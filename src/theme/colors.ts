/**
 * colors.ts — Central brand color palette for BrewBox.
 * All colors are defined here once. Components import from here
 * instead of hardcoding hex values — makes theme changes easy.
 */

export const Colors = {
  light: {
    // Brand colors
    primary: '#C86D3B',       // Terracotta amber — buttons, active tabs, CTAs
    primaryDark: '#9E4E22',   // Darker shade — pressed/hover states
    primaryLight: '#E59265',  // Lighter shade — highlights
    primarySubtle: '#F7EDE6', // Very light tint — selected card backgrounds

    // Specialty accents
    espresso: '#1A120B',      // Deep roasted bean — high-contrast text
    botanicalSage: '#2E4A35', // Matcha green — tea badges, sage buttons
    sageSubtle: '#E8EFEA',    // Light sage — sage badge backgrounds
    amberGold: '#DDA15E',     // Gold — star ratings, micro-lot highlights
    amberSubtle: '#FAF3E8',   // Light amber — micro-lot badge backgrounds

    // Backgrounds & surfaces
    background: '#FAF7F2',       // Warm parchment — main screen background
    surface: '#FFFFFF',          // White — cards and modals
    surfaceElevated: '#F4EEE5',  // Latte cream — slightly raised surfaces
    surfaceSecondary: '#EDE5D8', // Deeper warm — section dividers

    // Borders
    border: '#E8DFD3',
    borderStrong: '#D5C8B8',
    divider: '#EFE7DC',

    // Text
    textPrimary: '#1E1510',   // Near-black — headings and body
    textSecondary: '#6B5E55', // Medium brown — labels and descriptions
    textMuted: '#9E9086',     // Light grey-brown — placeholders
    textInverse: '#FAF7F2',   // Light — text on dark backgrounds

    // Status
    success: '#2D6A4F',
    successBg: '#E9F5EF',
    warning: '#D48B38',
    warningBg: '#FDF6EC',
    error: '#BA3B3B',
    errorBg: '#FCEFEF',

    // Roast meter — 5 colors for the 5 roast level segments (light → dark)
    roastLight: '#DE9B52',
    roastMediumLight: '#BF7231',
    roastMedium: '#9A5120',
    roastMediumDark: '#6E3211',
    roastDark: '#3F1A07',

    // Overlays
    backdrop: 'rgba(26, 18, 11, 0.45)',   // Modal background dimmer
    cardShadow: 'rgba(40, 24, 15, 0.07)', // Product card shadow
  },

  dark: {
    // Same structure as light — brighter values for dark backgrounds
    primary: '#E28743',
    primaryDark: '#B85D1E',
    primaryLight: '#F3A66B',
    primarySubtle: '#2D1B11',

    espresso: '#F5EBE1',
    botanicalSage: '#588157',
    sageSubtle: '#1B291E',
    amberGold: '#E6AF6B',
    amberSubtle: '#2B2113',

    background: '#110D0B',       // Smoked espresso obsidian
    surface: '#1A1411',
    surfaceElevated: '#241D18',
    surfaceSecondary: '#2F2620',

    border: '#2C221D',
    borderStrong: '#3D312A',
    divider: '#261E1A',

    textPrimary: '#F7EFE8',
    textSecondary: '#B3A59A',
    textMuted: '#7F7268',
    textInverse: '#140E0A',

    success: '#52B788',
    successBg: '#132A1F',
    warning: '#E9C46A',
    warningBg: '#2E2613',
    error: '#E76F51',
    errorBg: '#311613',

    roastLight: '#E8AE6B',
    roastMediumLight: '#D28543',
    roastMedium: '#B4642C',
    roastMediumDark: '#8A4219',
    roastDark: '#5C2B10',

    backdrop: 'rgba(0, 0, 0, 0.7)',
    cardShadow: 'rgba(0, 0, 0, 0.35)',
  },
};

// TypeScript type derived from the light theme — used to type-check color references
export type ThemeColors = typeof Colors.light;
