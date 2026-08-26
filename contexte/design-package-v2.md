# Dossier de conception V2, Pacific Rent&Clean

Écrit le 2026-08-20, AVANT toute génération. C'est l'entrée du build.
Tout texte marqué verbatim part tel quel dans la page, sans reformulation.

Ce dossier remplace `design-package.md` (V1, 2026-08-13). La V1 reste au dépôt
comme archive : sa palette turquoise, sa prémisse « sous la surface » et sa
carte des bandes ne s'appliquent plus.

---

## 0. Le cadre

| Élément | Décision |
|---|---|
| Objet | Direction artistique entièrement neuve. Aucune reprise de la mise en page V1, aucun gabarit Shopify. |
| Périmètre | **La page d'accueil seule.** Elle pose le système que le reste du site suivra. |
| Référence | Pure Casa (Dribbble) comme repère d'audace éditoriale. Aucune reprise de ses sections, compositions ni couleurs. |
| Positionnement | Deux activités à égalité : prestation de nettoyage textile à domicile, et location de la machine professionnelle. |
| Caisse | Shopify. Chaque bouton renvoie vers la boutique. Le site ne touche jamais à l'argent. |
| Palier | Tier 2, film enchaîné de 18 s en 3 morceaux, Seedance 2.0, 1080p, muet. |
| Budget validé | 2 (image de départ) + 3 × 54 (film) + 8 × 2 (images de sections) = **180 crédits** sur 861,1. |
| Dossier de déploiement | `site/` |
| Bruts et revue | `review/`, ne part JAMAIS en ligne |

**Écart assumé par rapport au brief V1.** Le brief de reprise disait « le Puzzi
n'est pas le sujet du site ». Le nouveau brief en fait une expérience signature.
C'est le nouveau brief qui gouverne : la machine devient un objet visuel
récurrent, et les deux offres restent à égalité stricte.

---

## 1. La prémisse de marque

**Une seule chose sépare le sale du propre. Un passage.**

Pas un produit miracle, pas un tour de main. Un passage : la buse avance, elle
injecte, elle reprend, et derrière elle la fibre n'est plus la même. Devant la
ligne, la surface d'avant. Derrière, la surface d'après. Cette ligne est
visible, elle est nette, et elle est la seule chose que le visiteur doit
comprendre.

Tout le site enseigne ce passage. Le film est un passage. Le comparateur avant
après est un passage que le visiteur fait lui même. Les séparateurs de sections
sont des passages. Et les deux offres ne sont que deux réponses à une seule
question : **qui fait le passage, vous ou nous.**

Une section qui ne sert pas ce passage ne monte pas dans la page.

---

## 2. La palette, en jetons CSS

Direction donnée par Tamatoa, affinée pour tenir les contrastes. Valeurs
finalisées sur le film approuvé.

```css
:root{
  --deep:#082F35;        /* Pacific Deep. Fond dominant, navigation, pied de page */
  --deep-2:#0A3B42;      /* surfaces surélevées sur fond sombre */
  --lagoon:#0E6670;      /* états interactifs, filets, accents froids */
  --lagoon-lift:#158796; /* lagon éclairci, pour les bordures qui doivent passer 3:1 */
  --foam:#F4F1E8;        /* Foam. Grand fond clair, texte sur fond sombre */
  --sand:#D8C6A5;        /* Tahitian Sand. Fonds secondaires, surfaces éditoriales */
  --sand-deep:#B9A480;   /* sable assombri, texte secondaire sur clair */
  --coral:#E87961;       /* accent rare. CTA et deux emphases, pas plus */
  --coral-hover:#F08E78;
  --basalt:#202524;      /* neutre premium, texte sur fond clair */
  --leaf:#47715B;        /* végétation, en dose homéopathique */
  --edge:#3E7079;        /* jeton dédié aux bordures interactives, mesuré ≥3:1 */
}
```

**Règle de rareté.** Le corail n'apparaît que sur le CTA principal, sur l'état de
focus, et sur la ligne de passage au moment où elle traverse. Partout ailleurs,
Pacific Deep, Foam et Sand portent la page.

**Le piège esquivé, dit à voix haute.** Foam plus Corail, c'est à un cheveu du
cliché « fond crème, serif, terracotta » que le métier voit passer dix fois par
jour. Trois garde-fous : aucune police à empattements, la surface dominante est
Pacific Deep et non le crème, et le corail reste sous les deux pour cent de la
page. Les tons viennent du monde réel du sujet (écume, corail, sable, basalte
volcanique), pas d'un gabarit.

Le canevas n'est jamais du noir pur ni du blanc pur. Pacific Deep et Foam le
garantissent par construction.

---

## 3. Le trio typographique

| Rôle | Police | Graisses et axes |
|---|---|---|
| Titrage | **Archivo** (variable, axe de chasse) | 700 et 800, chasse 110 à 125 |
| Texte | **Instrument Sans** | 400, 500 |
| Petites étiquettes | **DM Mono** | 400 |

Ni Inter ni Roboto. Archivo en chasse élargie donne l'aplomb éditorial de la
référence Pure Casa sans devenir décoratif : un mot posé en 12 vw tient l'écran
tout seul. DM Mono donne aux repères techniques leur air d'instrument de mesure.

Les mots surdimensionnés sont des éléments graphiques : `PASSAGE`, `MATELAS`,
`AUTO` se lisent d'abord comme des formes, ensuite comme du texte.

---

## 4. Le film, morceau par morceau

Un seul sujet du début à la fin : **la fibre d'un tapis shaggy à poils longs.**
Caméra basse, très près, avançant. Aucune coupe. Chaque raccord tombe dans un
mouvement, jamais sur un repos.

Le visiteur est le suceur. Devant lui la surface d'avant, derrière lui la
surface d'après, et la ligne entre les deux avance avec le scroll.

### Morceau 1, La surface mate (0 à 6 s)

- **Monde** : macro très basse au ras d'une laine shaggy sèche, tassée, grisée,
  beige éteint. Le poil est aplati, la lumière chaude et morte, de la poussière
  fine flotte dans les rais.
- **Caméra** : poussée avant lente et régulière, légèrement plongeante, effleurant
  la pointe des poils.
- **Vie** : les poils bougent au passage de l'air, la poussière dérive.
- **Image finale** : toujours en mouvement, une ombre plus sombre entre par le
  bas du cadre. **Ne se repose pas.**

### Morceau 2, Le passage (6 à 12 s)

- **Monde** : la même laine, même cap, même vitesse.
- **Événement** : une nappe de fines gouttes frappe la fibre par le bas du cadre.
  **Gouttes sur l'objectif, un temps de flou.** Derrière la ligne, la laine
  fonce d'humidité puis se relève : saturée, profonde, le gris arraché. Des
  particules sombres décollent et partent vers le bas.
- **Le raccord tombe ici, dans la salve de gouttes.** C'est ce qui justifie que
  la texture se régénère, donc la couture ne se voit pas.
- **Image finale** : toujours en avance, dans le couloir fraîchement passé.
  **Ne se repose pas.**

### Morceau 3, Le repos (12 à 18 s)

- **Monde** : le couloir propre s'ouvre sur une étendue large de laine restaurée.
- **Caméra** : la poussée ralentit, s'élève d'un souffle, s'arrête.
- **Événement** : le brillant humide sèche en un mat doux, une brume légère
  monte et se dissipe, le poil se redresse.
- **Image finale, composée** : champ de laine propre plein cadre, lumière rasante
  et fraîche aux tons Pacific. **Aucun bord à couper, aucun sujet à décentrer** :
  le texte est plaçable partout, sur n'importe quel écran.

---

## 5. La carte des bandes

Hauteur du héros : **1000vh**. Plage de scroll utile : 900vh, donc 0,02 de
progression = 18vh. Ces plages sont des **points de départ**, validés ensuite
par le test de coup de molette.

| # | Plage | Moment du film | Texte (verbatim) | Entrée |
|---|---|---|---|---|
| 1 | 0,00 → 0,13 | laine mate, poussière en suspension | « Vous ne voyez que le dessus. » | Rampe au chargement puis scroll. Mots qui **descendent** en place. |
| 2 | 0,16 → 0,34 | l'ombre de la buse entre dans le cadre | « Dessous, tout ce que l'aspirateur laisse. » | **Flou vers net** : la ligne se précise. |
| 3 | 0,38 → 0,56 | la salve de gouttes, le passage | « Un passage suffit. » | **Coup de mot avec dépassement** : trois mots qui frappent et se posent. |
| 4 | 0,60 → 0,76 | le couloir propre, le poil qui se relève | « La fibre se relève. » | **Tissage** : les caractères arrivent en alternance par le haut et par le bas. |
| 5 | 0,80 → 1,00 | l'arrivée au repos | Titre : « À vous de passer. Ou à nous. »<br>Sous titre : « Nettoyage à domicile par injection extraction. Ou vous louez la machine et vous le faites vous même. »<br>Boutons : « Réserver un nettoyage » et « Louer la machine » | **Montée mot à mot en trois temps** : titre, puis sous titre, puis les deux boutons. |

Bande 1 : pas de fondu d'entrée, plus une rampe d'assemblage au chargement.
Bande 5 : pas de fondu de sortie, le texte reste posé quand la page continue.

---

## 6. Le héros fixe (téléphones et mouvement réduit)

Composé sur l'image finale du film, sans voyage derrière.

- Titre : « Le propre se voit. »
- Sous titre : « Nettoyage textile par injection extraction, à domicile. Et la
  machine en location si vous préférez le faire vous même. Tahiti, 7j/7. »
- Boutons : « Réserver un nettoyage » et « Louer la machine »

---

## 7. Le bas de page, section par section

Tout converge vers **une seule ancre : `#reserver`**.

Aucune section voisine ne partage la même charpente. L'ordre des charpentes :
bandeau défilant, empilement éditorial asymétrique, plein cadre interactif,
diptyque schéma plus texte, frise horizontale, fourche à deux colonnes égales,
liste numérotée, accordéon, plein cadre de clôture.

### 7.1 Navigation
`Pacific Rent&Clean` à gauche. Puis `Services`, `Location`, `Comment ça marche`,
`Résultats`, `FAQ`. Bouton accent `Réserver` à droite. Fond translucide qui se
densifie une fois le héros passé.

### 7.2 Le bandeau de crédibilité
Pas de cartes à icônes. Une seule ligne défilante en DM Mono, sous le héros, qui
se lit comme un relevé d'instrument :

> INJECTION EXTRACTION · MATÉRIEL PROFESSIONNEL · INTERVENTION À DOMICILE ·
> LOCATION DISPONIBLE · PRODUITS PROFESSIONNELS · TAHITI · 7J/7

### 7.3 « Ce qu'on remet à neuf », les services
Titre de section : « Ce qu'on remet à neuf. »

Empilement éditorial, quatre entrées, quatre charpentes différentes. Chaque
entrée : un numéro en mono, un mot surdimensionné, une image, une phrase de
bénéfice, un prix de départ réel, un lien vers `#reserver`.

**01, MATELAS**
> Vous y passez un tiers de votre vie. La transpiration, elle, descend dans la
> mousse et n'en ressort pas toute seule.
> À partir de 5 000 F.

**02, CANAPÉS & FAUTEUILS**
> Le tissu d'un canapé encaisse tout : les repas, les enfants, le sel, le sable.
> L'extraction va rechercher ce que l'aspirateur laisse au fond.
> À partir de 5 000 F.

**03, AUTO**
> Sièges, moquettes, sièges enfant. Un habitacle qui a vécu l'humidité de Tahiti
> se nettoie en profondeur, pas en surface.
> Sur devis.

**04, TAPIS & MOQUETTES**
> Le poil long garde tout. C'est aussi ce qui rend le passage si visible.
> À partir de 2 000 F.

### 7.4 « Le passage », le comparateur avant après
Titre : « Faites le passage vous même. »

Plein cadre. Une seule surface, deux états, une poignée que le visiteur tire en
travers de l'image. La poignée EST la ligne de passage signature : un filet
corail avec un bord irrégulier de fibre dessiné en SVG.

Étiquette sous l'image, en clair et sans détour :
> Démonstration du procédé, images générées. Ce ne sont pas les photos d'un
> chantier client. Elles seront remplacées par de vrais avant après.

C'est **le moment interactif désigné** du site : le visiteur ne lit pas le
passage, il le fait.

### 7.5 « La machine », le Puzzi 10/1
Titre : « La puissance professionnelle, entre vos mains. »

Diptyque : à gauche un **schéma technique du Puzzi 10/1 dessiné à la main en
SVG**, à droite les points d'accroche. Sur ordinateur, survol et clic. Au doigt,
appui. Chaque point allume une pièce du schéma et une ligne de texte.

| Point | Texte (verbatim) |
|---|---|
| RÉSERVOIR EAU PROPRE, 10 L | La solution de nettoyage qui part dans la fibre. |
| RÉSERVOIR EAU SALE, 9 L | Ce qui remonte de la fibre. Amovible, on le vide à l'évier. |
| FLEXIBLE INJECTION / EXTRACTION, 2,5 M | Relie la machine à l'outil. De quoi faire un canapé sans déplacer la cuve. |
| PISTOLET INJECTION / EXTRACTION | Vous appuyez, ça injecte. Vous relâchez, ça reprend. |
| SUCEUR FAUTEUIL, 110 MM | Canapés, matelas, sièges de voiture. |
| SUCEUR SOL, 240 MM | Tapis, moquettes, sols textiles. |
| INJECTION, 1 BAR | La solution est poussée dans la fibre, pas posée dessus. |
| EXTRACTION | La turbine reprend l'eau et la saleté décollée, dans le même geste. |

Note de fabrication : le schéma est un dessin, pas une photo, et il est annoncé
comme tel. Dès que Tamatoa fournit des photos de sa machine, le schéma gagne à
côté de lui un carrousel photo tournant image par image.

### 7.6 « Le procédé », six temps
Frise horizontale, six temps, un extrait vidéo macro en fond qui ne joue que
lorsque la section est à l'écran.

> PRÉPARATION → INJECTION → ACTION SUR LES FIBRES → EXTRACTION → SÉCHAGE → TEXTILE PROPRE

Une ligne sous la frise :
> L'aspirateur prend ce qui est posé. L'injection extraction va chercher ce qui
> est incrusté, et le remonte au lieu de le noyer.

### 7.7 « Deux façons de retrouver le propre », la fourche
Titre plein cadre, en deux lignes surdimensionnées :

> DEUX FAÇONS
> DE RETROUVER LE PROPRE.

Deux colonnes, traitement strictement égal, chacune son image.

**ON S'EN OCCUPE.**
> Un professionnel vient chez vous, sur rendez vous, 7 jours sur 7. Vous ne
> touchez à rien.
> Bouton : « Réserver une prestation »

**À VOUS DE JOUER.**
> La machine arrive chez vous avec tout ce qu'il faut. Vous avez 24 heures à
> partir de la livraison.
> Bouton : « Louer le Kärcher »

### 7.8 La location, en détail
Titre : « Tout ce qu'il vous faut pour nettoyer vous même. »

Ce qui part avec la machine, listé sans emballage :

- Kärcher Puzzi 10/1, injecteur extracteur professionnel
- Flexible 2,5 m, suceur sol 240 mm, suceur fauteuil
- Pastilles Kärcher CarpetPro RM 760
- Manuel d'utilisation en PDF

Deux forfaits, côte à côte, traitement égal :

| Forfait | Prix | Contenu |
|---|---|---|
| Standard | 6 390 F | 2 pastilles RM 760 |
| Auto Home | 7 990 F | 2 pastilles RM 760, 1 brosse rotative et perceuse à batterie, 1 bouteille de TASKI Tapi Extract |

> Livraison 1 500 F sur Punaauia, Faa'a et Papenoo.

Sur les pastilles RM 760, une seule phrase, pas un catalogue chimique :
> Conçues pour l'injection extraction. Elles encapsulent la salissure grasse au
> lieu de la diluer, ce qui raccourcit le séchage.

### 7.9 « Comment ça marche », trois temps
> **01, CHOISISSEZ.** Une prestation à domicile, ou la machine en location.
> **02, RÉSERVEZ.** Vous choisissez l'option, la date, et vous laissez vos coordonnées.
> **03, ON S'OCCUPE DU RESTE.** On vient, ou on livre. Selon ce que vous avez choisi.

Une ligne sous les trois : « Simple. Rapide. Clair. »

### 7.10 Les tarifs
Les vrais prix, affichés. Deux tableaux, prestation et consommables.

| Prestation | Prix |
|---|---|
| Tapis petit (80x150) | 2 000 F |
| Tapis moyen (160x230) | 4 000 F |
| Tapis grand (240x330) | 6 000 F |
| Matelas 1 place (90x190) | 5 000 F |
| Matelas double (140x190) | 10 000 F |
| Matelas queen (160x200) | 11 000 F |
| Matelas king (180x200) | 12 000 F |
| Fauteuil | 5 000 F |
| Canapé 2 places | 10 000 F |
| Canapé 3 places | 12 000 F |
| Canapé d'angle | 15 000 F |
| Canapé clic clac | 20 000 F |

Consommables : pastille Kärcher RM 760, 500 F. Buse à crevasse, 500 F.

### 7.11 Les questions qui bloquent (FAQ)
Accordéon éditorial. Écrit depuis les objections réelles relevées en recherche.

**« Ça sèche en combien de temps ? »**
> [À REMPLIR PAR TAMATOA, délai réel constaté chez toi, aucun chiffre inventé ici]

**« J'ai peur d'abîmer mon canapé. »**
> C'est la bonne question. Le vrai risque n'est pas le produit, c'est l'eau
> laissée dans la fibre : trop injectée, pas assez reprise, et la mousse reste
> humide au fond. Un injecteur extracteur reprend dans le même geste qu'il
> injecte, et c'est exactement ce qui le sépare d'une shampouineuse.

**« Est ce que les taches partent vraiment ? »**
> [À REMPLIR PAR TAMATOA, ce que tu garantis et ce que tu ne garantis pas]

**« Peut on nettoyer tous les tissus ? »**
> Non, et personne de sérieux ne vous dira le contraire. L'injection extraction
> est faite pour les textiles qui supportent l'eau. Le velours, la soie et les
> tissus marqués « nettoyage à sec » demandent un avis avant de commencer.
> Envoyez une photo de l'étiquette, on vous répond.

**« Dois je préparer mon canapé ou mon matelas ? »**
> Videz ce qui traîne dessus et dégagez un mètre autour. Le reste, c'est notre
> travail.

**« Comment fonctionne la location ? »**
> Vous réservez une date, la machine est livrée chez vous, vous l'avez 24 heures
> à partir de la livraison. Les pastilles partent avec.

**« Je ne saurai pas m'en servir. »**
> Elle a deux réservoirs et une gâchette. Le manuel part avec la machine, et on
> répond au téléphone pendant la location.

**« Livrez vous la machine ? »**
> Oui. 1 500 F sur Punaauia, Faa'a et Papenoo.

**« Quelle zone desservez vous ? »**
> [À REMPLIR PAR TAMATOA, zone réelle au delà de Punaauia, Faa'a et Papenoo]

**« Il faut avancer de l'argent ? »**
> Non. Vous choisissez votre date et vous payez la prestation ou la location.

### 7.12 Le bloc de clôture, l'unique appel
Ancre `#reserver`, plein cadre, sur l'image finale du film.

> PRÊT À VOIR
> LA DIFFÉRENCE ?

Deux chemins, traitement égal, les deux vers Shopify :
- « Réserver un nettoyage » → fiche prestation Shopify
- « Louer la machine » → fiche location Shopify

Sous les deux, en clair : téléphone et courriel.
[À REMPLIR PAR TAMATOA, téléphone, courriel, deux URL Shopify]

Formulaire de devis, pour les hôtels et les locations saisonnières : nom,
courriel, téléphone, besoin. Traitement retenu sur un site statique : **lien
mailto vers l'adresse de l'entreprise**, parce qu'un message doit vraiment
arriver quelque part. Message de confirmation honnête :
> Votre messagerie s'ouvre avec le message prêt. Il ne part qu'une fois envoyé.

### 7.13 Pied de page
Pacific Rent&Clean · Services · Location · Comment ça marche · FAQ · Contact ·
Réseaux · Mentions légales · Zone desservie · Horaires.
Fond Pacific Deep. Typographie et espacement, aucune décoration.
Marque réelle, donc aucune mention de fiction.

---

## 8. La couche vectorielle

**L'élément signature : la ligne de passage.** Un bord horizontal irrégulier,
dessiné à la main en SVG, dont le profil imite la pointe d'une fibre. Il traverse
la page à chaque changement d'acte : la section qui arrive est révélée par ce
bord qui balaie, jamais par un fondu. Au dessus du bord, le ton d'avant. En
dessous, le ton d'après. Enlevez le, et la page perd son idée. C'est là que
passe tout le budget d'audace.

Le même bord sert trois fois : séparateur de sections, poignée du comparateur
avant après, et soulignement du CTA au survol.

Le reste, au niveau du murmure :

- Schéma du Puzzi 10/1 dessiné à la main en SVG, avec ses points d'accroche.
- Frise du procédé en six temps, tracés qui se dessinent seuls à l'apparition.
- Fines gouttes dérivant très lentement dans la couche de fond fixe.
- Couche d'environnement fixe : lueur lagon très lente sur le fond Pacific Deep,
  plus un grain. Cycle de 60 s ou plus, décalage négatif pour ne jamais démarrer
  au premier plan.

Tout respecte le mouvement réduit : états finaux affichés, moteurs arrêtés.

---

## 9. Les images à générer

Toutes dans le monde du film approuvé : même lumière, même étalonnage, même
matière. Aucun ouvrier souriant face caméra, aucune scène corporate, aucun
cliché touristique polynésien. Objets, matières, procédé, transformation.

| Fichier | Sujet | Crédits |
|---|---|---|
| `still-matelas.jpg` | matelas nu dans une chambre polynésienne contemporaine, lumière rasante | 2 |
| `still-canape.jpg` | canapé en tissu, macro à mi distance sur l'accoudoir et la trame | 2 |
| `still-auto.jpg` | siège auto en tissu, portière ouverte, lumière tropicale | 2 |
| `still-tapis.jpg` | tapis shaggy au sol, béton ciré et bois, ombre longue | 2 |
| `avant.jpg` | tapis shaggy terni, exactement cadré | 2 |
| `apres.jpg` | **le même cadre, le même tapis, restauré** (édition d'image depuis `avant.jpg`, pas une génération indépendante) | 2 |
| `still-prestation.jpg` | intérieur tropical moderne, buse en action sur un canapé, personne au second plan hors focus | 2 |
| `still-location.jpg` | le kit posé au sol sur du basalte humide : flexible enroulé, suceurs, pastilles | 2 |
| **Total** | | **16** |

`hero-poster.jpg` et `hero-ending.jpg` sortent gratuitement du film.
L'extrait macro du procédé sort gratuitement du film V1, réétalonné aux tons
Pacific et ré encodé petit.

---

## 10. La liste d'ingénierie

Rien n'est optionnel, tout est dans `scrub-pipeline.md` :

- Vidéo récupérée en Blob **avec anneau de progression** (le film dépassera 8 Mo),
  affiche peinte en premier, chien de garde à 20 s.
- Interpolation du temps affiché normalisée au delta, boucle rAF qui se met au
  repos, `IntersectionObserver` sur le héros.
- Recherches vidéo strictement séquencées, drapeau libéré sur `error`.
- Écritures DOM uniquement au changement, texte limité à 10 Hz.
- Bandes cadencées en vh, validées au test de coup de molette (120, 240, 360).
- Lisibilité en quatre couches : voile global, voile par bande, ombre de texte,
  pastille pour les petits textes. Audit de la pire image à 3,5:1 minimum.
- Cinq portes du héros fixe, identiques au caractère près en CSS et en JS,
  branchées sur les événements `change`.
- Page complète et belle si la vidéo n'arrive jamais.
- Plancher de qualité au complet : polices dégraissées, contrastes calculés,
  repères sémantiques, focus visible, cibles tactiles de 44 px, favicon SVG.
- Standard « tout le site animé » : rien ne claque, une entrée chorégraphiée par
  section, un élément vivant par section au niveau du murmure.

---

## 11. Ce qu'il manque, et qui n'est pas inventé

Aucun avis client, aucune note, aucun nombre de chantiers, aucune année
d'expérience, aucun pourcentage de satisfaction ne figure sur cette page. La
preuve passe par le résultat visible, le procédé expliqué, les vraies
caractéristiques de la machine et les vrais prix.

À fournir par Tamatoa, en clair dans la page tant que ce n'est pas fourni :

1. Téléphone et courriel de l'entreprise
2. Les deux URL Shopify (prestation, location)
3. Le délai de séchage réellement constaté
4. Ce qui est garanti et ce qui ne l'est pas sur les taches
5. La zone desservie réelle
6. Trois ou quatre photos du Puzzi 10/1

---

## 12. La porte du texte

Chaque ligne écrite ci dessus part **telle quelle** dans la page. La page
construite doit passer le contrôle de la phase 9 avant que qui que ce soit la
voie : zéro tiret cadratin, zéro mot de catalogue, et le balayage des tics
d'écriture automatique. Les figures voulues de ce dossier (« À vous de passer.
Ou à nous. », « Un passage suffit. », « Simple. Rapide. Clair. ») sont du métier
et restent.

---

## 13. Ce qui a changé pendant la fabrication, et pourquoi

Écrit après coup, le 2026-08-20. Le dossier ci-dessus reste le plan. Voici les
écarts, tous mesurés, aucun deviné.

**Le film neuf n'a pas pu être fabriqué dans cette session.** La politique
réseau de l'environnement cloud bloque `higgsfield.ai` et son CDN : le proxy
répond 403 sur ces deux hôtes alors que le reste d'internet passe. On peut
commander une génération et la voir dans le widget, mais pas récupérer le
fichier pour l'encoder. Dépenser 162 crédits sur un film non téléchargeable
n'avait aucun sens. Une image de départ avait déjà été générée avant que le
blocage soit constaté : **2 crédits dépensés, solde 859,1.**

**Arbitrage de Tamatoa : construire toute la page maintenant, film neuf plus
tard.** Le héros tourne donc sur le film de la V1, qui s'est révélé meilleur
que prévu pour ce brief : surface sèche et grisée, descente dans la fibre,
passage de l'eau, champ de laine propre au repos. Les cinq textes de la carte
des bandes s'y posent sans être retouchés.

**Étalonnage Pacific du film.** Le turquoise plat vers 11 s, point faible
signalé en V1, est passé en vert lagon minéral. Chaîne appliquée :
`eq(sat .70, contrast 1.05)`, `selectivecolor` sur les cyans et les bleus,
`colorbalance` (ombres vers le teal, tons moyens vers le sable, hautes lumières
vers l'écume), puis `curves`. Vérifié sur trois images représentatives avant
d'encoder.

**Encodage.** 1600 px de large, crf 25, `-g 8`. **7,12 Mo** au lieu de 9,03 en
1728/crf 24. Comparé au zoom 200 % pixel à pixel sur l'image la plus lisse du
film : indistinguable, aucune bande de dégradé. 21 % de gagné sur l'actif le
plus lourd.

**Toutes les images de sections viennent du film ou des visuels déjà payés**,
réétalonnées. Quatre textures de service prélevées à quatre moments distincts,
deux photos de scène pour la fourche. Le couple avant/après du comparateur est
**la même image**, dont l'état « avant » est obtenu par étalonnage optique
(désaturation, voile chaud, noirs relevés, grain). Même cadrage au pixel près,
ce qui est exactement ce qui rend un comparateur satisfaisant. Annoncé sous
l'image comme une démonstration, pas comme un chantier client.

**Le Kärcher est un schéma dessiné à la main en SVG**, pas une photo, et la
page le dit. Huit points d'accroche, cotes en DM Mono (9 L, 10 L, 2,5 m,
240 mm, 110 mm). Premier jet trop maigre et trop petit dans son cadre : redessiné
en objet avec remplissages, cadrage resserré, suceur sol visiblement plus large
que le suceur fauteuil.

**Carte des bandes retimée après le test de coup de molette.** La bande 1 ne
tenait que 4 crans de 120 px, sous le minimum de 5. Nouvelles plages :
**0 → 0,16 · 0,19 → 0,37 · 0,41 → 0,585 · 0,615 → 0,775 · 0,80 → 1,00**.
Résultat mesuré : 9, 9, 10, 9, 22 crans consécutifs à pleine opacité, et à
360 px par cran chaque bande reste vue pleinement 3 fois au moins, donc aucune
n'est sautable.

**`scroll-behavior: smooth` retiré.** Sur un héros de 1000vh, un clic dans la
navigation faisait défiler lentement dix mille pixels. Saut instantané, plus
prévisible, et le test de molette redevient mesurable.

**Voiles des bandes refaits après mesure.** Première mesure au pixel sur les
vraies images du film : bandes 1, 2, 4 et 5 à 1,99 · 3,07 · 1,64 · 2,77, sous
le seuil de 3,5. Le film est clair, les voiles radiaux ne couvraient pas la
colonne de texte. Remplacés par des dégradés directionnels qui assombrissent le
côté du texte et laissent l'autre moitié vivante, et les colonnes de texte ont
été contraintes pour que l'alignement veuille dire quelque chose.
Après correction : **1 → 5,56 · 2 → 9,92 · 3 → 6,35 · 4 → 4,48 · 5 → 7,27**.
Ce sont les alphas à toucher si le film doit ressortir plus clair.

**Cibles tactiles.** Quinze liens sous 44 px au doigt (la marque, les quatre
liens de service, les dix liens de pied de page). Corrigés par le rembourrage
sous `(pointer: coarse)`, sans déplacer la mise en page. Contrôle final :
aucune.

**Le héros fixe n'avait aucune image.** L'affiche n'était peinte que dans le
chemin défilé, donc les téléphones voyaient un fond vide. Corrigé : le chemin
fixe peint `hero-ending.jpg`, l'image d'arrivée composée pour ça, et c'est le
seul fichier téléchargé sur petit écran. La vidéo n'est jamais demandée.

**Capture de pointeur.** `setPointerCapture` pouvait lever et casser le
glissement du comparateur. Enveloppée.

**Titres qui débordaient.** La clôture tenait sur trois lignes au lieu de deux,
le titre de la location sur six. Corps réduits, et le point d'interrogation ne
peut plus rester orphelin.

**Contrôle du texte.** Zéro tiret cadratin dans la page. Les seules occurrences
de « solution » sont « solution de nettoyage », le vrai mot du métier. « landscape »
n'apparaît que dans les requêtes média.

---

## 14. La section machine passe en volume

Décidé le 2026-08-21, après que Tamatoa a généré un modèle 3D du Puzzi 10/1
avec Tripo.

**Le choix technique, dit à voix haute.** Le brief demandait une 3D
manipulable. Deux façons de la livrer :

1. Charger le fichier GLB dans la page avec une bibliothèque 3D. Cela veut dire
   embarquer 300 à 600 Ko de moteur, plus le maillage et ses textures, souvent
   5 à 20 Mo, et allumer WebGL sur le téléphone du visiteur.
2. **Rendre un tourne-disque hors ligne depuis le modèle, et n'expédier que des
   images.** C'est la méthode des pages produit haut de gamme.

**C'est la deuxième qui est retenue**, et c'est un écart assumé par rapport au
mot « 3D » du brief : le visiteur ne reçoit aucune 3D, il reçoit 36 images.
Ce qu'il perd : le survol libre en hauteur et le zoom dans l'objet. Ce qu'il
gagne : **636 Ko au total, 16 Ko par image**, une rotation fluide sur
n'importe quel téléphone, aucune bibliothèque, aucun WebGL, aucune batterie
brûlée, et le même comportement partout.

**Ce que le tourne-disque sait faire.**

- 36 images à 10 degrés d'intervalle, glissées à la main ou au doigt, avec
  inertie qui retombe en douceur.
- **Les huit points d'accroche suivent la rotation.** Pour chaque image, la
  position à l'écran de chaque pièce est calculée au rendu et embarquée dans la
  page (7,7 Ko de données). Une pièce qui passe derrière la machine s'efface et
  cesse d'être cliquable.
- **Cliquer une ligne de la fiche fait tourner la machine pour présenter la
  pièce.** L'image la plus favorable de chaque pièce est calculée au rendu,
  et l'animation prend le chemin le plus court.
- Dérive lente au repos, au niveau du murmure, coupée dès qu'on touche et dès
  qu'une pièce est sélectionnée.
- Flèches gauche et droite au clavier, rôle `slider`, angle annoncé.
- Chargement des 36 images derrière un anneau de progression, déclenché à
  l'approche de la section.
- Mouvement réduit : aucune dérive, aucune animation de rotation, la
  manipulation reste possible.

**La chaîne de fabrication, entièrement hors ligne :** three.js dans un Chrome
sans écran rend les 36 images et projette les points d'accroche image par
image. `turntable/` dans le dossier de travail contient la scène et le script.
**Rien de three.js ne part sur le site.**

**Ce qui tourne aujourd'hui est une maquette de travail**, une forme grossière
modélisée à la main pour juger l'interaction. La page le dit en clair sous la
fiche. Le modèle Tripo du vrai Puzzi la remplacera sans toucher à une seule
ligne d'interaction : il suffit de le passer dans le même banc de rendu.
