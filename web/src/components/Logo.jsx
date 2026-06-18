export default function Logo({ size = 44, variant = "dark", className = "" }) {
  const bg = variant === "light" ? "#FAFAF7" : "#0A0A0A";
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="logoGold" x1="12" x2="52" y1="12" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6D3F08" />
          <stop offset="0.2" stopColor="#B97816" />
          <stop offset="0.38" stopColor="#FFF0A8" />
          <stop offset="0.54" stopColor="#D59B21" />
          <stop offset="0.72" stopColor="#8A4C0A" />
          <stop offset="1" stopColor="#F3CF63" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill={bg} />
      <rect x="18" y="14" width="14" height="6" rx="1.5" fill="url(#logoGold)" />
      <circle cx="32" cy="36" r="15" fill="none" stroke="url(#logoGold)" strokeWidth="3" />
      <circle cx="32" cy="36" r="10" fill="none" stroke="url(#logoGold)" strokeWidth="1.5" opacity="0.55" />
      <circle cx="32" cy="36" r="5.5" fill="url(#logoGold)" />
    </svg>
  );
}
