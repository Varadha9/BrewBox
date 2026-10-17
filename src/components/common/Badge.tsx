import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';

export type BadgeVariant =
  | 'micro-lot'
  | 'tasting-note'
  | 'process'
  | 'origin'
  | 'roast'
  | 'in-stock'
  | 'out-of-stock'
  | 'sage';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'tasting-note',
  style,
  icon,
}) => {
  const getBadgeStyle = (): ViewStyle => {
    switch (variant) {
      case 'micro-lot':
        return {
          backgroundColor: '#FAF3E8',
          borderColor: '#DEB887',
        };
      case 'process':
        return {
          backgroundColor: '#F3EFE6',
          borderColor: '#D8C7B0',
        };
      case 'origin':
        return {
          backgroundColor: '#EFEAE2',
          borderColor: '#CFC2B0',
        };
      case 'sage':
        return {
          backgroundColor: Colors.light.sageSubtle,
          borderColor: '#B7CBBF',
        };
      case 'in-stock':
        return {
          backgroundColor: Colors.light.successBg,
          borderColor: '#A8D5C0',
        };
      case 'out-of-stock':
        return {
          backgroundColor: Colors.light.errorBg,
          borderColor: '#F1B2B2',
        };
      case 'roast':
        return {
          backgroundColor: '#F7EDE6',
          borderColor: '#E6B99E',
        };
      case 'tasting-note':
      default:
        return {
          backgroundColor: '#F5EFE8',
          borderColor: '#DFD3C3',
        };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'micro-lot':
        return '#96531A';
      case 'sage':
        return Colors.light.botanicalSage;
      case 'in-stock':
        return Colors.light.success;
      case 'out-of-stock':
        return Colors.light.error;
      case 'roast':
        return Colors.light.primaryDark;
      default:
        return Colors.light.textPrimary;
    }
  };

  return (
    <View style={[styles.container, getBadgeStyle(), style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.label, { color: getTextColor() }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: Spacing.xs,
  },
  label: {
    ...Typography.labelSmall,
    fontWeight: '600',
  },
});
