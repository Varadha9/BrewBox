import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';
import { BespokeIcon } from '../common/BespokeIcon';

interface FreeShippingMeterProps {
  subtotal: number;
  freeShippingThreshold: number;
  amountNeeded: number;
  isEligible: boolean;
}

export const FreeShippingMeter: React.FC<FreeShippingMeterProps> = ({
  subtotal,
  freeShippingThreshold,
  amountNeeded,
  isEligible,
}) => {
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <BespokeIcon
            name="truck"
            size={16}
            color={isEligible ? Colors.light.success : Colors.light.primary}
          />
        </View>
        <Text style={styles.title}>
          {isEligible
            ? 'Complimentary Express Roaster Delivery Unlocked!'
            : `Add ₹${amountNeeded} more for Free Roaster Express Delivery`}
        </Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${progressPercent}%`,
              backgroundColor: isEligible ? Colors.light.success : Colors.light.primary,
            },
          ]}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.progressText}>
          {isEligible ? 'Free Shipping on this order' : `₹${subtotal} of ₹${freeShippingThreshold}`}
        </Text>
        <Text style={styles.percentText}>{progressPercent}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF5EE',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EFE5D5',
    marginVertical: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAE1D2',
  },
  title: {
    flex: 1,
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  track: {
    height: 6,
    backgroundColor: '#E7DEC8',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginVertical: 4,
  },
  fill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressText: {
    ...Typography.labelSmall,
    color: Colors.light.textSecondary,
  },
  percentText: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    fontWeight: '700',
  },
});
