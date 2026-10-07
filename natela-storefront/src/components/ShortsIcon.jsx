/* Placeholder artwork shown wherever a product photo is missing.
   Once the client supplies photography, set `image` on the product
   and ProductCard will render an <img> instead of this. */

export default function ShortsIcon({ size = 84, color = "#D2D2CC", stroke = 1.6 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M32 26h56l5 44c.5 4-2.6 7.5-6.6 7.5H68l-4-26h-8l-4 26H33.6c-4 0-7.1-3.5-6.6-7.5l5-44z" />
      <line x1="60" y1="26" x2="60" y2="70" />
    </svg>
  );
}
