// src/components/LogoBK.jsx
export default function LogoBK({ size = 28, title = "BK" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="logo-bk"
    >
      <defs>
        <linearGradient id="bkRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#6366f1" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>

      {/* Badge with gradient ring that adapts to theme colors */}
      <circle cx="32" cy="32" r="30" fill="var(--card)" stroke="url(#bkRing)" strokeWidth="2" />

      {/* Very subtle “code” background */}
      <g
        opacity=".12"
        fill="currentColor"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontWeight="700"
        fontSize="16"
        textAnchor="middle"
      >
        <text x="20" y="24">&lt;</text>
        <text x="46" y="46">/&gt;</text>
      </g>

      {/* BK letters – inherit currentColor so they match var(--text) */}
      <g
        fill="currentColor"
        fontFamily="Inter, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
        fontWeight="800"
        fontSize="24"
      >
        <text x="22" y="40">b</text>
        <text x="36" y="40">k</text>
      </g>
    </svg>
  );
}
