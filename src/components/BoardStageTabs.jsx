const DEFAULT_VIEWS = [
  { id: "player", label: "Your Board" },
  { id: "enemy", label: "Target Board" },
];

export default function BoardStageTabs({ activeView, onChange, views = DEFAULT_VIEWS }) {
  return (
    <div className="mobile-board-switcher glass-light rounded-full p-1">
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${views.length}, minmax(0, 1fr))` }}
      >
        {views.map((view) => {
          const active = activeView === view.id;

          return (
            <button
              key={view.id}
              type="button"
              onClick={() => onChange(view.id)}
              className={`rounded-full px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] transition sm:text-xs ${
                active
                  ? "bg-cyan/16 text-foam shadow-[0_0_0_1px_rgba(0,212,255,0.35)]"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-foam"
              }`}
              aria-pressed={active}
            >
              {view.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
