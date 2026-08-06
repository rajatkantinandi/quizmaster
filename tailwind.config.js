/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--qm-primary)',
          hover: 'var(--primary-button-bg-hover)',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: 'var(--secondary-card-bg)',
          foreground: 'var(--qm-primary)',
        },
        destructive: {
          DEFAULT: '#fa5252',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--qm-card-bg)',
          foreground: 'var(--qm-primary)',
        },
        'input-bg': 'var(--input-bg)',
        'checkbox-bg': 'var(--checkbox-bg)',
        'default-button': {
          DEFAULT: 'var(--default-button-bg)',
          hover: 'var(--default-button-bg-hover)',
        },
        'qm-card': {
          DEFAULT: 'var(--qm-card-bg)',
          border: 'var(--qm-card-border)',
        },
        'quiz-teal': '#009688',
        'quiz-blue': '#2196f3',
        'quiz-pink': '#e91e63',
        'quiz-green': '#4caf50',
        'quiz-purple': '#673ab7',
        'correct-color': '#40c057',
        'incorrect-color': '#fa5252',
        warning: '#fab005',
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
        'border-roll': {
          '50%': {
            background: 'repeating-linear-gradient(45deg, var(--correct-color) 2%, var(--qm-primary) 4%)',
          },
          '100%': {
            background: 'repeating-linear-gradient(45deg, var(--correct-color) 3%, var(--qm-primary) 5%)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'border-roll': 'border-roll 0.5s linear infinite',
      },
    },
  },
  plugins: [],
};
