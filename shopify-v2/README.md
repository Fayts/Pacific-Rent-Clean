# Pacific Rent&Clean V2 · Shopify Online Store 2.0

Le thème reprend le dossier `site/` de la branche `claude/verify-10k-website-skill-5yr8qa` au commit `4a68aeb9821e62e181b0fb94368e2709432a6467`. Le code du thème se trouve dans `shopify-v2/` sur `feature/shopify-v2-theme-prototype`.

## Installation pour une recette isolée

1. Depuis `shopify-v2/`, exécuter `shopify theme check` puis `shopify theme package`. Le ZIP contient les dossiers Shopify à sa racine et les médias du héros.
2. Après accord, importer le ZIP dans la bibliothèque des thèmes d’une boutique Shopify de test isolée et ouvrir **Aperçu**.
3. Dans cette boutique de test, créer les cinq pages avec les handles ci-dessous. Le modèle Page par défaut charge la bonne section selon le handle, ce qui permet d’explorer les liens en aperçu. Les modèles dédiés sont aussi fournis pour une affectation explicite lorsque Shopify les propose dans l’administration. Configurer les titres et métadescriptions des pages dans l’administration.

| Page | URL | Modèle dédié |
| --- | --- | --- |
| Accueil | `/` | `index` |
| Prestations | `/pages/prestations` | `page.prestations` |
| Location | `/pages/location` | `page.location` |
| Contact | `/pages/contact` | `page.contact` |
| Tunnel Location | `/pages/reserver` | `page.reserver-location` |
| Tunnel Prestations | `/pages/demande-prestation` | `page.demande-prestation` |

4. Ouvrir l’accueil en aperçu et suivre les boutons et les liens du menu. Remplir les formulaires avec des coordonnées fictives. Une confirmation de simulation clôt chaque parcours.
5. Dans la section Accueil, le mode **Séquence WebP** est sélectionné par défaut. Choisir **Vidéo MP4** pour vérifier la lecture pilotée par le défilement. Le champ vidéo optionnel permet de sélectionner la même vidéo dans **Contenu → Fichiers** de la boutique de test si son CDN ne sert pas le MP4 embarqué. La source d’origine est `assets/hero-scrub-web.mp4`.

## Fonctionnalités reproduites

- Les six pages, le CSS responsive, les typographies d’origine, les animations, les médias, le menu mobile, les ancres et les paramètres de présélection. Les liens de devis transmettent aussi la catégorie de textile.
- Accueil avec 181 images WebP, canvas et préchargement progressif. Le mode MP4, les affiches de repli, les deux boutons de réservation et le héros fixe sur petit écran ou en mouvement réduit reprennent la V2.
- Location de 24 heures. Standard 6 390 XPF et Auto-Home 7 990 XPF, avec deux pastilles RM 760 incluses et jusqu’à dix pastilles supplémentaires à 500 XPF chacune. Date à partir de J+2 à Tahiti. Remise par livraison ou retrait avec frais par commune (0, 1 500 ou 2 500 XPF dans les deux cas, conformément à la V2). Adresse obligatoire pour la livraison. Virement, Deblock ou espèces, sans paiement en ligne ni caution. Récapitulatif et CGS Location dépliables avec acceptation obligatoire.
- Prestations avec douze références textile et dimensions, panier multi-articles, quantités, frais par commune et récapitulatif. Standard dès J+2 et urgence J+1 à 1 500 XPF. Le retour à Standard efface la date devenue invalide et conserve le panier et les coordonnées. Les CGS Prestations version du 18 novembre 2026 sont dépliables et à accepter. Les pastilles supplémentaires sont propres au tunnel Location.
- Contact et demande de devis hors dimensions avec textile, dimensions et description. La location, la prestation et le contact utilisent le simulateur commun.

## Contrat avec Vercel et coûts possibles

`assets/request-transport.js` reprend les chemins `/api/location`, `/api/prestation` et `/api/contact` et leurs charges utiles JSON. Il vérifie les champs et retourne des réponses locales. Pour Prestations, il simule aussi la préparation de l’horodatage, puis le dépôt de la demande. Tout reçu et toute signature de simulation sont fictifs. Le thème ne propose aucun réglage d’activation des envois réels.

Après validation, adapter le transport pour appeler une passerelle de préproduction, tout en conservant les fonctions Node.js de la V2 côté Vercel. Les tarifs, les dates, les coordonnées et le consentement doivent y être contrôlés de nouveau. Conserver `RESEND_API_KEY` et la configuration d’expédition dans l’environnement serveur. Les appels Prestations doivent conserver le protocole `prepareConsent` / `stamp`, le `requestId` et l’idempotence.

| Option | Intégration | Coûts éventuels |
| --- | --- | --- |
| URL HTTPS Vercel | Appels JSON depuis le thème. Gérer `OPTIONS`, les origines autorisées et une protection anti-abus côté serveur. CORS contrôle le navigateur et ne suffit pas à authentifier les appels. | Pas d’application Shopify dédiée. Vérifier l’éligibilité du plan Vercel à l’usage commercial, le trafic et les quotas Resend. |
| Shopify App Proxy vers Vercel | URL sous le domaine Shopify, application approuvée et vérification de la signature Shopify côté serveur, en plus de la protection anti-abus. | Développement et maintenance de l’application, hébergement Vercel et consommation Resend. |

Aucun nouvel abonnement ni application payante n’est nécessaire pour la simulation. Pour les envois réels, les coûts éventuels incluent le plan et les dépassements Vercel, les quotas de courriels Resend, et un domaine d’envoi vérifié si l’entreprise n’en dispose pas. Les tarifs dépendent des offres et du volume. [Tarifs Vercel](https://vercel.com/pricing) · [Tarifs Resend](https://resend.com/pricing) · [Documentation App Proxy](https://shopify.dev/docs/apps/build/online-store/app-proxies)

## Vérifications et risques avant mise en service

- Shopify CLI a validé le thème sans erreur. Les avertissements concernent les ressources Google Fonts reprises de la V2. Le ZIP a été vérifié avec les 181 WebP et le MP4.
- Chromium a exécuté les six pages rendues localement à 390, 820 et 1 440 px. Les parcours ont couvert les liens et ancres, le menu, le canvas, le MP4, le mouvement réduit, les présélections, les totaux, les CGS, les transitions de dates et les trois simulations, sans requête de soumission.
- Les tests Node existants de Location passent. Trois assertions de Prestations échouent également sur la V2 de référence. Le test de grille attend une ancienne structure HTML et deux tests d’API utilisent la version de CGS du 16 novembre, alors que l’API exige celle du 18 novembre.
- La recette dans Shopify reste à faire après autorisation. Vérifier le chargement des médias sur son CDN, le rendu avec les polices chargées, les liens en aperçu et Safari sur iPhone/iPad. Le poids des médias et la vitesse du réseau influent sur le premier passage de l’animation.
- La connexion Vercel/Resend reste à faire après autorisation. Tester d’abord avec des destinataires fictifs, un transport serveur simulé, une limitation de débit et une journalisation sans données personnelles. Valider les mécanismes de déduplication des trois formulaires, la conservation des preuves de consentement, la politique de confidentialité et les mentions légales avant l’ouverture.
- La disponibilité reste à confirmer manuellement. Avant toute transition, définir qui vérifie les créneaux et comment éviter les doublons avec IzyRent. La simulation Shopify ne lit ni n’écrit les disponibilités d’IzyRent.
