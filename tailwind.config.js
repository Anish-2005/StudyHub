/** @type {import('tailwindcss').Config} */
const withOpacity = (cssVar) => `rgb(var(${cssVar}) / <alpha-value>)`;

const toneScale = (token) => ({
  50: withOpacity(`--color-${token}-50`),
  100: withOpacity(`--color-${token}-100`),
  200: withOpacity(`--color-${token}-200`),
  300: withOpacity(`--color-${token}-300`),
  400: withOpacity(`--color-${token}-400`),
  500: withOpacity(`--color-${token}-500`),
  600: withOpacity(`--color-${token}-600`),
  700: withOpacity(`--color-${token}-700`),
  800: withOpacity(`--color-${token}-800`),
  900: withOpacity(`--color-${token}-900`),
  950: withOpacity(`--color-${token}-950`),
});

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: toneScale('primary'),
        secondary: toneScale('secondary'),
        accent: toneScale('accent'),
        success: toneScale('success'),
        warning: toneScale('warning'),
        vscode: {
          bg: withOpacity('--color-vscode-bg'),
          sidebar: withOpacity('--color-vscode-sidebar'),
          active: withOpacity('--color-vscode-active'),
          border: withOpacity('--color-vscode-border'),
          text: withOpacity('--color-vscode-text'),
          accent: withOpacity('--color-vscode-accent'),
          success: withOpacity('--color-vscode-success'),
          warning: withOpacity('--color-vscode-warning'),
          error: withOpacity('--color-vscode-error'),
          purple: withOpacity('--color-vscode-purple'),
          blue: withOpacity('--color-vscode-blue'),
          green: withOpacity('--color-vscode-green'),
          orange: withOpacity('--color-vscode-orange'),
          yellow: withOpacity('--color-vscode-yellow'),
        },
      },
      fontFamily: {
        sans: ['Nunito Sans', 'Avenir Next', 'Segoe UI', 'sans-serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      screens: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        professional: '0 1px 3px rgba(84,58,28,0.12), 0 1px 2px rgba(84,58,28,0.1)',
        'professional-lg': '0 8px 24px rgba(84,58,28,0.12)',
        vscode: '0 6px 20px rgba(84,58,28,0.12)',
      },
    },
  },
  plugins: [],
};
