/**
 * userStore.ts — Global reactive state for user registration, authentication,
 * active user profile, shipping addresses, taste preferences, and orders.
 *
 * All credentials & passwords are stored locally in state.
 * Unauthenticated users must sign up or sign in to enter BrewBox.
 */

import { create } from 'zustand';
import {
  CartItem,
  GrindOption,
  Order,
  OrderTrackingStep,
  PaymentMethodType,
  RegisteredUser,
  ShippingAddress,
  UserProfile,
  UserTasteProfile,
} from '../types';

// ── Profile Factory ──────────────────────────────────────────────────────────
// Generates a clean UserProfile for a newly registered user (NO default mock data)
export const createProfileForUser = (user: {
  id: string;
  name: string;
  email: string;
  phone: string;
}): UserProfile => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  memberTier: 'Artisan Bronze',
  memberPoints: 0,              // Starts at 0 points (earned from real orders)
  tasteProfile: null,           // Not calibrated until user takes Coffee Quiz
  addresses: [],                // Empty until user saves an address
  defaultGrindPreference: null, // Not set until user chooses one
});

// ── UserStore Interface ───────────────────────────────────────────────────────
export interface UserStore {
  // Locally stored user registrations (password stored locally in memory)
  registeredUsers: RegisteredUser[];

  // Session state: false by default — user MUST sign up or sign in
  isAuthenticated: boolean;

  // Active logged-in user profile (null when signed out)
  profile: UserProfile | null;

  // Order history for the current session
  orders: Order[];

  // ── Authentication Actions ──
  signup: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => { success: boolean; error?: string };

  login: (
    email: string,
    password: string
  ) => { success: boolean; error?: string };

  logout: () => void;

  // ── Profile & Address Actions ──
  updateTasteProfile: (profile: Partial<UserTasteProfile>) => void;
  setDefaultGrindPreference: (grind: GrindOption) => void;
  addAddress: (address: Omit<ShippingAddress, 'id'>) => void;
  setDefaultAddress: (addressId: string) => void;

  // ── Order Creation ──
  createOrderFromCart: (
    items: CartItem[],
    subtotal: number,
    discount: number,
    shipping: number,
    tax: number,
    total: number,
    paymentMethod: PaymentMethodType,
    deliveryAddress?: ShippingAddress
  ) => Order;
}

// ── useUserStore Implementation ──────────────────────────────────────────────
export const useUserStore = create<UserStore>((set, get) => ({
  registeredUsers: [],
  isAuthenticated: false, // Default: NOT authenticated — user must sign up/in
  profile: null,          // Default: No active account loaded
  orders: [],             // Fresh order list

  // ── signup ──────────────────────────────────────────────────────────────────
  // Saves user details and password locally. Automatically signs in the new user.
  signup: ({ name, email, phone, password }) => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    // Check if user already exists locally
    const existing = get().registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (existing) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in.',
      };
    }

    const newUser: RegisteredUser = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: password, // Stored locally only
      createdAt: new Date().toISOString(),
    };

    const newProfile = createProfileForUser(newUser);

    set((state) => ({
      registeredUsers: [...state.registeredUsers, newUser],
      profile: newProfile,
      isAuthenticated: true,
      orders: [],
    }));

    return { success: true };
  },

  // ── login ───────────────────────────────────────────────────────────────────
  // Validates email and password against locally registered accounts.
  login: (email, password) => {
    const cleanEmail = email.toLowerCase().trim();
    const user = get().registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!user) {
      return {
        success: false,
        error: 'No account found with this email. Please sign up first.',
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please verify and try again.',
      };
    }

    const activeProfile = createProfileForUser(user);

    set({
      profile: activeProfile,
      isAuthenticated: true,
    });

    return { success: true };
  },

  // ── logout ──────────────────────────────────────────────────────────────────
  // Resets session state. User must sign in or sign up again to re-enter.
  logout: () => {
    set({
      profile: null,
      isAuthenticated: false,
    });
  },

  // ── updateTasteProfile ──────────────────────────────────────────────────────
  updateTasteProfile: (newProfile) => {
    set((state) => {
      if (!state.profile) return state;
      const baseTaste: UserTasteProfile = state.profile.tasteProfile || {
        preferredRoast: ['Medium-Light'],
        preferredBrewMethods: ['Hario V60'],
        tasteLeaning: 'Balanced & Sweet',
        milkPreference: 'Black / Straight',
        cupFrequencyDaily: 2,
      };
      return {
        profile: {
          ...state.profile,
          tasteProfile: {
            ...baseTaste,
            ...newProfile,
          },
        },
      };
    });
  },

  // ── setDefaultGrindPreference ───────────────────────────────────────────────
  setDefaultGrindPreference: (grind) => {
    set((state) => {
      if (!state.profile) return state;
      return {
        profile: {
          ...state.profile,
          defaultGrindPreference: grind,
        },
      };
    });
  },

  // ── addAddress ──────────────────────────────────────────────────────────────
  addAddress: (addressData) => {
    const newAddress: ShippingAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    set((state) => {
      if (!state.profile) return state;
      return {
        profile: {
          ...state.profile,
          addresses: [...state.profile.addresses, newAddress],
        },
      };
    });
  },

  // ── setDefaultAddress ───────────────────────────────────────────────────────
  setDefaultAddress: (addressId) => {
    set((state) => {
      if (!state.profile) return state;
      return {
        profile: {
          ...state.profile,
          addresses: state.profile.addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === addressId,
          })),
        },
      };
    });
  },

  // ── createOrderFromCart ─────────────────────────────────────────────────────
  createOrderFromCart: (
    items,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    paymentMethod,
    deliveryAddress
  ) => {
    const currentProfile = get().profile;
    const defaultAddr: ShippingAddress =
      deliveryAddress ||
      currentProfile?.addresses.find((a) => a.isDefault) ||
      currentProfile?.addresses[0] || {
        id: `addr-${Date.now()}`,
        fullName: currentProfile?.name || 'Roastery Member',
        phone: currentProfile?.phone || '+91 98765 43210',
        street: 'Express Roastery Pickup',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        isDefault: true,
      };

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
      status: 'placed',
      currentStepIndex: 0,
      steps,
      shippingAddress: defaultAddr,
      paymentMethod,
      roastBatchId: `BATCH-${randomSuffix}`,
      roastDate: 'Scheduled Fresh',
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
      profile: state.profile
        ? {
            ...state.profile,
            memberPoints:
              state.profile.memberPoints + Math.round(total / 10),
          }
        : null,
    }));

    return newOrder;
  },
}));
