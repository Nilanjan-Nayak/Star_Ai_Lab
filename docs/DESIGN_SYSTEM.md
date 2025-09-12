# Star AI Labs Design System

A comprehensive, premium design system built for modern web applications with a focus on AI and technology themes.

## 🎨 Design Philosophy

Our design system is built around the concept of **"Premium Digital Excellence"** - combining cutting-edge aesthetics with functional design principles. The system features:

- **Dark-first approach** with sophisticated color palettes
- **Glass morphism** and modern visual effects
- **Responsive design** that works across all devices
- **Accessibility-focused** components
- **Performance-optimized** CSS and animations

## 🌈 Color System

### Primary Colors (Deep Space Theme)
```css
--primary-void: #000000
--primary-deep: #0a0a0a
--primary-rich: #111111
--primary-charcoal: #1a1a1a
--primary-slate: #2a2a2a
--primary-graphite: #333333
```

### Secondary Colors (Cosmic Blue)
```css
--secondary-midnight: #0f1419
--secondary-navy: #1e3a8a
--secondary-royal: #0066ff
--secondary-electric: #00d4ff
--secondary-cyan: #06b6d4
--secondary-sky: #3b82f6
--secondary-azure: #60a5fa
--secondary-ice: #93c5fd
```

### Accent Colors
```css
--accent-neon: #00ff88
--accent-purple: #8b5cf6
--accent-pink: #ec4899
--accent-orange: #f97316
--accent-yellow: #eab308
```

## 🎭 Component Library

### Buttons
```tsx
import { Button } from '@/components/ui';

// Primary button
<Button variant="primary" size="lg" icon={Rocket}>
  Get Started
</Button>

// Secondary button with loading state
<Button variant="secondary" loading={true}>
  Processing...
</Button>

// Ghost button with right icon
<Button variant="ghost" icon={ArrowRight} iconPosition="right">
  Learn More
</Button>
```

**Available Variants:**
- `primary` - Main call-to-action buttons
- `secondary` - Secondary actions with glass effect
- `accent` - Special highlight buttons with neon gradient
- `ghost` - Minimal buttons for subtle actions

**Available Sizes:**
- `sm` - Small buttons for compact spaces
- `base` - Default size for most use cases
- `lg` - Large buttons for primary actions
- `xl` - Extra large for hero sections

### Cards
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';

<Card variant="premium" hover={true}>
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
    <CardDescription>Brief project description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
  <CardFooter>
    {/* Action buttons */}
  </CardFooter>
</Card>
```

**Card Variants:**
- `default` - Standard glass effect card
- `premium` - Enhanced card with stronger effects and borders

### Inputs
```tsx
import { Input } from '@/components/ui';

<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  icon={Mail}
  iconPosition="left"
  error={errors.email}
/>
```

### Badges
```tsx
import { Badge } from '@/components/ui';

<Badge variant="primary" icon={Star}>
  Featured
</Badge>

<Badge variant="accent" size="lg">
  New
</Badge>
```

## 🏗️ Layout System

### Container
```tsx
import { Container } from '@/components/layout';

<Container size="xl">
  {/* Content with max-width and responsive padding */}
</Container>
```

**Container Sizes:**
- `sm` - max-width: 640px
- `md` - max-width: 768px
- `lg` - max-width: 1024px
- `xl` - max-width: 1280px
- `full` - max-width: 100%

### Section
```tsx
import { Section } from '@/components/layout';

<Section 
  id="about" 
  padding="xl" 
  background="glass"
  containerSize="lg"
>
  {/* Section content */}
</Section>
```

**Section Options:**
- `padding`: `sm`, `base`, `lg`, `xl`
- `background`: `transparent`, `glass`, `gradient`
- `containerSize`: Same as Container sizes

### Grid
```tsx
import { Grid } from '@/components/layout';

<Grid cols={3} gap="lg">
  {items.map(item => (
    <div key={item.id}>{item.content}</div>
  ))}
</Grid>
```

**Grid Configurations:**
- `cols`: 1-6 columns with responsive breakpoints
- `gap`: `sm`, `base`, `lg`, `xl`

## ✨ Utility Classes

### Glass Effects
```css
.glass-effect /* Standard glass morphism */
.glass-primary /* Dark glass with high opacity */
.glass-secondary /* Medium opacity glass */
.glass-tertiary /* Light opacity glass */
```

### Gradients
```css
.gradient-text /* Gradient text effect */
.bg-gradient-primary /* Primary gradient background */
.bg-gradient-accent /* Accent gradient background */
```

### Animations
```css
.animate-fade-in /* Fade in animation */
.animate-slide-in-left /* Slide from left */
.animate-slide-in-right /* Slide from right */
.animate-pulse /* Pulsing effect */
.animate-spin /* Rotation animation */
.animate-bounce /* Bouncing effect */
.hover-lift /* Lift on hover */
.glow-effect /* Glowing shadow */
```

## 🎬 Animation System

### CSS Custom Properties for Animations
```css
--transition-fast: 150ms ease
--transition-base: 250ms ease
--transition-slow: 350ms ease
--transition-slower: 500ms ease

--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Keyframe Animations
- `fadeIn` - Smooth fade in with slight upward movement
- `slideInLeft` - Slide in from the left
- `slideInRight` - Slide in from the right
- `pulse` - Gentle pulsing effect
- `spin` - Continuous rotation
- `bounce` - Bouncing animation

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* Base: 0px and up */
/* sm: 640px and up */
/* md: 768px and up */
/* lg: 1024px and up */
/* xl: 1280px and up */
/* 2xl: 1536px and up */
```

### Responsive Utilities
All components are built with mobile-first responsive design:
- Grid systems automatically adjust column counts
- Typography scales appropriately
- Spacing and padding adapt to screen size
- Interactive elements have touch-friendly sizes

## 🎯 Best Practices

### Component Usage
1. **Always use semantic HTML** - Our components are built with accessibility in mind
2. **Prefer composition** - Combine small components rather than creating large monolithic ones
3. **Use consistent spacing** - Stick to the spacing scale defined in the design system
4. **Follow the color hierarchy** - Use primary colors for main actions, secondary for supporting actions

### Performance
1. **CSS Custom Properties** - All colors and values use CSS custom properties for easy theming
2. **Optimized animations** - All animations use transform and opacity for better performance
3. **Minimal bundle size** - Components are tree-shakeable and only include what you use

### Accessibility
1. **Keyboard navigation** - All interactive components support keyboard navigation
2. **Screen reader support** - Proper ARIA labels and semantic markup
3. **Color contrast** - All color combinations meet WCAG AA standards
4. **Focus indicators** - Clear focus states for all interactive elements

## 🚀 Getting Started

1. **Import the design system CSS:**
```css
@import './styles/design-system.css';
```

2. **Use components in your React app:**
```tsx
import { Button, Card } from '@/components/ui';
import { Container, Section } from '@/components/layout';
```

3. **Apply utility classes:**
```tsx
<div className="glass-effect gradient-text animate-fade-in">
  Premium content
</div>
```

## 🔧 Customization

### CSS Custom Properties
You can customize the design system by overriding CSS custom properties:

```css
:root {
  --primary-void: #your-color;
  --secondary-royal: #your-color;
  /* Override any design token */
}
```

### Component Variants
Create new component variants by extending existing ones:

```tsx
const CustomButton = styled(Button)`
  /* Your custom styles */
`;
```

## 📚 Examples

Check out the `src/components/enhanced/` directory for complete examples:
- `HeroSection.tsx` - Advanced hero section with animations
- `ProjectShowcase.tsx` - Complex project display with filtering

## 🤝 Contributing

When adding new components or utilities:
1. Follow the existing naming conventions
2. Use CSS custom properties for all values
3. Ensure responsive design
4. Add proper TypeScript types
5. Include accessibility features
6. Document your changes

---

**Star AI Labs Design System** - Building the future of digital experiences.

Made in Nilanjan Nayak