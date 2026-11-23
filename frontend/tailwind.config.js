/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#09090B",
        charcoal: "#131316",
        amber: { DEFAULT: "#F5A623", dark: "#D4891C" },
        muted: "#6B7280",
        border: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'glow-amber': 'radial-gradient(ellipse at center, rgba(245,166,35,0.15) 0%, transparent 70%)',
        'glow-purple': 'radial-gradient(ellipse at center, rgba(139,92,246,0.2) 0%, rgba(245,166,35,0.1) 50%, transparent 70%)',
      },
    },
  },
  plugins: [],
}
