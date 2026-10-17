import { create } from 'zustand';
import {
  CartItem,
  Order,
  OrderTrackingStep,
  PaymentMethodType,
  ShippingAddress,
  UserProfile,
  UserTasteProfile,
} from '../types';

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

const INITIAL_PROFILE: UserProfile = {
  id: 'usr-101',
  name: 'Varad Mandhare',
  email: 'varad@brewbox.craft',
  phone: '+91 98765 43210',
  memberTier: 'Roastery Gold',
  memberPoints: 480,
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
    status: 'roasting',
    currentStepIndex: 1,
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

export interface UserStore {
  profile: UserProfile;
  orders: Order[];

  updateTasteProfile: (profile: Partial<UserTasteProfile>) => void;
  addAddress: (address: Omit<ShippingAddress, 'id'>) => void;
  setDefaultAddress: (addressId: string) => void;
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

export const useUserStore = create<UserStore>((set, get) => ({
  profile: INITIAL_PROFILE,
  orders: INITIAL_ORDERS,

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

  createOrderFromCart: (
    items,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    paymentMethod
  ) => {
    const defaultAddr =
      get().profile.addresses.find((a) => a.isDefault) || get().profile.addresses[0];

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
      profile: {
        ...state.profile,
        memberPoints: state.profile.memberPoints + Math.round(total / 10),
      },
    }));

    return newOrder;
  },
}));
