module.exports = {
  content: ["./src/**/*.{html,njk}"],
  safelist: [
    {
      pattern: /^fa-.*/, // Keep all Font Awesome classes
    },
  ],
  darkMode: "class", // Enables class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Add other plugins if needed
  ],
};