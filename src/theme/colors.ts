export const Colors = {
  light: {
    // Brand & Hero Colors
    primary: '#C86D3B', // Warm artisanal terracotta/cinnamon roast
    primaryDark: '#9E4E22',
    primaryLight: '#E59265',
    primarySubtle: '#F7EDE6',

    // Specialty Accents
    espresso: '#1A120B', // Deep roasted bean
    botanicalSage: '#2E4A35', // Matchas & organic teas
    sageSubtle: '#E8EFEA',
    amberGold: '#DDA15E', // Specialty micro-lot medal / stars
    amberSubtle: '#FAF3E8',

    // Surfaces & Backgrounds
    background: '#FAF7F2', // Warm artisanal parchment
    surface: '#FFFFFF', // Crisp white card
    surfaceElevated: '#F4EEE5', // Warm latte cream
    surfaceSecondary: '#EDE5D8',

    // Borders & Dividers
    border: '#E8DFD3',
    borderStrong: '#D5C8B8',
    divider: '#EFE7DC',

    // Typography
    textPrimary: '#1E1510',
    textSecondary: '#6B5E55',
    textMuted: '#9E9086',
    textInverse: '#FAF7F2',

    // Status
    success: '#2D6A4F',
    successBg: '#E9F5EF',
    warning: '#D48B38',
    warningBg: '#FDF6EC',
    error: '#BA3B3B',
    errorBg: '#FCEFEF',

    // Roast Meter Colors
    roastLight: '#DE9B52',
    roastMediumLight: '#BF7231',
    roastMedium: '#9A5120',
    roastMediumDark: '#6E3211',
    roastDark: '#3F1A07',

    // Overlays
    backdrop: 'rgba(26, 18, 11, 0.45)',
    cardShadow: 'rgba(40, 24, 15, 0.07)',
  },
  dark: {
    // Brand & Hero Colors
    primary: '#E28743',
    primaryDark: '#B85D1E',
    primaryLight: '#F3A66B',
    primarySubtle: '#2D1B11',

    // Specialty Accents
    espresso: '#F5EBE1',
    botanicalSage: '#588157',
    sageSubtle: '#1B291E',
    amberGold: '#E6AF6B',
    amberSubtle: '#2B2113',

    // Surfaces & Backgrounds
    background: '#110D0B', // Smoked espresso obsidian
    surface: '#1A1411', // Dark roasted card
    surfaceElevated: '#241D18',
    surfaceSecondary: '#2F2620',

    // Borders & Dividers
    border: '#2C221D',
    borderStrong: '#3D312A',
    divider: '#261E1A',

    // Typography
    textPrimary: '#F7EFE8',
    textSecondary: '#B3A59A',
    textMuted: '#7F7268',
    textInverse: '#140E0A',

    // Status
    success: '#52B788',
    successBg: '#132A1F',
    warning: '#E9C46A',
    warningBg: '#2E2613',
    error: '#E76F51',
    errorBg: '#311613',

    // Roast Meter Colors
    roastLight: '#E8AE6B',
    roastMediumLight: '#D28543',
    roastMedium: '#B4642C',
    roastMediumDark: '#8A4219',
    roastDark: '#5C2B10',

    // Overlays
    backdrop: 'rgba(0, 0, 0, 0.7)',
    cardShadow: 'rgba(0, 0, 0, 0.35)',
  },
};

export type ThemeColors = typeof Colors.light;
