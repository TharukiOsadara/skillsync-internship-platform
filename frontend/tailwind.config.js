/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // navy colors used as bg/border
    "bg-navy-950","bg-navy-900","bg-navy-800","bg-navy-700",
    "border-navy-800","border-navy-700","border-navy-950",
    "hover:bg-navy-800",
    // cyan
    "text-cyan-400","border-cyan-400","bg-cyan-400",
    // slate
    "text-slate-200","text-slate-400",
    // red/green/purple for badges
    "text-red-400","text-green-400","text-purple-400",
    "bg-red-400","bg-green-400",
    // font
    "font-syne",
    // custom utilities
    "card","btn-cyan","btn-outline","input-field","skill-tag",
    "badge-active","badge-expired","nav-item","bg-grid","text-gradient",
    "shadow-cyan",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0B1220",
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
        },
        cyan: {
          400: "#22D3EE",
          500: "#06B6D4",
        },
        slate: {
          400: "#94A3B8",
          200: "#F8FAFC",
        },
      },
      fontFamily: {
        // Changed from Syne to DM Sans — professional, clean, modern
        syne: ["DM Sans", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(34,211,238,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.04) 1px,transparent 1px)",
        "cyan-gradient": "linear-gradient(135deg, #22D3EE, #06B6D4)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      boxShadow: {
        cyan: "0 0 60px rgba(34,211,238,0.08)",
        "cyan-sm": "0 0 30px rgba(34,211,238,0.06)",
      },
    },
  },
  plugins: [],
};