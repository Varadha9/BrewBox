import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';
import { BespokeIcon } from './BespokeIcon';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  hasActiveFilters?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search beans, origins, roast levels...',
  onFilterPress,
  hasActiveFilters = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputWrapper}>
        <BespokeIcon
          name="search"
          size={18}
          color={Colors.light.textSecondary}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.light.textMuted}
          style={styles.input}
          autoCorrect={false}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <Pressable
            onPress={() => onChangeText('')}
            hitSlop={8}
            style={styles.clearBtn}
          >
            <BespokeIcon
              name="close"
              size={16}
              color={Colors.light.textSecondary}
            />
          </Pressable>
        )}
      </View>

      {onFilterPress && (
        <Pressable
          onPress={onFilterPress}
          style={[
            styles.filterBtn,
            hasActiveFilters && styles.filterBtnActive,
          ]}
        >
          <BespokeIcon
            name="sliders"
            size={18}
            color={hasActiveFilters ? '#FFFFFF' : Colors.light.textPrimary}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    height: 46,
  },
  input: {
    flex: 1,
    marginLeft: Spacing.sm,
    ...Typography.bodyMedium,
    color: Colors.light.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: Spacing.xs,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
});
