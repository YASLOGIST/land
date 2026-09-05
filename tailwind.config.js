/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      /* The corporate hub's type stack (main/index.html). `Alexandria` and
         `JetBrains Mono` were named here but never requested by the shell, so
         every `font-arabic` and `font-mono` utility silently rendered in a
         system fallback. */
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        display: ['"Archivo"', 'system-ui', 'sans-serif'],
        arabic: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        ruqaa: ['"Aref Ruqaa"', '"IBM Plex Sans Arabic"', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
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
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        slate: {
          950: '#020617',
          900: '#0f172a',
          850: '#0b1120',
          800: '#1e293b',
        },
        cyan: {
          350: '#38e1fa',
          400: '#22d3ee',
          450: '#11c2df',
          500: '#06b6d4',
          950: '#042f2e',
        },
        gold: {
          50: '#fdfbf2',
          100: '#fcf6e1',
          200: '#f8ebbf',
          300: '#f2dc94',
          400: '#f0c742',
          500: '#E8B317', // Primary Sovereign Signal Gold
          600: '#cc970e',
          700: '#a3730e',
          800: '#7A5400', // High contrast text in light mode
          900: '#593e09',
          950: '#332102',
        },
        signal: {
          DEFAULT: '#E8B317',
          dark: '#E8B317',
          light: '#7A5400',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'crystal': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
        'crystal-glow': '0 0 25px rgba(232, 179, 23, 0.25), inset 0 1px 2px 0 rgba(255, 255, 255, 0.2)',
        'neon-gold': '0 0 20px rgba(232, 179, 23, 0.4)',
        'neon-cyan': '0 0 20px rgba(232, 179, 23, 0.4)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-subtle': 'pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar-sweep 4s linear infinite',
        'laser-scan': 'laser-scan 2.5s ease-in-out infinite',
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
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(0.98)' },
        },
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'laser-scan': {
          '0%, 100%': { transform: 'translateY(-100%)', opacity: '0' },
          '15%': { opacity: '0.8' },
          '50%': { transform: 'translateY(100%)', opacity: '1' },
          '85%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
