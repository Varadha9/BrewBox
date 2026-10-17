import { GrindOption, Product, WeightOption } from './product';

export interface CartItem {
  id: string; // unique cart item id: `${product.id}-${grind}-${weight.label}`
  product: Product;
  selectedGrind: GrindOption;
  selectedWeight: WeightOption;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PromoCode {
  code: string;
  discountPercentage: number;
  minOrderAmount: number;
  description: string;
}

export interface CartPricing {
  subtotal: number;
  discountAmount: number;
  appliedPromo?: PromoCode;
  shippingFee: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  isFreeShippingEligible: boolean;
  packagingFee: number;
  taxAmount: number;
  total: number;
}
