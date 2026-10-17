import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BespokeIcon, CustomButton } from '../../components';
import { useCartStore, useUserStore } from '../../store';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../theme';
import { PaymentMethodType } from '../../types';

interface CheckoutScreenProps {
  navigation: any;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
  const { items, getPricing, clearCart } = useCartStore();
  const { profile, createOrderFromCart } = useUserStore();
  const pricing = getPricing();

  const [selectedAddressIndex] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('upi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);

  const selectedAddress = profile.addresses[selectedAddressIndex] || profile.addresses[0];

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);

    setTimeout(() => {
      const order = createOrderFromCart(
        items,
        pricing.subtotal,
        pricing.discountAmount,
        pricing.shippingFee,
        pricing.taxAmount,
        pricing.total,
        selectedPayment
      );

      clearCart();
      setIsPlacingOrder(false);
      setSuccessOrder(order);
    }, 1200);
  };

  const handleViewOrder = () => {
    const targetOrderId = successOrder?.id;
    setSuccessOrder(null);
    navigation.navigate('OrderTracking', { orderId: targetOrderId });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={8}
          style={styles.backBtn}
        >
          <BespokeIcon name="arrow-left" size={20} color={Colors.light.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Roaster Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Step 1: Shipping Address */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <BespokeIcon name="map-pin" size={18} color={Colors.light.primary} />
            </View>
            <Text style={styles.cardTitle}>Delivery Address</Text>
          </View>

          <View style={styles.addressBox}>
            <Text style={styles.addressName}>{selectedAddress.fullName}</Text>
            <Text style={styles.addressText}>{selectedAddress.street}</Text>
            <Text style={styles.addressText}>
              {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postalCode}
            </Text>
            <Text style={styles.addressPhone}>Phone: {selectedAddress.phone}</Text>
          </View>
        </View>

        {/* Step 2: Freshness Dispatch Schedule */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <BespokeIcon name="clock" size={18} color={Colors.light.primary} />
            </View>
            <Text style={styles.cardTitle}>Roasting & Dispatch Schedule</Text>
          </View>

          <View style={styles.dispatchBox}>
            <Text style={styles.dispatchHighlight}>
              Roast on Demand • Next Roaster Run: Tomorrow Morning
            </Text>
            <Text style={styles.dispatchSub}>
              Beans are degassed and nitrogen flushed into valved pouches immediately upon cooling.
            </Text>
          </View>
        </View>

        {/* Step 3: Payment Method */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <BespokeIcon name="shield" size={18} color={Colors.light.primary} />
            </View>
            <Text style={styles.cardTitle}>Payment Method</Text>
          </View>

          <View style={styles.paymentList}>
            {[
              {
                id: 'upi' as PaymentMethodType,
                title: 'UPI Fast Checkout',
                desc: 'Google Pay, PhonePe, Paytm, BHIM',
              },
              {
                id: 'card' as PaymentMethodType,
                title: 'Credit / Debit Card',
                desc: 'Visa, Mastercard, RuPay, Amex',
              },
              {
                id: 'netbanking' as PaymentMethodType,
                title: 'Net Banking',
                desc: 'All Major Indian Banks',
              },
              {
                id: 'cod' as PaymentMethodType,
                title: 'Cash on Delivery',
                desc: 'Pay upon delivery at your doorstep',
              },
            ].map((method) => {
              const isSelected = selectedPayment === method.id;
              return (
                <Pressable
                  key={method.id}
                  onPress={() => setSelectedPayment(method.id)}
                  style={[
                    styles.paymentOption,
                    isSelected && styles.paymentOptionActive,
                  ]}
                >
                  <View style={styles.paymentRadio}>
                    {isSelected && <View style={styles.paymentRadioInner} />}
                  </View>
                  <View style={styles.paymentInfo}>
                    <Text
                      style={[
                        styles.paymentTitle,
                        isSelected && styles.paymentTitleActive,
                      ]}
                    >
                      {method.title}
                    </Text>
                    <Text style={styles.paymentDesc}>{method.desc}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Order Items Review */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <BespokeIcon name="bag" size={18} color={Colors.light.primary} />
            </View>
            <Text style={styles.cardTitle}>Order Review ({items.length} items)</Text>
          </View>

          {items.map((item) => (
            <View key={item.id} style={styles.reviewItemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.reviewItemName}>{item.product.name}</Text>
                <Text style={styles.reviewItemSub}>
                  {item.selectedWeight.label} • {item.selectedGrind} • Qty: {item.quantity}
                </Text>
              </View>
              <Text style={styles.reviewItemPrice}>₹{item.totalPrice}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalAmount}>₹{pricing.total}</Text>
          </View>
        </View>

        {/* Place Order CTA */}
        <View style={styles.actionWrapper}>
          <CustomButton
            title={`Confirm & Place Roaster Order • ₹${pricing.total}`}
            onPress={handlePlaceOrder}
            loading={isPlacingOrder}
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={!!successOrder}
        animationType="fade"
        transparent
      >
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <BespokeIcon name="check" size={32} color="#FFFFFF" />
            </View>

            <Text style={styles.successTitle}>Order Confirmed!</Text>
            <Text style={styles.successNumber}>
              Order #{successOrder?.orderNumber}
            </Text>
            <Text style={styles.successText}>
              Your green coffee beans have been allocated to the roastery queue. We will roast, nitrogen-flush, and dispatch them fresh to your door.
            </Text>

            <View style={styles.batchInfoBox}>
              <Text style={styles.batchLabel}>Allocated Batch Code:</Text>
              <Text style={styles.batchValue}>{successOrder?.roastBatchId}</Text>
            </View>

            <CustomButton
              title="Track Roasting & Delivery"
              onPress={handleViewOrder}
              size="medium"
              fullWidth
              style={styles.trackBtn}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.titleLarge,
    color: Colors.light.espresso,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
    gap: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    ...Typography.titleMedium,
    color: Colors.light.textPrimary,
  },
  addressBox: {
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  addressName: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  addressText: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  addressPhone: {
    ...Typography.bodySmall,
    color: Colors.light.primaryDark,
    marginTop: 4,
    fontWeight: '600',
  },
  dispatchBox: {
    backgroundColor: '#FAF5EE',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.primary,
  },
  dispatchHighlight: {
    ...Typography.titleSmall,
    color: Colors.light.primaryDark,
    marginBottom: 4,
  },
  dispatchSub: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  paymentList: {
    gap: Spacing.sm,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
  },
  paymentOptionActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primarySubtle,
  },
  paymentRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  paymentRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
  },
  paymentTitleActive: {
    color: Colors.light.primaryDark,
    fontWeight: '700',
  },
  paymentDesc: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  reviewItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs + 2,
  },
  reviewItemName: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  reviewItemSub: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    fontSize: 12,
  },
  reviewItemPrice: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.divider,
    marginVertical: Spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...Typography.titleMedium,
    color: Colors.light.espresso,
  },
  totalAmount: {
    ...Typography.priceLarge,
    color: Colors.light.primaryDark,
  },
  actionWrapper: {
    marginTop: Spacing.md,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 14, 10, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  successCard: {
    width: '100%',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.floating,
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.light.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  successTitle: {
    ...Typography.displaySmall,
    color: Colors.light.espresso,
    marginBottom: 4,
  },
  successNumber: {
    ...Typography.titleSmall,
    color: Colors.light.primaryDark,
    marginBottom: Spacing.md,
  },
  successText: {
    ...Typography.bodyMedium,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  batchInfoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surfaceElevated,
    paddingVertical: Spacing.xs + 4,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xl,
    gap: 6,
  },
  batchLabel: {
    ...Typography.labelSmall,
    color: Colors.light.textSecondary,
  },
  batchValue: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    fontWeight: '700',
  },
  trackBtn: {
    marginTop: Spacing.xs,
  },
});
