/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        'secondary': 'var(--secondary)',
        'secondary-light': 'var(--secondary-light)',
        'danger': 'var(--danger)',
        'success': 'var(--success)',
        'warning': 'var(--warning)',
        'dark-blue': 'var(--dark-blue)',
        'dark-blue-dark': 'var(--dark-blue-dark)',
        'tag-news': 'var(--tag-news)',
        'tag-tutorial': 'var(--tag-tutorial)',
        'tag-announcement': 'var(--tag-announcement)',
        'tag-news-bg': 'var(--tag-news-bg)',
        'tag-tutorial-bg': 'var(--tag-tutorial-bg)',
        'tag-announcement-bg': 'var(--tag-announcement-bg)',
      },
      width: {
        'xl': 'var(--xl)',
        'lg': 'var(--lg)',
        'md': 'var(--md)',
        'sm': 'var(--sm)',
      },
      maxWidth: {
        'xl': 'var(--xl)',
        'lg': 'var(--lg)',
        'md': 'var(--md)',
        'sm': 'var(--sm)',
      },
      minWidth: {
        'xl': 'var(--xl)',
        'lg': 'var(--lg)',
        'md': 'var(--md)',
        'sm': 'var(--sm)',
      },
    },
    flex: {
      '0.5': '0.5 0.5 0%',
      '1': '1 1 0%',
      '2': '2 2 0%',
    },
  },
  plugins: [],
}

