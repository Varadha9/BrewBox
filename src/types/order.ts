import { CartItem } from './cart';

export type OrderStatus =
  | 'placed'
  | 'roasting'
  | 'packed'
  | 'dispatched'
  | 'delivered';

export interface OrderTrackingStep {
  status: OrderStatus;
  label: string;
  sublabel: string;
  completed: boolean;
  timestamp?: string;
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'cod';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  estimatedDelivery: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  currentStepIndex: number;
  steps: OrderTrackingStep[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodType;
  roastBatchId?: string;
  roastDate?: string;
}
