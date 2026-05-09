const FLEET_ROWS = [
  { count: 1, size: 4 },
  { count: 2, size: 3 },
  { count: 3, size: 2 },
  { count: 4, size: 1 },
];

function MiniShip({ size }) {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {Array.from({ length: size }, (_, index) => (
        <span
          key={index}
          className="h-4 w-4 rounded-[0.28rem] border border-cyan/55 bg-cyan/20 shadow-[0_0_10px_rgba(0,212,255,0.2)] sm:h-5 sm:w-5"
        />
      ))}
    </div>
  );
}

function FleetRow({ count, size }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[0.85rem] border border-cyan/20 bg-white/[0.045] px-3 py-2.5 shadow-[0_0_14px_rgba(0,212,255,0.06)]">
      <div className="flex items-center gap-3 text-[0.82rem] font-semibold text-foam sm:text-sm">
        <span>{count} *</span>
        <MiniShip size={size} />
      </div>
      <span className="text-[0.68rem] uppercase tracking-[0.12em] text-cyan-100/70 sm:text-[0.72rem]">
        {size} {size === 1 ? "cell" : "cells"}
      </span>
    </div>
  );
}

export default function FleetCompositionCard({ descriptionId }) {
  return (
    <section
      aria-labelledby={descriptionId}
      className="rounded-[1rem] border border-cyan/25 bg-white/[0.045] p-3 shadow-[0_0_18px_rgba(0,212,255,0.08)] sm:rounded-[1.25rem] sm:p-4"
    >
      <h3 id={descriptionId} className="font-display text-[1.15rem] leading-tight text-foam sm:text-xl">
        Build 10 ships
      </h3>
      <p className="mt-2 text-[0.8rem] leading-5 text-slate-300 sm:text-[0.88rem] sm:leading-6">
        Keep one empty square around every ship.
      </p>

      <div className="mt-4 grid gap-2">
        {FLEET_ROWS.map((row) => (
          <FleetRow key={row.size} count={row.count} size={row.size} />
        ))}
      </div>
    </section>
  );
}
