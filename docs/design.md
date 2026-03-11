# OasisBio Design Documentation

## Design Philosophy

OasisBio follows a minimalist, modern design approach inspired by Swiss Grid principles and black/white minimalism. The design emphasizes clean typography, precise alignment, and strategic use of negative space to create a sophisticated, professional aesthetic.

## Visual Language

### Design Keywords
- Swiss Grid
- Black / White minimalism
- Editorial typography
- Strong negative space
- Motion restraint
- Precise alignment
- Brutalist undertone
- Awwwards-level transitions

### Color Palette

#### Primary Colors
- **Black**: #000000
- **White**: #FFFFFF

#### Grayscale
- **Dark Gray**: #111111
- **Medium Gray**: #666666
- **Light Gray**: #D9D9D9
- **Extra Light Gray**: #F5F5F5

### Typography

#### Font Recommendations
- **Headings**: Helvetica Now / Inter Tight / Satoshi style
- **Body Text**: Inter / Suisse Intl style
- **Monospace**: JetBrains Mono / IBM Plex Mono

#### Typography Hierarchy
- **H1**: 4xl-8xl, bold, tracking-tight
- **H2**: 3xl-5xl, bold, tracking-tight
- **H3**: 2xl-3xl, bold
- **Body**: base, regular
- **Small Text**: sm, regular

### Layout System

#### Grid
- 12-column grid system
- Responsive breakpoints
- Consistent spacing units

#### Spacing
- Base unit: 4px
- Spacing scale: 0.5rem, 1rem, 1.5rem, 2rem, 3rem, 4rem, 6rem, 8rem

#### Layout Components
- Hero sections with large typography
- Card-based content blocks
- Grid-based feature sections
- Full-width background sections

## CSS Implementation

### Tailwind CSS Configuration

#### Custom Tailwind Setup
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        gray: {
          100: '#F5F5F5',
          200: '#D9D9D9',
          300: '#B3B3B3',
          400: '#999999',
          500: '#666666',
          600: '#4D4D4D',
          700: '#333333',
          800: '#1A1A1A',
          900: '#111111',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
}
```

### Global Styles

#### CSS Reset and Base Styles
```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #000000;
  --primary: #000000;
  --primary-foreground: #ffffff;
  --secondary: #f5f5f5;
  --secondary-foreground: #000000;
  --muted: #f5f5f5;
  --muted-foreground: #666666;
  --accent: #f5f5f5;
  --