/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand greens
        primary: {
          DEFAULT: "#1A6B3C",
          50: "#EEF7F1",
          100: "#D7ECDF",
          200: "#A9D4B9",
          300: "#75B891",
          400: "#3F9264",
          500: "#1A6B3C",
          600: "#155931",
          700: "#114727",
          800: "#0C351D",
          900: "#082414",
        },
        // Accent gold
        accent: {
          DEFAULT: "#D4A017",
          50: "#FBF4DD",
          100: "#F6E6B0",
          200: "#EFD173",
          300: "#E4B83C",
          400: "#D4A017",
          500: "#B5870E",
          600: "#8E6A0B",
        },
        // Charcoal
        charcoal: {
          DEFAULT: "#1C1C2E",
          50: "#F4F4F7",
          100: "#E2E2E9",
          200: "#BFBFCD",
          300: "#8B8BA3",
          400: "#535369",
          500: "#1C1C2E",
          600: "#161624",
          700: "#10101A",
          800: "#0A0A11",
          900: "#040408",
        },
        // Neutrals (warm)
        cream: "#FBF9F4",
        mint: "#E6F4EC",
        sage: "#C8DDD0",
        offwhite: "#F8FAF9",
        textgray: "#5A6473",
        bordergray: "#E5E8EC",
        // Semantic
        success: { DEFAULT: "#27AE60", 50: "#E8F8EE" },
        error: { DEFAULT: "#E74C3C", 50: "#FCEAE7" },
        warning: { DEFAULT: "#F39C12", 50: "#FEF3E0" },
        info: { DEFAULT: "#3B82F6", 50: "#EAF2FF" },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Lato", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "0.95", letterSpacing: "-0.04em", fontWeight: "800" }],
        "display": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.035em", fontWeight: "800" }],
        "h1": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "h2": ["clamp(1.5rem, 2.5vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "700" }],
        "h3": ["1.5rem", { lineHeight: "1.25", fontWeight: "700" }],
        "h4": ["1.25rem", { lineHeight: "1.3", fontWeight: "700" }],
        "eyebrow": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.14em", fontWeight: "700" }],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(28,28,46,0.04), 0 4px 12px rgba(28,28,46,0.04)",
        card: "0 1px 3px rgba(28,28,46,0.05), 0 8px 24px rgba(28,28,46,0.06)",
        lift: "0 4px 8px rgba(28,28,46,0.06), 0 16px 40px rgba(28,28,46,0.10)",
        glow: "0 8px 32px rgba(26,107,60,0.22)",
        gold: "0 8px 32px rgba(212,160,23,0.30)",
        ring: "0 0 0 4px rgba(26,107,60,0.12)",
        inset: "inset 0 1px 2px rgba(28,28,46,0.08)",
      },
      backgroundImage: {
        "grad-primary": "linear-gradient(135deg, #1A6B3C 0%, #114727 100%)",
        "grad-primary-deep": "linear-gradient(135deg, #082414 0%, #1A6B3C 60%, #082414 100%)",
        "grad-gold": "linear-gradient(135deg, #E4B83C 0%, #B5870E 100%)",
        "grad-dark": "linear-gradient(135deg, #1C1C2E 0%, #10101A 100%)",
        "grad-mint": "linear-gradient(180deg, #E6F4EC 0%, #FBF9F4 100%)",
        "grad-hero": "radial-gradient(ellipse at top left, rgba(26,107,60,0.12), transparent 55%), radial-gradient(ellipse at top right, rgba(212,160,23,0.10), transparent 55%)",
        "grad-hero-dark": "radial-gradient(ellipse at top left, rgba(63,146,100,0.30), transparent 50%), radial-gradient(ellipse at bottom right, rgba(212,160,23,0.18), transparent 55%)",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        pulseRing: "pulseRing 2s cubic-bezier(0.215,0.61,0.355,1) infinite",
        slideUp: "slideUp 0.5s ease-out both",
      },
      maxWidth: {
        "8xl": "88rem",
      },
    },
  },
  plugins: [],
};
