function CoachHint({ label, detail }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-4">
      <div className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">{label}</div>
      <div className="mt-2 text-sm leading-6 text-slate-200">{detail}</div>
    </div>
  );
}

export default function PhaseCoach({
  phase,
  selectedShipName,
  playerFleetCount,
  playerShipsAfloat,
  enemyShipsAfloat,
  playerShots,
  soundEnabled,
}) {
  const phaseCopy =
    phase === "setup"
      ? {
          eyebrow: "Deployment",
          title: "Set the opening shape of the battle",
          body: selectedShipName
            ? `Position the ${selectedShipName}, rotate with R, or recall any placed ship to rebalance your formation.`
            : "Your fleet is placed. Confirm when you like the shape, or click a placed ship to reposition it.",
          hints: [
            {
              label: "Fleet Progress",
              detail: `${playerFleetCount}/5 ships placed before launch.`,
            },
            {
              label: "Controls",
              detail: "Arrow keys move focus, Enter places, R rotates, and the sound toggle stays persistent.",
            },
            {
              label: "Tactical Advice",
              detail: "Avoid long obvious lines. Spread ship lengths to make follow-up shots less efficient.",
            },
          ],
        }
      : phase === "battle"
        ? {
            eyebrow: "Battle",
            title: "Work the board, not just the nearest target",
            body: "Use misses to eliminate lanes, then collapse around confirmed hits. The last shot stays highlighted so the tempo remains readable.",
            hints: [
              {
                label: "Fleet Status",
                detail: `${playerShipsAfloat} of your ships remain afloat. ${enemyShipsAfloat} enemy ships remain.`,
              },
              {
                label: "Shot Discipline",
                detail: `${playerShots} shots fired so far. Keep spacing clean until a hit breaks the pattern.`,
              },
              {
                label: "Audio",
                detail: soundEnabled
                  ? "Sound cues are on for hits, misses, and sinks."
                  : "Sound cues are muted. You can re-enable them from the top bar.",
              },
            ],
          }
        : {
            eyebrow: "After Action",
            title: "Reset quickly and iterate on placement",
            body: "Use the archive and intel panels to judge whether the result came from aim, placement, or pace.",
            hints: [
              {
                label: "Review",
                detail: "Check the recent action feed and history panel to spot repeated weaknesses.",
              },
              {
                label: "Difficulty",
                detail: "Change difficulty from the top bar before starting the next deployment.",
              },
              {
                label: "Next Run",
                detail: "A tighter opening layout can matter as much as better shot sequencing.",
              },
            ],
          };

  return (
    <section className="glass-panel rounded-[2rem] p-5 sm:p-6">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">{phaseCopy.eyebrow}</p>
        <h2 className="mt-2 font-display text-2xl text-foam sm:text-3xl">
          {phaseCopy.title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-[0.95rem]">
          {phaseCopy.body}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {phaseCopy.hints.map((hint) => (
          <CoachHint key={hint.label} label={hint.label} detail={hint.detail} />
        ))}
      </div>
    </section>
  );
}
