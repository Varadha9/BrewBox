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
import { useCartStore, useWishlistStore } from '../../store';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../theme';
import { Product } from '../../types';

interface WishlistScreenProps {
  navigation: any;
}

export const WishlistScreen: React.FC<WishlistScreenProps> = ({ navigation }) => {
  const { items, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveToCart = (product: Product) => {
    const defaultGrind = product.availableGrinds[0] || 'Whole Bean';
    const defaultWeight = product.weightOptions[0] || {
      weightGrams: 250,
      label: '250g',
      priceMultiplier: 1,
    };
    addItem(product, defaultGrind, defaultWeight, 1);
    toggleWishlist(product);
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails', { product });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>SAVED SPECIALTY LOTS</Text>
          <Text style={styles.headerTitle}>Your Wishlist</Text>
        </View>
        <Text style={styles.itemCountText}>{items.length} Saved</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <BespokeIcon
              name="heart"
              size={48}
              color={Colors.light.borderStrong}
            />
          </View>
          <Text style={styles.emptyTitle}>No Saved Beans</Text>
          <Text style={styles.emptySubtitle}>
            Save your favorite single origins, experimental micro-lots, and seasonal teas to buy when your stash runs low.
          </Text>
          <CustomButton
            title="Explore Specialty Catalog"
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
          <View style={styles.grid}>
            {items.map((product) => (
              <View key={product.id} style={styles.card}>
                <Pressable
                  onPress={() => handleProductPress(product)}
                  style={styles.imageBox}
                >
                  <Image
                    source={{ uri: product.image }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <Pressable
                    onPress={() => toggleWishlist(product)}
                    hitSlop={8}
                    style={styles.removeBtn}
                  >
                    <BespokeIcon
                      name="heart-filled"
                      size={18}
                      color="#D9534F"
                    />
                  </Pressable>
                </Pressable>

                <View style={styles.cardContent}>
                  <Text style={styles.originText} numberOfLines={1}>
                    {product.origin || 'Specialty Craft'}
                  </Text>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.price}>
                    {product.currency}
                    {product.basePrice}
                  </Text>

                  <CustomButton
                    title="Move to Cart"
                    onPress={() => handleMoveToCart(product)}
                    size="small"
                    variant="outline"
                    icon={
                      <BespokeIcon
                        name="bag"
                        size={14}
                        color={Colors.light.primary}
                      />
                    }
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  card: {
    width: '47.5%',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
    ...Shadows.soft,
  },
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
