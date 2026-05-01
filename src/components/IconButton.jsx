import { forwardRef } from "react";

const IconButton = forwardRef(function IconButton({
  children,
  onClick,
  tone = "default",
  disabled = false,
  type = "button",
  ariaLabel,
  title,
  className = "",
  shape = "pill",
  size = "md",
}, ref) {
  const tones = {
    default:
      "border-white/12 bg-white/[0.03] text-foam hover:border-cyan/45 hover:bg-cyan/[0.08]",
    accent:
      "border-cyan/28 bg-cyan/[0.08] text-cyan-50 hover:border-cyan/70 hover:bg-cyan/[0.14]",
    warm:
      "border-coral/28 bg-coral/[0.08] text-foam hover:border-coral/70 hover:bg-coral/[0.14]",
    success:
      "border-mint/28 bg-mint/[0.08] text-foam hover:border-mint/70 hover:bg-mint/[0.14]",
  };
  const sizeClasses = {
    sm: shape === "circle" ? "h-8 w-8 text-[0.68rem]" : "px-3 py-1.5 text-xs",
    md: shape === "circle" ? "h-9 w-9 text-xs" : "px-4 py-2 text-sm",
    lg: shape === "circle" ? "h-10 w-10 text-sm" : "px-5 py-3 text-sm",
  };
  const shapeClasses =
    shape === "circle"
      ? "glass-button inline-flex items-center justify-center rounded-full"
      : "glass-button inline-flex items-center justify-center rounded-full";

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      className={`${shapeClasses} ${sizeClasses[size]} border font-medium tracking-[0.14em] transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#061f19] ${
        tones[tone]
      } ${disabled ? "cursor-not-allowed opacity-40" : "hover:scale-[1.03]"} ${className}`}
    >
      {children}
    </button>
  );
});

export default IconButton;
