import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  // Editorial Display Headings
  displayLarge: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.6,
    lineHeight: 38,
  },
  displayMedium: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 32,
  },
  displaySmall: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 28,
  },

  // Titles
  titleLarge: {
    fontSize: 19,
    fontWeight: '600',
    letterSpacing: -0.1,
    lineHeight: 25,
  },
  titleMedium: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 22,
  },
  titleSmall: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
    lineHeight: 19,
  },

  // Body
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 17,
  },

  // Micro / Badges / Labels
  labelLarge: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
    lineHeight: 18,
  },
  labelMedium: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    lineHeight: 15,
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    lineHeight: 14,
  },

  // Numbers & Prices
  priceLarge: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  priceMedium: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  priceSmall: {
    fontSize: 14,
    fontWeight: '700',
  },
};
