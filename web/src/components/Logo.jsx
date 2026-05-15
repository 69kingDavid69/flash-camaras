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
      <rect width="64" height="64" rx="14" fill={bg} />
      <rect x="18" y="14" width="14" height="6" rx="1.5" fill="#C8102E" />
      <circle cx="32" cy="36" r="15" fill="none" stroke="#C8102E" strokeWidth="3" />
      <circle cx="32" cy="36" r="10" fill="none" stroke="#C8102E" strokeWidth="1.5" opacity="0.45" />
      <circle cx="32" cy="36" r="5.5" fill="#C8102E" />
    </svg>
  );
}
