// WishlistScreen.tsx — Shows all products the user has saved/hearted.
// Users can remove items or move them directly to the cart from here.

import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BespokeIcon, CustomButton } from '../../components';
// useCartStore — to add items to cart when user taps "Move to Cart"
import { useCartStore, useWishlistStore } from '../../store';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../theme';
import { Product } from '../../types';

interface WishlistScreenProps {
  navigation: any;
}

export const WishlistScreen: React.FC<WishlistScreenProps> = ({ navigation }) => {
  // items = all saved products, toggleWishlist = remove from wishlist
  const { items, toggleWishlist } = useWishlistStore();
  // addItem = add product to cart with default grind + weight
  const { addItem } = useCartStore();

  // Move to cart: adds with default options, then removes from wishlist
  const handleMoveToCart = (product: Product) => {
    const defaultGrind = product.availableGrinds[0] || 'Whole Bean';
    const defaultWeight = product.weightOptions[0] || {
      weightGrams: 250,
      label: '250g',
      priceMultiplier: 1,
    };
    addItem(product, defaultGrind, defaultWeight, 1);
    toggleWishlist(product); // remove from wishlist after adding to cart
  };

  // Navigate to full product details screen
  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails', { product });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>SAVED SPECIALTY LOTS</Text>
          <Text style={styles.headerTitle}>Your Wishlist</Text>
        </View>
        {/* Show total saved count on the right */}
        <Text style={styles.itemCountText}>{items.length} Saved</Text>
      </View>

      {/* ── Empty State ── shown when no items are saved */}
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <BespokeIcon name="heart" size={48} color={Colors.light.borderStrong} />
          </View>
          <Text style={styles.emptyTitle}>No Saved Beans</Text>
          <Text style={styles.emptySubtitle}>
            Save your favorite single origins, experimental micro-lots, and seasonal teas to buy when your stash runs low.
          </Text>
          {/* CTA to go explore products */}
          <CustomButton
            title="Explore Specialty Catalog"
            onPress={() => navigation.navigate('ExploreTab')}
            size="medium"
            style={styles.emptyBtn}
          />
        </View>
      ) : (
        // ── Product Grid ── 2-column grid of saved products
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.grid}>
            {items.map((product) => (
              <View key={product.id} style={styles.card}>

                {/* Product image — tappable to open details */}
                <Pressable onPress={() => handleProductPress(product)} style={styles.imageBox}>
                  <Image
                    source={{ uri: product.image }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  {/* Red heart button — tapping removes from wishlist */}
                  <Pressable
                    onPress={() => toggleWishlist(product)}
                    hitSlop={8}
                    style={styles.removeBtn}
                  >
                    <BespokeIcon name="heart-filled" size={18} color="#D9534F" />
                  </Pressable>
                </Pressable>

                {/* Card text content */}
                <View style={styles.cardContent}>
                  {/* Origin label in uppercase */}
                  <Text style={styles.originText} numberOfLines={1}>
                    {product.origin || 'Specialty Craft'}
                  </Text>
                  {/* Product name — max 2 lines */}
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  {/* Base price */}
                  <Text style={styles.price}>
                    {product.currency}{product.basePrice}
                  </Text>
                  {/* Move to Cart button — adds item and removes from wishlist */}
                  <CustomButton
                    title="Move to Cart"
                    onPress={() => handleMoveToCart(product)}
                    size="small"
                    variant="outline"
                    icon={<BespokeIcon name="bag" size={14} color={Colors.light.primary} />}
                    style={styles.moveBtn}
                  />
                </View>
              </View>
            ))}
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
  // Top bar with title and item count
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
  // Centered empty state layout
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
  // 2-column flex wrap grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  // Each card takes ~half the screen width
  card: {
    width: '47.5%',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
    ...Shadows.soft,
  },
  // Image area with heart button overlay
  imageBox: {
    width: '100%',
    height: 140,
    backgroundColor: '#F3EFE6',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  // Floating remove (heart) button top-right of image
  removeBtn: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.soft,
  },
  cardContent: {
    padding: Spacing.md,
  },
  originText: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    textTransform: 'uppercase',
  },
  productName: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
    marginVertical: 4,
    minHeight: 36,
  },
  price: {
    ...Typography.priceMedium,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
  },
  moveBtn: {
    width: '100%',
  },
});
