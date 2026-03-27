import IconButton from "./IconButton";
import useBodyScrollLock from "../hooks/useBodyScrollLock";

function TipCard({ title, body }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] px-4 py-4">
      <div className="text-sm font-medium text-foam">{title}</div>
      <div className="mt-2 text-sm leading-6 text-slate-300">{body}</div>
    </div>
  );
}

export default function OnboardingModal({ open, onClose }) {
  useBodyScrollLock(open);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#020817]/80 px-4 backdrop-blur-md animate-fade-in">
      <div className="glass-frosted animate-modal-in w-full max-w-3xl rounded-[2rem] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">Welcome Aboard</p>
        <h2 className="mt-3 font-display text-3xl text-foam sm:text-4xl">
          Command the fleet in three phases
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          Sea Battle plays fast once the loop clicks: deploy a hard-to-read fleet, probe for
          structure, then collapse on confirmed hits. The boards, intel feed, and top controls
          cover the full loop.
        </p>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
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

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <TipCard
            title="Keyboard"
            body="Arrow keys move board focus, Enter places ships or fires, and R toggles orientation during setup."
          />
          <TipCard
            title="Mobile"
            body="Use the board tabs to switch between your board, the enemy board, and the intel panel without the layout becoming cramped."
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <IconButton onClick={onClose} tone="success">
            Start Battle
          </IconButton>
        </div>
      </div>
    </div>
  );
}
