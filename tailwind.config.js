/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A6B3C", // Primary Green
        },
        accent: {
          DEFAULT: "#D4A017", // Accent Gold
        },
        charcoal: {
          DEFAULT: "#1C1C2E", // Dark Charcoal
        },
        mint: {
          DEFAULT: "#E6F4EC", // Light Mint
        },
        offwhite: {
          DEFAULT: "#F8FAF9", // Off White
        },
        success: {
          DEFAULT: "#27AE60", // Success Green
        },
        error: {
          DEFAULT: "#E74C3C", // Error Red
        },
        warning: {
          DEFAULT: "#F39C12", // Warning Amber
        },
        textgray: {
          DEFAULT: "#5A6473", // Text Gray
        },
        bordergray: {
          DEFAULT: "#DDE3E9", // Border Gray
        }
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', "sans-serif"],
        sans: ["Lato", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['28px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'body': ['16px', { lineHeight: '1.5' }],
        'small': ['14px', { lineHeight: '1.5' }],
        'ui': ['12px', { lineHeight: '1.4', fontWeight: '600' }],
      },
      boxShadow: {
        soft: "0 2px 8px rgba(28,28,46,0.06)",
        card: "0 4px 20px rgba(28,28,46,0.08)",
        glow: "0 8px 32px rgba(26,107,60,0.18)",
        gold: "0 8px 32px rgba(212,160,23,0.25)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #1A6B3C 0%, #124D2B 100%)",
        "gradient-gold": "linear-gradient(135deg, #D4A017 0%, #A67D12 100%)",
        "gradient-dark": "linear-gradient(135deg, #1C1C2E 0%, #12121F 100%)",
      },
    },
  },
  plugins: [],
};
