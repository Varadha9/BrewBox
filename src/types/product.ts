// ── Product Category Types ────────────────────────────────────────────────────
// TypeScript union types restrict values to only valid options.
// This prevents typos like 'coffe' or 'Tea' — TypeScript will catch them at compile time.

// The 4 top-level product categories in the BrewBox catalog.
export type ProductCategory =
  | 'coffee'
  | 'tea'
  | 'equipment'
  | 'merchandise';

// Subcategories for coffee products (used for filtering and display).
export type CoffeeSubcategory =
  | 'single-origin'
  | 'blend'
  | 'espresso'
  | 'cold-brew'
  | 'decaf';

// Subcategories for tea products.
export type TeaSubcategory =
  | 'matcha'
  | 'oolong'
  | 'black'
  | 'green'
  | 'herbal';

// Subcategories for brewing equipment.
export type EquipmentSubcategory =
  | 'pourover'
  | 'french-press'
  | 'grinder'
  | 'scale'
  | 'kettle';

// Subcategories for merchandise.
export type MerchandiseSubcategory =
  | 'merchandise'
  | 'ceramic'
  | 'apparel';

// The 5 roast levels used by the RoastMeter component and filter system.
// Ordered from lightest to darkest roast.
export type RoastLevel =
  | 'Light'
  | 'Medium-Light'
  | 'Medium'
  | 'Medium-Dark'
  | 'Dark';

// The 7 grind options available for coffee products.
// These map directly to the GrindSelector component's options.
export type GrindOption =
  | 'Whole Bean'
  | 'Espresso (Fine)'
  | 'Moka Pot'
  | 'Aeropress'
  | 'Pour Over / V60 (Medium)'
  | 'French Press (Coarse)'
  | 'Cold Brew (Extra Coarse)';

// ── TasteProfile ──────────────────────────────────────────────────────────────
// Represents the sensory attributes of a coffee or tea on a 1-5 scale.
// Displayed visually by the TasteProfileBar component as segmented bar charts.
export interface TasteProfile {
  acidity: number;    // 1 = low acidity (dark roast), 5 = high acidity (light roast)
  sweetness: number;  // 1 = dry/bitter, 5 = naturally sweet
  body: number;       // 1 = tea-like/light, 5 = syrupy/heavy mouthfeel
  bitterness: number; // 1 = no bitterness, 5 = intense bitterness
}

// ── BrewGuide ─────────────────────────────────────────────────────────────────
// A step-by-step brewing recipe attached to each coffee/tea product.
// Displayed in the ProductDetailsScreen as a dial-in extraction guide.
export interface BrewGuide {
  method: string;              // e.g. "Hario V60 Pour Over"
  coffeeGrams: number;         // Amount of coffee to use in grams
  waterGrams: number;          // Amount of water in grams
  ratio: string;               // e.g. "1:16.6" (coffee:water ratio)
  grindRecommended: string;    // Descriptive grind size (e.g. "like kosher salt")
  temperatureCelsius: number;  // Ideal water temperature in °C
  brewTimeSeconds: number;     // Total brew time in seconds
  steps: string[];             // Ordered array of step-by-step instructions
}

// ── ProductReview ─────────────────────────────────────────────────────────────
// A single customer review attached to a product.
export interface ProductReview {
  id: string;
  author: string;
  rating: number;           // 1-5 star rating
  date: string;             // Relative date string (e.g. "2 days ago")
  comment: string;
  verifiedBuyer: boolean;   // True if the reviewer actually purchased the product
  brewMethodUsed?: string;  // Optional: what brewing method they used
}

// ── WeightOption ──────────────────────────────────────────────────────────────
// Represents a package size option for a product (e.g. 250g, 500g, 1kg).
// priceMultiplier is applied to basePrice to calculate the price for each size.
export interface WeightOption {
  weightGrams: number;      // Weight in grams (0 for non-coffee items like equipment)
  label: string;            // Display label: "250g Bag", "500g Bag", "1kg Bulk Roaster Pack"
  priceMultiplier: number;  // 1 = base price, 1.85 = 500g price, 3.4 = 1kg price
}

// ── Product ───────────────────────────────────────────────────────────────────
// The main product interface — describes every item in the BrewBox catalog.
// This is the most important type in the app; it's used by every screen and component.
export interface Product {
  id: string;          // Unique identifier (e.g. 'prod-ethiopia-idido')
  name: string;        // Full product name
  tagline: string;     // Short marketing description shown on cards
  category: ProductCategory;
  subcategory: CoffeeSubcategory | TeaSubcategory | EquipmentSubcategory | MerchandiseSubcategory;
  basePrice: number;       // Price in INR (₹) for the smallest/default size
  originalPrice?: number;  // Optional: original price before discount (for strikethrough display)
  currency: string;        // Currency symbol (e.g. '₹')
  rating: number;          // Average rating (e.g. 4.9)
  reviewCount: number;     // Total number of reviews
  image: string;           // Primary product image URL
  galleryImages: string[]; // Additional gallery image URLs for the details screen
  isFeatured?: boolean;    // Show in the "Featured" section on the Home screen
  isMicroLot?: boolean;    // Show the "Micro-Lot" badge on the product card
  isBestSeller?: boolean;  // Show the "Best Seller" badge
  inStock: boolean;        // Controls whether the "Add to Cart" button is enabled

  // ── Specialty Coffee Specifics ─────────────────────────────────────────────
  // These fields are only populated for coffee products.
  origin?: string;        // e.g. "Gedeo Zone, Yirgacheffe, Ethiopia"
  region?: string;        // Sub-region or cooperative name
  farm?: string;          // Specific farm or estate name
  elevationMASL?: string; // Farm altitude in Meters Above Sea Level (e.g. "2,050 - 2,200 MASL")
  varietal?: string;      // Coffee cultivar (e.g. "Heirloom, Bourbon, Geisha")
  process?: 'Washed' | 'Natural' | 'Honey' | 'Anaerobic Ferment' | 'Charcoal Roasted';
  roastLevel?: RoastLevel;
  harvestDate?: string;
  tastingNotes: string[];         // Flavor descriptors (e.g. ["Bergamot", "Peach", "Jasmine"])
  tasteProfile?: TasteProfile;    // Numeric sensory scores for the TasteProfileBar

  // ── Tea Specifics ──────────────────────────────────────────────────────────
  teaGrade?: string;         // e.g. "Ceremonial Grade, First Flush"
  teaCultivar?: string;      // Tea plant cultivar (e.g. "Okumidori")
  teaHarvestSeason?: string; // e.g. "Spring 2026"

  // ── Details & Story ────────────────────────────────────────────────────────
  description: string;          // Full product description shown on the details screen
  roasterStory: string;         // The roaster's personal notes about this lot
  brewGuide?: BrewGuide;        // Optional step-by-step brewing recipe
  availableGrinds: GrindOption[]; // Which grind options are available for this product
  weightOptions: WeightOption[];  // Available package sizes with price multipliers
  reviews: ProductReview[];       // Customer reviews
}
