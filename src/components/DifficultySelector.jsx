import { DIFFICULTY_LEVELS } from "../data/constants";

export default function DifficultySelector({
  difficulty,
  onChange,
  disabled = false,
}) {
  return (
    <div className="glass-panel flex flex-wrap gap-2 rounded-3xl p-2">
      {DIFFICULTY_LEVELS.map((level) => {
        const active = level.id === difficulty;

        return (
          <button
            key={level.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(level.id)}
            className={`min-w-[6.25rem] rounded-full px-4 py-2 text-sm transition duration-200 ${
              active
                ? "bg-cyan/20 text-foam shadow-[0_0_0_1px_rgba(0,212,255,0.45)]"
                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-foam"
            } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            aria-pressed={active}
          >
            <span className="block font-medium">{level.name}</span>
            <span className="text-[0.65rem] text-slate-400">{level.description}</span>
          </button>
        );
      })}
    </div>
  );
}
