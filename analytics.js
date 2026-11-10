/* Bactério Challenge · mesure Plausible agrégée.
   Schéma fermé : aucun nom, aucun texte libre, aucun score exact, aucun identifiant.
   Ce fichier doit précéder l'initialisation de Plausible. */
(() => {
  const TRACKS = { ide: "IDE", medecin: "Médecin", nouveau: "Nouveaux arrivants" };
  const LEVELS = ["En apprentissage", "Bon niveau", "Excellent", "Expert"];
  const T = "(IDE|Médecin|Nouveaux arrivants)";
  const base = new RegExp(`^(pageview|engagement|BC Jeu démarré|BC Attestation imprimée|BC ${T} (démarré|terminé|abandonné))$`);
  const teaching = new RegExp(`^BC ${T} (niveau (En apprentissage|Bon niveau|Excellent|Expert)|Q(0[1-9]|1[0-2]) à revoir)$`);
  let enabled = true;
  let started = false;

  function send(name) {
    try { if (typeof window.plausible === "function") window.plausible(name); } catch { /* Ne jamais bloquer le jeu. */ }
  }

  window.bcAnalytics = {
    base, teaching, TRACKS, LEVELS,
    isTeachingEnabled: () => enabled,
    setTeachingEnabled(value) { enabled = Boolean(value); },
    transformRequest(payload) {
      if (!base.test(payload.n) && !(enabled && teaching.test(payload.n))) return null;
      payload.u = location.origin + location.pathname;
      payload.r = null;
      delete payload.p;
      delete payload.$;
      return payload;
    },
    trackStart(track) {
      if (!TRACKS[track]) return;
      if (!started) { started = true; send("BC Jeu démarré"); }
      send(`BC ${TRACKS[track]} démarré`);
    },
    trackEnd(track) { if (TRACKS[track]) send(`BC ${TRACKS[track]} terminé`); },
    trackQuit(track) { if (TRACKS[track]) send(`BC ${TRACKS[track]} abandonné`); },
    trackAttestation() { send("BC Attestation imprimée"); },
    trackLevel(track, level) {
      const name = `BC ${TRACKS[track]} niveau ${level}`;
      if (enabled && teaching.test(name)) send(name);
    },
    trackMiss(track, qIndex) {
      const name = `BC ${TRACKS[track]} Q${String(qIndex + 1).padStart(2, "0")} à revoir`;
      if (enabled && teaching.test(name)) send(name);
    }
  };
})();
