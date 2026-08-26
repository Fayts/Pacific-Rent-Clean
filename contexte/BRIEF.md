# Brief de reprise, Pacific Rent&Clean

A lire en premier par toute session Claude Code ouverte sur ce depot. Le skill
`10k-websites` vit dans `.claude/skills/10k-websites/` et se charge tout seul.

## Ce que le projet est

Entreprise de **nettoyage textile par injection extraction a domicile** et de
**location de machines de nettoyage** a Tahiti. Depuis le brief du 2026-08-20,
les deux activites sont a egalite stricte sur le site, et le Karcher Puzzi 10/1
est devenu un objet visuel signature. Cible prioritaire : les particuliers ;
hotels et locations saisonnieres en second rideau.

La caisse reste sur **Shopify**. Chaque bouton de reservation renvoie vers la
boutique existante. Le site de ce depot est une **facade** : il ne touche jamais
a l'argent.

Premisse de marque, verbatim : **« Une seule chose separe le sale du propre.
Un passage. »**

## L'etat actuel : la V2

`site/index.html` est la page d'accueil V2, direction artistique entierement
neuve, livree le 2026-08-20. Elle n'est **pas encore en ligne**.

- Dossier de conception : `contexte/design-package-v2.md`. C'est l'entree du
  build. Toute copie marquee verbatim part telle quelle dans la page. Sa
  section 13 liste tout ce qui a change pendant la fabrication, avec les
  mesures.
- Palette Pacific : `#082F35` fond dominant, `#F4F1E8` ecume, `#D8C6A5` sable,
  `#0E6670` lagon, `#E87961` corail en accent rare, `#202524` basalte.
- Typographie : Archivo en chasse elargie, Instrument Sans, DM Mono.
- Element signature : **la ligne de passage**, un bord de fibre dessine a la
  main qui revele chaque changement d'acte.

`contexte/design-package.md` est le dossier de la V1 (2026-08-13). Il reste
comme archive : sa palette turquoise et sa carte des bandes ne s'appliquent
plus.

## Ce qui existe deja, et qui ne doit PAS etre regenere

Tous les visuels de `site/assets/` sont derives du film de la V1, deja paye
118 credits, plus 2 credits pour une image de depart V2 non recuperable.

| Fichier | Ce que c'est |
|---|---|
| `hero-scrub.mp4` | Le film de 18 s, etalonne aux tons Pacific, 1600 px, 7,12 Mo |
| `hero-poster.jpg` | Premiere image du film, affiche du heros defile |
| `hero-ending.jpg` | Image d'arrivee. Sert au heros fixe des telephones ET au bloc de cloture |
| `svc-matelas / svc-canape / svc-auto / svc-tapis` | Quatre textures de service, quatre moments distincts du film |
| `voie-domicile / voie-location` | Les deux photos de scene de la fourche |
| `comparateur-avant / comparateur-apres` | La meme image, l'etat « avant » obtenu par etalonnage optique |

**Regle :** reutiliser ces fichiers par defaut. Ne relancer une generation
Higgsfield que si Tamatoa le demande, et lui annoncer le cout avant.

## Ce qui reste a faire

1. **Le film neuf du brief** : tapis shaggy, vue depuis le suceur, sale devant
   et propre derriere. Storyboard complet en section 4 du dossier V2. Trois
   morceaux de 6 s, Seedance 2.0, 1080p, muet, 162 credits. Bloque aujourd'hui
   par le reseau (voir ci-dessous).
2. **Les photos du Puzzi 10/1** de Tamatoa, a mettre a cote du schema SVG.
3. **Les informations manquantes**, marquees en clair dans la page par des
   pastilles sable : telephone, courriel, les deux URL Shopify, le delai de
   sechage reel, ce qui est garanti sur les taches, la zone desservie reelle.
   La constante `MAILTO` en tete du script attend l'adresse courriel.
4. **La mise en ligne** : phase 10 du skill, connecteur Hostinger.

## Les deux choses que la session cloud n'a pas d'office

1. **Higgsfield est connecte, mais son CDN est bloque.** Le proxy de sortie de
   l'environnement repond 403 sur `higgsfield.ai` et sur
   `d8j0ntlcm91z4.cloudfront.net`, alors que le reste d'internet passe. On peut
   commander une generation et la voir dans le widget, mais pas telecharger le
   fichier pour l'encoder. Pour reprendre le pipeline video, il faut soit
   autoriser ces hotes dans les reglages reseau de l'environnement, soit
   travailler depuis une machine locale.

2. **ffmpeg est absent de l'image de base.** Il s'installe en une commande, mais
   l'index apt est perime au demarrage :

   ```bash
   apt-get update -qq && apt-get install -y --no-install-recommends ffmpeg
   ```

   A mettre dans le *setup script* de l'environnement cloud pour ne plus y penser.

## Comment relire le site pendant le travail

```bash
cd site && python3 -m http.server 8899
```

Puis ouvrir `http://127.0.0.1:8899/` dans un vrai navigateur. Un double clic sur
`index.html` montre volontairement le heros fixe : les navigateurs bloquent
`fetch` sur `file://`, donc le chargeur de la video retombe sur l'image, ce qui
est l'etat de secours voulu.

Chromium sans codecs proprietaires (celui de Playwright, dans cet environnement)
**ne decode pas le H.264**. La page tombe alors correctement sur son affiche et
son chevron. Ce n'est pas un bug du site.

## Ce qui n'est volontairement pas dans ce depot

- Les identifiants Shopify : ils ne passent ni par la conversation ni par Git.
- Les fichiers `.env` et le dossier `.vercel` : ignores par `.gitignore`.
- Les bruts de generation et les images de revue : `review/`, jamais en ligne.
- Le suivi interne AI-OS : il reste dans `C:\AIOS\projects\pacific-rent-clean\`.
  **Ce depot est public.**

## La section machine, et comment y mettre le vrai Puzzi

`site/assets/machine/` contient 36 images du Puzzi vu sous 36 angles, plus
`anchors.json`, qui donne pour chaque image la position a l'ecran des huit
pieces. La page fait tourner l'objet au glisser et deplace les pastilles avec.

**L'objet montre aujourd'hui est une maquette de travail**, une forme grossiere
modelee a la main. La page le dit en clair. Pour la remplacer par le vrai
Puzzi, deux chemins.

### Chemin A, avec le fichier 3D (.glb)

Le banc de rendu est dans le dossier de travail de la session, pas dans le
depot : une scene three.js dans un Chrome sans ecran, qui sort les 36 images
et projette les points d'accroche image par image. C'est le chemin le plus
precis : les pastilles sont calculees, pas estimees.

### Chemin B, avec une simple video

Quand le fichier 3D n'est pas telechargeable, une capture video du modele qui
tourne suffit.

```
./outils/mp4-vers-tourne-disque.sh <video.mp4> <largeur:hauteur:x:y> [nb_images] [debut] [duree]
```

Ce qui fait une bonne capture :

- **un tour complet, a vitesse constante.** La rotation automatique du
  visualiseur vaut mieux qu'un glissement a la main, toujours irregulier.
- **la hauteur de camera ne bouge pas** pendant l'enregistrement.
- **l'objet centre et le plus grand possible**, l'interface autour n'a pas
  d'importance, elle est recadree.
- **10 a 20 secondes** suffisent, sans le son.
- **un fond uni et sombre** si le visualiseur le permet, sinon la couleur du
  panneau de la page sera ajustee a celle de la video.

Les pastilles, elles, ne sont plus calculees mais **estimees** par un modele
cylindrique avec perspective, cale sur six reperes par piece releves a l'oeil
sur les images. Precision du modele mesuree contre la verite terrain :
**0,02 % de la largeur en horizontal, 0,28 % en vertical**, soit moins d'un
pixel sur un panneau de 700 px. Le facteur limitant devient le releve a
l'oeil, de l'ordre d'une largeur de pastille dans le pire cas.
