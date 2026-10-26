// CartScreen.tsx — The shopping cart screen.
// Shows all added items, free shipping progress meter, promo code input,
// order price breakdown, and a "Proceed to Checkout" button.

import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BespokeIcon, CustomButton, FreeShippingMeter } from '../../components';
// useCartStore — all cart state: items, promo, pricing actions
import { useCartStore } from '../../store';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../theme';

interface CartScreenProps {
  navigation: any;
}

export const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const {
    items,
    appliedPromo,
    promoError,
    updateQuantity,
    removeItem,
    applyPromo,
    removePromo,
    getPricing,
  } = useCartStore();

  // promoInput = text the user types in the promo code field
  const [promoInput, setPromoInput] = useState('');
  // pricing = full breakdown object: subtotal, discount, shipping, tax, total
  const pricing = getPricing();

  // handleApplyPromo — applies either the typed code or a quick-tap chip code
  const handleApplyPromo = (codeToApply?: string) => {
    const code = codeToApply || promoInput;
    if (code.trim()) {
      const success = applyPromo(code);
      if (success) setPromoInput(''); // clear input on success
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>YOUR ROAST SELECTION</Text>
          <Text style={styles.headerTitle}>BrewBox Cart</Text>
        </View>
        {/* Total quantity count on the right */}
        <Text style={styles.itemCountText}>
          {items.reduce((sum, item) => sum + item.quantity, 0)} Items
        </Text>
      </View>

      {/* ── Empty State ── shown when cart has no items */}
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <BespokeIcon name="bag" size={48} color={Colors.light.borderStrong} />
          </View>
          <Text style={styles.emptyTitle}>Your BrewBox is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Explore our single-origin micro-lots, signature blends, and ceremonial teas to build your personalized box.
          </Text>
          <CustomButton
            title="Discover Roasts"
            onPress={() => navigation.navigate('ExploreTab')}
            size="medium"
            style={styles.emptyBtn}
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          {/* ── Free Shipping Meter ── progress bar toward ₹999 threshold */}
          <FreeShippingMeter
            subtotal={pricing.subtotal}
            freeShippingThreshold={pricing.freeShippingThreshold}
            amountNeeded={pricing.amountNeededForFreeShipping}
            isEligible={pricing.isFreeShippingEligible}
          />

          {/* ── Cart Items List ── one card per item */}
          <View style={styles.itemsList}>
            {items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                {/* Product thumbnail */}
                <Image
                  source={{ uri: item.product.image }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />

                <View style={styles.itemInfo}>
                  {/* Item name + trash button */}
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.product.name}
                    </Text>
                    <Pressable onPress={() => removeItem(item.id)} hitSlop={8}>
                      <BespokeIcon name="trash" size={16} color={Colors.light.textMuted} />
                    </Pressable>
                  </View>

                  {/* Weight and grind variant */}
                  <Text style={styles.itemVariant}>
                    {item.selectedWeight.label} • {item.selectedGrind}
                  </Text>

                  {/* Price + quantity stepper */}
                  <View style={styles.itemFooter}>
                    <Text style={styles.itemPrice}>
                      {item.product.currency}{item.unitPrice}
                    </Text>

                    {/* ── Stepper ── minus / count / plus */}
                    <View style={styles.stepper}>
                      <Pressable
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        style={styles.stepBtn}
                        hitSlop={6}
                      >
                        <BespokeIcon name="minus" size={12} color={Colors.light.textPrimary} />
                      </Pressable>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <Pressable
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        style={styles.stepBtn}
                        hitSlop={6}
                      >
                        <BespokeIcon name="plus" size={12} color={Colors.light.textPrimary} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* ── Promo Code Section ── */}
          <View style={styles.promoSection}>
            <Text style={styles.sectionTitle}>Roastery Promo Code</Text>

            {/* If a promo is already applied, show it with a remove button */}
            {appliedPromo ? (
              <View style={styles.appliedPromoBox}>
                <View style={styles.appliedPromoInfo}>
                  <BespokeIcon name="sparkles" size={18} color={Colors.light.primary} />
                  <View>
                    <Text style={styles.appliedPromoCode}>{appliedPromo.code}</Text>
                    <Text style={styles.appliedPromoDesc}>{appliedPromo.description}</Text>
                  </View>
                </View>
                {/* X button to remove the applied promo */}
                <Pressable onPress={removePromo} hitSlop={8}>
                  <BespokeIcon name="close" size={16} color={Colors.light.textMuted} />
                </Pressable>
              </View>
            ) : (
              <>
                {/* Text input + Apply button row */}
                <View style={styles.promoInputRow}>
                  <TextInput
                    value={promoInput}
                    onChangeText={setPromoInput}
                    placeholder="Enter code (e.g. ROASTMASTER15)"
                    placeholderTextColor={Colors.light.textMuted}
                    autoCapitalize="characters"
                    style={styles.promoInput}
                  />
                  <CustomButton
                    title="Apply"
                    onPress={() => handleApplyPromo()}
                    size="small"
                    variant="secondary"
                    style={styles.applyBtn}
                  />
                </View>

                {/* Error message if promo is invalid or minimum not met */}
                {promoError && <Text style={styles.promoErrorText}>{promoError}</Text>}

                {/* Quick-tap promo chips — tap to auto-apply */}
                <View style={styles.promoChipsRow}>
                  <Pressable onPress={() => handleApplyPromo('ROASTMASTER15')} style={styles.promoChip}>
                    <Text style={styles.promoChipCode}>ROASTMASTER15</Text>
                    <Text style={styles.promoChipDesc}>15% Off (min ₹900)</Text>
                  </Pressable>
                  <Pressable onPress={() => handleApplyPromo('FIRSTBREW')} style={styles.promoChip}>
                    <Text style={styles.promoChipCode}>FIRSTBREW</Text>
                    <Text style={styles.promoChipDesc}>10% Off</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>

          {/* ── Order Summary Card ── full price breakdown */}
          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Order Breakdown</Text>

            {/* Subtotal row */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{pricing.subtotal}</Text>
            </View>

            {/* Discount row — only shown if a promo is applied */}
            {pricing.discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: Colors.light.success }]}>
                  Discount ({pricing.appliedPromo?.code})
                </Text>
                <Text style={[styles.summaryValue, { color: Colors.light.success }]}>
                  -₹{pricing.discountAmount}
                </Text>
              </View>
            )}

            {/* Eco packaging fee */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Freshness Degas Packaging</Text>
              <Text style={styles.summaryValue}>₹{pricing.packagingFee}</Text>
            </View>

            {/* 5% GST */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GST (5%)</Text>
              <Text style={styles.summaryValue}>₹{pricing.taxAmount}</Text>
            </View>

            {/* Shipping — shows FREE in green if threshold met */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Roaster Express Courier</Text>
              <Text style={[styles.summaryValue, pricing.shippingFee === 0 && { color: Colors.light.success }]}>
                {pricing.shippingFee === 0 ? 'FREE' : `₹${pricing.shippingFee}`}
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Grand total */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalValue}>₹{pricing.total}</Text>
            </View>
          </View>

          {/* ── Checkout CTA ── shows total in button label */}
          <View style={styles.checkoutWrapper}>
            <CustomButton
              title={`Proceed to Roaster Checkout • ₹${pricing.total}`}
              onPress={() => navigation.navigate('Checkout')}
              size="large"
              fullWidth
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  // Top bar: title left, item count right
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    backgroundColor: Colors.light.background,
  },
  headerSubtitle: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    letterSpacing: 1.2,
  },
  headerTitle: {
    ...Typography.displaySmall,
    color: Colors.light.espresso,
  },
  itemCountText: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  // Centered empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.huge,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F3EFE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.displaySmall,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    ...Typography.bodyMedium,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  emptyBtn: {
    minWidth: 200,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  itemsList: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  // Horizontal card: image left, info right
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.soft,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F3EFE6',
  },
  itemInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'space-between',
  },
  // Name + trash icon row
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
    flex: 1,
    marginRight: Spacing.xs,
  },
  itemVariant: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  // Price + stepper row
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  itemPrice: {
    ...Typography.priceMedium,
    color: Colors.light.textPrimary,
  },
  // Stepper: minus | count | plus
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  stepBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  quantityText: {
    ...Typography.labelLarge,
    color: Colors.light.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },
  // Promo code section card
  promoSection: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sectionTitle: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
  },
  // Input + Apply button side by side
  promoInputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  promoInput: {
    flex: 1,
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: Spacing.md,
    height: 42,
    ...Typography.bodyMedium,
    color: Colors.light.textPrimary,
  },
  applyBtn: {
    minWidth: 80,
  },
  promoErrorText: {
    ...Typography.bodySmall,
    color: Colors.light.error,
    marginTop: Spacing.xs,
  },
  // Row of quick-tap promo chips
  promoChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
    marginTop: Spacing.sm,
  },
  promoChip: {
    backgroundColor: '#F9F4EB',
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#E8DCB8',
  },
  promoChipCode: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    fontWeight: '700',
  },
  promoChipDesc: {
    ...Typography.labelSmall,
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  // Applied promo row: code info + remove X
  appliedPromoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.primarySubtle,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.light.primaryLight,
  },
  appliedPromoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  appliedPromoCode: {
    ...Typography.titleSmall,
    color: Colors.light.primaryDark,
  },
  appliedPromoDesc: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    fontSize: 12,
  },
  // Order summary card
  summaryCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.soft,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs + 2,
  },
  summaryLabel: {
    ...Typography.bodyMedium,
    color: Colors.light.textSecondary,
  },
  summaryValue: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.divider,
    marginVertical: Spacing.sm + 2,
  },
  // Grand total row — larger text
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xs,
  },
  totalLabel: {
    ...Typography.titleMedium,
    color: Colors.light.espresso,
  },
  totalValue: {
    ...Typography.priceLarge,
    color: Colors.light.primaryDark,
  },
  checkoutWrapper: {
    marginTop: Spacing.xl,
  },
});
