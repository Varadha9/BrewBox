import { useCartStore } from '../src/store/cartStore';
import { useUserStore } from '../src/store/userStore';
import { PRODUCTS } from '../src/data/products';

describe('BrewBox Cart & Business Logic Tests', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  test('should start with an empty cart and 0 count', () => {
    const store = useCartStore.getState();
    expect(store.items.length).toBe(0);
    expect(store.getItemCount()).toBe(0);
    const pricing = store.getPricing();
    expect(pricing.total).toBe(0);
    expect(pricing.subtotal).toBe(0);
  });

  test('should add a specialty coffee item with selected grind and weight', () => {
    const store = useCartStore.getState();
    const product = PRODUCTS[0]; // Ethiopia Yirgacheffe Idido (basePrice 720)
    const grind = 'Pour Over / V60 (Medium)';
    const weight = product.weightOptions[0]; // 250g, multiplier 1

    store.addItem(product, grind, weight, 1);

    const updated = useCartStore.getState();
    expect(updated.items.length).toBe(1);
    expect(updated.getItemCount()).toBe(1);
    expect(updated.items[0].product.name).toBe('Ethiopia Yirgacheffe Idido');
    expect(updated.items[0].selectedGrind).toBe(grind);
    expect(updated.items[0].unitPrice).toBe(720);

    const pricing = updated.getPricing();
    expect(pricing.subtotal).toBe(720);
    // Below ₹999 threshold -> standard shipping fee applies
    expect(pricing.isFreeShippingEligible).toBe(false);
    expect(pricing.shippingFee).toBe(99);
    expect(pricing.packagingFee).toBe(29);
  });

  test('should unlock free shipping when subtotal exceeds ₹999 threshold', () => {
    const store = useCartStore.getState();
    const product = PRODUCTS[1]; // Panama Geisha Boquete Reserve (basePrice 1650)
    const grind = 'Whole Bean';
    const weight = product.weightOptions[0];

    store.addItem(product, grind, weight, 1);

    const pricing = useCartStore.getState().getPricing();
    expect(pricing.subtotal).toBe(1650);
    expect(pricing.isFreeShippingEligible).toBe(true);
    expect(pricing.shippingFee).toBe(0);
    expect(pricing.amountNeededForFreeShipping).toBe(0);
  });

  test('should apply ROASTMASTER15 discount code correctly', () => {
    const store = useCartStore.getState();
    const product = PRODUCTS[1]; // 1650
    store.addItem(product, 'Whole Bean', product.weightOptions[0], 1);

    const applied = store.applyPromo('ROASTMASTER15');
    expect(applied).toBe(true);

    const pricing = useCartStore.getState().getPricing();
    expect(pricing.appliedPromo?.code).toBe('ROASTMASTER15');
    // 15% of 1650 = 247.5 -> 248
    expect(pricing.discountAmount).toBe(248);
  });

  test('should reject promo if minimum order amount is not met', () => {
    const store = useCartStore.getState();
    const product = PRODUCTS[3]; // Chikmagalur 520
    store.addItem(product, 'Moka Pot', product.weightOptions[0], 1);

    // ROASTMASTER15 requires ₹900 min order
    const applied = store.applyPromo('ROASTMASTER15');
    expect(applied).toBe(false);
    expect(useCartStore.getState().promoError).toContain('Requires a minimum order of ₹900');
  });

  test('should create a tracked order in userStore upon checkout', () => {
    const user = useUserStore.getState();
    const product = PRODUCTS[0];
    useCartStore.getState().addItem(product, 'Whole Bean', product.weightOptions[0], 2);

    const freshCart = useCartStore.getState();
    const pricing = freshCart.getPricing();
    const initialOrdersCount = user.orders.length;

    const newOrder = user.createOrderFromCart(
      freshCart.items,
      pricing.subtotal,
      pricing.discountAmount,
      pricing.shippingFee,
      pricing.taxAmount,
      pricing.total,
      'upi'
    );

    expect(newOrder.orderNumber).toContain('BB-2026-');
    expect(newOrder.items.length).toBe(1);
    expect(newOrder.status).toBe('placed');
    expect(newOrder.steps.length).toBe(5);

    const updatedUser = useUserStore.getState();
    expect(updatedUser.orders.length).toBe(initialOrdersCount + 1);
  });
});
