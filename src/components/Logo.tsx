export function Logo({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Estora">
      <rect width="64" height="64" rx="16" fill="#3A5A4A" />
      <path d="M17 46 V20a9 9 0 0 1 9-9h14a9 9 0 0 1 9 9v26" fill="none" stroke="#C5A059" strokeWidth="4" strokeLinecap="round" />
      <path d="M23 46 V24a2.5 2.5 0 0 1 2.5-2.5h7A2.5 2.5 0 0 1 35 24v22" fill="none" stroke="#FDFBF7" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}