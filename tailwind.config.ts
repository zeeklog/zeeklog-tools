import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 博文编辑器（page-template/editor）设计令牌
        editor: {
          surface: '#f8f9fa',
          'on-surface': '#2b3437',
          'surface-container-lowest': '#ffffff',
          'on-background': '#2b3437',
          'surface-container-low': '#f1f4f6',
          'surface-container': '#eaeff1',
          'surface-container-high': '#e3e9ec',
          'surface-container-highest': '#dbe4e7',
          'surface-variant': '#dbe4e7',
          'on-surface-variant': '#586064',
          primary: '#5d5e62',
          'primary-dim': '#515256',
          'on-primary': '#f7f7fb',
          'outline-variant': '#abb3b7',
          'inverse-surface': '#0c0f10',
          'on-tertiary': '#faf8ff',
          secondary: '#006f19',
          'secondary-container': '#72ff73',
          'secondary-fixed-dim': '#59f160',
          'on-secondary-container': '#006014',
          tertiary: '#595e78',
          'tertiary-fixed': '#dadefe',
          error: '#9f403d',
        },
        // 极客日志（zeeklog.com）品牌色彩
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [typography],
}

export default config

