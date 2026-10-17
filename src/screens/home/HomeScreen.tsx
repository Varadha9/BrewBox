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
import {
  Badge,
  BespokeIcon,
  CustomButton,
  ProductCard,
} from '../../components';
import { CATEGORIES, PRODUCTS } from '../../data';
import { useCartStore, useFilterStore } from '../../store';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../theme';
import { Product } from '../../types';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { getItemCount } = useCartStore();
  const { setSelectedCategory, resetFilters } = useFilterStore();
  const cartCount = getItemCount();

  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller);
  const microLots = PRODUCTS.filter((p) => p.isMicroLot);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails', { product });
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId as any);
    navigation.navigate('ExploreTab', { initialCategory: categoryId });
  };

  const handleExploreAll = () => {
    resetFilters();
    navigation.navigate('ExploreTab');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Editorial Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>EST. 2026 • ARTISANAL ROASTERS</Text>
          <Text style={styles.headerTitle}>BrewBox</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            onPress={() => navigation.navigate('ExploreTab')}
            hitSlop={8}
            style={styles.iconButton}
          >
            <BespokeIcon name="search" size={20} color={Colors.light.textPrimary} />
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('CartTab')}
            hitSlop={8}
            style={styles.iconButton}
          >
            <BespokeIcon name="bag" size={20} color={Colors.light.textPrimary} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Editorial Hero Banner */}
        <View style={styles.heroBanner}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Badge
              label="Spring 2026 Harvest Drop"
              variant="micro-lot"
              style={styles.heroBadge}
            />
            <Text style={styles.heroTitle}>High-Altitude Micro-Lots</Text>
            <Text style={styles.heroSubtitle}>
              Sourced directly from Yirgacheffe & Chiriquí. Roasted fresh weekly.
            </Text>
            <CustomButton
              title="Explore Curated Roasts"
              onPress={handleExploreAll}
              size="medium"
              style={styles.heroBtn}
              icon={
                <BespokeIcon name="arrow-right" size={16} color="#FFFFFF" />
              }
              iconPosition="right"
            />
          </View>
        </View>

        {/* Categories Bar */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Curated Collections</Text>
          <Pressable onPress={handleExploreAll}>
            <Text style={styles.seeAllText}>View All</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => handleCategoryPress(cat.id)}
              style={({ pressed }) => [
                styles.categoryCard,
                pressed && styles.categoryCardPressed,
              ]}
            >
              <View style={styles.categoryIconCircle}>
                <BespokeIcon
                  name={cat.iconName}
                  size={22}
                  color={Colors.light.primary}
                />
              </View>
              <Text style={styles.categoryName}>{cat.shortLabel}</Text>
              <Text style={styles.categoryCount}>{cat.itemCount} Items</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Interactive "Find Your Roast" Coffee Quiz Teaser */}
        <Pressable
          onPress={() => navigation.navigate('CoffeeQuiz')}
          style={styles.quizBanner}
        >
          <View style={styles.quizContent}>
            <View style={styles.quizTagRow}>
              <BespokeIcon name="sparkles" size={16} color={Colors.light.primary} />
              <Text style={styles.quizTag}>PALATE MATCHER</Text>
            </View>
            <Text style={styles.quizTitle}>Find Your Perfect Brew</Text>
            <Text style={styles.quizSubtitle}>
              Take a 60-second quiz to uncover single-origins matched to your brewing style.
            </Text>
          </View>
          <View style={styles.quizArrowCircle}>
            <BespokeIcon
              name="arrow-right"
              size={18}
              color={Colors.light.primary}
            />
          </View>
        </Pressable>

        {/* Featured Micro-Lots Carousel */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Featured Micro-Lots</Text>
            <Text style={styles.sectionSubtitle}>
              Rare varietals & experimental fermentations
            </Text>
          </View>
          <Pressable onPress={() => navigation.navigate('ExploreTab')}>
            <Text style={styles.seeAllText}>Browse</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalProductsScroll}
        >
          {microLots.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => handleProductPress(product)}
              style={styles.carouselCard}
            />
          ))}
        </ScrollView>

        {/* Roastery Best Sellers */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Roastery Best Sellers</Text>
            <Text style={styles.sectionSubtitle}>
              Beloved by baristas and home brewers
            </Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => handleProductPress(product)}
              style={styles.gridCard}
            />
          ))}
        </View>

        {/* Artisanal Commitment Card */}
        <View style={styles.commitmentCard}>
          <BespokeIcon name="shield" size={28} color={Colors.light.primary} />
          <Text style={styles.commitmentTitle}>The BrewBox Roast Promise</Text>
          <Text style={styles.commitmentText}>
            Every batch is roasted to order on eco-efficient Loring roasters, nitrogen-flushed, and packaged with one-way degassing aroma valves. We guarantee roast dates within 48 hours of dispatch.
          </Text>
        </View>
      </ScrollView>
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
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.light.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    ...Typography.labelSmall,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: Spacing.huge,
  },
  heroBanner: {
    margin: Spacing.lg,
    height: 280,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.floating,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(24, 16, 11, 0.62)',
    padding: Spacing.lg,
    justifyContent: 'flex-end',
  },
  heroBadge: {
    marginBottom: Spacing.sm,
    backgroundColor: '#FAF3E8',
  },
  heroTitle: {
    ...Typography.displaySmall,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    ...Typography.bodySmall,
    color: '#E8DFD3',
    marginBottom: Spacing.md,
  },
  heroBtn: {
    alignSelf: 'flex-start',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.titleLarge,
    color: Colors.light.textPrimary,
  },
  sectionSubtitle: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  seeAllText: {
    ...Typography.titleSmall,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  categoriesScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  categoryCard: {
    width: 105,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    ...Shadows.soft,
  },
  categoryCardPressed: {
    backgroundColor: Colors.light.surfaceElevated,
  },
  categoryIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.light.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  categoryName: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryCount: {
    ...Typography.labelSmall,
    color: Colors.light.textMuted,
  },
  quizBanner: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: '#FAF4EB',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#E8DCB8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quizContent: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  quizTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  quizTag: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    letterSpacing: 1,
  },
  quizTitle: {
    ...Typography.titleMedium,
    color: Colors.light.textPrimary,
  },
  quizSubtitle: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  quizArrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8DCB8',
  },
  horizontalProductsScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  carouselCard: {
    width: 220,
  },
  gridContainer: {
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  gridCard: {
    width: '47.5%',
  },
  commitmentCard: {
    margin: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#F3EFE6',
    borderWidth: 1,
    borderColor: '#E5DCB8',
    alignItems: 'center',
    textAlign: 'center',
  },
  commitmentTitle: {
    ...Typography.titleMedium,
    color: Colors.light.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  commitmentText: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
});
