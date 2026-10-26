/**
 * typography.ts — Centralized text style system for BrewBox.
 * Named styles are defined here once and spread into components.
 * Ensures consistent font sizes, weights, and spacing across all screens.
 * Usage: <Text style={Typography.titleMedium}>Hello</Text>
 */

import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  // Large hero headings — used on banners and screen titles
  displayLarge:  { fontSize: 32, fontWeight: '700', letterSpacing: -0.6, lineHeight: 38 },
  displayMedium: { fontSize: 26, fontWeight: '700', letterSpacing: -0.4, lineHeight: 32 },
  displaySmall:  { fontSize: 22, fontWeight: '700', letterSpacing: -0.2, lineHeight: 28 },

  // Section headings and product names
  titleLarge:  { fontSize: 19, fontWeight: '600', letterSpacing: -0.1, lineHeight: 25 },
  titleMedium: { fontSize: 16, fontWeight: '600', letterSpacing: 0,    lineHeight: 22 },
  titleSmall:  { fontSize: 14, fontWeight: '600', letterSpacing: 0.1,  lineHeight: 19 },

  // Descriptions, roaster stories, general content
  bodyLarge:  { fontSize: 16, fontWeight: '400', letterSpacing: 0.15, lineHeight: 24 },
  bodyMedium: { fontSize: 14, fontWeight: '400', letterSpacing: 0.1,  lineHeight: 20 },
  bodySmall:  { fontSize: 12, fontWeight: '400', letterSpacing: 0.2,  lineHeight: 17 },

  // Badges, category pills, tab bar labels — uppercase for editorial feel
  labelLarge:  { fontSize: 13, fontWeight: '600', letterSpacing: 0.3, lineHeight: 18 },
  labelMedium: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', lineHeight: 15 },
  labelSmall:  { fontSize: 10, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase', lineHeight: 14 },

  // Prices and totals in cart/checkout
  priceLarge:  { fontSize: 24, fontWeight: '700', letterSpacing: -0.3 },
  priceMedium: { fontSize: 18, fontWeight: '700', letterSpacing: -0.2 },
  priceSmall:  { fontSize: 14, fontWeight: '700' },
};
