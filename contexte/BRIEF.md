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
