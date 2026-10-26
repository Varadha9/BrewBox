/**
 * spacing.ts — Consistent spacing, border radius, and shadow tokens.
 * Used for padding, margin, and gap values across all components.
 * Follows a base-4 scale so layouts feel visually rhythmic.
 * Usage: padding: Spacing.lg  →  padding: 16
 */

export const Spacing = {
  xxs: 2,   // Hairline — very tight gaps
  xs: 4,    // Extra small — icon padding
  sm: 8,    // Small — gaps between inline elements
  md: 12,   // Medium — standard card padding
  lg: 16,   // Large — screen horizontal padding, button padding
  xl: 20,   // Extra large — section spacing
  xxl: 28,  // Between major sections
  xxxl: 36, // Hero section padding
  huge: 48, // Top/bottom breathing room
};

// Corner rounding scale for cards, buttons, and badges
export const BorderRadius = {
  xs: 4,      // Subtle — small tags
  sm: 8,      // Standard — input fields
  md: 12,     // Medium — cards and buttons
  lg: 16,     // Large — product cards
  xl: 22,     // Extra large — bottom sheets
  full: 9999, // Fully circular — pills, badges, icon buttons
};

// Pre-built shadow styles — spread into component styles: ...Shadows.card
// elevation = Android shadow depth; shadowXxx = iOS shadow properties
export const Shadows = {
  soft: {
    shadowColor: '#28180F', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  card: {
    shadowColor: '#28180F', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  floating: {
    shadowColor: '#1A120B', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 6,
  },
};
