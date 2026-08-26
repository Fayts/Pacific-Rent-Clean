#!/bin/bash
# Transforme une capture video d'un modele 3D qui tourne en un jeu d'images
# pour le tourne-disque de la section machine.
#
#   ./mp4-vers-tourne-disque.sh <video.mp4> <largeur:hauteur:x:y> [nb_images] [debut] [duree]
#
#   <largeur:hauteur:x:y>  la zone a garder, en pixels, sans l'interface autour
#                          (l'ordre est celui de ffmpeg : d'abord la taille, puis le coin)
#   nb_images              36 par defaut
#   debut / duree          en secondes, pour ne garder qu'un tour complet
#
# Exemple :
#   ./mp4-vers-tourne-disque.sh enregistrement.mp4 760:570:210:120 36 2.5 12.0
#
# Les images sortent dans site/assets/machine/ sous la forme m00.jpg a m35.jpg.
set -euo pipefail

SRC="${1:?donner le fichier video}"
CROP="${2:?donner la zone a garder, forme largeur:hauteur:x:y}"
N="${3:-36}"
START="${4:-0}"
DUR="${5:-}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/site/assets/machine"
REVIEW="$ROOT/review/tourne-disque"
mkdir -p "$OUT" "$REVIEW"

if [ -z "$DUR" ]; then
  TOTAL=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")
  DUR=$(awk -v t="$TOTAL" -v s="$START" 'BEGIN{printf "%.3f", t - s}')
fi

echo "source   : $SRC"
echo "zone     : $CROP"
echo "fenetre  : de ${START}s sur ${DUR}s, decoupee en $N images"

rm -f "$OUT"/m*.jpg
for i in $(seq 0 $((N - 1))); do
  T=$(awk -v s="$START" -v d="$DUR" -v i="$i" -v n="$N" 'BEGIN{printf "%.4f", s + d * i / n}')
  IDX=$(printf "%02d" "$i")
  ffmpeg -y -v error -ss "$T" -i "$SRC" -frames:v 1 \
         -vf "crop=${CROP},scale=900:-2" -q:v 4 "$OUT/m${IDX}.jpg"
done

echo "images   : $(ls "$OUT"/m*.jpg | wc -l), poids total $(du -sh "$OUT" | cut -f1)"

# planche de controle, hors du dossier qui part en ligne
rm -f "$REVIEW"/*.jpg
k=1
for i in 00 06 12 18 24 30; do
  ffmpeg -y -v error -i "$OUT/m$i.jpg" -vf scale=420:-2 -q:v 3 "$REVIEW/$k.jpg"
  k=$((k + 1))
done
ffmpeg -y -v error -pattern_type glob -i "$REVIEW/*.jpg" -vf "tile=3x2" -q:v 3 "$REVIEW/planche.jpg"
echo "controle : $REVIEW/planche.jpg"
