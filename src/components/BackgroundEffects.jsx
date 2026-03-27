import clsx from "clsx";

function Bubble({ delay, left, size, duration }) {
  return (
    <span
      className="bubble-particle absolute bottom-[-2rem] rounded-full bg-cyan/10 blur-[1px]"
      style={{
        left,
        width: size,
        height: size,
        animationDelay: delay,
        animationDuration: duration,
      }}
    />
  );
}

export default function BackgroundEffects({ energetic = false }) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="ocean-background" />
      <div className="absolute inset-0">
        {[
          ["8%", "0s", "0.6rem", "14s"],
          ["18%", "2s", "0.9rem", "18s"],
          ["32%", "6s", "0.5rem", "13s"],
          ["47%", "1s", "0.8rem", "16s"],
          ["61%", "7s", "0.65rem", "15s"],
          ["74%", "4s", "1rem", "20s"],
          ["86%", "9s", "0.55rem", "12s"],
        ].map(([left, delay, size, duration], index) => (
          <Bubble key={index} left={left} delay={delay} size={size} duration={duration} />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-32 overflow-hidden sm:h-40">
        <div className={clsx("wave-layer wave-back", energetic && "wave-energetic")} />
        <div className={clsx("wave-layer wave-mid", energetic && "wave-energetic")} />
        <div className={clsx("wave-layer wave-front", energetic && "wave-energetic")} />
      </div>
    </div>
  );
}
