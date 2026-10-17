import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'sage';
export type ButtonSize = 'small' | 'medium' | 'large';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  fullWidth = false,
}) => {
  const getContainerStyle = (pressed: boolean): StyleProp<ViewStyle> => {
    let paddingVertical = Spacing.md;
    let paddingHorizontal = Spacing.lg;

    if (size === 'small') {
      paddingVertical = Spacing.xs + 2;
      paddingHorizontal = Spacing.md;
    } else if (size === 'large') {
      paddingVertical = Spacing.lg - 1;
      paddingHorizontal = Spacing.xl;
    }

    let backgroundColor = Colors.light.primary;
    let borderWidth = 0;
    let borderColor = 'transparent';

    if (variant === 'secondary') {
      backgroundColor = Colors.light.espresso;
    } else if (variant === 'sage') {
      backgroundColor = Colors.light.botanicalSage;
    } else if (variant === 'outline') {
      backgroundColor = 'transparent';
      borderWidth = 1.5;
      borderColor = Colors.light.borderStrong;
    } else if (variant === 'ghost') {
      backgroundColor = 'transparent';
    }

    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.md,
      opacity: disabled ? 0.5 : pressed ? 0.88 : 1,
      paddingVertical,
      paddingHorizontal,
      backgroundColor,
      borderWidth,
      borderColor,
      ...(fullWidth && { width: '100%' }),
    };
  };

  const getTextColor = () => {
    switch (variant) {
      case 'outline':
        return Colors.light.textPrimary;
      case 'ghost':
        return Colors.light.primary;
      case 'secondary':
      case 'sage':
      case 'primary':
      default:
        return '#FFFFFF';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return Typography.labelLarge;
      case 'large':
        return Typography.titleMedium;
      case 'medium':
      default:
        return Typography.titleSmall;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [getContainerStyle(pressed), style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          style={styles.spinner}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <>{icon}</>}
          <Text
            style={[
              getTextSize(),
              {
                color: getTextColor(),
                marginHorizontal: icon ? Spacing.xs + 2 : 0,
              },
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && <>{icon}</>}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  spinner: {
    paddingVertical: 2,
  },
});
