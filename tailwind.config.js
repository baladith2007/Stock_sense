/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-soft': 'var(--surface-soft)',
        line: 'var(--border)',
        ink: 'var(--text)',
        muted: 'var(--text-muted)',
        'muted-strong': 'var(--text-muted-strong)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        'primary-ink': 'var(--primary-ink)',
        'primary-tint': 'var(--primary-tint)',
        'primary-ring': 'var(--primary-ring)',
        accent: 'var(--accent)',
        'accent-tint': 'var(--accent-tint)',
        'accent-ink': 'var(--accent-ink)',
        danger: 'var(--danger)',
        'danger-tint': 'var(--danger-tint)',
        'danger-ink': 'var(--danger-ink)',
        info: 'var(--info)',
        'info-tint': 'var(--info-tint)',
        'info-ink': 'var(--info-ink)',
        navy: 'var(--navy-900)',
        'navy-800': 'var(--navy-800)',
        'navy-700': 'var(--navy-700)',
        'on-navy': 'var(--on-navy)',
        'on-navy-muted': 'var(--on-navy-muted)',
        mint: 'var(--mint)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        caption: ['12px', { lineHeight: '16px' }],
        label: ['13px', { lineHeight: '18px' }],
        body: ['15px', { lineHeight: '1.6' }],
        h2: ['18px', { lineHeight: '24px' }],
        h1: ['24px', { lineHeight: '32px' }],
        display: ['40px', { lineHeight: '1.1' }],
        'display-lg': ['56px', { lineHeight: '1.05' }],
        stat: ['28px', { lineHeight: '34px' }],
        'stat-lg': ['40px', { lineHeight: '44px' }],
      },
      borderRadius: {
        card: '14px',
        modal: '20px',
        input: '8px',
      },
      boxShadow: {
        float: '0 8px 30px rgba(15, 23, 42, 0.08)',
      },
      maxWidth: {
        content: '1120px',
      },
      spacing: {
        18: '4.5rem',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(12px) scale(.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in .2s ease-out both',
        'rise-in': 'rise-in .2s ease-out both',
        'toast-in': 'toast-in .2s ease-out both',
      },
    },
  },
  plugins: [],
};
