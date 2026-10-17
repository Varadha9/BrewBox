import { create } from 'zustand';
import { ProductCategory, RoastLevel } from '../types';

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating';

export interface FilterStore {
  searchQuery: string;
  selectedCategory: ProductCategory | 'all';
  selectedRoast: RoastLevel | 'all';
  selectedSort: SortOption;
  onlyMicroLots: boolean;
  onlyInStock: boolean;

  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: ProductCategory | 'all') => void;
  setSelectedRoast: (roast: RoastLevel | 'all') => void;
  setSelectedSort: (sort: SortOption) => void;
  toggleMicroLots: () => void;
  toggleInStock: () => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  searchQuery: '',
  selectedCategory: 'all',
  selectedRoast: 'all',
  selectedSort: 'featured',
  onlyMicroLots: false,
  onlyInStock: true,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedRoast: (selectedRoast) => set({ selectedRoast }),
  setSelectedSort: (selectedSort) => set({ selectedSort }),
  toggleMicroLots: () => set((state) => ({ onlyMicroLots: !state.onlyMicroLots })),
  toggleInStock: () => set((state) => ({ onlyInStock: !state.onlyInStock })),
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
