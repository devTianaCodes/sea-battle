import clsx from "clsx";

function Bubble({ delay, left, size, duration, opacity, blur, drift }) {
  return (
    <span
      className="bubble-particle absolute bottom-[-3rem] rounded-full"
      style={{
        left,
        width: size,
        height: size,
        animationDelay: delay,
        animationDuration: duration,
        opacity,
        filter: `blur(${blur})`,
        "--bubble-drift": drift,
      }}
    />
  );
}

export default function BackgroundEffects({ energetic = false }) {
  const bubbles = [
    ["6%", "0s", "0.75rem", "17s", 0.65, "0.5px", "0.9rem"],
    ["12%", "3s", "1.25rem", "21s", 0.48, "1px", "-1.2rem"],
    ["19%", "1.5s", "0.55rem", "13s", 0.75, "0px", "0.6rem"],
    ["28%", "7s", "1.6rem", "24s", 0.35, "1.4px", "-1.6rem"],
    ["36%", "2.5s", "0.8rem", "16s", 0.58, "0.7px", "0.8rem"],
    ["45%", "5.5s", "2rem", "26s", 0.3, "1.8px", "-2rem"],
    ["53%", "0.5s", "0.65rem", "14s", 0.72, "0.4px", "0.5rem"],
    ["61%", "8s", "1.3rem", "20s", 0.45, "1px", "-1rem"],
    ["70%", "4s", "0.9rem", "18s", 0.62, "0.8px", "1.1rem"],
    ["79%", "9s", "1.8rem", "25s", 0.32, "1.6px", "-1.5rem"],
    ["87%", "6.5s", "0.7rem", "15s", 0.7, "0.5px", "0.7rem"],
    ["93%", "10s", "1.1rem", "19s", 0.5, "1px", "-0.8rem"],
  ];

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="ocean-background" />
      <div className="underwater-haze" />
      <div className="underwater-caustics" />
      <div className="absolute inset-0">
        {bubbles.map(([left, delay, size, duration, opacity, blur, drift], index) => (
          <Bubble
            key={index}
            left={left}
            delay={delay}
            size={size}
            duration={duration}
            opacity={opacity}
            blur={blur}
            drift={drift}
          />
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
