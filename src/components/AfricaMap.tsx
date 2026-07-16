export function AfricaMap({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 104" className={className} aria-hidden="true">
      {/* Continent silhouette */}
      <path
        d="M30 8 C36 6 44 8 50 6 C54 3 58 3 60 7 C64 8 68 10 70 14 C73 20 74 26 76 32 C82 34 88 40 90 45 C86 50 80 52 76 56 C74 62 70 68 66 76 C62 84 56 90 50 92 C44 90 40 84 38 76 C36 68 32 62 30 56 C26 54 22 52 22 48 C20 44 16 42 16 38 C18 32 22 26 24 20 C26 14 27 10 30 8 Z"
        fill="rgba(201,162,75,0.08)"
        stroke="#c9a24b"
        strokeOpacity="0.55"
        strokeWidth="0.9"
      />
      {/* Madagascar */}
      <path
        d="M79 74 C81 76 82 80 80 84 C78 82 77 78 79 74 Z"
        fill="rgba(201,162,75,0.08)"
        stroke="#c9a24b"
        strokeOpacity="0.55"
        strokeWidth="0.9"
      />
      {/* Benin marker */}
      <circle cx="33" cy="47" r="2.4" fill="#c9a24b" />
      <circle cx="33" cy="47" r="5" fill="none" stroke="#c9a24b" strokeOpacity="0.5" strokeWidth="0.7">
        <animate attributeName="r" values="3;8;3" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
