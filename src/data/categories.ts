import { ProductCategory } from '../types';

export interface CategoryInfo {
  id: ProductCategory | 'all';
  name: string;
  shortLabel: string;
  tagline: string;
  description: string;
  iconName: string;
  itemCount: number;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'all',
    name: 'All Offerings',
    shortLabel: 'All',
    tagline: 'Curated specialty coffees, fine teas & precision gear',
    description: 'Explore the full artisanal catalog roasted in small batches.',
    iconName: 'sparkles',
    itemCount: 16,
  },
  {
    id: 'coffee',
    name: 'Specialty Coffee',
    shortLabel: 'Coffee',
    tagline: 'Micro-lots, single origins & signature roastery blends',
    description: 'Direct trade beans sourced from high-altitude estates, roasted fresh.',
    iconName: 'coffee-bean',
    itemCount: 8,
  },
  {
    id: 'tea',
    name: 'Estate Teas',
    shortLabel: 'Tea',
    tagline: 'Single-estate loose leaf, first flush & ceremonial matcha',
    description: 'Hand-picked from historical gardens in Uji, Darjeeling & Nantou.',
    iconName: 'leaf',
    itemCount: 4,
  },
  {
    id: 'equipment',
    name: 'Brewing Gear',
    shortLabel: 'Gear',
    tagline: 'Barista-grade pour-overs, hand grinders & precision scales',
    description: 'Engineered tools to unlock extraction potential in every cup.',
    iconName: 'pourover',
    itemCount: 3,
  },
  {
    id: 'merchandise',
    name: 'Roastery Merch',
    shortLabel: 'Merch',
    tagline: 'Ceramic cups, minimalist canisters & roastery apparel',
    description: 'Bespoke ceramics and lifestyle goods crafted for coffee lovers.',
    iconName: 'cup',
    itemCount: 1,
  },
];
