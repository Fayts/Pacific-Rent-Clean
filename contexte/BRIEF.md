# Brief de reprise — Pacific Rent&Clean

A lire en premier par toute session Claude Code ouverte sur ce depot, en
particulier depuis la tablette. Le skill `10k-websites` vit dans
`.claude/skills/10k-websites/` et se charge tout seul.

## Ce que le projet est

Entreprise de **location de machines de nettoyage** a Tahiti, plus prestation a
domicile. Le Karcher Puzzi 10/1 est la premiere machine de la gamme, **pas** le
sujet du site. Cible prioritaire : les particuliers ; hotels et locations
saisonnieres en second rideau.

La caisse reste sur **Shopify**. Chaque bouton « Reserver » renvoie vers la
boutique existante. Le site de ce depot est une **facade** : il ne touche jamais
a l'argent.

Premisse de marque, verbatim : **« Le propre commence sous la surface. »**

## Ce qui existe deja, et qui ne doit PAS etre regenere

`site/` est la V1 livree et mise en ligne le 2026-08-13. Tous ses visuels sont
**deja generes** — 118 credits Higgsfield depenses :

| Fichier | Ce que c'est |
|---|---|
| `site/assets/hero-scrub.mp4` | Le film de 18 s, 3 segments enchaines (Seedance 2.0), defile au scroll |
| `site/assets/hero-poster.jpg` | Poster du heros, sert de premiere image |
| `site/assets/hero-still.jpg`, `hero-ending.jpg` | Images fixes du film |
| `site/assets/still-machine.jpg`, `still-location.jpg`, `still-prestation.jpg` | Les trois sections sous la ligne de flottaison |
| `site/index.html` | La page complete, HTML/CSS/JS pur, sans etape de build |

**Regle :** reutiliser ces fichiers par defaut. Ne relancer une generation
Higgsfield que si Tamatoa le demande explicitement, et lui annoncer le cout en
credits avant.

`contexte/design-package.md` est le dossier de conception ecrit AVANT la
generation. C'est l'entree que le skill consomme en phase de build : premisse de
marque, palette, trio typographique, carte des bandes, et **toute la copie en
verbatim**. Le texte marque verbatim part tel quel dans la page, sans
reformulation.

## Les deux choses que la session cloud n'a pas d'office

1. **Higgsfield** — ce n'est PAS un probleme de depot. Le skill passe par le
   connecteur MCP `https://mcp.higgsfield.ai/mcp`, dont le trafic transite par
   les serveurs d'Anthropic et non par le reseau de la VM. Il suffit de
   l'activer sur la session depuis claude.ai. Verifier ensuite par un appel de
   solde : il doit rendre de vrais nombres.

2. **ffmpeg** — absent de la VM cloud (Node.js 22 y est, lui). Le pipeline de
   scrub video en depend. Le reglage se fait une fois dans le *setup script* de
   l'environnement cloud, pas ici :

   ```bash
   #!/bin/bash
   apt update && apt install -y ffmpeg || true
   ```

## Ce qui n'est volontairement pas dans ce depot

- Les identifiants Shopify (admin, jeton d'API, mot de passe de boutique) : ils
  ne passent ni par la conversation ni par Git.
- Les fichiers `.env` et le dossier `.vercel` : ignores par `.gitignore`.
- Les bruts de generation et les images de revue : ils ne partent jamais en ligne.
- Le suivi interne AI-OS (etat, decisions, empreintes) : il reste dans
  `C:\AIOS\projects\pacific-rent-clean\`. **Ce depot est public.**
