// create is Zustand's store factory — creates a global reactive state store.
import { create } from 'zustand';

// We import all the TypeScript types needed to describe the user's data.
import {
  CartItem,
  Order,
  OrderTrackingStep,
  PaymentMethodType,
  ShippingAddress,
  UserProfile,
  UserTasteProfile,
} from '../types';

// ── Seed Data: Default Shipping Address ──────────────────────────────────────
// Pre-populated address for the demo user profile.
// In a real app, this would come from a backend database.
const INITIAL_ADDRESS: ShippingAddress = {
  id: 'addr-1',
  fullName: 'Varad Mandhare',
  phone: '+91 98765 43210',
  street: 'Flat 402, Roastery Apartments, 12th Main Indiranagar',
  city: 'Bengaluru',
  state: 'Karnataka',
  postalCode: '560038',
  isDefault: true,
};

// ── Seed Data: Default User Profile ──────────────────────────────────────────
// Pre-populated user profile shown in the Profile/Palate screen.
// memberTier and memberPoints simulate a loyalty rewards system.
// tasteProfile stores the user's preferences set via the Palate Matcher Quiz.
const INITIAL_PROFILE: UserProfile = {
  id: 'usr-101',
  name: 'Varad Mandhare',
  email: 'varad@brewbox.craft',
  phone: '+91 98765 43210',
  memberTier: 'Roastery Gold',   // Loyalty tier: Bronze → Gold → Connoisseur Black
  memberPoints: 480,              // Points earned from past orders (₹10 spent = 1 point)
  tasteProfile: {
    preferredRoast: ['Light', 'Medium-Light'],
    preferredBrewMethods: ['Hario V60', 'AeroPress'],
    tasteLeaning: 'Bright & Fruity',
    milkPreference: 'Black / Straight',
    cupFrequencyDaily: 3,
  },
  addresses: [INITIAL_ADDRESS],
  defaultGrindPreference: 'Pour Over / V60 (Medium)',
};

// ── Seed Data: Pre-existing Order ────────────────────────────────────────────
// A sample order in "roasting" status to demonstrate the 5-stage order tracking UI.
// This shows the jury how the live order tracking pipeline looks with real data.
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8831',
    orderNumber: 'BB-2026-8831',
    createdAt: 'Today, 10:30 AM',
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    items: [
      {
        id: 'sample-cart-item-1',
        product: {
          id: 'prod-ethiopia-idido',
          name: 'Ethiopia Yirgacheffe Idido',
          tagline: 'Anaerobic Natural Micro-Lot with Wild Jasmine & Meyer Lemon',
          category: 'coffee',
          subcategory: 'single-origin',
          basePrice: 720,
          currency: '₹',
          rating: 4.9,
          reviewCount: 142,
          image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
          galleryImages: [],
          inStock: true,
          tastingNotes: ['Bergamot', 'Wild Jasmine', 'Ripe Peach'],
          description: 'A breathtaking micro-lot from Idido.',
          roasterStory: 'Roasted on Loring S15 Kestrel.',
          availableGrinds: ['Whole Bean', 'Pour Over / V60 (Medium)'],
          weightOptions: [{ weightGrams: 250, label: '250g Bag', priceMultiplier: 1 }],
          reviews: [],
        },
        selectedGrind: 'Pour Over / V60 (Medium)',
        selectedWeight: { weightGrams: 250, label: '250g Bag', priceMultiplier: 1 },
        quantity: 1,
        unitPrice: 720,
        totalPrice: 720,
      },
    ],
    subtotal: 720,
    discount: 0,
    shipping: 99,
    tax: 36,
    total: 855,
    status: 'roasting',       // Current stage in the 5-step pipeline
    currentStepIndex: 1,      // Index 1 = "Small-Batch Roasting" step is active
    steps: [
      {
        status: 'placed',
        label: 'Order Placed & Green Beans Allocated',
        sublabel: 'Batch #428 reserved at Roastery',
        completed: true,
        timestamp: '10:30 AM',
      },
      {
        status: 'roasting',
        label: 'Small-Batch Roasting on Loring S15',
        sublabel: 'Master Roaster dialing development profile',
        completed: true,
        timestamp: '11:15 AM',
      },
      {
        status: 'packed',
        label: 'Degassing & Nitrogen Valve Sealed',
        sublabel: 'Guaranteed peak freshness preservation',
        completed: false,
      },
      {
        status: 'dispatched',
        label: 'Dispatched via Temperature-Controlled Courier',
        sublabel: 'Fast express door-to-door transit',
        completed: false,
      },
      {
        status: 'delivered',
        label: 'Delivered to Your Doorstep',
        sublabel: 'Ready for grinding and brewing',
        completed: false,
      },
    ],
    shippingAddress: INITIAL_ADDRESS,
    paymentMethod: 'upi',
    roastBatchId: 'LOT-IDIDO-0428',
    roastDate: 'Roasted Today',
  },
];

// ── UserStore Interface ───────────────────────────────────────────────────────
// Defines the shape of the user store: profile data, order history, and actions.
export interface UserStore {
  profile: UserProfile;  // The logged-in user's profile and taste preferences
  orders: Order[];       // Full order history (newest first)

  // updateTasteProfile: saves the user's quiz results from the Palate Matcher.
  // Uses Partial<UserTasteProfile> so only changed fields need to be passed.
  updateTasteProfile: (profile: Partial<UserTasteProfile>) => void;

  // addAddress: adds a new shipping address to the user's address book.
  addAddress: (address: Omit<ShippingAddress, 'id'>) => void;

  // setDefaultAddress: marks one address as the default for checkout.
  setDefaultAddress: (addressId: string) => void;

  // createOrderFromCart: the most important action — converts the cart into a new Order.
  // Called by CheckoutScreen after payment confirmation.
  // Returns the newly created Order object so the app can navigate to order tracking.
  createOrderFromCart: (
    items: CartItem[],
    subtotal: number,
    discount: number,
    shipping: number,
    tax: number,
    total: number,
    paymentMethod: PaymentMethodType
  ) => Order;
}

// ── useUserStore ──────────────────────────────────────────────────────────────
// The Zustand store for user profile, taste preferences, and order history.
export const useUserStore = create<UserStore>((set, get) => ({
  profile: INITIAL_PROFILE,
  orders: INITIAL_ORDERS,

  // ── updateTasteProfile ──────────────────────────────────────────────────────
  // Merges new taste preference values into the existing tasteProfile.
  // The spread operator (...) ensures we only overwrite the fields that changed.
  updateTasteProfile: (newProfile) => {
    set((state) => ({
      profile: {
        ...state.profile,
        tasteProfile: {
          ...state.profile.tasteProfile,
          ...newProfile,
        },
      },
    }));
  },

  // ── addAddress ──────────────────────────────────────────────────────────────
  // Creates a new address with a unique ID (using Date.now() as a simple unique key)
  // and appends it to the user's address list.
  addAddress: (addressData) => {
    const newAddress: ShippingAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    set((state) => ({
      profile: {
        ...state.profile,
        addresses: [...state.profile.addresses, newAddress],
      },
    }));
  },

  // ── setDefaultAddress ───────────────────────────────────────────────────────
  // Maps over all addresses and sets isDefault = true only for the matching ID.
  // All other addresses get isDefault = false.
  setDefaultAddress: (addressId) => {
    set((state) => ({
      profile: {
        ...state.profile,
        addresses: state.profile.addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        })),
      },
    }));
  },

  // ── createOrderFromCart ─────────────────────────────────────────────────────
  // Converts the current cart into a new Order with a 5-stage tracking pipeline.
  // This is called when the user confirms payment on the Checkout screen.
  // After creation, the order is prepended to the orders array (newest first).
  // The user also earns loyalty points: 1 point per ₹10 spent.
  createOrderFromCart: (
    items,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    paymentMethod
  ) => {
    // Find the user's default shipping address for this order
    const defaultAddr =
      get().profile.addresses.find((a) => a.isDefault) || get().profile.addresses[0];

    // Build the 5-stage roastery tracking pipeline.
    // Only the first step (placed) is marked completed = true at order creation.
    const steps: OrderTrackingStep[] = [
      {
        status: 'placed',
        label: 'Order Placed & Green Beans Allocated',
        sublabel: 'Reserved at roastery queue',
        completed: true,
        timestamp: 'Just now',
      },
      {
        status: 'roasting',
        label: 'Small-Batch Roasting on Loring S15',
        sublabel: 'Scheduled for next roasting run',
        completed: false,
      },
      {
        status: 'packed',
        label: 'Degassing & Nitrogen Valve Sealed',
        sublabel: 'Aroma lock packaging',
        completed: false,
      },
      {
        status: 'dispatched',
        label: 'Dispatched via Express Roaster Courier',
        sublabel: 'Tracking ID will be SMS notified',
        completed: false,
      },
      {
        status: 'delivered',
        label: 'Delivered Fresh to Your Doorstep',
        sublabel: 'Optimal brewing 5-14 days from roast',
        completed: false,
      },
    ];

    // Generate a random 4-digit suffix for the order number (e.g. BB-2026-4821)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `BB-2026-${randomSuffix}`,
      createdAt: 'Just now',
      estimatedDelivery: 'Within 2 business days',
      items: [...items],
      subtotal,
      discount,
      shipping,
      tax,
      total,
      status: 'placed',       // New orders always start at the "placed" stage
      currentStepIndex: 0,    // Index 0 = first step is active
      steps,
      shippingAddress: defaultAddr,
      paymentMethod,
      roastBatchId: `BATCH-${randomSuffix}`,
      roastDate: 'Scheduled Fresh',
    };

    set((state) => ({
      orders: [newOrder, ...state.orders], // Prepend new order (newest first)
      profile: {
        ...state.profile,
        // Award loyalty points: 1 point per ₹10 spent (Math.round for whole numbers)
        memberPoints: state.profile.memberPoints + Math.round(total / 10),
      },
    }));

    return newOrder; // Return the order so CheckoutScreen can navigate to tracking
  },
}));
