/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kaiDark: "#1a2035",      // Premium Sidebar background
        kaiBg: "#f9fbfd",        // Premium canvas background
        kaiPrimary: "#1572e8",   // Kaiadmin Blue accent
        kaiSuccess: "#31ce36",   // Alert/Metric green
        kaiWarning: "#ff9726",   // Metric orange
        kaiCard: "#ffffff",      // Pure white panels
        kaiBorder: "#f1f3f5"     // Soft separation borders
      },
      fontFamily: {
        sans: ['Public Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        kai: "0 2px 14px 0 rgba(114, 134, 153, 0.08)",
        kaiHover: "0 10px 25px -5px rgba(21, 114, 232, 0.15)"
      }
    },
  },
  plugins: [],
}