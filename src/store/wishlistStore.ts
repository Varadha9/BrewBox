import { create } from 'zustand';
import { Product } from '../types';

export interface WishlistStore {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],

  toggleWishlist: (product: Product) => {
    set((state) => {
      const exists = state.items.some((item) => item.id === product.id);
      if (exists) {
        return { items: state.items.filter((item) => item.id !== product.id) };
      } else {
        return { items: [...state.items, product] };
      }
    });
  },

  isInWishlist: (productId: string) => {
    return get().items.some((item) => item.id === productId);
  },

  clearWishlist: () => {
    set({ items: [] });
  },
}));
