import IconButton from "./IconButton";
import useBodyScrollLock from "../hooks/useBodyScrollLock";

function TipCard({ title, body }) {
  return (
    <div className="rounded-[1rem] border border-white/10 bg-white/[0.05] px-3 py-3 sm:rounded-3xl sm:px-4 sm:py-4">
      <div className="text-[0.85rem] font-medium text-foam sm:text-sm">{title}</div>
      <div className="mt-1.5 text-[0.8rem] leading-5 text-slate-300 sm:mt-2 sm:text-sm sm:leading-6">{body}</div>
    </div>
  );
}

export default function OnboardingModal({ open, onClose }) {
  useBodyScrollLock(open);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-[15px] z-[60] flex items-center justify-center rounded-[20px] bg-[#020817]/80 p-2 backdrop-blur-md animate-fade-in sm:p-3">
      <div className="glass-frosted animate-modal-in flex max-h-full w-full max-w-3xl flex-col overflow-y-auto rounded-[1.35rem] p-3 sm:rounded-[2rem] sm:p-8">
        <p className="text-[0.62rem] uppercase tracking-[0.18em] text-cyan/70 sm:text-xs sm:tracking-[0.28em]">Welcome Aboard</p>
        <h2 className="mt-2 font-display text-[1.45rem] text-foam sm:mt-3 sm:text-4xl">
          Command the fleet in three phases
        </h2>
        <p className="mt-2 max-w-2xl text-[0.82rem] leading-6 text-slate-300 sm:mt-3 sm:text-sm sm:leading-7">
          Sea Battle plays fast once the loop clicks: deploy a hard-to-read fleet, probe for
          structure, then collapse on confirmed hits. The boards, intel feed, and top controls
          cover the full loop.
        </p>

        <div className="mt-4 grid gap-2 sm:mt-6 sm:gap-3 lg:grid-cols-3">
          <TipCard
            title="Deploy smart"
            body="Select ships from the sidebar, rotate with R, and recall placed ships whenever you want to reshape the opening layout."
          />
          <TipCard
            title="Read the board"
            body="Misses remove lanes. Hits narrow the pattern. The most recent shot stays highlighted so each turn remains easy to parse."
          />
          <TipCard
            title="Use the intel"
            body="The battle snapshot tracks accuracy, ship damage, and the live action feed so you can adapt during the round."
          />
        </div>

        <div className="mt-4 grid gap-2 sm:mt-6 sm:grid-cols-2 sm:gap-3">
          <TipCard
            title="Keyboard"
            body="Arrow keys move board focus, Enter places ships or fires, and R toggles orientation during setup."
          />
          <TipCard
            title="Mobile"
            body="The layout keeps the active boards readable first and lets the rest of the interface breathe instead of crowding the play area."
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3 sm:mt-8">
          <IconButton onClick={onClose} tone="success" className="px-3 py-2 text-[0.72rem] tracking-[0.08em] sm:text-sm">
            Start Battle
          </IconButton>
        </div>
      </div>
    </div>
  );
}
