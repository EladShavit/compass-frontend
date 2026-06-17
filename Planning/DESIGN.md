---
name: Compass
colors:
  surface: '#0c141f'
  surface-dim: '#0c141f'
  surface-bright: '#323946'
  surface-container-lowest: '#070e19'
  surface-container-low: '#151c27'
  surface-container: '#19202b'
  surface-container-high: '#232a36'
  surface-container-highest: '#2e3541'
  on-surface: '#dce2f3'
  on-surface-variant: '#c8c5cd'
  inverse-surface: '#dce2f3'
  inverse-on-surface: '#2a313d'
  outline: '#929097'
  outline-variant: '#47464c'
  surface-tint: '#c6c4df'
  primary: '#c6c4df'
  on-primary: '#2f2e43'
  primary-container: '#1a1a2e'
  on-primary-container: '#83829b'
  inverse-primary: '#5d5c74'
  secondary: '#b5d33f'
  on-secondary: '#2a3400'
  secondary-container: '#86a100'
  on-secondary-container: '#283200'
  tertiary: '#c6bfff'
  on-tertiary: '#2900a0'
  tertiary-container: '#170067'
  on-tertiary-container: '#7f70fc'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e0fc'
  primary-fixed-dim: '#c6c4df'
  on-primary-fixed: '#1a1a2e'
  on-primary-fixed-variant: '#45455b'
  secondary-fixed: '#d1f059'
  secondary-fixed-dim: '#b5d33f'
  on-secondary-fixed: '#171e00'
  on-secondary-fixed-variant: '#3e4c00'
  tertiary-fixed: '#e4dfff'
  tertiary-fixed-dim: '#c6bfff'
  on-tertiary-fixed: '#160066'
  on-tertiary-fixed-variant: '#4029ba'
  background: '#0c141f'
  on-background: '#dce2f3'
  surface-variant: '#2e3541'
typography:
  h1:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-margin: 24px
  gutter: 16px
---

## Brand & Style

The brand personality is anchored in professional reliability and forward-thinking precision. Targeting high-net-worth individuals and tech-savvy investors, the design system evokes a sense of "secure momentum"—combining the stability of traditional banking with the agility of modern fintech.

The visual style is a sophisticated blend of **Corporate Modern** and **Glassmorphism**. It utilizes deep, immersive backgrounds to establish authority, while employing vibrant, luminescent accents and translucent layers to guide the user's attention. The interface prioritizes clarity and high-trust signals, ensuring complex financial data feels manageable and transparent. The inclusion of RTL support ensures a seamless experience for Hebrew-speaking markets, maintaining visual balance and structural integrity across all localized views.

## Colors

The palette is designed for high-contrast readability and premium appeal. 

- **Primary (Dark Navy):** Used for main backgrounds and core structural elements to establish a "high-trust" foundation.
- **Secondary (Lime Green):** Reserved for primary actions, growth indicators, and critical success states. Its high luminosity against the navy creates an immediate focal point.
- **Tertiary (Purple):** Used for secondary features, data visualization categories, and interactive highlights to add depth to the brand's technological identity.
- **Neutral (Gray):** Applied to secondary text, borders, and disabled states to maintain hierarchy without clutter.
- **Light Navy/Lavender:** Utilized for subtle surfaces, hover states, and as a soft contrast against the deep primary backgrounds.

## Typography

This design system utilizes **Manrope** for its exceptional legibility and modern, geometric construction, which aligns with the professional yet contemporary fintech aesthetic. 

The hierarchy is strictly enforced through scale and weight. Main headings are bold and tight to feel impactful, while body text maintains a generous line height for readability during long-form data consumption. For Hebrew RTL support, ensure the font weight is maintained consistently to preserve the visual "gravity" of the layout. All numerical data should use tabular figures to ensure alignment in financial tables.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The spacing logic follows a 4px baseline, ensuring all elements—from icons to margins—are mathematically aligned.

Layouts should prioritize whitespace to prevent "dashboard fatigue." Elements should be grouped using logical proximity, with larger 48px gaps used to separate distinct functional modules (e.g., Portfolio Overview vs. Recent Transactions). In RTL mode, the grid direction and column ordering must flip entirely, ensuring the visual "start" begins from the right margin.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Glassmorphism** rather than traditional heavy shadows. 

1.  **Base Layer:** Solid Dark Navy (#1A1A2E).
2.  **Card Layer:** A slightly lighter tint of navy or a 10% opacity white overlay to create a subtle "lift."
3.  **Interactive Layer:** Purple or Lime Green accents with high-diffusion ambient shadows (Blur: 20px, Opacity: 15%) to indicate reachability.
4.  **Overlays:** Use backdrop-blur (12px) on modals and navigation bars to maintain context of the underlying data while focusing the user's attention.

## Shapes

The shape language is defined by significant rounding to soften the "coldness" of financial data and evoke a modern, approachable feel. 

Large containers and primary cards use a **24px radius**, creating a friendly, framed appearance. Smaller interactive components like input fields, buttons, and secondary cards use a **12px radius** to maintain a cohesive look without consuming excessive internal padding. Drop zones for file uploads or data imports are distinguished by a **dashed border** with a 2px stroke, reinforcing their functional role.

## Components

- **Buttons:** Primary buttons use a solid Lime Green background with Dark Navy text for maximum contrast. Secondary buttons use a Purple ghost style with a 1px border.
- **Cards:** Large cards feature the 24px radius and a subtle 1px border (#F0F0F8 at 10% opacity). They should have a padding of at least 24px.
- **Input Fields:** Use a Dark Navy background slightly lighter than the base, with a 12px radius and a Lavender-tinted focus state.
- **Drop Zones:** Feature a 2px dashed Lavender border and a subtle Purple-tinted background to indicate interactivity.
- **Chips:** Small, highly rounded (pill) shapes used for status indicators (e.g., "Pending," "Complete"), utilizing the Tertiary Purple or Neutral Gray.
- **Icons:** Use clean, linear SVG icons with a consistent 2px stroke weight. In RTL, directional icons (arrows, progress bars) must be mirrored.
- **Data Tables:** High-density lists with subtle horizontal separators (#F0F0F8 at 5% opacity). Rows should feature a hover state using a slight Lavender tint.