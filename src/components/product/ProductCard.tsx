import React from 'react';
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useCartStore, useWishlistStore } from '../../store';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../theme';
import { Product } from '../../types';
import { Badge } from '../common/Badge';
import { BespokeIcon } from '../common/BespokeIcon';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  style,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const isFav = isInWishlist(product.id);

  const handleQuickAdd = () => {
    const defaultGrind = product.availableGrinds[0] || 'Whole Bean';
    const defaultWeight = product.weightOptions[0] || {
      weightGrams: 250,
      label: '250g',
      priceMultiplier: 1,
    };
    addItem(product, defaultGrind, defaultWeight, 1);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
        style,
      ]}
    >
      {/* Product Image & Badges */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Favorite Button */}
        <Pressable
          onPress={() => toggleWishlist(product)}
          hitSlop={8}
          style={styles.favBtn}
        >
          <BespokeIcon
            name={isFav ? 'heart-filled' : 'heart'}
            size={18}
            color={isFav ? '#D9534F' : Colors.light.textPrimary}
          />
        </Pressable>

        {/* Top Badges */}
        <View style={styles.badgeRow}>
          {product.isMicroLot && (
            <Badge label="Micro-Lot" variant="micro-lot" />
          )}
          {product.roastLevel && (
            <Badge label={`${product.roastLevel}`} variant="roast" />
          )}
          {product.category === 'tea' && (
            <Badge label="Estate Tea" variant="sage" />
          )}
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.content}>
        {/* Origin / Elevation */}
        {product.origin ? (
          <Text style={styles.originText} numberOfLines={1}>
            {product.origin}
          </Text>
        ) : (
          <Text style={styles.originText} numberOfLines={1}>
            Specialty Craft Edition
          </Text>
        )}

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Tasting Notes */}
        <View style={styles.notesRow}>
          {product.tastingNotes.slice(0, 3).map((note) => (
            <Text key={note} style={styles.noteItem}>
              • {note}
            </Text>
          ))}
        </View>

        {/* Price & Action */}
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {product.currency}
              {product.basePrice}
            </Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                {product.currency}
                {product.originalPrice}
              </Text>
            )}
          </View>

          <Pressable
            onPress={handleQuickAdd}
            hitSlop={6}
            style={({ pressed }) => [
              styles.addBtn,
              pressed && styles.addBtnPressed,
            ]}
          >
            <BespokeIcon name="plus" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
    ...Shadows.card,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#F3EFE6',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favBtn: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  badgeRow: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  content: {
    padding: Spacing.md,
  },
  originText: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
    lineHeight: 18,
    minHeight: 36,
  },
  notesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginVertical: Spacing.xs + 2,
  },
  noteItem: {
    ...Typography.bodySmall,
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  price: {
    ...Typography.priceMedium,
    color: Colors.light.textPrimary,
  },
  originalPrice: {
    ...Typography.bodySmall,
    color: Colors.light.textMuted,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnPressed: {
    backgroundColor: Colors.light.primaryDark,
  },
});
