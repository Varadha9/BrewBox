// CartItem is imported because an Order contains the items that were in the cart at checkout.
import { CartItem } from './cart';

// ── OrderStatus ───────────────────────────────────────────────────────────────
// The 5 stages of BrewBox's roastery order fulfillment pipeline.
// Each stage corresponds to a step in the live order tracking UI.
export type OrderStatus =
  | 'placed'      // Order confirmed, green beans allocated
  | 'roasting'    // Beans are being roasted on the Loring S15 Kestrel
  | 'packed'      // Degassed and sealed in nitrogen-flushed valve bags
  | 'dispatched'  // Handed to temperature-controlled courier
  | 'delivered';  // Delivered to the customer's doorstep

// ── OrderTrackingStep ─────────────────────────────────────────────────────────
// Represents a single step in the 5-stage order tracking timeline.
// The OrderHistoryScreen renders these as a vertical progress timeline.
export interface OrderTrackingStep {
  status: OrderStatus;   // Which stage this step represents
  label: string;         // Primary step title (e.g. "Small-Batch Roasting on Loring S15")
  sublabel: string;      // Secondary description shown below the label
  completed: boolean;    // True = this step has been completed (shown with a filled circle)
  timestamp?: string;    // Optional: time this step was completed (e.g. "11:15 AM")
}

// ── ShippingAddress ───────────────────────────────────────────────────────────
// A delivery address saved in the user's address book.
export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;  // True = this address is pre-selected at checkout
}

// ── PaymentMethodType ─────────────────────────────────────────────────────────
// The 4 payment methods available at checkout.
// In a real app, these would integrate with Razorpay's native SDK.
export type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'cod';

// ── Order ─────────────────────────────────────────────────────────────────────
// Represents a completed order — created by userStore.createOrderFromCart().
// Displayed in the OrderHistoryScreen with the 5-stage tracking timeline.
export interface Order {
  id: string;                    // Internal unique ID (e.g. "ord-1718234567890")
  orderNumber: string;           // Human-readable order number (e.g. "BB-2026-4821")
  createdAt: string;             // When the order was placed (e.g. "Today, 10:30 AM")
  estimatedDelivery: string;     // Estimated delivery window (e.g. "Within 2 business days")
  items: CartItem[];             // Snapshot of cart items at the time of checkout
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;           // Current stage in the fulfillment pipeline
  currentStepIndex: number;      // Index of the active step (0-4) in the steps array
  steps: OrderTrackingStep[];    // The 5-stage tracking pipeline steps
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodType;
  roastBatchId?: string;         // e.g. "LOT-IDIDO-0428" — the roasting batch reference
  roastDate?: string;            // When the beans were/will be roasted
}
