"use client";
import FlashChangeCardActivity from "@/components/appariement/FlashChangeCardDomainActivity";

export default function TestPage() {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="180"
        height="180"
        viewBox="0 0 720 220"
        role="img"
        aria-label="CVTheque logo ribbon"
      >
        <defs>
          <linearGradient id="g4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#111827" />
            <stop offset="0.5" stop-color="#64748B" />
            <stop offset="1" stop-color="#38BDF8" />
          </linearGradient>
        </defs>

        <g transform="translate(52,44)">
          <path
            d="M38 108
             C38 60, 78 28, 118 36
             C156 44, 170 86, 144 108
             C120 128, 82 120, 86 92
             C90 64, 128 64, 132 84"
            fill="none"
            stroke="url(#g4)"
            stroke-width="12"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <path
            d="M132 84
             C148 92, 162 92, 174 82
             C168 102, 152 118, 132 122"
            fill="none"
            stroke="#111827"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.9"
          />
        </g>

        <g transform="translate(360, 110)">
          <text
            x="0"
            y="0"
            text-anchor="middle"
            dominant-baseline="middle"
            font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial"
            font-size="56"
            font-weight="800"
            fill="#111827"
          >
            CV
            <tspan font-weight="600" fill="#374151">
              Theque
            </tspan>
          </text>
        </g>
      </svg>
    </div>
  );
}
