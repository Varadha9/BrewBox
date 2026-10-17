import { BrewGuide } from '../types';

export const DEFAULT_BREW_GUIDES: Record<string, BrewGuide> = {
  v60: {
    method: 'Hario V60 Pour Over',
    coffeeGrams: 15,
    waterGrams: 250,
    ratio: '1:16.6',
    grindRecommended: 'Medium-Fine (like kosher salt)',
    temperatureCelsius: 93,
    brewTimeSeconds: 195, // 3m 15s
    steps: [
      'Rinse the paper filter with hot water and discard the rinse water.',
      'Add 15g freshly ground coffee. Create a gentle divot in the centre.',
      '0:00 - Bloom: Pour 45g of water at 93°C in spirals. Allow grounds to bloom and degas for 45 seconds.',
      '0:45 - First pour: Pour continuously in concentric circles up to 150g by 1:15.',
      '1:30 - Second pour: Gently pour remaining water up to 250g by 2:00.',
      'Give one gentle swirl and let draw down completely until 3:15.',
    ],
  },
  aeropress: {
    method: 'AeroPress Inverted',
    coffeeGrams: 16,
    waterGrams: 200,
    ratio: '1:12.5',
    grindRecommended: 'Medium (table salt)',
    temperatureCelsius: 88,
    brewTimeSeconds: 120, // 2m
    steps: [
      'Assemble AeroPress in inverted position. Rinse filter cap.',
      'Add 16g coffee into the chamber.',
      'Start timer and pour 100g water at 88°C. Stir vigorously 5 times.',
      'At 0:45, top up water to 200g. Attach filter cap.',
      'At 1:20, carefully invert over cup and press slowly over 30 seconds until hiss.',
    ],
  },
  frenchPress: {
    method: 'Classic French Press',
    coffeeGrams: 30,
    waterGrams: 500,
    ratio: '1:16.6',
    grindRecommended: 'Coarse (sea salt crystals)',
    temperatureCelsius: 95,
    brewTimeSeconds: 240, // 4m
    steps: [
      'Preheat the glass beaker with warm water, then empty.',
      'Add 30g coarse ground coffee.',
      'Pour 500g freshly boiled water (95°C) saturating all grounds.',
      'Place plunger on top without pressing. Let steep for 4 minutes.',
      'Break the crust gently with a spoon, scoop off excess foam, and plunge slowly.',
    ],
  },
  coldBrew: {
    method: 'Slow Steep Cold Brew',
    coffeeGrams: 75,
    waterGrams: 600,
    ratio: '1:8 concentrate',
    grindRecommended: 'Extra Coarse (cracked peppercorns)',
    temperatureCelsius: 20,
    brewTimeSeconds: 57600, // 16 hours
    steps: [
      'Combine 75g coarse coffee and 600g filtered cold water in a carafe.',
      'Gently stir to ensure even wetness.',
      'Cover and steep in refrigerator for 16-18 hours.',
      'Filter through paper or fine mesh. Dilute 1:1 with cold water or milk over ice.',
    ],
  },
  matchaWhisk: {
    method: 'Traditional Chasen Whisk',
    coffeeGrams: 2, // 2g matcha powder
    waterGrams: 70,
    ratio: '2g : 70ml',
    grindRecommended: 'Micro-milled ceremonial powder',
    temperatureCelsius: 75,
    brewTimeSeconds: 60,
    steps: [
      'Sift 2g (approx 2 chashaku scoops) of matcha into a warm chawan bowl.',
      'Pour 70ml of 75°C spring water down the side of the bowl.',
      'Hold the bamboo chasen upright and whisk vigorously in a "W" motion from wrist.',
      'When fine velvety micro-foam forms across the entire surface, slow down to break large bubbles.',
    ],
  },
};
