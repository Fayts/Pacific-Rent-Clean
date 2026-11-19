# Pacific Rent&Clean V2 — Prototype Shopify (non publié)

Source de référence : branche `claude/verify-10k-website-skill-5yr8qa`, dossier `site/`.

## Périmètre
- Thème Shopify Online Store 2.0 isolé dans `shopify-v2/`.
- Aucun changement du thème Shopify actif, de `main`, des applications ou des paiements.
- Phase initiale : structure Liquid, accueil et tunnel Location ; les autres pages seront portées ensuite.
- Conserver IzyRent pendant la transition ; aucune suppression d'abonnement.

## Points bloquants avant une réservation fonctionnelle
1. Porter fidèlement les médias, le CSS, les scripts et les pages depuis `site/` en réécrivant leurs URL avec les filtres Liquid `asset_url` / `routes`.
2. Héberger les API de réservation existantes sur Vercel et définir une passerelle Shopify → Vercel avec vérification de signature ou autre protection appropriée. Ne pas exposer les clés Resend.
3. Ne jamais envoyer une vraie réservation pendant la recette sans accord explicite.
4. Préserver les paramètres de présélection, les CGS et les validations côté serveur.
5. Comparer la version Shopify au dernier commit V2 avant publication.

## État
Ce dossier est un **socle de développement**, pas un thème prêt à importer ni à publier. La boutique Shopify actuelle reste la référence commerciale jusqu'à validation complète.
