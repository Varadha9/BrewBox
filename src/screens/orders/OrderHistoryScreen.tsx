// OrderHistoryScreen.tsx — Shows all past orders with a 5-stage roastery tracking timeline.
// Each order card shows batch ID, items, live stage progress, and total paid.

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BespokeIcon, CustomButton } from '../../components';
// useUserStore — reads the orders array from global state
import { useUserStore } from '../../store';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../theme';

interface OrderHistoryScreenProps {
  navigation: any;
  route?: any;
}

export const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ navigation }) => {
  // orders = array of all placed orders, newest first
  const { orders } = useUserStore();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>ROAST DISPATCH TELEMETRY</Text>
          <Text style={styles.headerTitle}>Order Tracking</Text>
        </View>
        {/* Total order count badge */}
        <Text style={styles.orderCountText}>{orders.length} Orders</Text>
      </View>

      {/* ── Empty State ── shown when user has no orders yet */}
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <BespokeIcon name="truck" size={48} color={Colors.light.borderStrong} />
          </View>
          <Text style={styles.emptyTitle}>No Roastery Orders Yet</Text>
          <Text style={styles.emptySubtitle}>
            When you order fresh small-batch coffee or fine tea, you can track its roast stage in real time here.
          </Text>
          <CustomButton
            title="Browse Fresh Offerings"
            onPress={() => navigation.navigate('ExploreTab')}
            size="medium"
            style={styles.emptyBtn}
          />
        </View>
      ) : (
        // ── Orders List ── scrollable list of order cards
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>

              {/* ── Order Header ── order number + status badge */}
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
                  {/* Date and item count */}
                  <Text style={styles.orderDate}>
                    {order.createdAt} • {order.items.length} items
                  </Text>
                </View>
                {/* Status pill — e.g. ROASTING, DISPATCHED */}
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>
                    {order.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* ── Roast Batch Banner ── shows batch ID and roast date */}
              {order.roastBatchId && (
                <View style={styles.batchBanner}>
                  <BespokeIcon name="flame" size={16} color={Colors.light.primary} />
                  <Text style={styles.batchBannerText}>
                    Roaster Batch ID: {order.roastBatchId} • {order.roastDate}
                  </Text>
                </View>
              )}

              {/* ── Items Summary ── list of products in this order */}
              <View style={styles.itemsSummary}>
                {order.items.map((item, idx) => (
                  <View key={idx} style={styles.orderItemRow}>
                    {/* qty x product name */}
                    <Text style={styles.orderItemTitle}>
                      {item.quantity}x {item.product.name}
                    </Text>
                    {/* weight and grind specs */}
                    <Text style={styles.orderItemSpecs}>
                      {item.selectedWeight.label} ({item.selectedGrind})
                    </Text>
                  </View>
                ))}
              </View>

              {/* ── 5-Stage Roastery Timeline ── visual progress tracker */}
              <View style={styles.timelineContainer}>
                <Text style={styles.timelineHeading}>Roast & Delivery Stages</Text>

                {order.steps.map((step, sIdx) => {
                  const isLast = sIdx === order.steps.length - 1;
                  // isCurrent = the active step right now
                  const isCurrent = sIdx === order.currentStepIndex;
                  // isDone = this step and all before it are completed
                  const isDone = sIdx <= order.currentStepIndex;

                  return (
                    <View key={step.status} style={styles.timelineRow}>

                      {/* Left column: dot + vertical connector line */}
                      <View style={styles.lineCol}>
                        {/* Dot: grey = pending, amber = done, larger = current */}
                        <View style={[styles.dot, isDone && styles.dotDone, isCurrent && styles.dotCurrent]}>
                          {/* Show checkmark inside completed dots */}
                          {isDone ? <BespokeIcon name="check" size={10} color="#FFFFFF" /> : null}
                        </View>
                        {/* Vertical line connecting dots — colored if done */}
                        {!isLast && (
                          <View style={[styles.verticalLine, isDone && styles.verticalLineDone]} />
                        )}
                      </View>

                      {/* Right column: step label + timestamp */}
                      <View style={styles.timelineContent}>
                        <View style={styles.stepTitleRow}>
                          {/* Bold amber text for the current active step */}
                          <Text style={[styles.stepLabel, isCurrent && styles.stepLabelCurrent]}>
                            {step.label}
                          </Text>
                          {/* Timestamp shown only for completed steps */}
                          {step.timestamp && (
                            <Text style={styles.stepTime}>{step.timestamp}</Text>
                          )}
                        </View>
                        {/* Sub-description below the step label */}
                        <Text style={styles.stepSublabel}>{step.sublabel}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* ── Order Footer ── total amount paid */}
              <View style={styles.orderFooter}>
                <Text style={styles.orderTotalLabel}>Total Paid:</Text>
                <Text style={styles.orderTotalValue}>₹{order.total}</Text>
              </View>
            </View>
          ))}
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
  // Top bar with title and order count
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
  orderCountText: {
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
    gap: Spacing.lg,
  },
  // White card for each order
  orderCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.soft,
  },
  // Row: order number left, status badge right
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  orderNumber: {
    ...Typography.titleMedium,
    color: Colors.light.espresso,
  },
  orderDate: {
    ...Typography.bodySmall,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  // Amber pill showing current order status
  statusBadge: {
    backgroundColor: Colors.light.primarySubtle,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.light.primaryLight,
  },
  statusBadgeText: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    fontWeight: '700',
    fontSize: 10,
  },
  // Amber banner showing roast batch reference
  batchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAF5EE',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginVertical: Spacing.sm,
  },
  batchBannerText: {
    ...Typography.bodySmall,
    color: Colors.light.primaryDark,
    fontWeight: '600',
    fontSize: 12,
  },
  // Items list separated by bottom border
  itemsSummary: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  orderItemRow: {
    marginBottom: 4,
  },
  orderItemTitle: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  orderItemSpecs: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    fontSize: 12,
  },
  timelineContainer: {
    marginTop: Spacing.md,
  },
  timelineHeading: {
    ...Typography.labelLarge,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },
  // Each row = dot column + content column
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  // Fixed-width left column for dot + line
  lineCol: {
    width: 24,
    alignItems: 'center',
  },
  // Default dot = grey (pending)
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E5DED4',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  // Completed dot = amber
  dotDone: {
    backgroundColor: Colors.light.primary,
  },
  // Current active dot = slightly larger dark amber
  dotCurrent: {
    backgroundColor: Colors.light.primaryDark,
    transform: [{ scale: 1.15 }],
  },
  // Grey vertical connector line between dots
  verticalLine: {
    width: 2,
    height: 38,
    backgroundColor: '#E8E1D5',
    marginVertical: 2,
  },
  // Amber line for completed steps
  verticalLineDone: {
    backgroundColor: Colors.light.primary,
  },
  // Right side content area
  timelineContent: {
    flex: 1,
    marginLeft: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  stepTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Default step label = grey
  stepLabel: {
    ...Typography.titleSmall,
    color: Colors.light.textSecondary,
    fontSize: 13,
  },
  // Active step label = bold amber
  stepLabelCurrent: {
    color: Colors.light.primaryDark,
    fontWeight: '700',
  },
  stepTime: {
    ...Typography.labelSmall,
    color: Colors.light.textMuted,
    fontSize: 11,
  },
  stepSublabel: {
    ...Typography.bodySmall,
    color: Colors.light.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  // Footer row: "Total Paid" label + amount
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
  },
  orderTotalLabel: {
    ...Typography.bodyMedium,
    color: Colors.light.textSecondary,
  },
  orderTotalValue: {
    ...Typography.priceMedium,
    color: Colors.light.espresso,
  },
});
