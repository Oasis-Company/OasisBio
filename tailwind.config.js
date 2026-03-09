/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'oklch(0.9816 0.0017 247.8577)',
        foreground: 'oklch(0.1221 0.0036 255.5078)',
        card: 'oklch(1.0000 0 0)',
        'card-foreground': 'oklch(0.1221 0.0036 255.5078)',
        popover: 'oklch(1.0000 0 0)',
        'popover-foreground': 'oklch(0.1221 0.0036 255.5078)',
        primary: 'oklch(0.1221 0.0036 255.5078)',
        'primary-foreground': 'oklch(1.0000 0 0)',
        secondary: 'oklch(0.9653 0 0)',
        'secondary-foreground': 'oklch(0.5560 0 0)',
        muted: 'oklch(0.9653 0 0)',
        'muted-foreground': 'oklch(0.5560 0 0)',
        accent: 'oklch(0.9653 0 0)',
        'accent-foreground': 'oklch(0.1221 0.0036 255.5078)',
        destructive: 'oklch(0.5948 0.2007 25.5645)',
        'destructive-foreground': 'oklch(1.0000 0 0)',
        border: 'oklch(0.9288 0 0)',
        input: 'oklch(0.9288 0 0)',
        ring: 'oklch(0.1221 0.0036 255.5078)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}