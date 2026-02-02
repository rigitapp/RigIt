/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Rig It brand colors - industrial/mechanical theme
        'rig': {
          'black': '#0a0a0a',
          'charcoal': '#1a1a1a',
          'steel': '#2d2d2d',
          'iron': '#404040',
          'chrome': '#6b6b6b',
          'silver': '#a3a3a3',
          'gold': '#f5a623',
          'amber': '#d4910a',
          'rust': '#c45c26',
          'copper': '#b87333',
          'neon': '#00ff9d',
          'electric': '#00d4ff',
        },
      },
      fontFamily: {
        'display': ['Bebas Neue', 'Impact', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'body': ['DM Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #f5a623, 0 0 10px #f5a623, 0 0 15px #f5a623' },
          '100%': { boxShadow: '0 0 10px #f5a623, 0 0 20px #f5a623, 0 0 30px #f5a623' },
        },
      },
      backgroundImage: {
        'rig-gradient': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        'gold-gradient': 'linear-gradient(135deg, #f5a623 0%, #d4910a 100%)',
        'steel-gradient': 'linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%)',
      },
    },
  },
  plugins: [],
};
