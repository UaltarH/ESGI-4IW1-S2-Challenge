const animate = require("tailwindcss-animate")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  safelist: ["dark"],
  prefix: "",
  
  content: [
    './pages/**/*.{ts,tsx,vue}',
    './components/**/*.{ts,tsx,vue}',
    './app/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}',
	],

  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'primary-light': 'var(--primary-light)',
        'secondary-light': 'var(--secondary-light)',
        'danger': 'var(--danger)',
        'danger-light': 'var(--danger-light)',
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

        // framework
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
      	xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "collapsible-down": {
          from: { height: 0 },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        "collapsible-up": {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-in-out",
        "collapsible-up": "collapsible-up 0.2s ease-in-out",
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
  plugins: [animate],
}