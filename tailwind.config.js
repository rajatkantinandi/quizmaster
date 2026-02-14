/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#014751',
          hover: '#016c7b',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f5f6e6',
          foreground: '#014751',
        },
        destructive: {
          DEFAULT: 'rgb(250, 82, 82)',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: '#f5f6e6',
          foreground: '#014751',
        },
        'input-bg': '#e4fafc',
        'checkbox-bg': '#c4fceb',
        'default-button': {
          DEFAULT: '#ffd700',
          hover: '#ffe30c',
        },
        'qm-card': {
          DEFAULT: '#f5f6e6',
          border: '#adc3c7',
        },
        'quiz-teal': '#009688',
        'quiz-blue': '#2196f3',
        'quiz-pink': '#e91e63',
        'quiz-green': '#4caf50',
        'quiz-purple': '#673ab7',
        'correct-color': 'rgb(64, 192, 87)',
        'incorrect-color': 'rgb(250, 82, 82)',
        warning: 'rgb(250, 176, 5)',
        'points-1': '#20c027',
        'points-2': '#82c91e',
        'points-3': '#fab005',
        'points-4': '#fd7e14',
        'points-5': '#fa5252',
      },
      fontFamily: {
        display: ['Comfortaa', 'cursive'],
        body: ['Ubuntu', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0',
        'quiz-card': '10px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
