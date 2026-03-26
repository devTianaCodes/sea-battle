export default function IconButton({
  children,
  onClick,
  tone = "default",
  disabled = false,
  type = "button",
}) {
  const tones = {
    default:
      "border-white/15 bg-white/8 text-foam hover:border-cyan/60 hover:bg-cyan/12",
    accent:
      "border-cyan/30 bg-cyan/15 text-foam hover:border-cyan/70 hover:bg-cyan/20",
    warm:
      "border-coral/30 bg-coral/12 text-foam hover:border-coral/70 hover:bg-coral/18",
    success:
      "border-mint/30 bg-mint/12 text-foam hover:border-mint/70 hover:bg-mint/18",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border px-4 py-2 text-sm font-medium tracking-wide transition duration-200 ${
        tones[tone]
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      {children}
    </button>
  );
}
