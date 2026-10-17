import { create } from 'zustand';
import { CartItem, CartPricing, GrindOption, Product, PromoCode, WeightOption } from '../types';

const VALID_PROMOS: Record<string, PromoCode> = {
  ROASTMASTER15: {
    code: 'ROASTMASTER15',
    discountPercentage: 15,
    minOrderAmount: 900,
    description: '15% off orders over ₹900',
  },
  FIRSTBREW: {
    code: 'FIRSTBREW',
    discountPercentage: 10,
    minOrderAmount: 500,
    description: '10% welcome discount for new coffee lovers',
  },
  FREESHIP: {
    code: 'FREESHIP',
    discountPercentage: 0,
    minOrderAmount: 0,
    description: 'Complimentary Roaster Express Delivery',
  },
};

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 99;
const PACKAGING_FEE = 29; // eco-friendly nitrogen-flushed valve packaging
const TAX_RATE = 0.05; // 5% GST on specialty coffee & tea

export interface CartStore {
  items: CartItem[];
  appliedPromo?: PromoCode;
  promoError?: string;

  // Actions
  addItem: (product: Product, grind: GrindOption, weight: WeightOption, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  clearCart: () => void;

  // Computations
  getPricing: () => CartPricing;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  appliedPromo: undefined,
  promoError: undefined,

  addItem: (product, grind, weight, quantity = 1) => {
    const unitPrice = Math.round(product.basePrice * weight.priceMultiplier);
    const itemId = `${product.id}-${grind}-${weight.label}`;

    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.id === itemId);

      if (existingIndex > -1) {
        const updated = [...state.items];
        const current = updated[existingIndex];
        const newQty = current.quantity + quantity;
        updated[existingIndex] = {
          ...current,
          quantity: newQty,
          totalPrice: newQty * unitPrice,
        };
        return { items: updated };
      }

      const newItem: CartItem = {
        id: itemId,
        product,
        selectedGrind: grind,
        selectedWeight: weight,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
      };

      return { items: [...state.items, newItem] };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              totalPrice: item.unitPrice * quantity,
            }
          : item
      ),
    }));
  },

  applyPromo: (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const promo = VALID_PROMOS[trimmed];

    if (!promo) {
      set({ promoError: 'Invalid promo code. Try FIRSTBREW or ROASTMASTER15' });
      return false;
    }

    const subtotal = get().items.reduce((sum, item) => sum + item.totalPrice, 0);
    if (subtotal < promo.minOrderAmount) {
      set({
        promoError: `Requires a minimum order of ₹${promo.minOrderAmount}`,
      });
      return false;
    }

    set({ appliedPromo: promo, promoError: undefined });
    return true;
  },

  removePromo: () => {
    set({ appliedPromo: undefined, promoError: undefined });
  },

  clearCart: () => {
    set({ items: [], appliedPromo: undefined, promoError: undefined });
  },

  getPricing: () => {
    const { items, appliedPromo } = get();
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

    let discountAmount = 0;
    if (appliedPromo) {
      if (appliedPromo.code === 'FREESHIP') {
        discountAmount = 0;
      } else {
        discountAmount = Math.round((subtotal * appliedPromo.discountPercentage) / 100);
      }
    }

    const isFreeShippingEligible = subtotal >= FREE_SHIPPING_THRESHOLD || appliedPromo?.code === 'FREESHIP';
    const shippingFee = subtotal === 0 || isFreeShippingEligible ? 0 : STANDARD_SHIPPING_FEE;
    const packagingFee = subtotal > 0 ? PACKAGING_FEE : 0;
    const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(taxableAmount * TAX_RATE);
    const total = Math.max(0, taxableAmount + shippingFee + packagingFee + taxAmount);

    return {
      subtotal,
      discountAmount,
      appliedPromo,
      shippingFee,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      amountNeededForFreeShipping,
      isFreeShippingEligible,
      packagingFee,
      taxAmount,
      total,
    };
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
