# Ajout automatique des objectifs Plausible

Ce script ajoute dans Plausible les 54 objectifs de [GOALS.txt](../../GOALS.txt) (site `jetpod.github.io`). Il ne crée que ceux qui manquent et peut donc être relancé sans risque de doublon.

## Prérequis

[Node.js](https://nodejs.org) 18 ou plus récent.

## Utilisation

```bash
git clone https://github.com/JETPOD/PREV_BACT.git
cd PREV_BACT/tools/plausible-goals
npm run setup        # installe Playwright et Chromium (une seule fois)
npm run test-un      # essai : crée un seul objectif
npm run goals        # crée tous les objectifs manquants
```

Une fenêtre Chrome s'ouvre sur Plausible : connectez-vous normalement (y compris le code de double authentification). Le script reprend seul dès que la page **Settings → Goals** s'affiche, crée les objectifs un par un, puis affiche un bilan et la liste des éventuels manquants.

- Le script ne lit ni ne stocke votre mot de passe. La session est conservée dans le dossier local `.plausible-session` pour éviter de vous reconnecter ; supprimez-le après usage si vous le souhaitez.
- En cas d'échec sur un objectif, une capture d'écran est enregistrée dans `captures/` et le script passe au suivant.
- `npm run dry-run` affiche la liste sans rien créer.

## Mode API (offre Enterprise uniquement)

Avec une clé Sites API, le navigateur n'est pas nécessaire :

```bash
PLAUSIBLE_SITES_API_KEY=xxxx node add-goals.mjs
```

La [Sites API](https://plausible.io/docs/sites-api) est réservée à l'offre Enterprise ; avec les offres Growth ou Business, utilisez le mode navigateur.

## Options

| Option | Rôle | Défaut |
|---|---|---|
| `--limit N` | ne crée que N objectifs | tous |
| `--site` | site Plausible | `jetpod.github.io` |
| `--host` | instance Plausible (auto-hébergée) | `https://plausible.io` |
| `--goals` | fichier de noms | `../../GOALS.txt` |

Le même script fonctionne pour les autres jeux : `node add-goals.mjs --goals chemin/vers/liste.txt`.
