---
name: Precision Clinical Interface
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#bec6e0'
  on-tertiary: '#283044'
  tertiary-container: '#9ea6bf'
  on-tertiary-container: '#343c50'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  container-padding: 24px
  gutter: 16px
  section-gap: 40px
  element-gap: 12px
---

## Brand & Style
This design system centers on **Medical Precision & AI Intelligence**. It is designed for dental professionals who require high-speed validation of diagnostic data. The aesthetic merges **Corporate Modernism** with **Glassmorphism**, creating a digital environment that feels clinical yet advanced.

The visual narrative balances the sterile reliability of a laboratory with the energetic pulse of modern computing. Key characteristics include:
- **Clinical Rigor:** High-contrast backgrounds specifically optimized for viewing grayscale radiographic imagery.
- **Intelligent Assistance:** Using vibrant AI highlights to guide the eye toward diagnostic anomalies without overwhelming the medical data.
- **Structural Clarity:** A strict adherence to grid patterns and logical information density to reduce cognitive load during long shifts.

## Colors
The palette is rooted in a "Deep Clinical" dark mode to maximize the dynamic range of X-ray and CT scan visualizations.

- **Primary (#06B6D4):** An energetic Cyan used exclusively for AI-generated findings, active states, and critical action paths.
- **Surface Tiers:** Uses #0F172A for the foundation and #1E293B for elevated cards and containers to create a sense of depth.
- **Functional Grays:** #F8FAFC is reserved for high-priority labels and body text, while muted variations handle secondary metadata.
- **Semantic Accents:** Standard medical status colors (Success: Emerald, Warning: Amber, Error: Rose) should be desaturated to maintain the professional atmosphere.

## Typography
The system utilizes **Inter** for all primary reading tasks due to its exceptional legibility in dense interfaces. **Geist** is introduced for labels, monospaced data, and technical readouts to reinforce the developer-grade precision of the AI engine.

- **Scale:** High contrast between headlines and body text ensures clear information hierarchy.
- **Technical Readouts:** Use `label-sm` for dental notation (e.g., FDI World Dental Federation notation) to ensure clarity in tight spaces.
- **Line Heights:** Generous line heights are maintained for body text to prevent fatigue during document review.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. Diagnostic viewers utilize a fluid layout to maximize the pixels available for imagery, while sidebar controls and patient records adhere to a structured 12-column grid.

- **Breakpoints:** Mobile (under 768px), Tablet (768px - 1280px), Desktop (1280px+).
- **Subtle Grids:** Use a 32px light grid overlay on background layers to provide a sense of mathematical alignment and "blueprint" aesthetics.
- **Margins:** 24px internal padding for all cards; 40px vertical separation between major logical sections.

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Glassmorphism**, rather than traditional shadows, to keep the interface feeling light and digital.

- **Layer 0 (Background):** #0F172A (Deep Slate).
- **Layer 1 (Containers):** #1E293B with a 1px border of #FFFFFF (10% opacity).
- **Layer 2 (Overlays/Glass):** Surfaces use a background blur (12px) with a semi-transparent fill of #1E293B at 70% opacity.
- **AI Highlights:** Elements validated by AI utilize an outer glow (0px 0px 12px) using the Primary Cyan at 30% opacity to denote active intelligence.

## Shapes
The design system uses **Soft (0.25rem)** roundedness to maintain a professional, architectural feel. 

- **Standard Elements:** 4px (0.25rem) radius for buttons and input fields.
- **Large Containers:** 8px (0.5rem) for cards and modals.
- **Interactive States:** Use sharp, 1px borders to define interactive areas, ensuring they feel like precision tools rather than consumer toys.

## Components
- **Buttons:** Inspired by Shadcn/ui. Primary buttons use a solid Cyan fill with dark slate text. Secondary buttons use a ghost style with a 1px border.
- **Diagnostic Cards:** Feature a "header-less" design where patient data and radiographic thumbnails are separated by a subtle 1px divider.
- **AI Toggles:** Switch components should glow softly when active, indicating the AI layer is currently processing or visible.
- **Data Visualization:** Use thin stroke weights (1px to 1.5px) for charts and graphs. Avoid fills; prefer line work to maintain the "Minimalist/Technical" aesthetic.
- **Input Fields:** Darker than the container background to create a "well" effect, with a Cyan 1px border on focus.
- **Chips/Badges:** Small, rectangular badges with Geist typography for categorizing dental conditions (e.g., "Caries", "Perio").