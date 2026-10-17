import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BespokeIcon,
  CustomButton,
  ProductCard,
  SearchBar,
} from '../../components';
import { CATEGORIES, PRODUCTS } from '../../data';
import { useFilterStore } from '../../store';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';
import { Product, RoastLevel } from '../../types';

interface ExploreScreenProps {
  navigation: any;
  route: any;
}

const ROAST_OPTIONS: (RoastLevel | 'all')[] = [
  'all',
  'Light',
  'Medium-Light',
  'Medium',
  'Medium-Dark',
  'Dark',
];

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  navigation,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedRoast,
    setSelectedRoast,
    selectedSort,
    setSelectedSort,
    onlyMicroLots,
    toggleMicroLots,
    resetFilters,
  } = useFilterStore();

  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Roast filter
      if (selectedRoast !== 'all' && item.roastLevel !== selectedRoast) {
        return false;
      }

      // Micro-lot filter
      if (onlyMicroLots && !item.isMicroLot) {
        return false;
      }

      // Search query
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesOrigin = item.origin?.toLowerCase().includes(query);
        const matchesNotes = item.tastingNotes.some((n) =>
          n.toLowerCase().includes(query)
        );
        const matchesTagline = item.tagline.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);

        if (
          !matchesName &&
          !matchesOrigin &&
          !matchesNotes &&
          !matchesTagline &&
          !matchesCategory
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'price-low') {
        return a.basePrice - b.basePrice;
      }
      if (selectedSort === 'price-high') {
        return b.basePrice - a.basePrice;
      }
      if (selectedSort === 'rating') {
        return b.rating - a.rating;
      }
      return 0; // featured default order
    });
  }, [selectedCategory, selectedRoast, onlyMicroLots, searchQuery, selectedSort]);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails', { product });
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedRoast !== 'all' ||
    onlyMicroLots ||
    selectedSort !== 'featured';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Search & Filter Bar */}
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search origins, notes (e.g. Jasmine, Peach)..."
          onFilterPress={() => setFilterModalVisible(true)}
          hasActiveFilters={hasActiveFilters}
        />
      </View>

      {/* Category Pills */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id as any)}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextSelected,
                  ]}
                >
                  {cat.shortLabel}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Quick Filter Bar (Roast & Micro-lot) */}
      {selectedCategory === 'coffee' || selectedCategory === 'all' ? (
        <View style={styles.subFilterWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subFilterScroll}
          >
            {ROAST_OPTIONS.map((roast) => {
              const isSelected = selectedRoast === roast;
              return (
                <Pressable
                  key={roast}
                  onPress={() => setSelectedRoast(roast)}
                  style={[
                    styles.roastPill,
                    isSelected && styles.roastPillSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.roastPillText,
                      isSelected && styles.roastPillTextSelected,
                    ]}
                  >
                    {roast === 'all' ? 'All Roasts' : `${roast}`}
                  </Text>
                </Pressable>
              );
            })}

            <Pressable
              onPress={toggleMicroLots}
              style={[
                styles.roastPill,
                onlyMicroLots && styles.microLotPillSelected,
              ]}
            >
              <Text
                style={[
                  styles.roastPillText,
                  onlyMicroLots && styles.microLotPillTextSelected,
                ]}
              >
                ✨ Micro-Lots Only
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      ) : null}

      {/* Results Header */}
      <View style={styles.resultsInfoRow}>
        <Text style={styles.resultsCount}>
          Showing {filteredProducts.length} specialty items
        </Text>
        {hasActiveFilters && (
          <Pressable onPress={resetFilters}>
            <Text style={styles.clearFiltersText}>Reset Filters</Text>
          </Pressable>
        )}
      </View>

      {/* Product Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContent}
      >
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <BespokeIcon
              name="coffee-bean"
              size={48}
              color={Colors.light.borderStrong}
            />
            <Text style={styles.emptyTitle}>No Offerings Found</Text>
            <Text style={styles.emptySubtitle}>
              Try clearing your search term or adjusting roast and category filters.
            </Text>
            <CustomButton
              title="Reset All Filters"
              onPress={resetFilters}
              variant="outline"
              size="small"
              style={styles.emptyBtn}
            />
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => handleProductPress(product)}
                style={styles.gridCard}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Filter Bottom Sheet / Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Refine Offerings</Text>
              <Pressable
                onPress={() => setFilterModalVisible(false)}
                hitSlop={8}
              >
                <BespokeIcon name="close" size={22} color={Colors.light.textPrimary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Sort By */}
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              <View style={styles.optionsWrap}>
                {[
                  { id: 'featured', label: 'Featured Curations' },
                  { id: 'price-low', label: 'Price: Low to High' },
                  { id: 'price-high', label: 'Price: High to Low' },
                  { id: 'rating', label: 'Top Rated by Connoisseurs' },
                ].map((sort) => (
                  <Pressable
                    key={sort.id}
                    onPress={() => setSelectedSort(sort.id as any)}
                    style={[
                      styles.modalOptionPill,
                      selectedSort === sort.id && styles.modalOptionPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        selectedSort === sort.id && styles.modalOptionTextActive,
                      ]}
                    >
                      {sort.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Micro Lots */}
              <Text style={styles.filterSectionTitle}>Exclusivity</Text>
              <Pressable
                onPress={toggleMicroLots}
                style={[
                  styles.checkboxRow,
                  onlyMicroLots && styles.checkboxRowActive,
                ]}
              >
                <View style={styles.checkboxBox}>
                  {onlyMicroLots && (
                    <BespokeIcon name="check" size={14} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>
                  Show only rare micro-lot & auction lots
                </Text>
              </Pressable>
            </ScrollView>

            <View style={styles.modalFooter}>
              <CustomButton
                title="Apply Filters"
                onPress={() => setFilterModalVisible(false)}
                fullWidth
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.light.background,
  },
  categoriesWrapper: {
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  categoriesScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 3,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryPillSelected: {
    backgroundColor: Colors.light.espresso,
    borderColor: Colors.light.espresso,
  },
  categoryPillText: {
    ...Typography.labelLarge,
    color: Colors.light.textSecondary,
  },
  categoryPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  subFilterWrapper: {
    paddingVertical: Spacing.xs + 2,
    backgroundColor: '#F7F3EC',
  },
  subFilterScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs + 2,
  },
  roastPill: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  roastPillSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  microLotPillSelected: {
    backgroundColor: '#FAF3E8',
    borderColor: '#D4A373',
  },
  roastPillText: {
    ...Typography.labelSmall,
    color: Colors.light.textSecondary,
  },
  roastPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  microLotPillTextSelected: {
    color: '#96531A',
    fontWeight: '700',
  },
  resultsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  resultsCount: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  clearFiltersText: {
    ...Typography.labelSmall,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  gridContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  gridCard: {
    width: '47.5%',
  },
  emptyContainer: {
    paddingVertical: Spacing.huge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...Typography.titleMedium,
    color: Colors.light.textPrimary,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.xl,
  },
  emptyBtn: {
    marginTop: Spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.light.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    ...Typography.titleLarge,
    color: Colors.light.textPrimary,
  },
  filterSectionTitle: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  modalOptionPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  modalOptionPillActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  modalOptionText: {
    ...Typography.bodySmall,
    color: Colors.light.textPrimary,
  },
  modalOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  checkboxRowActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primarySubtle,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  checkboxLabel: {
    ...Typography.bodyMedium,
    color: Colors.light.textPrimary,
  },
  modalFooter: {
    marginTop: Spacing.xl,
  },
});
