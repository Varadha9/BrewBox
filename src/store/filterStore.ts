// create is Zustand's store factory — creates a global reactive state store.
import { create } from 'zustand';

// ProductCategory and RoastLevel are TypeScript union types from our types module.
// They restrict filter values to only valid options (e.g. 'coffee' | 'tea' | 'equipment').
import { ProductCategory, RoastLevel } from '../types';

// SortOption defines the 4 valid ways to sort the product catalog.
// TypeScript union types prevent invalid sort values from being passed.
export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating';

// ── FilterStore Interface ─────────────────────────────────────────────────────
// Defines all the filter/search state and the actions to modify them.
// The ExploreScreen reads from this store to filter and sort the product list.
export interface FilterStore {
  searchQuery: string;                        // Text typed in the search bar
  selectedCategory: ProductCategory | 'all'; // Active category filter (coffee, tea, gear, etc.)
  selectedRoast: RoastLevel | 'all';          // Active roast level filter (Light, Medium, Dark, etc.)
  selectedSort: SortOption;                   // Current sort order
  onlyMicroLots: boolean;                     // Toggle: show only micro-lot exclusive products
  onlyInStock: boolean;                       // Toggle: hide out-of-stock products

  // Setter actions — each one updates a single filter field in the store
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: ProductCategory | 'all') => void;
  setSelectedRoast: (roast: RoastLevel | 'all') => void;
  setSelectedSort: (sort: SortOption) => void;
  toggleMicroLots: () => void;  // Flips the boolean (true → false, false → true)
  toggleInStock: () => void;    // Flips the boolean
  resetFilters: () => void;     // Resets all filters back to their default values
}

// ── useFilterStore ────────────────────────────────────────────────────────────
// The Zustand store for the Explore screen's search and filter state.
// When any filter changes, all components subscribed to this store re-render automatically.
export const useFilterStore = create<FilterStore>((set) => ({
  // ── Default / Initial Filter State ─────────────────────────────────────────
  searchQuery: '',           // No search text by default
  selectedCategory: 'all',  // Show all categories
  selectedRoast: 'all',      // Show all roast levels
  selectedSort: 'featured',  // Default sort: featured products first
  onlyMicroLots: false,      // Show all products (not just micro-lots)
  onlyInStock: true,         // Hide out-of-stock products by default

  // ── Setter Actions ──────────────────────────────────────────────────────────
  // Each setter uses Zustand's set() to update a single field.
  // Zustand automatically merges the new value with the existing state.
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedRoast: (selectedRoast) => set({ selectedRoast }),
  setSelectedSort: (selectedSort) => set({ selectedSort }),

  // Toggle actions flip the current boolean value using the previous state.
  toggleMicroLots: () => set((state) => ({ onlyMicroLots: !state.onlyMicroLots })),
  toggleInStock: () => set((state) => ({ onlyInStock: !state.onlyInStock })),

  // ── resetFilters ────────────────────────────────────────────────────────────
  // Resets all filter fields back to their initial default values.
  // Called when the user taps "Clear All Filters" in the Explore screen.
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedCategory: 'all',
      selectedRoast: 'all',
      selectedSort: 'featured',
      onlyMicroLots: false,
      onlyInStock: true,
    }),
}));
