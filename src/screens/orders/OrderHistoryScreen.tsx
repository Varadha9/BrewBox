import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BespokeIcon, CustomButton } from '../../components';
import { useUserStore } from '../../store';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../theme';

interface OrderHistoryScreenProps {
  navigation: any;
  route?: any;
}

export const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({
  navigation,
}) => {
  const { orders } = useUserStore();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>ROAST DISPATCH TELEMETRY</Text>
          <Text style={styles.headerTitle}>Order Tracking</Text>
        </View>
        <Text style={styles.orderCountText}>{orders.length} Orders</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <BespokeIcon
              name="truck"
              size={48}
              color={Colors.light.borderStrong}
            />
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              {/* Order Header */}
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>
                    Order #{order.orderNumber}
                  </Text>
                  <Text style={styles.orderDate}>
                    {order.createdAt} • {order.items.length} items
                  </Text>
                </View>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>
                    {order.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Roast Batch Info */}
              {order.roastBatchId && (
                <View style={styles.batchBanner}>
                  <BespokeIcon
                    name="flame"
                    size={16}
                    color={Colors.light.primary}
                  />
                  <Text style={styles.batchBannerText}>
                    Roaster Batch ID: {order.roastBatchId} • {order.roastDate}
                  </Text>
                </View>
              )}

              {/* Items Summary */}
              <View style={styles.itemsSummary}>
                {order.items.map((item, idx) => (
                  <View key={idx} style={styles.orderItemRow}>
                    <Text style={styles.orderItemTitle}>
                      {item.quantity}x {item.product.name}
                    </Text>
                    <Text style={styles.orderItemSpecs}>
                      {item.selectedWeight.label} ({item.selectedGrind})
                    </Text>
                  </View>
                ))}
              </View>

              {/* Visual 5-Stage Roastery Timeline */}
              <View style={styles.timelineContainer}>
                <Text style={styles.timelineHeading}>Roast & Delivery Stages</Text>
                {order.steps.map((step, sIdx) => {
                  const isLast = sIdx === order.steps.length - 1;
                  const isCurrent = sIdx === order.currentStepIndex;
                  const isDone = sIdx <= order.currentStepIndex;

                  return (
                    <View key={step.status} style={styles.timelineRow}>
                      {/* Left Dot and Line */}
                      <View style={styles.lineCol}>
                        <View
                          style={[
                            styles.dot,
                            isDone && styles.dotDone,
                            isCurrent && styles.dotCurrent,
                          ]}
                        >
                          {isDone ? (
                            <BespokeIcon
                              name="check"
                              size={10}
                              color="#FFFFFF"
                            />
                          ) : null}
                        </View>
                        {!isLast && (
                          <View
                            style={[
                              styles.verticalLine,
                              isDone && styles.verticalLineDone,
                            ]}
                          />
                        )}
                      </View>

                      {/* Right Content */}
                      <View style={styles.timelineContent}>
                        <View style={styles.stepTitleRow}>
                          <Text
                            style={[
                              styles.stepLabel,
                              isCurrent && styles.stepLabelCurrent,
                            ]}
                          >
                            {step.label}
                          </Text>
                          {step.timestamp && (
                            <Text style={styles.stepTime}>
                              {step.timestamp}
                            </Text>
                          )}
                        </View>
                        <Text style={styles.stepSublabel}>
                          {step.sublabel}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Order Footer */}
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
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
    gap: Spacing.lg,
  },
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
  orderCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.soft,
  },
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
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  lineCol: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E5DED4',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  dotDone: {
    backgroundColor: Colors.light.primary,
  },
  dotCurrent: {
    backgroundColor: Colors.light.primaryDark,
    transform: [{ scale: 1.15 }],
  },
  verticalLine: {
    width: 2,
    height: 38,
    backgroundColor: '#E8E1D5',
    marginVertical: 2,
  },
  verticalLineDone: {
    backgroundColor: Colors.light.primary,
  },
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
  stepLabel: {
    ...Typography.titleSmall,
    color: Colors.light.textSecondary,
    fontSize: 13,
  },
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
