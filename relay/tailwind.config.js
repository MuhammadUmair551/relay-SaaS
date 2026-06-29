/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream:   '#F0EDE4',
        surface: '#FFFFFF',
        border:  '#DDD9CC',
        panel:   '#2E3D18',

        olive: {
          900: '#1E2B0C',
          700: '#3D5420',
          500: '#6A8A3A',
          300: '#A8C070',
          100: '#E4ECCC',
        },

        muted:   '#7A8060',
        subtle:  '#A8A890',

        success: '#4A7A2A',
        warning: '#C07820',
        danger:  '#A03020',
      },

      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        hero: ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.05', fontWeight: '800' }],
      },

      boxShadow: {
        card:    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        float:   '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
        panel:   '0 20px 60px rgba(0,0,0,0.15)',
      },

      letterSpacing: {
        nav: '0.12em',
      },
    },
  },
  plugins: [],
};