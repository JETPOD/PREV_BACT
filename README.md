# Bactério Challenge

**Serious game de prévention des bactériémies nosocomiales** — prototype web pédagogique développé pour l'Équipe Opérationnelle d'Hygiène (EOH) / CLIN dans le cadre du plan d'action de réduction de 30 % des bactériémies nosocomiales à 12 mois.

> _Ensemble, sous la barre des 30 %._

## 🎯 Objectifs pédagogiques

- Diffuser les bons réflexes en matière de prévention des bactériémies liées aux soins (BLC, ISO, bactériémies urinaires).
- Renforcer la **traçabilité de la voie de prélèvement d'hémoculture** — cible institutionnelle ≥ 95 % à 6 mois.
- Ancrer une culture de sécurité **collective, non nominative et bienveillante**.

## 👥 Trois parcours cibles

| Parcours | Public | Durée | Questions |
|---|---|---|---|
| **Le geste juste** | IDE / IADE de terrain | ~12 min | 12 |
| **La bonne décision** | Médecins prescripteurs | ~10 min | 10 |
| **Les fondamentaux** | Nouveaux arrivants (accueil, tutorat) | ~10 min | 10 |

Chaque question s'appuie sur un **scénario clinique**, propose 3 à 4 options, puis délivre une **explication sourcée** (SF2H, SPIADI, PROPIAS, HAS).

## 🎮 Mécanique de jeu

- **Score** : +15 pts si juste au premier essai · +10 au second · +5 au dernier.
- **Streak** visible dès 3 bonnes réponses consécutives.
- **Feedback bienveillant** avec source scientifique à chaque question.
- **Écran de résultats** : trophée par palier (🌱 / 🎯 / 🏆 / ⭐), bilan par thématique avec barres animées, 3 « ce que vous emportez » personnalisés.
- **Attestation nominative** imprimable en PDF via le navigateur.

## 🚀 Utilisation

### En ligne (GitHub Pages)

Voir la section **About** du dépôt pour le lien direct (activé automatiquement).

### En local

Il n'y a **aucune dépendance** — le jeu tourne en HTML/CSS/JS statique.

```bash
git clone https://github.com/JETPOD/PREV_BACT.git
cd PREV_BACT
# Ouvrir index.html directement, ou :
python3 -m http.server 8000
# puis http://localhost:8000
```

### Hébergement en intranet

Copiez les 3 fichiers (`index.html`, `styles.css`, `game.js`) sur n'importe quel serveur web statique.
Aucun backend, aucune base de données, aucun cookie, aucun `localStorage` — 100 % anonyme et RGPD-friendly.

## 📁 Structure

```
PREV_BACT/
├── index.html      # Structure SPA (home / jeu / résultats) + dialogs
├── styles.css      # Charte teal + print stylesheet A4
├── game.js         # Logique + banque des 32 questions sourcées
└── README.md
```

## 🎨 Charte graphique

Palette **teal** — `#01696F` primary / `#0C4E54` foncé / `#E6F0F0` clair / `#F7F6F2` crème.
Typographie **General Sans** (Fontshare) avec fallback système.

## 📚 Sources scientifiques mobilisées

- [SF2H — 100 recommandations pour la surveillance et la prévention](https://www.sf2h.net/publications.html)
- [Mission nationale SPIADI 2023-2025](https://www.spiadi.fr/)
- [PROPIAS — Actions ministérielles](https://sante.gouv.fr/soins-et-maladies/qualite-securite-et-pertinence-des-soins/securite-des-prises-en-charge/actions-propias-risque-infectieux/)
- [Stratégie nationale 2022-2025 de prévention des IAS](https://www.cpias-ile-de-france.fr/docprocom/doc/ministere-strategie-nationale-2022-2025.pdf)
- Avis conjoint SF2H-SFPC juin 2024 sur la manipulation des dispositifs intravasculaires

## 🧪 Extension possible

- Ajouter des parcours **cadre de santé** et **aide-soignant(e)**
- Intégrer un module **auto-évaluation post-audit flash 48 h**
- Traduction anglaise pour établissements multi-sites
- Version print PDF de type flyer récapitulatif

## 📝 Licence

Ce prototype est mis à disposition sous licence [Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr).
Réutilisation autorisée à fins pédagogiques non commerciales avec attribution EOH/CLIN.

## 🤝 Contribution

Suggestions bienvenues via **Issues** : ajout de questions, correction de sources, amélioration UX.

---

_Prototype v1.0 — juillet 2026 · Dr Jean-Etienne Podik · EOH / CLIN_
