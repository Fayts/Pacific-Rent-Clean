# Dossier de conception — Pacific Rent&Clean

Écrit le 2026-08-13, AVANT toute génération. C'est l'entrée du build.
Tout texte marqué « verbatim » part tel quel dans la page, sans reformulation.

---

## 0. Le cadre

| Élément | Décision |
|---|---|
| Objet | Refonte complète de la façade de `pacificrentclean.com` |
| Positionnement | **Entreprise de location de machines de nettoyage** à Tahiti, plus prestation à domicile. Le Kärcher Puzzi 10/1 est la **première machine de la gamme**, pas le sujet du site. |
| Caisse | Conservée sur Shopify. Chaque bouton « Réserver » envoie vers la boutique existante (panier, dates, paiement). Le nouveau site ne touche jamais à l'argent. |
| Cible prioritaire | Particuliers. Hôtels et locations saisonnières en second rideau. |
| Visuels | Générés. Aucune mise en scène de faux avant/après, aucun faux client. Remplaçables par de vraies photos plus tard. Aucune mention exigée. |
| Palier | Tier 2, film enchaîné de 18 s en 3 morceaux, modèle Seedance 2.0. |
| Budget validé | 2 + (3 × 54) + 6 = **170 crédits** sur 1003,6. |
| Dossier de déploiement | `projects/pacific-rent-clean/site/` (hors Git du AI-OS) |
| Bruts et revue | `projects/pacific-rent-clean/review/` — ne part JAMAIS en ligne |

---

## 1. La prémisse de marque

**Le propre commence sous la surface.**

Un tissu n'est pas sale sur le dessus. Il est sale au fond, entre les fibres, là
où l'aspirateur n'a jamais rien pris. L'injection extraction descend chercher
cette saleté et la remonte. Toute l'entreprise tient dans ce mouvement, et les
deux offres ne sont que deux façons de le faire : **vous descendez vous même
avec la machine louée, ou nous descendons pour vous.**

Le site entier enseigne ce seul mouvement. Le film descend. Le scroll descend.
La ligne de profondeur descend. Le moment interactif fait descendre puis
remonter. Une section qui ne sert pas ce mouvement ne monte pas dans la page.

---

## 2. La palette

Prélevée du logo (script bleu vers turquoise, bulles) et du monde du film
(lagon profond, lumière turquoise, eau). Valeurs finalisées sur les images
approuvées ; celles ci sont la direction.

```css
:root{
  --canvas:#07141B;         /* fond de page, bleu vert très sombre, jamais noir pur */
  --panel:#0D222C;          /* cartes et surfaces surélevées */
  --deep:#124A6E;           /* le bleu de la descente, du logo */
  --accent:#22D3C5;         /* le turquoise du logo. CTA et emphase rare uniquement */
  --accent-hover:#5AE7DC;
  --accent-muted:#22D3C51F; /* bordures, lueurs, particules */
  --text-primary:#EAF6F5;
  --text-secondary:#9DB4B8;
}
```

Règle de rareté : le turquoise n'apparaît que sur le CTA, le focus, la ligne de
profondeur et deux moments d'emphase. Partout ailleurs, le calme.

## 3. Le trio typographique

| Rôle | Police | Graisses |
|---|---|---|
| Titrage | **Bricolage Grotesque** | 700 (600 pour les titres de section) |
| Texte | **Karla** | 400, 500 |
| Petites étiquettes | **DM Mono** | 400 |

Ni Inter ni Roboto. Bricolage Grotesque tient un grand corps par dessus de la
vidéo sans devenir décoratif ; DM Mono donne aux repères de profondeur
(`01 / SURFACE`) leur air d'instrument de mesure.

---

## 4. Le film, morceau par morceau

Caméra tournée **vers le bas du début à la fin**. Un seul sujet : la fibre.
Aucune coupe. Chaque raccord tombe dans un mouvement, jamais sur un repos.

### Morceau 1 — La surface morte (0 à 6 s)

- **Monde** : macro extrême d'un tissage textile sec et poussiéreux qui remplit
  le cadre, gris beige, lumière chaude et morte, poussière en suspension.
- **Caméra** : chute droite vers la surface, vitesse constante.
- **Franchissement** : la caméra passe entre deux brins. Bouffée de poussière,
  un temps de flou, la lumière baisse d'un cran sous la surface.
- **Image finale** : en pleine descente, juste sous la surface, dans un canyon
  de fibres brun gris et sombre. **Ne se repose pas.**

### Morceau 2 — L'eau (6 à 12 s)

- **Monde** : le canyon de fibres, parois qui filent vers le haut du cadre.
- **Caméra** : même cap, même vitesse, la descente continue sans rupture.
- **Événement** : une lumière turquoise monte du fond. L'eau arrive par
  derrière la caméra en nappe brillante et balaye vers le bas. Gouttes sur
  l'objectif, un temps de flou. La poussière et les particules sombres sont
  arrachées des fibres et emportées vers le bas.
- **Le raccord tombe ici, dans le balayage d'eau** : c'est le moment qui
  justifie que la texture se régénère, donc la couture ne se voit pas.
- **Image finale** : toujours en descente, dans un canyon devenu propre et
  saturé, éclairé turquoise. **Ne se repose pas.**

### Morceau 3 — L'arrivée (12 à 18 s)

- **Monde** : le canyon s'ouvre sur une étendue large et calme de fibre propre.
- **Caméra** : la descente ralentit et s'arrête, toujours tournée vers le bas.
- **Événement** : l'eau devient un film mince qui s'évacue et s'évapore en une
  brume légère. Des micro gouttes accrochent la lumière.
- **Image finale, composée** : champ de fibre propre plein cadre, lumière
  rasante et fraîche, tout au repos. **Aucun bord à couper, aucun sujet à
  décentrer** : le texte est plaçable partout et sur n'importe quel écran.

---

## 5. La carte des bandes

Hauteur du héros : **1000vh** (18 s de film). Plage de scroll utile : 900vh,
donc 0,02 de progression = 18vh. Les plages ci dessous sont des **points de
départ**, validés ensuite par le test de coup de molette.

| # | Plage | Moment du film | Texte (verbatim) | Entrée |
|---|---|---|---|---|
| 1 | 0,00 → 0,13 | chute vers la surface poussiéreuse | « L'aspirateur s'arrête ici. » | Rampe au chargement puis scroll. Mots qui **descendent** en place. |
| 2 | 0,16 → 0,34 | traversée de la surface, entrée dans le canyon | « La saleté, elle, est déjà plus bas. » | **Flou vers net** : la ligne se précise comme la caméra sous la surface. |
| 3 | 0,38 → 0,56 | le balayage d'eau, la saleté arrachée | « L'eau descend jusqu'au fond. »<br>« Et remonte tout avec elle. » | **Dispersion** : les caractères arrivent de positions éparpillées, comme les particules emportées. Deuxième ligne décalée. |
| 4 | 0,60 → 0,76 | canyon propre, lumière turquoise | « Il ne reste rien. » | **Coup de mot** avec dépassement : trois mots qui frappent et se posent. |
| 5 | 0,80 → 1,00 | l'arrivée au repos | Titre : « À vous de descendre. Ou à nous. »<br>Sous titre : « Vous louez la machine et vous le faites vous même. Ou on vient le faire chez vous. »<br>Bouton : « Réserver une date » | **Montée mot à mot en trois temps** : titre, puis sous titre, puis le bouton. |

Bande 1 : pas de fondu d'entrée, plus une rampe d'assemblage au chargement.
Bande 5 : pas de fondu de sortie, le texte reste posé quand la page continue.

## 6. Le héros fixe (téléphones et mouvement réduit)

Composé sur l'image finale du film, sans voyage derrière.

- Titre : « Le propre commence sous la surface. »
- Sous titre : « Location de machines de nettoyage professionnelles et
  prestation à domicile. Tahiti, 7j/7. »
- Bouton : « Réserver une date »

---

## 7. Le bas de page, section par section

Tout converge vers **une seule ancre : `#reserver`**.

### 7.1 Barre de navigation
Logo, `Louer une machine`, `Prestation`, `Tarifs`, puis le bouton accent
`Réserver`. Fond translucide qui se densifie après le héros.

### 7.2 « Deux façons de faire » — la fourche
Deux cartes, traitement strictement égal, chacune avec son image.

**Carte A. Vous le faites vous même**
> La machine arrive chez vous. Vous avez 24 heures à partir de la livraison.
> À partir de 6 390 F.

**Carte B. On le fait chez vous**
> Un prestataire vient, sur rendez vous, 7 jours sur 7.
> À partir de 2 000 F.

### 7.3 « Le parc » — la position d'entreprise de location
Titre : « Nos machines »

> Aujourd'hui, une machine. Celle qui sert le plus, et qu'on connaît par cœur.
> Les suivantes arrivent.

Fiche de la machine, chiffres réels tirés du catalogue :

- Kärcher Puzzi 10/1, injecteur extracteur professionnel
- Réservoir 10 L d'eau propre, 9 L d'eau sale
- Débit d'injection 1 L/min, pression 1 bar
- 10,5 kg, embout sol et embout fauteuil inclus
- Manuel d'utilisation fourni en PDF

Deux forfaits, côte à côte, traitement égal :

| Forfait | Prix | Contenu |
|---|---|---|
| Standard | 6 390 F | 2 pastilles détergentes RM 760 |
| Auto Home | 7 990 F | 2 pastilles RM 760, 1 brosse rotative et perceuse à batterie, 1 bouteille de TASKI Tapi Extract |

Ligne de livraison : « Livraison 1 500 F sur Punaauia, Faa'a et Papenoo. »
Emplacement prévu, vide aujourd'hui, pour la machine numéro deux.

### 7.4 Le moment interactif — « Appuyez et maintenez »
Coupe transversale d'une fibre dessinée en SVG, saleté logée au fond.
Le visiteur **appuie et maintient**. Tant qu'il tient, l'eau descend, la saleté
se décroche et remonte. Il relâche trop tôt, la progression redescend en
douceur, elle ne saute jamais à zéro. Il va au bout, et la liste de ce qui
part s'allume dans l'ordre :

> acariens · taches · odeurs · allergènes

Étiquette : « Maintenez. C'est exactement ce que fait la machine. »
Mouvement réduit : état final immédiat, aucun appui exigé.

### 7.5 Tarifs
Les vrais prix du catalogue, affichés. Fini le « contactez nous pour un devis »
sur des prestations dont le prix existe déjà.

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

### 7.6 Les questions qui bloquent (FAQ)
Écrite depuis les objections réelles relevées en recherche.

**« J'ai peur d'abîmer mon canapé. »**
> C'est la bonne question. Le vrai risque n'est pas le produit, c'est l'eau
> laissée dans la fibre : trop d'eau injectée, pas assez ré aspirée, et la
> mousse reste au fond. Un injecteur extracteur aspire dans le même geste
> qu'il injecte. Le manuel part avec la machine, et on répond au téléphone.

**« Ça sèche en combien de temps ? »**
> [À REMPLIR PAR TAMATOA — délai réel constaté, aucun chiffre inventé]

**« Est ce que les taches partent vraiment ? »**
> [À REMPLIR PAR TAMATOA — ce que tu garantis et ce que tu ne garantis pas]

**« Vous venez jusqu'où ? »**
> [À REMPLIR PAR TAMATOA — zone réelle au delà de Punaauia, Faa'a et Papenoo]

**« Il faut avancer de l'argent ? »**
> Non. Réservation immédiate, sans acompte. Vous choisissez votre date et vous
> payez la location.

### 7.7 Le bloc « Réserver » — l'unique appel
Ancre `#reserver`. Deux chemins, un seul bloc, les deux vers Shopify :

- « Je loue la machine » → fiche produit Shopify
- « Je veux qu'on vienne » → fiche prestation Shopify

Sous les deux : téléphone et courriel en clair.
[À REMPLIR PAR TAMATOA — téléphone, courriel]

Formulaire de devis, pour les hôtels et les gros volumes : nom, courriel,
téléphone, besoin. Traitement retenu : **lien mailto vers l'adresse de
l'entreprise**, parce qu'un site statique n'a pas de serveur et qu'un message
doit vraiment arriver quelque part. Message de confirmation honnête : « Votre
messagerie s'ouvre avec le message prêt. Il ne part qu'une fois envoyé. »

### 7.8 Pied de page
Navigation, lien vers la politique de confidentialité existante, mention légale,
`© 2026 Pacific Rent&Clean`. Marque réelle, donc aucune mention de fiction.

---

## 8. La couche vectorielle

**L'élément signature : la ligne de profondeur.** Un filet turquoise vertical
le long de la marge gauche, sur toute la page, gradué et légendé en DM Mono :
`SURFACE`, `FIBRE`, `FOND`, `PROPRE`. Il se remplit au fil du scroll. Enlevez
le, la page perd son idée. C'est là que passe tout le budget d'audace.

Le reste, au niveau du murmure :

- Motif de tissage, deux brins entrelacés dessinés à la main en SVG, utilisé
  comme séparateur de sections. Se dessine tout seul à l'apparition.
- Coupe de fibre du moment interactif, dessinée en SVG.
- Micro gouttes dérivant lentement dans la couche de fond fixe.
- Couche d'environnement fixe : lueur turquoise très lente sur le fond bleu
  vert, plus un grain. Cycle de 60 s ou plus, décalage négatif pour ne jamais
  démarrer au premier plan.

Tout respecte le mouvement réduit : états finaux affichés, moteurs arrêtés.

## 9. La liste d'ingénierie

Rien de tout ceci n'est optionnel, tout est dans `scrub-pipeline.md` :

- Vidéo récupérée en Blob **avec anneau de progression** (le film enchaîné
  dépassera 8 Mo), affiche peinte en premier, chien de garde à 20 s.
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
- Standard « tout le site animé » : rien ne claque, une entrée chorégraphiée
  par section, un élément vivant par section au niveau du murmure.

## 9 bis. Ce qui a changé pendant la fabrication, et pourquoi

Écrit après coup, le 2026-08-13. Le dossier ci-dessus reste le plan ; voici les
écarts, tous mesurés.

- **Angle du plan d'ouverture.** Vue rasante et non verticale : le modèle a donné
  mieux que la commande, un tunnel avec de la profondeur. Cadeau saisi.
- **Morceau 2 conservé malgré ma réserve.** Le balayage d'eau demandé est sorti
  en teinte cyan uniforme au lieu d'une nappe avec gouttes sur l'objectif.
  Recommandation de refaire émise, **arbitrage de Tamatoa : garder**, pour ne pas
  dépenser 54 crédits de plus. Le morceau 3 a partiellement rattrapé : on voit le
  bout du tunnel dès sa première seconde, ce qui donne un sens au passage cyan.
- **Encodage.** 1728 px de large, crf 24, un seul encodage sur les trois bruts
  concaténés : **9,1 Mo** au lieu de 14,7 en 1080p/crf 22. Vérifié à 200 % sur
  une image de dégradé (pas de bandes) et sur la laine (poils nets).
- **Fin du plan mesurée, pas jugée** : courbe de mouvement image par image, de 26
  au départ à 1,2 à la fin. La caméra s'arrête vraiment, aucun rognage nécessaire.
- **Voiles des bandes réglés sur mesure.** Première mesure au pixel : bandes 1 et
  5 à 2,8 et 3,1:1, sous le seuil de 3,5. Les deux tombent sur du tissu clair.
  Voiles recentrés sur leur propre texte et approfondis à 0,86 au centre.
  Après correction : **1 → 8,3 · 2 → 7,3 · 3 → 4,98 · 4 → 8,6 · 5 → 6,1**.
  Ces alphas sont la molette à tourner si le film doit ressortir plus clair.
- **Bordures interactives.** Le filet décoratif tombait à 1,4:1 une fois composé
  sur son fond. Jeton dédié `--edge:#46767E` pour les champs et les gros liens :
  3,2 à 3,4:1 mesurés.
- **Cibles tactiles.** Neuf liens sous 44 px au doigt (logo, coordonnées, pied de
  page). Corrigé sans déplacer la mise en page. Contrôle final : aucune.
- **Charpentes d'en-tête variées** pour qu'aucune section voisine ne se ressemble :
  gauche, deux colonnes, centré, gauche, aligné à droite, centré.
- **Image de la section machines.** La machine générée **n'est pas** le Kärcher
  Puzzi 10/1. Elle est posée sur la carte « vous le faites vous même » avec un
  texte alternatif qui dit « illustration », et la fiche technique porte la buse
  en action, qui montre la technique sans prétendre montrer la machine.
  🔴 **À remplacer par une photo réelle du Puzzi dès que Tamatoa en fournit une.**
- **Dépense réelle.** Compteur passé de 1003,6 à 885,6, soit **118 crédits**,
  moins que les 170 annoncés. Le préflight disait 54 par vidéo ; l'écart n'est pas
  expliqué et n'est pas inventé ici.

## 10. La porte du texte

Chaque ligne écrite ci dessus part **telle quelle** dans la page. La page
construite doit passer le contrôle de la phase 9 avant que qui que ce soit la
voie : zéro tiret cadratin, zéro mot de catalogue, et le balayage des tics
d'écriture automatique. Les figures voulues de ce dossier (« À vous de
descendre. Ou à nous. », « Il ne reste rien. ») sont du métier et restent.
