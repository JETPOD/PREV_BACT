/* ============================================================
   Bactério Challenge — logique de jeu
   EOH / CLIN — juillet 2026
   ============================================================ */

// =============== BANQUE DE QUESTIONS ===============
const QUESTIONS = {
  ide: {
    name: "IDE / IADE — Le geste juste",
    questions: [
      {
        theme: "Antisepsie",
        scenario: "M. R., 68 ans, sepsis post-opératoire à J+2. Le médecin prescrit une hémoculture. Vous préparez le geste sur voie périphérique.",
        question: "Quel antiseptique cutané utilisez-vous chez cet adulte pour le site de ponction ?",
        options: [
          "Bétadine dermique aqueuse",
          "CHG alcoolique 2 % avec temps de séchage respecté",
          "Alcool à 70 % seul",
          "Savon doux + eau claire"
        ],
        correct: 1,
        explanation: "La CHG alcoolique 2 % est le standard recommandé par la SF2H pour l'antisepsie avant hémoculture et pose de cathéter chez l'adulte. Le respect du temps de séchage spontané est essentiel pour l'efficacité de l'antiseptique.",
        source: "SF2H 2019 · SPIADI"
      },
      {
        theme: "Prélèvement",
        scenario: "Vous avez préparé la peau. Il faut maintenant remplir les flacons d'hémoculture.",
        question: "Dans quel ordre remplissez-vous les flacons ?",
        options: [
          "Aérobie puis anaérobie",
          "Anaérobie puis aérobie",
          "L'ordre n'a pas d'importance"
        ],
        correct: 0,
        explanation: "L'ordre standard est aérobie puis anaérobie, pour limiter l'introduction d'air dans le flacon anaérobie. Le volume et l'ordre sont cruciaux pour la sensibilité.",
        source: "SF2H · Recommandations laboratoire"
      },
      {
        theme: "Prélèvement",
        scenario: "Vous devez remplir chaque flacon d'hémoculture adulte.",
        question: "Quel est le volume minimum recommandé par flacon ?",
        options: ["3 ml", "10 ml", "20 ml", "40 ml"],
        correct: 1,
        explanation: "10 ml par flacon adulte est le volume recommandé pour optimiser la sensibilité microbiologique. Un volume insuffisant est la première cause de faux négatifs.",
        source: "SF2H · CLIN"
      },
      {
        theme: "Traçabilité",
        scenario: "Vous remplissez le bon de laboratoire pour l'hémoculture prélevée sur voie périphérique.",
        question: "Concernant la voie de prélèvement, la règle est :",
        options: [
          "À mentionner seulement si prélevée sur cathéter",
          "Optionnelle si l'IDE le juge évident",
          "Systématiquement précisée (VP / KTC / PICC / PAC / CI)"
        ],
        correct: 2,
        explanation: "La voie doit être systématiquement précisée. C'est la donnée qui permet à l'EOH de distinguer une bactériémie liée aux cathéters d'une contamination — 14,5 % de vos bons actuels ne la mentionnent pas.",
        source: "Rapport EOH V2 · Cible ≥ 95 % à 6 mois"
      },
      {
        theme: "Traçabilité",
        scenario: "Vous avez bien noté la voie sur le bon de laboratoire, mais l'infirmière du soir vous demande si vous l'avez aussi consignée dans le dossier de soin.",
        question: "Cette double traçabilité est-elle nécessaire ?",
        options: [
          "Non, le bon suffit",
          "Oui — les 2 sources (bon + dossier) doivent concorder",
          "Optionnel si le patient sort le lendemain"
        ],
        correct: 1,
        explanation: "La concordance bon / dossier est essentielle. L'audit EOH vérifie les deux sources — la traçabilité complète est le socle de la fiabilité des taux nosocomiaux.",
        source: "Protocole EOH · Audit flash 48 h"
      },
      {
        theme: "Manipulation",
        scenario: "Vous devez injecter un antibiotique par une valve bidirectionnelle sur un cathéter central.",
        question: "Avant d'accéder à la valve, vous faites :",
        options: [
          "Rinçage direct à la seringue",
          "Friction 15 secondes à l'alcool 70 % + séchage spontané",
          "Nettoyage à la compresse sèche"
        ],
        correct: 1,
        explanation: "La désinfection de la valve à l'alcool 70 % pendant 15 secondes avant chaque accès est le geste-clé pour prévenir les bactériémies liées aux cathéters. Conformité nationale SPIADI 2024 : 44 % — il y a une marge d'amélioration.",
        source: "SPIADI 2024 · SF2H"
      },
      {
        theme: "Manipulation",
        scenario: "Le pansement transparent d'un CVC posé il y a 5 jours est propre, sec et bien collé.",
        question: "Quand doit-il être refait en routine ?",
        options: [
          "Tous les jours",
          "Tous les 7 jours ou si souillé/décollé",
          "Toutes les 48 heures"
        ],
        correct: 1,
        explanation: "Le pansement transparent occlusif se change tous les 7 jours ou sans délai s'il est souillé, décollé ou humide. Les changements trop fréquents exposent inutilement le site.",
        source: "SF2H 2019"
      },
      {
        theme: "Suspicion BLC",
        scenario: "M. L. est porteur d'un PICC line depuis 8 jours. Il présente une fièvre à 39 °C sans autre foyer évident.",
        question: "Quelle est la conduite à tenir ?",
        options: [
          "Retrait immédiat systématique du PICC",
          "Hémocultures appariées (cathéter + périphérique) avant toute décision",
          "Antibiothérapie empirique sans hémocultures"
        ],
        correct: 1,
        explanation: "Devant une suspicion de bactériémie liée au cathéter, on prélève une hémoculture sur le cathéter ET une hémoculture périphérique en parallèle. Le ratio de temps de positivation ou le rapport quantitatif oriente le diagnostic.",
        source: "SF2H · 100 recommandations"
      },
      {
        theme: "Interprétation",
        scenario: "Une hémoculture ressort positive à Staphylococcus epidermidis dans un seul flacon sur deux, prélevée sur voie périphérique.",
        question: "Comment interprétez-vous cela ?",
        options: [
          "Bactériémie vraie à traiter",
          "Contamination probable de la peau",
          "Endocardite"
        ],
        correct: 1,
        explanation: "Un staphylocoque à coagulase négative isolé dans un seul flacon oriente vers une contamination (flore cutanée), sauf terrain particulier (immunodéprimé, prothèse vasculaire). D'où l'importance capitale d'une antisepsie parfaite.",
        source: "SF2H · Guide interprétation"
      },
      {
        theme: "Hygiène des mains",
        scenario: "Vous devez accéder à un dispositif intravasculaire (CVC, PICC, midline, CCI).",
        question: "Avant tout accès, vous :",
        options: [
          "Lavage simple à l'eau et savon",
          "Friction hydro-alcoolique",
          "Gants sans autre geste préalable"
        ],
        correct: 1,
        explanation: "La friction hydro-alcoolique est requise avant tout accès à un dispositif intravasculaire. La conformité nationale SPIADI 2025 pour l'hygiène opérateur est de 46-55 % — un axe majeur d'amélioration.",
        source: "SPIADI 2025 · SF2H"
      },
      {
        theme: "Manipulation",
        scenario: "Vous venez d'injecter un antibiotique dans un cathéter central.",
        question: "Le rinçage pulsé après injection est :",
        options: [
          "Optionnel selon le produit injecté",
          "Recommandé pour éviter le dépôt et les biofilms",
          "À éviter par risque de reflux"
        ],
        correct: 1,
        explanation: "Le rinçage pulsé (à-coups) après injection est recommandé (avis SF2H-SFPC 2024) pour prévenir les dépôts médicamenteux et la formation de biofilms — un facteur clé des BLC tardives.",
        source: "SF2H-SFPC juin 2024"
      },
      {
        theme: "Réactivité",
        scenario: "Vous constatez qu'un pansement de CVC est légèrement décollé et souillé par de la transpiration.",
        question: "Vous :",
        options: [
          "Attendez la prochaine visite programmée",
          "Renforcez avec un pansement supplémentaire",
          "Réalisez la réfection sans délai selon protocole"
        ],
        correct: 2,
        explanation: "Un pansement souillé ou décollé doit être refait sans délai. Renforcer sans nettoyer expose au risque infectieux — c'est un des points-clés du bundle de manipulation.",
        source: "SF2H · Bundle EOH"
      }
    ]
  },
  medecin: {
    name: "Médecin prescripteur — La bonne décision",
    questions: [
      {
        theme: "Indication",
        scenario: "M. B., 54 ans, admis pour pneumopathie franche. Vous devez prescrire une antibiothérapie IV de 5 jours. L'accès veineux périphérique est facile et de bonne qualité.",
        question: "Poser un CVC est-il indiqué ?",
        options: [
          "Oui, systématique pour toute antibio IV",
          "Non — un CVP suffit pour une durée < 7 jours",
          "À discuter avec l'IDE"
        ],
        correct: 1,
        explanation: "Pour une antibiothérapie IV de courte durée avec un accès périphérique correct, le CVP est adapté. Chaque jour-cathéter supplémentaire augmente le risque de BLC — l'indication doit être stricte.",
        source: "SF2H · PROPIAS axe 3"
      },
      {
        theme: "Choix du dispositif",
        scenario: "Mme D. doit recevoir une antibiothérapie IV de 3 semaines à domicile.",
        question: "Quel dispositif d'accès vasculaire choisissez-vous ?",
        options: [
          "CVP renouvelé toutes les 96 h",
          "Midline ou PICC line",
          "CVC jugulaire",
          "Chambre implantable (CCI)"
        ],
        correct: 1,
        explanation: "Pour une durée prévisible de 2 à 4 semaines, le midline ou PICC est le choix optimal. La CCI se réserve aux traitements > 3 mois ou itératifs (oncologie). Le CVC est réservé aux durées courtes en réanimation ou soins continus.",
        source: "SF2H · SPIADI"
      },
      {
        theme: "Pose CVC",
        scenario: "Vous devez poser un CVC chez un patient adulte sans contre-indication anatomique.",
        question: "Quel site d'insertion privilégier pour limiter le risque infectieux ?",
        options: [
          "Fémoral (accès rapide en urgence)",
          "Sous-clavier",
          "Jugulaire interne"
        ],
        correct: 1,
        explanation: "Le site sous-clavier est associé au taux le plus faible d'infections liées au cathéter, sauf contre-indication (troubles de la coagulation, insuffisance respiratoire sévère). Le fémoral est à éviter en dehors de l'urgence.",
        source: "SF2H · SPIADI 2023"
      },
      {
        theme: "Réévaluation",
        scenario: "Vous êtes en staff médical du matin dans l'unité de surveillance continue.",
        question: "L'indication de chaque dispositif invasif (CVC, sonde urinaire, PICC…) doit être réévaluée :",
        options: [
          "À chaque changement de senior",
          "Quotidiennement, en staff",
          "Toutes les 72 heures",
          "À la sortie du patient"
        ],
        correct: 1,
        explanation: "L'évaluation quotidienne systématique en staff (démarche « stop and go ») réduit la durée moyenne de maintien de 20 à 40 % dans les études interventionnelles. Un dispositif sans indication écrite = retrait sous 24 h.",
        source: "PROPIAS · Bundle EOH"
      },
      {
        theme: "Sondage urinaire",
        scenario: "Mme M., 62 ans, consciente et continente, sort de bloc après une PTH programmée.",
        question: "Le sondage urinaire est-il indiqué ?",
        options: [
          "Systématique pour toute chirurgie orthopédique",
          "Non indiqué par défaut chez une patiente continente",
          "48 heures post-op systématique"
        ],
        correct: 1,
        explanation: "Chez une patiente continente sortant d'une chirurgie orthopédique programmée sans complication, le sondage vésical n'est pas indiqué. C'est un facteur majeur de bactériémies urinaires nosocomiales évitables.",
        source: "HAS · SF2H"
      },
      {
        theme: "Retrait précoce",
        scenario: "Un patient a été sondé pour monitoring de la diurèse pendant l'intervention. À J+1 post-op, il est conscient, autonome, hémodynamiquement stable.",
        question: "Quand retirer la sonde urinaire ?",
        options: [
          "Dès la sortie de la salle de réveil",
          "Dès que possible et au plus tard J+2",
          "À la sortie du patient"
        ],
        correct: 1,
        explanation: "La sonde doit être retirée dès que l'indication disparaît. La règle « J+2 par défaut sauf indication écrite maintenue » est efficace : chaque jour de sondage supplémentaire augmente le risque de bactériurie.",
        source: "HAS · PROPIAS"
      },
      {
        theme: "Pose CVC",
        scenario: "Vous êtes sur le point de poser un CVC chez un patient de médecine polyvalente, sans immunodépression.",
        question: "Une antibioprophylaxie est-elle recommandée avant la pose ?",
        options: [
          "Systématique pendant 24 h",
          "Aucune antibioprophylaxie recommandée",
          "Uniquement en cas de neutropénie"
        ],
        correct: 1,
        explanation: "Aucune antibioprophylaxie n'est recommandée avant la pose d'un CVC chez l'adulte non immunodéprimé. La prévention repose sur le bundle (antisepsie, drapage, hygiène, checklist).",
        source: "SF2H · SFAR"
      },
      {
        theme: "Suspicion BLC",
        scenario: "M. K. porteur d'un CVC depuis 6 jours présente une fièvre inexpliquée à 38,7 °C. Pas d'autre foyer identifié.",
        question: "Quelle est votre stratégie diagnostique ?",
        options: [
          "Retrait du CVC en systématique",
          "Hémocultures appariées cathéter + périphérique avec temps de positivation",
          "Antibiothérapie probabiliste seule"
        ],
        correct: 1,
        explanation: "La stratégie recommandée repose sur les hémocultures appariées : le différentiel de temps de positivation (positivité KT > 2 h avant la périphérique) ou le ratio quantitatif ≥ 5 oriente vers une BLC. Éviter le retrait aveugle.",
        source: "SF2H · Recommandations 2019"
      },
      {
        theme: "Analyse de cause",
        scenario: "Une bactériémie liée à un cathéter (BLC) vient d'être confirmée dans votre unité.",
        question: "Quelle démarche organisationnelle est recommandée ?",
        options: [
          "Recherche du responsable du geste",
          "Analyse collective non nominative type Badicause",
          "Aucune démarche systématique"
        ],
        correct: 1,
        explanation: "L'analyse Badicause (démarche nationale SPIADI 2026) est une revue collective non nominative dans les 15 jours qui suivent : arbre des causes, identification des points d'amélioration, plan d'action correctif. C'est bienveillant et systémique.",
        source: "SPIADI · Badicause"
      },
      {
        theme: "Traçabilité",
        scenario: "Vous prescrivez une hémoculture dans le dossier d'un patient porteur d'un CVC.",
        question: "Comment libellez-vous la prescription ?",
        options: [
          "« Hémoculture » suffit",
          "« Hémoculture » avec la voie souhaitée (VP ou KT + périph)",
          "On laisse l'IDE choisir la voie"
        ],
        correct: 1,
        explanation: "La prescription doit préciser la voie souhaitée : c'est le prescripteur qui décide d'une stratégie d'hémocultures appariées ou d'une simple périphérique. Cette précision alimente aussi la traçabilité méthodologique de l'EOH.",
        source: "Rapport EOH V2 · Cible ≥ 95 %"
      }
    ]
  },
  nouveau: {
    name: "Nouveaux arrivants — Les fondamentaux",
    questions: [
      {
        theme: "Hygiène des mains",
        scenario: "Vous vous apprêtez à entrer en chambre pour un soin. Vos mains vous paraissent visuellement propres.",
        question: "La friction hydro-alcoolique est :",
        options: [
          "Facultative si les mains sont propres visuellement",
          "Systématique avant tout contact patient",
          "Uniquement si le soin est invasif"
        ],
        correct: 1,
        explanation: "La friction hydro-alcoolique est systématique aux 5 indications OMS, y compris avant contact patient. La propreté visuelle ne dit rien de la contamination microbienne.",
        source: "OMS · 5 indications"
      },
      {
        theme: "Tenue",
        scenario: "Vous êtes en tenue professionnelle sur une unité de soins.",
        question: "Le port d'une alliance et d'une montre est :",
        options: [
          "Autorisé",
          "Interdit sur les avant-bras et mains lors des soins",
          "Toléré si petit modèle"
        ],
        correct: 1,
        explanation: "Bijoux, montres et faux ongles sont proscrits sur les avant-bras et les mains — ils réduisent l'efficacité de la friction hydro-alcoolique et abritent des micro-organismes.",
        source: "SF2H · Précautions standard"
      },
      {
        theme: "Kits et matériel",
        scenario: "Vous participez à une pose de CVC. Le kit stérile préparé est incomplet : il manque une compresse.",
        question: "Que faites-vous ?",
        options: [
          "Vous improvisez avec ce qui est disponible",
          "Vous arrêtez et complétez le kit avant de poursuivre",
          "Vous continuez sans, si le geste est urgent"
        ],
        correct: 1,
        explanation: "Un geste stérile ne se fait pas « en dépannage ». On stoppe, on complète, puis on reprend proprement. Un raccourci sur la stérilité expose le patient à une infection nosocomiale.",
        source: "Bundle SF2H"
      },
      {
        theme: "Signalement",
        scenario: "Vous constatez qu'un CVC est en place depuis 12 jours chez un patient qui n'en a plus d'indication claire.",
        question: "Vous :",
        options: [
          "Ne dites rien, ce n'est pas votre responsabilité",
          "Signalez au médecin en charge + à l'EOH",
          "Retirez seul(e) le dispositif"
        ],
        correct: 1,
        explanation: "Le signalement est une responsabilité partagée. Un dispositif sans indication doit être retiré — vous alertez, la décision revient au médecin. Le retrait autonome sort du cadre.",
        source: "PROPIAS · Culture sécurité"
      },
      {
        theme: "Culture sécurité",
        scenario: "L'EOH vient présenter les résultats d'un audit dans votre service.",
        question: "L'approche est :",
        options: [
          "Nominative et sanctionnante",
          "Collective, bienveillante, non nominative",
          "Facultative, on peut ne pas y assister"
        ],
        correct: 1,
        explanation: "La démarche EOH est collective, bienveillante et non nominative. Elle vise l'amélioration systémique, pas la mise en cause individuelle. Votre présence est un engagement d'équipe.",
        source: "Protocole EOH audit flash"
      },
      {
        theme: "Traçabilité",
        scenario: "Vous venez de prélever une hémoculture. Vous devez tracer la voie de prélèvement.",
        question: "Où l'écrivez-vous ?",
        options: [
          "Sur le bon d'hémoculture uniquement",
          "Dans le dossier de soin uniquement",
          "Bon + dossier, avec concordance des 2 mentions"
        ],
        correct: 2,
        explanation: "La double traçabilité bon + dossier est la règle. C'est cette concordance qui est vérifiée à l'audit et qui permet à l'EOH de classer correctement les bactériémies.",
        source: "Protocole EOH · Audit flash 48 h"
      },
      {
        theme: "Objectifs",
        scenario: "Vous entendez parler d'un objectif institutionnel sur la traçabilité de la voie de prélèvement.",
        question: "Quelle est la cible à 6 mois pour l'établissement ?",
        options: ["70 %", "85 %", "≥ 95 %"],
        correct: 2,
        explanation: "L'objectif est ≥ 95 % de traçabilité de la voie de prélèvement à 6 mois. C'est la condition pour mesurer avec fiabilité la baisse des bactériémies nosocomiales et éclairer les actions ciblées.",
        source: "Plan d'action EOH 2026-2027"
      },
      {
        theme: "Sondage urinaire",
        scenario: "Un patient nouvellement admis vous demande s'il peut être sondé « par confort » car il a du mal à se lever.",
        question: "La règle par défaut est :",
        options: [
          "Sonder par confort si le patient le demande",
          "Ne pas sonder sauf indication médicale écrite",
          "Sonder systématiquement les personnes âgées"
        ],
        correct: 1,
        explanation: "Aucun sondage sans indication écrite. Le confort n'est pas une indication — la sonde urinaire multiplie par 3 à 4 le risque de bactériémie d'origine urinaire.",
        source: "HAS · SF2H"
      },
      {
        theme: "Ressources",
        scenario: "Vous avez un doute sur un protocole d'antisepsie ou de manipulation de ligne.",
        question: "À qui vous adressez-vous en premier ?",
        options: [
          "Au médecin de garde",
          "Au référent EOH de l'unité ou à l'EOH",
          "À une recherche internet"
        ],
        correct: 1,
        explanation: "Le référent EOH de l'unité (1 IDE + 1 médecin par unité prioritaire) est votre premier contact. L'EOH est là pour répondre, pas pour juger. Une question évitée = un risque pris.",
        source: "Gouvernance plan d'action"
      },
      {
        theme: "Définitions",
        scenario: "Vous discutez d'un cas clinique en staff.",
        question: "Une bactériémie est dite nosocomiale si elle survient :",
        options: [
          "Dès l'admission",
          "≥ 48 heures après l'admission",
          "Uniquement en réanimation",
          "À la sortie du patient"
        ],
        correct: 1,
        explanation: "Le seuil de 48 heures après l'admission (ou 72 h pour certains cas) est le critère de définition d'une infection nosocomiale (associée aux soins). Avant, elle est réputée d'importation communautaire.",
        source: "SPILF · 100 recommandations"
      }
    ]
  }
};

// =============== ÉTAT DE JEU ===============
const state = {
  track: null,
  qIndex: 0,
  score: 0,
  streak: 0,
  answers: [],           // { theme, correct, firstTry }
  attempted: false,      // question courante déjà tentée ?
  shuffledOptions: []    // ordres mélangés pour la question courante
};

// =============== UTILITAIRES ===============
function $(id) { return document.getElementById(id); }
function $$(sel) { return document.querySelectorAll(sel); }

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showScreen(id) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =============== HOME ===============
function initHome() {
  $$('.track-card').forEach(card => {
    card.addEventListener('click', () => startGame(card.dataset.track));
  });
  $('btn-rules').addEventListener('click', () => $('dlg-rules').showModal());
  $$('[data-close-dlg]').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('dialog').close());
  });
}

// =============== JEU ===============
function startGame(trackKey) {
  state.track = trackKey;
  state.qIndex = 0;
  state.score = 0;
  state.streak = 0;
  state.answers = [];
  const track = QUESTIONS[trackKey];
  $('q-total').textContent = track.questions.length;
  renderQuestion();
  showScreen('screen-game');
}

function renderQuestion() {
  const track = QUESTIONS[state.track];
  const q = track.questions[state.qIndex];
  state.attempted = false;

  // Header progress
  $('q-current').textContent = state.qIndex + 1;
  const pct = ((state.qIndex) / track.questions.length) * 100;
  $('progress-fill').style.width = pct + '%';
  $('score-val').textContent = state.score;

  // Streak
  const streakEl = $('score-streak');
  if (state.streak >= 3) {
    streakEl.textContent = '🔥 ' + state.streak;
    streakEl.hidden = false;
  } else {
    streakEl.hidden = true;
  }

  // Scenario + question
  $('scenario-text').textContent = q.scenario;
  $('question-text').textContent = q.question;

  // Options — mélange à chaque partie
  const shuffled = shuffle(q.options.map((opt, i) => ({ text: opt, originalIndex: i })));
  state.shuffledOptions = shuffled;

  const container = $('options-container');
  container.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  shuffled.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span><span class="opt-text">${opt.text}</span>`;
    btn.dataset.originalIndex = opt.originalIndex;
    btn.addEventListener('click', () => selectOption(btn, opt.originalIndex));
    container.appendChild(btn);
  });

  // Reset feedback + next
  $('feedback').hidden = true;
  $('btn-next').hidden = true;
}

function selectOption(btn, originalIndex) {
  const track = QUESTIONS[state.track];
  const q = track.questions[state.qIndex];
  const isCorrect = originalIndex === q.correct;
  const isFirstTry = !state.attempted;

  if (isCorrect) {
    // Marquer visuellement
    btn.classList.add('correct');
    // Désactiver toutes les options
    $$('#options-container .option-btn').forEach(b => {
      b.disabled = true;
      if (b !== btn && !b.classList.contains('wrong')) b.classList.add('dim');
    });

    // Points
    const gained = isFirstTry ? 15 : 10;
    state.score += gained;
    state.streak += 1;
    $('score-val').textContent = state.score;

    // Feedback OK
    $('feedback').className = 'feedback ok';
    $('feedback').hidden = false;
    $('feedback-icon').textContent = '✓';
    $('feedback-title').textContent = isFirstTry
      ? `Exact — +${gained} points (bonus 1re tentative)`
      : `Bonne réponse — +${gained} points`;
    $('feedback-text').textContent = q.explanation;
    $('feedback-source').textContent = 'Source : ' + q.source;

    // Enregistrer la réponse
    state.answers.push({ theme: q.theme, correct: true, firstTry: isFirstTry });

    // Afficher bouton suivant
    $('btn-next').hidden = false;
    $('btn-next').focus();
  } else {
    // Mauvaise réponse : marquer, désactiver cette option, permettre un nouvel essai
    btn.classList.add('wrong');
    btn.disabled = true;
    state.attempted = true;
    state.streak = 0;

    // Feedback erreur (temporaire, sans révéler la bonne)
    $('feedback').className = 'feedback err';
    $('feedback').hidden = false;
    $('feedback-icon').textContent = '✕';
    $('feedback-title').textContent = 'Pas exactement — essayez encore';
    $('feedback-text').textContent = 'Réfléchissez à la recommandation la plus récente et à la sécurité du patient.';
    $('feedback-source').textContent = '';

    // Si toutes les options ont été essayées et qu'aucune n'est correcte → révéler la correcte
    const remaining = Array.from($$('#options-container .option-btn')).filter(b => !b.disabled);
    if (remaining.length === 1) {
      // La dernière restante est nécessairement la bonne
      const lastBtn = remaining[0];
      const lastOriginal = parseInt(lastBtn.dataset.originalIndex, 10);
      if (lastOriginal === q.correct) {
        lastBtn.classList.add('correct');
        lastBtn.disabled = true;
        state.score += 5; // Points de consolation pour trouver au dernier essai
        $('score-val').textContent = state.score;
        $('feedback').className = 'feedback ok';
        $('feedback-icon').textContent = '✓';
        $('feedback-title').textContent = 'Voici la bonne réponse — +5 points';
        $('feedback-text').textContent = q.explanation;
        $('feedback-source').textContent = 'Source : ' + q.source;
        state.answers.push({ theme: q.theme, correct: true, firstTry: false });
        $('btn-next').hidden = false;
        $('btn-next').focus();
      }
    }
  }
}

// Bouton suivant
function nextQuestion() {
  const track = QUESTIONS[state.track];
  state.qIndex += 1;
  if (state.qIndex >= track.questions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

// Bouton quitter
function quitGame() {
  if (confirm('Quitter ce parcours ? Votre progression sera perdue.')) {
    showScreen('screen-home');
  }
}

// =============== RÉSULTATS ===============
function showResults() {
  const track = QUESTIONS[state.track];
  const total = track.questions.length;
  const maxScore = total * 15; // 15 = bonne réponse au premier coup
  const pct = Math.round((state.score / maxScore) * 100);

  $('score-final').textContent = state.score;
  $('score-max').textContent = maxScore;
  $('score-pct').textContent = pct + ' % de la performance maximale';

  // Niveau + trophée
  let level, trophy, takeaways;
  if (pct < 50) {
    level = 'En apprentissage — un tour de plus ?';
    trophy = '🌱';
    takeaways = [
      'Reprenez les fondamentaux de l\'hygiène des mains et du bundle cathéter.',
      'Notez la voie de prélèvement systématiquement — bon + dossier.',
      'N\'hésitez pas à solliciter le référent EOH de votre unité.'
    ];
  } else if (pct < 70) {
    level = 'Bon niveau — quelques points à revoir';
    trophy = '🎯';
    takeaways = [
      'Vous maîtrisez la majorité des gestes-clés — quelques nuances à consolider.',
      'La traçabilité complète (bon + dossier) reste le point de vigilance n° 1.',
      'Participez au prochain audit flash 48 h pour vous auto-évaluer.'
    ];
  } else if (pct < 90) {
    level = 'Excellent — vous êtes prêt à former les autres';
    trophy = '🏆';
    takeaways = [
      'Votre niveau vous permet d\'accompagner un(e) collègue en tutorat.',
      'Devenez référent EOH de votre unité si ce n\'est pas déjà le cas.',
      'La cible ≥ 95 % de traçabilité à 6 mois est à votre portée.'
    ];
  } else {
    level = 'Expert — ambassadeur EOH';
    trophy = '⭐';
    takeaways = [
      'Vous êtes un(e) référent(e) naturel(le) pour la prévention des bactériémies.',
      'Contribuez à la formation par simulation et aux Badicause de l\'unité.',
      'Votre exemplarité pèse dans la culture de sécurité du service.'
    ];
  }

  $('result-level').textContent = level;
  $('trophy').textContent = trophy;

  const list = $('takeaway-list');
  list.innerHTML = '';
  takeaways.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t;
    list.appendChild(li);
  });

  // Bilan par thématique
  const themeStats = {};
  state.answers.forEach(a => {
    if (!themeStats[a.theme]) themeStats[a.theme] = { correct: 0, total: 0, firstTry: 0 };
    themeStats[a.theme].total += 1;
    if (a.correct) themeStats[a.theme].correct += 1;
    if (a.firstTry) themeStats[a.theme].firstTry += 1;
  });

  const themeBars = $('theme-bars');
  themeBars.innerHTML = '';
  Object.entries(themeStats).forEach(([theme, stats]) => {
    const pctTheme = Math.round((stats.firstTry / stats.total) * 100);
    const level = pctTheme < 50 ? 'low' : pctTheme < 80 ? 'mid' : 'high';
    const bar = document.createElement('div');
    bar.className = 'theme-bar';
    bar.innerHTML = `
      <div class="theme-bar-head">
        <span class="theme-name">${theme}</span>
        <span class="theme-pct">${stats.firstTry}/${stats.total} · ${pctTheme} %</span>
      </div>
      <div class="theme-track"><div class="theme-fill ${level}" style="width: 0%"></div></div>
    `;
    themeBars.appendChild(bar);
    // Animation
    setTimeout(() => {
      bar.querySelector('.theme-fill').style.width = pctTheme + '%';
    }, 200);
  });

  showScreen('screen-results');
}

// =============== ATTESTATION ===============
function openAttestation() {
  const track = QUESTIONS[state.track];
  const maxScore = track.questions.length * 15;
  const pct = Math.round((state.score / maxScore) * 100);

  $('att-track').textContent = track.name;
  $('att-score').textContent = `${state.score} / ${maxScore} · ${pct} %`;

  let levelShort;
  if (pct < 50) levelShort = 'En apprentissage';
  else if (pct < 70) levelShort = 'Bon niveau';
  else if (pct < 90) levelShort = 'Excellent';
  else levelShort = 'Expert EOH';
  $('att-level').textContent = levelShort;

  const now = new Date();
  const d = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  $('att-date').textContent = d;

  $('att-name').value = '';
  $('att-doc-name').textContent = '—';

  $('dlg-attestation').showModal();
}

function printAttestation() {
  const name = $('att-name').value.trim();
  $('att-doc-name').textContent = name || 'Le / la participant(e)';
  // Petit délai pour rendre le DOM avant impression
  setTimeout(() => window.print(), 100);
}

// =============== NAVIGATION ===============
function initEvents() {
  $('btn-next').addEventListener('click', nextQuestion);
  $('btn-quit').addEventListener('click', quitGame);
  $('btn-replay').addEventListener('click', () => startGame(state.track));
  $('btn-home').addEventListener('click', () => showScreen('screen-home'));
  $('btn-attestation').addEventListener('click', openAttestation);
  $('btn-print-attestation').addEventListener('click', printAttestation);
}

// =============== BOOT ===============
document.addEventListener('DOMContentLoaded', () => {
  initHome();
  initEvents();
});
