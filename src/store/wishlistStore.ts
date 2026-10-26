// create is Zustand's store factory function.
// It creates a globally accessible reactive state store with zero boilerplate.
import { create } from 'zustand';

// Product is the TypeScript interface that describes a single catalog item.
import { Product } from '../types';

// ── WishlistStore Interface ───────────────────────────────────────────────────
// Defines the shape of the wishlist store: what it holds and what it can do.
export interface WishlistStore {
  items: Product[];  // Array of products the user has saved/hearted

  // toggleWishlist: adds the product if not saved, removes it if already saved.
  // This single function handles both "save" and "unsave" actions.
  toggleWishlist: (product: Product) => void;

  // isInWishlist: returns true/false for a given product ID.
  // Used by ProductCard to decide whether to show a filled or outline heart icon.
  isInWishlist: (productId: string) => boolean;

  // clearWishlist: removes all saved items — used for account reset.
  clearWishlist: () => void;
}

// ── useWishlistStore ──────────────────────────────────────────────────────────
// The Zustand store for the user's wishlist (saved/favorited products).
// Any component can call useWishlistStore() to read or modify the wishlist.
export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [], // Start with an empty wishlist

  // ── toggleWishlist ──────────────────────────────────────────────────────────
  // Checks if the product is already in the wishlist:
  //   - If YES → filter it out (remove)
  //   - If NO  → append it (add)
  // This toggle pattern avoids needing separate addToWishlist / removeFromWishlist functions.
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

  // ── isInWishlist ────────────────────────────────────────────────────────────
  // O(n) lookup — checks if any item in the wishlist matches the given productId.
  // Called on every ProductCard render to show the correct heart icon state.
  isInWishlist: (productId: string) => {
    return get().items.some((item) => item.id === productId);
  },

  // ── clearWishlist ───────────────────────────────────────────────────────────
  // Resets the wishlist to an empty array.
  clearWishlist: () => {
    set({ items: [] });
  },
}));
