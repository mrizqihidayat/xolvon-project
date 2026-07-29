export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sidebar: {
          bg: '#1a1d23',
          border: '#252830',
          hover: '#252830',
          active: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
}
