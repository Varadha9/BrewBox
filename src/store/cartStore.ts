/**
 * cartStore.ts — Global shopping cart state using Zustand.
 * Handles adding/removing items, promo codes, and price calculations.
 * Any component can call useCartStore() to read or modify the cart.
 * Zustand = lightweight state management (no Redux boilerplate needed).
 */

import { create } from 'zustand';
import { CartItem, CartPricing, GrindOption, Product, PromoCode, WeightOption } from '../types';

// Valid promo codes — in a real app these would come from a backend API
const VALID_PROMOS: Record<string, PromoCode> = {
  ROASTMASTER15: { code: 'ROASTMASTER15', discountPercentage: 15, minOrderAmount: 900, description: '15% off orders over ₹900' },
  FIRSTBREW:     { code: 'FIRSTBREW',     discountPercentage: 10, minOrderAmount: 500, description: '10% welcome discount' },
  FREESHIP:      { code: 'FREESHIP',      discountPercentage: 0,  minOrderAmount: 0,   description: 'Free delivery' },
};

const FREE_SHIPPING_THRESHOLD = 999; // Cart must exceed ₹999 for free shipping
const STANDARD_SHIPPING_FEE = 99;    // ₹99 shipping fee below threshold
const PACKAGING_FEE = 29;            // ₹29 eco nitrogen-flushed packaging
const TAX_RATE = 0.05;               // 5% GST on specialty coffee & tea

export interface CartStore {
  items: CartItem[];
  appliedPromo?: PromoCode;
  promoError?: string;

  addItem: (product: Product, grind: GrindOption, weight: WeightOption, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  clearCart: () => void;
  getPricing: () => CartPricing;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  appliedPromo: undefined,
  promoError: undefined,

  // Adds item to cart. If same product+grind+weight exists, increments quantity instead.
  // Cart item ID = `${productId}-${grind}-${weightLabel}` (unique per variant)
  addItem: (product, grind, weight, quantity = 1) => {
    const unitPrice = Math.round(product.basePrice * weight.priceMultiplier);
    const itemId = `${product.id}-${grind}-${weight.label}`;

    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.id === itemId);

      if (existingIndex > -1) {
        // Already in cart — just increase quantity
        const updated = [...state.items];
        const current = updated[existingIndex];
        const newQty = current.quantity + quantity;
        updated[existingIndex] = { ...current, quantity: newQty, totalPrice: newQty * unitPrice };
        return { items: updated };
      }

      // New item — append to cart
      const newItem: CartItem = { id: itemId, product, selectedGrind: grind, selectedWeight: weight, quantity, unitPrice, totalPrice: unitPrice * quantity };
      return { items: [...state.items, newItem] };
    });
  },

  // Removes item by filtering it out of the array
  removeItem: (itemId) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== itemId) }));
  },

  // Updates quantity; removes item if quantity drops to 0
  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) { get().removeItem(itemId); return; }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity, totalPrice: item.unitPrice * quantity } : item
      ),
    }));
  },

  // Validates promo code and checks minimum order requirement
  applyPromo: (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const promo = VALID_PROMOS[trimmed];
    if (!promo) { set({ promoError: 'Invalid promo code. Try FIRSTBREW or ROASTMASTER15' }); return false; }

    const subtotal = get().items.reduce((sum, item) => sum + item.totalPrice, 0);
    if (subtotal < promo.minOrderAmount) { set({ promoError: `Requires minimum order of ₹${promo.minOrderAmount}` }); return false; }

    set({ appliedPromo: promo, promoError: undefined });
    return true;
  },

  removePromo: () => set({ appliedPromo: undefined, promoError: undefined }),

  // Empties cart after successful checkout
  clearCart: () => set({ items: [], appliedPromo: undefined, promoError: undefined }),

  // Calculates the full price breakdown: subtotal → discount → shipping → tax → total
  getPricing: () => {
    const { items, appliedPromo } = get();
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

    let discountAmount = 0;
    if (appliedPromo && appliedPromo.code !== 'FREESHIP') {
      discountAmount = Math.round((subtotal * appliedPromo.discountPercentage) / 100);
    }

    const isFreeShippingEligible = subtotal >= FREE_SHIPPING_THRESHOLD || appliedPromo?.code === 'FREESHIP';
    const shippingFee = subtotal === 0 || isFreeShippingEligible ? 0 : STANDARD_SHIPPING_FEE;
    const packagingFee = subtotal > 0 ? PACKAGING_FEE : 0;
    const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(taxableAmount * TAX_RATE);
    const total = Math.max(0, taxableAmount + shippingFee + packagingFee + taxAmount);

    return { subtotal, discountAmount, appliedPromo, shippingFee, freeShippingThreshold: FREE_SHIPPING_THRESHOLD, amountNeededForFreeShipping, isFreeShippingEligible, packagingFee, taxAmount, total };
  },

  // Returns total item count (sum of all quantities) — used for cart badge
  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
