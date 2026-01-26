import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        xs: '12px',
        sm: '13px',
        base: '14px',
        md: '15px',
        lg: '16px',
        xl: '22px',
        '2xl': '28px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '6px',
        lg: '10px',
        xl: '20px',
        '2xl': '36px',
        full: '9999px',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: '#3e79f7',
          light: '#699dff',
          dark: '#2a59d1',
          lightest: '#f0f7ff',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: '#ff6b72',
          dark: '#d9505c',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: '#2dc56a',
          light: '#04d182',
        },
        warning: {
          DEFAULT: '#ffc542',
          light: '#ffd86b',
        },
        border: {
          DEFAULT: '#e6ebf1',
          light: '#d0d4d7',
          lighter: '#e0e0e0',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        text: {
          primary: '#1a3353',
          DEFAULT: '#455560',
          secondary: '#373d3f',
          muted: '#72849a',
          light: '#90a4ae',
        },
        bg: {
          DEFAULT: '#ffffff',
          secondary: '#f7f7f8',
          tertiary: '#fcfcfc',
          alt: '#fafafb',
        },
        chart: {
          '1': '#3e79f7',
          '2': '#2dc56a',
          '3': '#ffc542',
          '4': '#ff6b72',
          '5': '#08aeea',
          '6': '#a855f7',
          '7': '#f97316',
          '8': '#ec4899',
        },
      },
      boxShadow: {
        sm: '0 2px 0 rgba(0, 0, 0, 0.015)',
        DEFAULT: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
        md: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
        lg: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)',
        focus: '0 0 0 2px rgba(62, 121, 247, 0.2)',
        'focus-error': '0 0 0 2px rgba(255, 107, 114, 0.2)',
        dropdown: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
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
      transitionTimingFunction: {
        'omi-ease': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        'omi-bounce': 'cubic-bezier(0.12, 0.4, 0.29, 1.46)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
