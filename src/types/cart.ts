// We import the types we depend on from the product types file.
import { GrindOption, Product, WeightOption } from './product';

// ── CartItem ──────────────────────────────────────────────────────────────────
// Represents a single line item in the shopping cart.
// A CartItem is NOT just a Product — it also captures the user's specific
// grind selection, weight/size choice, quantity, and calculated prices.
export interface CartItem {
  // Unique ID for this cart line: `${product.id}-${grind}-${weight.label}`
  // This composite key ensures the same product with different grind/weight = separate cart items.
  id: string;
  product: Product;
  selectedGrind: GrindOption;    // Which grind the user selected (e.g. "Pour Over / V60")
  selectedWeight: WeightOption;  // Which package size the user selected (e.g. "250g Bag")
  quantity: number;
  unitPrice: number;             // Price per unit (basePrice × weight.priceMultiplier)
  totalPrice: number;            // unitPrice × quantity
}

// ── PromoCode ─────────────────────────────────────────────────────────────────
// Represents a promotional discount code that can be applied to the cart.
export interface PromoCode {
  code: string;                // The code string (e.g. "ROASTMASTER15")
  discountPercentage: number;  // Percentage discount (0 for FREESHIP, 15 for ROASTMASTER15)
  minOrderAmount: number;      // Minimum cart subtotal required to use this code
  description: string;         // Human-readable description shown in the cart UI
}

// ── CartPricing ───────────────────────────────────────────────────────────────
// The full price breakdown returned by cartStore.getPricing().
// This is displayed in the CartScreen and CheckoutScreen order summary.
export interface CartPricing {
  subtotal: number;                    // Sum of all item totalPrices
  discountAmount: number;              // Amount saved from the promo code
  appliedPromo?: PromoCode;            // The currently applied promo (if any)
  shippingFee: number;                 // ₹99 or ₹0 (if free shipping threshold met)
  freeShippingThreshold: number;       // ₹999 — the target for free shipping
  amountNeededForFreeShipping: number; // How much more the user needs to add to unlock free shipping
  isFreeShippingEligible: boolean;     // True if subtotal >= ₹999 or FREESHIP promo applied
  packagingFee: number;                // ₹29 eco-friendly nitrogen-flushed valve packaging
  taxAmount: number;                   // 5% GST on the discounted subtotal
  total: number;                       // Final amount: taxableAmount + shipping + packaging + tax
}
