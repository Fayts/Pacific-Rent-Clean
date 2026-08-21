# incoming

Boite de depot pour les fichiers qui viennent de Higgsfield.

Le reseau de la session cloud bloque le CDN de Higgsfield, donc Claude ne peut
pas telecharger les generations lui-meme. Ce dossier est le passe-plat : vous y
deposez les fichiers depuis la tablette, Claude les recupere avec `git pull`.

## Comment deposer, depuis la tablette

1. Dans Higgsfield, telecharger l'image ou la video sur la tablette.
2. Ouvrir ce dossier sur GitHub, bouton **Add file**, puis **Upload files**.
3. Choisir le ou les fichiers, puis **Commit changes**.
4. Dire a Claude que c'est depose.

Limite du televersement par navigateur : 25 Mo par fichier. Un plan de 6 s en
1080p passe largement.

## Nommage

Peu importe, Claude reconnait les fichiers. Si vous voulez aider :
`seg1.mp4`, `seg2.mp4`, `seg3.mp4` pour les trois morceaux du film,
`depart.png` pour l'image de depart, `puzzi-1.jpg` et suivants pour les photos
de la machine.

## Ce dossier ne part jamais en ligne

Claude vide `incoming/` une fois les fichiers traites et encodes dans
`site/assets/`. Rien de ce qui est ici n'est publie sur le site.
