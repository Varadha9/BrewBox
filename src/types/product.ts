export type ProductCategory =
  | 'coffee'
  | 'tea'
  | 'equipment'
  | 'merchandise';

export type CoffeeSubcategory =
  | 'single-origin'
  | 'blend'
  | 'espresso'
  | 'cold-brew'
  | 'decaf';

export type TeaSubcategory =
  | 'matcha'
  | 'oolong'
  | 'black'
  | 'green'
  | 'herbal';

export type EquipmentSubcategory =
  | 'pourover'
  | 'french-press'
  | 'grinder'
  | 'scale'
  | 'kettle';

export type MerchandiseSubcategory =
  | 'merchandise'
  | 'ceramic'
  | 'apparel';

export type RoastLevel =
  | 'Light'
  | 'Medium-Light'
  | 'Medium'
  | 'Medium-Dark'
  | 'Dark';

export type GrindOption =
  | 'Whole Bean'
  | 'Espresso (Fine)'
  | 'Moka Pot'
  | 'Aeropress'
  | 'Pour Over / V60 (Medium)'
  | 'French Press (Coarse)'
  | 'Cold Brew (Extra Coarse)';

export interface TasteProfile {
  acidity: number; // 1 - 5
  sweetness: number; // 1 - 5
  body: number; // 1 - 5
  bitterness: number; // 1 - 5
}

export interface BrewGuide {
  method: string;
  coffeeGrams: number;
  waterGrams: number;
  ratio: string;
  grindRecommended: string;
  temperatureCelsius: number;
  brewTimeSeconds: number;
  steps: string[];
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
  brewMethodUsed?: string;
}

export interface WeightOption {
  weightGrams: number;
  label: string; // "250g", "500g", "1kg"
  priceMultiplier: number; // 1, 1.85, 3.4
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  subcategory: CoffeeSubcategory | TeaSubcategory | EquipmentSubcategory | MerchandiseSubcategory;
  basePrice: number; // in INR (₹) or standard units
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  image: string;
  galleryImages: string[];
  isFeatured?: boolean;
  isMicroLot?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;

  // Specialty Coffee Specifics
  origin?: string; // e.g. "Yirgacheffe, Ethiopia"
  region?: string;
  farm?: string;
  elevationMASL?: string; // e.g. "1,950 - 2,200 MASL"
  varietal?: string; // e.g. "Heirloom, Bourbon"
  process?: 'Washed' | 'Natural' | 'Honey' | 'Anaerobic Ferment' | 'Charcoal Roasted';
  roastLevel?: RoastLevel;
  harvestDate?: string;
  tastingNotes: string[]; // e.g. ["Bergamot", "Peach Blossom", "Meyer Lemon"]
  tasteProfile?: TasteProfile;

  // Tea Specifics
  teaGrade?: string; // e.g. "Ceremonial Grade, First Flush"
  teaCultivar?: string; // e.g. "Okumidori", "Yabukita"
  teaHarvestSeason?: string; // e.g. "Spring 2026"

  // Details & Story
  description: string;
  roasterStory: string;
  brewGuide?: BrewGuide;
  availableGrinds: GrindOption[];
  weightOptions: WeightOption[];
  reviews: ProductReview[];
}
