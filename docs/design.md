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
  --accent-foreground: #000000;
  --border: #d9d9d9;
  --ring: #000000;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--background);
  color: var(--foreground);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

### Component Styles

#### Button Component
```tsx
// src/components/Button.tsx
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  asChild = false,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-border hover:bg-accent hover:text-accent-foreground',
  };
  
  const sizeClasses = {
    sm: 'h-9 px-4 py-2 text-sm',
    md: 'h-10 px-6 py-2',
    lg: 'h-11 px-8 py-2 text-lg',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  if (asChild) {
    const { children, ...restProps } = props;
    return React.cloneElement(React.Children.only(children), {
      className: classes,
      ...restProps,
    });
  }
  
  return (
    <button
      className={classes}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';
```

#### Card Component
```tsx
// src/components/Card.tsx
import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
));
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-muted-foreground ${className}`}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 pt-0 ${className}`}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center p-6 pt-0 ${className}`}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
```

#### Input Component
```tsx
// src/components/Input.tsx
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  min?: string;
  max?: string;
  step?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className,
  type,
  ...props
}, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';
```

### Animation and Transitions

