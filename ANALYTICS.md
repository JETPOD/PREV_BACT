# Bactério Challenge · Configuration Plausible

Le jeu utilise le site Plausible existant **jetpod.github.io** (même script que « Garde sous vigilance » et « Urgence REB »). Le script n'est chargé que sur le chemin `/PREV_BACT/` : les copies intranet, les prévisualisations et les tests locaux ne sont pas comptabilisés.

Tous les noms commencent par **BC** pour ne pas se mélanger avec les objectifs des autres jeux du même site.

## Créer les objectifs

Dans Plausible, ouvrir le site **jetpod.github.io**, puis **Settings → Goals → Add goal → Custom event**. Créer les 54 objectifs du fichier [GOALS.txt](GOALS.txt), avec les noms exacts (accents, espaces et zéros initiaux compris).

Pour les ajouter automatiquement, utiliser le script [tools/plausible-goals](tools/plausible-goals/README.md) : il ouvre Plausible dans Chrome, vous vous connectez, puis il crée les objectifs manquants.

Les événements ne sont pas rétroactifs : créer les objectifs avant de diffuser le jeu ([documentation Plausible](https://plausible.io/docs/custom-event-goals)).

### Bloc 1 · Fréquentation (11 objectifs, toujours actifs)

| Objectif | Déclenchement |
|---|---|
| `BC Jeu démarré` | Premier parcours lancé pendant la vie de la page |
| `BC IDE démarré` · `BC Médecin démarré` · `BC Nouveaux arrivants démarré` | Lancement d'un parcours, rejeux compris |
| `BC IDE terminé` · `BC Médecin terminé` · `BC Nouveaux arrivants terminé` | Arrivée à l'écran de résultats |
| `BC IDE abandonné` · `BC Médecin abandonné` · `BC Nouveaux arrivants abandonné` | Bouton « Quitter » confirmé |
| `BC Attestation imprimée` | Clic sur « Imprimer / PDF » (le nom saisi n'est jamais transmis) |

### Bloc 2 · Niveau atteint (12 objectifs, suivi pédagogique)

Pour chaque parcours (IDE, Médecin, Nouveaux arrivants) : `BC <parcours> niveau En apprentissage` (< 50 %), `Bon niveau` (50 à 69 %), `Excellent` (70 à 89 %), `Expert` (≥ 90 %). Seul le palier est transmis, jamais le score exact.

### Bloc 3 · Questions manquées au premier essai (31 objectifs, suivi pédagogique)

Envoyé une seule fois par question quand la première réponse choisie est fausse. Ce sont les objectifs les plus utiles pour cibler les messages EOH.

| Objectif | Thème | Question |
|---|---|---|
| `BC IDE Q01 à revoir` | Antisepsie | Quel antiseptique cutané utilisez-vous chez cet adulte pour le site de ponction ? |
| `BC IDE Q02 à revoir` | Prélèvement | Dans quel ordre remplissez-vous les flacons ? |
| `BC IDE Q03 à revoir` | Prélèvement | Quel est le volume minimum recommandé par flacon ? |
| `BC IDE Q04 à revoir` | Traçabilité | Concernant la voie de prélèvement, la règle est : |
| `BC IDE Q05 à revoir` | Traçabilité | Cette double traçabilité est-elle nécessaire ? |
| `BC IDE Q06 à revoir` | Manipulation | Avant d'accéder à la valve, vous faites : |
| `BC IDE Q07 à revoir` | Manipulation | Quand doit-il être refait en routine ? |
| `BC IDE Q08 à revoir` | Suspicion BLC | Quelle est la conduite à tenir ? |
| `BC IDE Q09 à revoir` | Interprétation | Comment interprétez-vous cela ? |
| `BC IDE Q10 à revoir` | Hygiène des mains | Avant tout accès, vous : |
| `BC IDE Q11 à revoir` | Manipulation | Le rinçage pulsé après injection est : |
| `BC IDE Q12 à revoir` | Réactivité | Vous : |
| `BC Médecin Q01 à revoir` | Indication | Poser un CVC est-il indiqué ? |
| `BC Médecin Q02 à revoir` | Choix du dispositif | Quel dispositif d'accès vasculaire choisissez-vous ? |
| `BC Médecin Q03 à revoir` | Pose CVC | Quel site d'insertion privilégier pour limiter le risque infectieux ? |
| `BC Médecin Q04 à revoir` | Réévaluation | L'indication de chaque dispositif invasif (CVC, sonde urinaire, PICC…) doit être réévaluée : |
| `BC Médecin Q05 à revoir` | Sondage urinaire | Le sondage urinaire est-il indiqué ? |
| `BC Médecin Q06 à revoir` | Retrait précoce | Quand retirer la sonde urinaire ? |
| `BC Médecin Q07 à revoir` | Pose CVC | Une antibioprophylaxie est-elle recommandée avant la pose ? |
| `BC Médecin Q08 à revoir` | Suspicion BLC | Quelle est votre stratégie diagnostique ? |
| `BC Médecin Q09 à revoir` | Analyse de cause | Quelle démarche organisationnelle est recommandée ? |
| `BC Médecin Q10 à revoir` | Traçabilité | Comment libellez-vous la prescription ? |
| `BC Nouveaux arrivants Q01 à revoir` | Hygiène des mains | La friction hydro-alcoolique est : |
| `BC Nouveaux arrivants Q02 à revoir` | Tenue | Le port d'une alliance et d'une montre est : |
| `BC Nouveaux arrivants Q03 à revoir` | Kits et matériel | Que faites-vous ? |
| `BC Nouveaux arrivants Q04 à revoir` | Signalement | Vous : |
| `BC Nouveaux arrivants Q05 à revoir` | Culture sécurité | L'approche est : |
| `BC Nouveaux arrivants Q06 à revoir` | Traçabilité | Où l'écrivez-vous ? |
| `BC Nouveaux arrivants Q07 à revoir` | Sondage urinaire | La règle par défaut est : |
| `BC Nouveaux arrivants Q08 à revoir` | Ressources | À qui vous adressez-vous en premier ? |
| `BC Nouveaux arrivants Q09 à revoir` | Définitions | Une bactériémie est dite nosocomiale si elle survient : |

## Indicateurs à suivre

| Indicateur | Calcul (totaux d'événements, même période) |
|---|---|
| Taux d'achèvement par parcours | `terminé` ÷ `démarré` |
| Taux d'abandon par parcours | `abandonné` ÷ `démarré` |
| Taux d'erreur au premier essai d'une question | `Qxx à revoir` ÷ `terminé` du parcours (approximation, les abandons en cours de route sont inclus au numérateur) |
| Répartition des niveaux | chaque `niveau` ÷ somme des 4 niveaux du parcours |
| Attestations | `BC Attestation imprimée` ÷ somme des `terminé` |

Utiliser les **totaux** plutôt que le taux de conversion affiché par Plausible, qui repose sur les visiteurs uniques quotidiens et non sur les tentatives ([définition des métriques](https://plausible.io/docs/metrics-definitions)). Filtrer les pages sur `/PREV_BACT/` si besoin. Vérifier que le fuseau horaire du site est **Europe/Paris**.

Point de vigilance institutionnel : `BC IDE Q04 à revoir`, `BC IDE Q05 à revoir`, `BC Médecin Q10 à revoir` et `BC Nouveaux arrivants Q06 à revoir` portent sur la traçabilité de la voie de prélèvement (cible ≥ 95 % à 6 mois).

## Vérifier l'affichage

Après création des objectifs, ouvrir le [jeu public](https://jetpod.github.io/PREV_BACT/) dans un navigateur sans bloqueur, jouer un parcours en se trompant volontairement à une question, puis imprimer l'attestation. Les événements apparaissent dans la section **Goal Conversions** du tableau de bord.

## Confidentialité

- Aucun nom, aucune réponse cochée, aucun score exact, aucun numéro de tentative ni identifiant d'apprenant n'est transmis.
- L'adresse de référence et les paramètres d'URL sont retirés de chaque envoi (`analytics.js`, liste fermée de noms autorisés).
- Le joueur peut désactiver les blocs 2 et 3 dans le « Règlement » ; ce choix vaut pour la page ouverte, sans stockage.
- Plausible fonctionne sans cookie ni identifiant persistant ([politique de données](https://plausible.io/data-policy)). Le propriétaire reste responsable des réglages du compte et de la validation institutionnelle du dispositif.

## Test local

`node test-analytics.cjs` vérifie les 54 noms autorisés, le nettoyage des envois et la désactivation du suivi pédagogique. Il n'envoie aucune requête.
