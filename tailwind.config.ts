import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores semânticas usando variáveis CSS
        background: 'var(--bg-primary)',
        foreground: 'var(--text-primary)',

        // Cores de acento dinâmicas (mudam com o tema)
        accent: {
          50: 'var(--accent-50)',
          100: 'var(--accent-100)',
          200: 'var(--accent-200)',
          300: 'var(--accent-300)',
          400: 'var(--accent-400)',
          500: 'var(--accent-500)',
          600: 'var(--accent-600)',
          700: 'var(--accent-700)',
          800: 'var(--accent-800)',
          900: 'var(--accent-900)',
          950: 'var(--accent-950)',
          DEFAULT: 'var(--accent-500)',
        },

        // Cores de texto semânticas
        muted: {
          DEFAULT: 'var(--text-muted)',
          foreground: 'var(--text-secondary)',
        },

        // Bordas
        border: 'var(--border-default)',

        // Versati brand colors (mantidas para compatibilidade)
        versati: {
          black: '#0A0A0A',
          gold: '#C9A962',
          bronze: '#B8956E',
          copper: '#8B7355',
          white: '#FFFFFF',
        },

        // Gold colors (mantidas para compatibilidade)
        gold: {
          50: '#FDF9F0',
          100: '#F9F0DB',
          200: '#F2E1B8',
          300: '#E8CD8A',
          400: '#D9B86A',
          500: '#C9A962',
          600: '#B8956E',
          700: '#8B7355',
          800: '#5E4D3A',
          900: '#3D3226',
          950: '#1F1A14',
        },

        // Neutral colors com melhor contraste
        neutral: {
          0: '#000000',
          50: '#0A0A0A',
          100: '#111111',
          150: '#141414',
          200: '#1A1A1A',
          250: '#1F1F1F',
          300: '#262626',
          400: '#404040',
          500: '#666666',
          600: '#808080',
          700: '#A1A1A1',
          800: '#C4C4C4',
          900: '#E5E5E5',
          950: '#F5F5F5',
          1000: '#FFFFFF',
        },

        // Status colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        heading: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['72px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['48px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2': ['36px', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'h3': ['24px', { lineHeight: '1.3' }],
        'h4': ['20px', { lineHeight: '1.4' }],
        'h5': ['18px', { lineHeight: '1.4' }],
      },
      borderRadius: {
        lg: '16px',
        md: '12px',
        sm: '8px',
      },
      boxShadow: {
        'glow': '0 0 20px var(--shadow-glow)',
        'glow-md': '0 0 30px var(--shadow-glow-md)',
        'glow-lg': '0 0 40px var(--shadow-glow-lg)',
        'glow-gold': '0 0 20px rgba(201, 169, 98, 0.2)',
        'glow-gold-md': '0 0 30px rgba(201, 169, 98, 0.3)',
        'glow-gold-lg': '0 0 40px rgba(201, 169, 98, 0.4)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--border-accent)',
        'card-elevated': '0 12px 40px rgba(0, 0, 0, 0.5)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px var(--shadow-glow)' },
          '50%': { boxShadow: '0 0 30px var(--shadow-glow-md)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'glow': 'glow 2s infinite',
      },
    },
  },
  plugins: [],
}

export default config
