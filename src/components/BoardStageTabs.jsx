const VIEWS = [
  { id: "player", label: "Your Board" },
  { id: "enemy", label: "Enemy Board" },
  { id: "intel", label: "Intel" },
];

export default function BoardStageTabs({ activeView, onChange }) {
  return (
    <div className="glass-panel rounded-[1.6rem] p-2 xl:hidden">
      <div className="grid grid-cols-3 gap-2">
        {VIEWS.map((view) => {
          const active = activeView === view.id;

          return (
            <button
              key={view.id}
              type="button"
              onClick={() => onChange(view.id)}
              className={`rounded-2xl px-3 py-3 text-sm transition ${
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
