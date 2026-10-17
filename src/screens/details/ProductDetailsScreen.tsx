import React, { useState } from 'react';
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
  GrindSelector,
  RoastMeter,
  TasteProfileBar,
} from '../../components';
import { useCartStore, useWishlistStore } from '../../store';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../theme';
import { GrindOption, Product, WeightOption } from '../../types';

interface ProductDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      product: Product;
    };
  };
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { product } = route.params;
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const [selectedGrind, setSelectedGrind] = useState<GrindOption>(
    product.availableGrinds[0] || 'Whole Bean'
  );
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(
    product.weightOptions[0] || { weightGrams: 250, label: '250g', priceMultiplier: 1 }
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'brewGuide' | 'reviews'>('overview');
  const [addedToast, setAddedToast] = useState(false);

  const isFav = isInWishlist(product.id);
  const currentPrice = Math.round(product.basePrice * selectedWeight.priceMultiplier);

  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.image];

  const handleAddToCart = () => {
    addItem(product, selectedGrind, selectedWeight, 1);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 2200);
  };

  const handleBuyNow = () => {
    addItem(product, selectedGrind, selectedWeight, 1);
    navigation.navigate('CartTab');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeTop} edges={['top']}>
        {/* Floating Custom Navigation Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={8}
            style={styles.headerBtn}
          >
            <BespokeIcon name="arrow-left" size={20} color={Colors.light.textPrimary} />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerRoasteryText}>SPECIALTY RESERVE</Text>
          </View>

          <Pressable
            onPress={() => toggleWishlist(product)}
            hitSlop={8}
            style={styles.headerBtn}
          >
            <BespokeIcon
              name={isFav ? 'heart-filled' : 'heart'}
              size={20}
              color={isFav ? '#D9534F' : Colors.light.textPrimary}
            />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Gallery Image Hero */}
        <View style={styles.imageGalleryContainer}>
          <Image
            source={{ uri: images[selectedImageIndex] }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {images.length > 1 && (
            <View style={styles.thumbnailRow}>
              {images.map((img, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => setSelectedImageIndex(idx)}
                  style={[
                    styles.thumbnail,
                    selectedImageIndex === idx && styles.thumbnailActive,
                  ]}
                >
                  <Image source={{ uri: img }} style={styles.thumbImage} />
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Content Container */}
        <View style={styles.content}>
          {/* Badges Row */}
          <View style={styles.badgesRow}>
            {product.isMicroLot && (
              <Badge label="Rare Micro-Lot" variant="micro-lot" />
            )}
            {product.process && (
              <Badge label={`${product.process} Process`} variant="process" />
            )}
            {product.elevationMASL && (
              <Badge label={product.elevationMASL} variant="origin" />
            )}
            {product.category === 'tea' && (
              <Badge label="Estate Tea" variant="sage" />
            )}
          </View>

          {/* Product Title & Tagline */}
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.tagline}>{product.tagline}</Text>

          {/* Ratings & Roaster Stock Status */}
          <View style={styles.metaRow}>
            <View style={styles.ratingBox}>
              <BespokeIcon name="star" size={16} color={Colors.light.amberGold} />
              <Text style={styles.ratingText}>
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </Text>
            </View>

            <View style={styles.stockBadge}>
              <View style={styles.greenDot} />
              <Text style={styles.stockText}>Roasted on Demand</Text>
            </View>
          </View>

          {/* Navigation Sub-Tabs */}
          <View style={styles.tabBar}>
            <Pressable
              onPress={() => setActiveTab('overview')}
              style={[styles.tabItem, activeTab === 'overview' && styles.tabItemActive]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'overview' && styles.tabTextActive,
                ]}
              >
                Overview & Origin
              </Text>
            </Pressable>

            {product.brewGuide && (
              <Pressable
                onPress={() => setActiveTab('brewGuide')}
                style={[
                  styles.tabItem,
                  activeTab === 'brewGuide' && styles.tabItemActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'brewGuide' && styles.tabTextActive,
                  ]}
                >
                  Brew Recipe
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => setActiveTab('reviews')}
              style={[styles.tabItem, activeTab === 'reviews' && styles.tabItemActive]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'reviews' && styles.tabTextActive,
                ]}
              >
                Reviews ({product.reviews.length})
              </Text>
            </Pressable>
          </View>

          {/* TAB 1: OVERVIEW & TASTING */}
          {activeTab === 'overview' && (
            <View style={styles.tabContent}>
              {/* Roast Meter (for coffee) */}
              {product.roastLevel && (
                <View style={styles.sectionBlock}>
                  <RoastMeter level={product.roastLevel} />
                </View>
              )}

              {/* Tasting Notes */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Sensory Tasting Notes</Text>
                <View style={styles.tastingNotesWrap}>
                  {product.tastingNotes.map((note) => (
                    <Badge
                      key={note}
                      label={note}
                      variant="tasting-note"
                      style={styles.tastingNoteBadge}
                    />
                  ))}
                </View>
              </View>

              {/* Taste Profile Radar / Bars */}
              {product.tasteProfile && (
                <View style={styles.sectionBlock}>
                  <TasteProfileBar profile={product.tasteProfile} />
                </View>
              )}

              {/* Weight / Pack Size Selector */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Select Package Size</Text>
                <View style={styles.weightSelectorRow}>
                  {product.weightOptions.map((opt) => {
                    const isSelected = selectedWeight.label === opt.label;
                    const optPrice = Math.round(product.basePrice * opt.priceMultiplier);

                    return (
                      <Pressable
                        key={opt.label}
                        onPress={() => setSelectedWeight(opt)}
                        style={[
                          styles.weightCard,
                          isSelected && styles.weightCardSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.weightLabel,
                            isSelected && styles.weightLabelSelected,
                          ]}
                        >
                          {opt.label}
                        </Text>
                        <Text
                          style={[
                            styles.weightPrice,
                            isSelected && styles.weightPriceSelected,
                          ]}
                        >
                          {product.currency}
                          {optPrice}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Grind Selector */}
              {product.availableGrinds.length > 1 && (
                <View style={styles.sectionBlock}>
                  <GrindSelector
                    availableGrinds={product.availableGrinds}
                    selectedGrind={selectedGrind}
                    onSelectGrind={setSelectedGrind}
                  />
                </View>
              )}

              {/* Origin Story / Specs */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Farm & Origin Details</Text>
                <View style={styles.specsTable}>
                  {product.origin && (
                    <View style={styles.specRow}>
                      <Text style={styles.specKey}>Origin</Text>
                      <Text style={styles.specValue}>{product.origin}</Text>
                    </View>
                  )}
                  {product.region && (
                    <View style={styles.specRow}>
                      <Text style={styles.specKey}>Region / Washing Station</Text>
                      <Text style={styles.specValue}>{product.region}</Text>
                    </View>
                  )}
                  {product.farm && (
                    <View style={styles.specRow}>
                      <Text style={styles.specKey}>Farm / Estate</Text>
                      <Text style={styles.specValue}>{product.farm}</Text>
                    </View>
                  )}
                  {product.varietal && (
                    <View style={styles.specRow}>
                      <Text style={styles.specKey}>Cultivar / Varietal</Text>
                      <Text style={styles.specValue}>{product.varietal}</Text>
                    </View>
                  )}
                  {product.elevationMASL && (
                    <View style={styles.specRow}>
                      <Text style={styles.specKey}>Elevation</Text>
                      <Text style={styles.specValue}>{product.elevationMASL}</Text>
                    </View>
                  )}
                  {product.harvestDate && (
                    <View style={styles.specRow}>
                      <Text style={styles.specKey}>Harvest Window</Text>
                      <Text style={styles.specValue}>{product.harvestDate}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Roaster's Note */}
              <View style={styles.roasterNoteBox}>
                <View style={styles.roasterHeader}>
                  <BespokeIcon name="info" size={18} color={Colors.light.primary} />
                  <Text style={styles.roasterHeading}>Head Roaster’s Notes</Text>
                </View>
                <Text style={styles.roasterText}>{product.roasterStory}</Text>
              </View>
            </View>
          )}

          {/* TAB 2: BREW GUIDE */}
          {activeTab === 'brewGuide' && product.brewGuide && (
            <View style={styles.tabContent}>
              <View style={styles.brewCard}>
                <View style={styles.brewHeader}>
                  <BespokeIcon name="pourover" size={24} color={Colors.light.primary} />
                  <View style={styles.brewTitleCol}>
                    <Text style={styles.brewMethodTitle}>
                      {product.brewGuide.method}
                    </Text>
                    <Text style={styles.brewRatio}>
                      Brew Ratio: {product.brewGuide.ratio}
                    </Text>
                  </View>
                </View>

                {/* Metrics Grid */}
                <View style={styles.brewMetricsGrid}>
                  <View style={styles.brewMetricItem}>
                    <Text style={styles.brewMetricLabel}>Dose</Text>
                    <Text style={styles.brewMetricValue}>
                      {product.brewGuide.coffeeGrams}g
                    </Text>
                  </View>
                  <View style={styles.brewMetricItem}>
                    <Text style={styles.brewMetricLabel}>Water</Text>
                    <Text style={styles.brewMetricValue}>
                      {product.brewGuide.waterGrams}g
                    </Text>
                  </View>
                  <View style={styles.brewMetricItem}>
                    <Text style={styles.brewMetricLabel}>Temp</Text>
                    <Text style={styles.brewMetricValue}>
                      {product.brewGuide.temperatureCelsius}°C
                    </Text>
                  </View>
                  <View style={styles.brewMetricItem}>
                    <Text style={styles.brewMetricLabel}>Time</Text>
                    <Text style={styles.brewMetricValue}>
                      {Math.floor(product.brewGuide.brewTimeSeconds / 60)}m{' '}
                      {product.brewGuide.brewTimeSeconds % 60}s
                    </Text>
                  </View>
                </View>

                {/* Steps */}
                <Text style={styles.stepsTitle}>Step-by-Step Dial-in</Text>
                {product.brewGuide.steps.map((step, index) => (
                  <View key={index} style={styles.stepRow}>
                    <View style={styles.stepNumberCircle}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <View style={styles.tabContent}>
              {product.reviews.length === 0 ? (
                <View style={styles.noReviewsBox}>
                  <Text style={styles.noReviewsTitle}>Be the first to review!</Text>
                  <Text style={styles.noReviewsText}>
                    Brewed this lot? Share your extraction recipe and sensory experience with the community.
                  </Text>
                </View>
              ) : (
                product.reviews.map((rev) => (
                  <View key={rev.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View>
                        <Text style={styles.reviewAuthor}>{rev.author}</Text>
                        <View style={styles.reviewStars}>
                          {[...Array(rev.rating)].map((_, i) => (
                            <BespokeIcon
                              key={i}
                              name="star"
                              size={14}
                              color={Colors.light.amberGold}
                            />
                          ))}
                        </View>
                      </View>
                      <Text style={styles.reviewDate}>{rev.date}</Text>
                    </View>

                    {rev.brewMethodUsed && (
                      <Text style={styles.reviewMethod}>
                        Brewed with: {rev.brewMethodUsed}
                      </Text>
                    )}

                    <Text style={styles.reviewComment}>{rev.comment}</Text>
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Added to Cart Feedback Banner */}
      {addedToast && (
        <View style={styles.toast}>
          <BespokeIcon name="check" size={16} color="#FFFFFF" />
          <Text style={styles.toastText}>
            Added to your BrewBox! ({selectedWeight.label}, {selectedGrind})
          </Text>
        </View>
      )}

      {/* Sticky Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceCol}>
          <Text style={styles.bottomPriceLabel}>Total Price</Text>
          <Text style={styles.bottomPrice}>
            {product.currency}
            {currentPrice}
          </Text>
        </View>

        <View style={styles.btnRow}>
          <CustomButton
            title="Add to Cart"
            onPress={handleAddToCart}
            variant="outline"
            size="medium"
            style={styles.cartActionBtn}
          />
          <CustomButton
            title="Buy Now"
            onPress={handleBuyNow}
            variant="primary"
            size="medium"
            style={styles.buyActionBtn}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeTop: {
    backgroundColor: Colors.light.background,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.soft,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerRoasteryText: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageGalleryContainer: {
    width: '100%',
    height: 320,
    backgroundColor: '#F0ECE4',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailRow: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  thumbnail: {
    width: 46,
    height: 46,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: Colors.light.primary,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: Spacing.lg,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
    marginBottom: Spacing.sm,
  },
  productName: {
    ...Typography.displaySmall,
    color: Colors.light.espresso,
    marginBottom: 4,
  },
  tagline: {
    ...Typography.bodyMedium,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    ...Typography.labelLarge,
    color: Colors.light.textPrimary,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.success,
  },
  stockText: {
    ...Typography.labelSmall,
    color: Colors.light.success,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    marginVertical: Spacing.lg,
  },
  tabItem: {
    paddingVertical: Spacing.sm + 2,
    marginRight: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: Colors.light.primary,
  },
  tabText: {
    ...Typography.titleSmall,
    color: Colors.light.textMuted,
  },
  tabTextActive: {
    color: Colors.light.primaryDark,
    fontWeight: '700',
  },
  tabContent: {
    gap: Spacing.xl,
  },
  sectionBlock: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },
  tastingNotesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tastingNoteBadge: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
  },
  weightSelectorRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  weightCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.surface,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  weightCardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primarySubtle,
  },
  weightLabel: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },
  weightLabelSelected: {
    color: Colors.light.primaryDark,
    fontWeight: '700',
  },
  weightPrice: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
  },
  weightPriceSelected: {
    color: Colors.light.primaryDark,
    fontWeight: '600',
  },
  specsTable: {
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  specKey: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
  },
  specValue: {
    ...Typography.bodySmall,
    color: Colors.light.textPrimary,
    fontWeight: '600',
  },
  roasterNoteBox: {
    backgroundColor: '#F6F0E6',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md + 2,
    borderWidth: 1,
    borderColor: '#E7DCB8',
  },
  roasterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    marginBottom: Spacing.xs + 2,
  },
  roasterHeading: {
    ...Typography.titleSmall,
    color: Colors.light.primaryDark,
  },
  roasterText: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  brewCard: {
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  brewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  brewTitleCol: {
    flex: 1,
  },
  brewMethodTitle: {
    ...Typography.titleMedium,
    color: Colors.light.textPrimary,
  },
  brewRatio: {
    ...Typography.bodySmall,
    color: Colors.light.primaryDark,
    fontWeight: '600',
    marginTop: 2,
  },
  brewMetricsGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.lg,
  },
  brewMetricItem: {
    flex: 1,
    alignItems: 'center',
  },
  brewMetricLabel: {
    ...Typography.labelSmall,
    color: Colors.light.textMuted,
  },
  brewMetricValue: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
    marginTop: 2,
  },
  stepsTitle: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  stepNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    ...Typography.labelSmall,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    ...Typography.bodyMedium,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  reviewCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  reviewAuthor: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  reviewDate: {
    ...Typography.labelSmall,
    color: Colors.light.textMuted,
  },
  reviewMethod: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    fontStyle: 'italic',
    marginBottom: Spacing.xs,
  },
  reviewComment: {
    ...Typography.bodyMedium,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  noReviewsBox: {
    padding: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: BorderRadius.lg,
  },
  noReviewsTitle: {
    ...Typography.titleMedium,
    color: Colors.light.textPrimary,
  },
  noReviewsText: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  toast: {
    position: 'absolute',
    bottom: 95,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.light.espresso,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    flex: 1,
    ...Typography.bodySmall,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.floating,
  },
  priceCol: {
    justifyContent: 'center',
  },
  bottomPriceLabel: {
    ...Typography.labelSmall,
    color: Colors.light.textMuted,
  },
  bottomPrice: {
    ...Typography.priceLarge,
    color: Colors.light.espresso,
  },
  btnRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cartActionBtn: {
    minWidth: 110,
  },
  buyActionBtn: {
    minWidth: 120,
  },
});
