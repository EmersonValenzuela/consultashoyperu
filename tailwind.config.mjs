/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#0B0F15',
          900: '#121822',
          800: '#1F2937',
          700: '#374151',
          500: '#6B7280',
          400: '#9CA3AF',
        },
        carmesi: {
          50: '#FEF2F2',
          100: '#FDE8E8',
          500: '#E02424',
          600: '#C81E1E',
          700: '#9B1C1C',
          800: '#771D1D',
          900: '#5A1717',
        },
        soles: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
        },
      },
      boxShadow: {
        clean: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
