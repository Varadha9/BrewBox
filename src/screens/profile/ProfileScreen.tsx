// ProfileScreen.tsx — User's account page showing membership tier, palate preferences,
// saved addresses, default grind, and an "About BrewBox" section.
// Also opens the CoffeeQuizModal for palate calibration.

import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, BespokeIcon, CustomButton } from '../../components';
import { useUserStore } from '../../store';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../theme';
import { GrindOption, Product } from '../../types';
import { CoffeeQuizModal } from './CoffeeQuizModal';

const AVAILABLE_GRINDS: GrindOption[] = [
  'Whole Bean',
  'Pour Over / V60 (Medium)',
  'Espresso (Fine)',
  'French Press (Coarse)',
  'Aeropress',
  'Moka Pot',
  'Cold Brew (Extra Coarse)',
];

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { profile, logout, addAddress, setDefaultGrindPreference } = useUserStore();
  const [quizVisible, setQuizVisible] = useState(false);

  // Address creation toggle & state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // If user is logged out, avoid rendering profile UI
  if (!profile) {
    return null;
  }

  // After quiz completes, navigate to the recommended product's details page
  const handleSelectQuizProduct = (product: Product) => {
    navigation.navigate('ProductDetails', { product });
  };

  const handleSaveAddress = () => {
    if (!street.trim() || !city.trim() || !postalCode.trim()) {
      Alert.alert('Incomplete Address', 'Please provide street address, city, and PIN code.');
      return;
    }

    addAddress({
      fullName: profile.name,
      phone: profile.phone,
      street: street.trim(),
      city: city.trim(),
      state: stateName.trim() || 'Maharashtra',
      postalCode: postalCode.trim(),
      isDefault: profile.addresses.length === 0,
    });

    setStreet('');
    setCity('');
    setStateName('');
    setPostalCode('');
    setShowAddAddress(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>MEMBER CONNOISSEUR DESK</Text>
        <Text style={styles.headerTitle}>Account & Palate</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Member Card ── avatar, name, email, loyalty tier + points */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <BespokeIcon name="coffee-bean" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.userEmail}>{profile.email}</Text>
            <View style={styles.badgeRow}>
              <Badge label={profile.memberTier} variant="micro-lot" style={styles.tierBadge} />
              <Text style={styles.pointsText}>{profile.memberPoints} Bean Rewards</Text>
            </View>
          </View>
        </View>

        {/* ── Palate Persona Card ── taste preferences from the quiz */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <BespokeIcon name="sparkles" size={18} color={Colors.light.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Your Palate Persona</Text>
              <Text style={styles.sectionSubtitle}>
                {profile.tasteProfile
                  ? 'Custom sensory calibration for curated drops'
                  : 'Sensory palate not calibrated yet'}
              </Text>
            </View>
          </View>

          {profile.tasteProfile ? (
            <>
              {/* Actual taste preferences answered in quiz */}
              <View style={styles.tasteBox}>
                <View style={styles.tasteRow}>
                  <Text style={styles.tasteKey}>Flavor Leaning:</Text>
                  <Text style={styles.tasteValue}>{profile.tasteProfile.tasteLeaning}</Text>
                </View>
                <View style={styles.tasteRow}>
                  <Text style={styles.tasteKey}>Favorite Brew Gear:</Text>
                  <Text style={styles.tasteValue}>
                    {profile.tasteProfile.preferredBrewMethods.join(', ')}
                  </Text>
                </View>
                <View style={styles.tasteRow}>
                  <Text style={styles.tasteKey}>Milk Ritual:</Text>
                  <Text style={styles.tasteValue}>{profile.tasteProfile.milkPreference}</Text>
                </View>
                <View style={styles.tasteRow}>
                  <Text style={styles.tasteKey}>Daily Frequency:</Text>
                  <Text style={styles.tasteValue}>
                    {profile.tasteProfile.cupFrequencyDaily} cups / day
                  </Text>
                </View>
              </View>

              <CustomButton
                title="Recalibrate Palate (Coffee Quiz)"
                onPress={() => setQuizVisible(true)}
                variant="outline"
                size="small"
                style={styles.quizBtn}
                icon={<BespokeIcon name="sliders" size={16} color={Colors.light.primary} />}
              />
            </>
          ) : (
            /* Uncalibrated empty state */
            <View style={styles.emptyCardBox}>
              <Text style={styles.emptyTitle}>No Sensory Calibration</Text>
              <Text style={styles.emptySubtext}>
                Take our 60-second coffee quiz to discover your personalized flavor profile and match single-origins to your brewing ritual.
              </Text>
              <CustomButton
                title="Calibrate My Palate (Take Quiz)"
                onPress={() => setQuizVisible(true)}
                variant="primary"
                size="small"
                style={{ alignSelf: 'flex-start' }}
                icon={<BespokeIcon name="sparkles" size={16} color="#FFFFFF" />}
              />
            </View>
          )}
        </View>

        {/* ── Saved Addresses ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <BespokeIcon name="map-pin" size={18} color={Colors.light.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Saved Delivery Addresses</Text>
              <Text style={styles.sectionSubtitle}>
                {profile.addresses.length > 0
                  ? `${profile.addresses.length} saved address`
                  : 'No default addresses set'}
              </Text>
            </View>
            {!showAddAddress && (
              <Pressable
                onPress={() => setShowAddAddress(true)}
                hitSlop={8}
                style={styles.addIconBtn}
              >
                <BespokeIcon name="plus" size={16} color={Colors.light.primary} />
                <Text style={styles.addBtnLabel}>Add</Text>
              </Pressable>
            )}
          </View>

          {profile.addresses.length > 0 ? (
            profile.addresses.map((addr) => (
              <View key={addr.id} style={styles.addressBox}>
                <View style={styles.addressTitleRow}>
                  <Text style={styles.addressName}>{addr.fullName}</Text>
                  {addr.isDefault && <Badge label="Default" variant="in-stock" />}
                </View>
                <Text style={styles.addressText}>{addr.street}</Text>
                <Text style={styles.addressText}>
                  {addr.city}, {addr.state} - {addr.postalCode}
                </Text>
                <Text style={styles.addressPhone}>{addr.phone}</Text>
              </View>
            ))
          ) : !showAddAddress ? (
            <View style={styles.emptyCardBox}>
              <Text style={styles.emptyTitle}>No Delivery Addresses Saved</Text>
              <Text style={styles.emptySubtext}>
                Add your delivery destination now or specify it during roastery checkout.
              </Text>
              <CustomButton
                title="+ Add Delivery Address"
                onPress={() => setShowAddAddress(true)}
                variant="outline"
                size="small"
                style={{ alignSelf: 'flex-start' }}
              />
            </View>
          ) : null}

          {/* Inline Add Address Form */}
          {showAddAddress && (
            <View style={styles.addAddressForm}>
              <Text style={styles.formSectionTitle}>New Delivery Address</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Street Address, Flat, Building"
                placeholderTextColor={Colors.light.textMuted}
                value={street}
                onChangeText={setStreet}
              />
              <View style={styles.formRow}>
                <TextInput
                  style={[styles.formInput, { flex: 1 }]}
                  placeholder="City"
                  placeholderTextColor={Colors.light.textMuted}
                  value={city}
                  onChangeText={setCity}
                />
                <TextInput
                  style={[styles.formInput, { flex: 1 }]}
                  placeholder="PIN Code"
                  placeholderTextColor={Colors.light.textMuted}
                  value={postalCode}
                  onChangeText={setPostalCode}
                  keyboardType="number-pad"
                />
              </View>
              <TextInput
                style={styles.formInput}
                placeholder="State (e.g. Maharashtra)"
                placeholderTextColor={Colors.light.textMuted}
                value={stateName}
                onChangeText={setStateName}
              />
              <View style={styles.formBtnRow}>
                <CustomButton
                  title="Save Address"
                  onPress={handleSaveAddress}
                  variant="primary"
                  size="small"
                  style={{ flex: 1 }}
                />
                <CustomButton
                  title="Cancel"
                  onPress={() => setShowAddAddress(false)}
                  variant="outline"
                  size="small"
                />
              </View>
            </View>
          )}
        </View>

        {/* ── Default Grind Preference ── one-click grind setting */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <BespokeIcon name="pourover" size={18} color={Colors.light.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Default Roastery Grind</Text>
              <Text style={styles.sectionSubtitle}>
                {profile.defaultGrindPreference
                  ? `Active: ${profile.defaultGrindPreference}`
                  : 'Not selected yet — choose your daily brewing style'}
              </Text>
            </View>
          </View>

          {/* Selectable Grind Chips */}
          <View style={styles.chipsContainer}>
            {AVAILABLE_GRINDS.map((grind) => {
              const isSelected = profile.defaultGrindPreference === grind;
              return (
                <Pressable
                  key={grind}
                  onPress={() => setDefaultGrindPreference(grind)}
                  style={[styles.grindChip, isSelected && styles.grindChipActive]}
                >
                  {isSelected && (
                    <BespokeIcon name="check" size={14} color="#FFFFFF" />
                  )}
                  <Text
                    style={[
                      styles.grindChipText,
                      isSelected && styles.grindChipTextActive,
                    ]}
                  >
                    {grind}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── About Card ── roastery story and app version */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About BrewBox Roastery</Text>
          <Text style={styles.aboutText}>
            BrewBox was founded by Varad Vikas Mandhare to celebrate the dedication of smallholder coffee farmers and artisan tea growers worldwide. Every batch is roasted micro-lot by micro-lot with uncompromised craft.
          </Text>
          <Text style={styles.versionText}>Version 1.0.0 • Artisanal Edition</Text>
        </View>

        {/* ── Sign Out Button ── */}
        <View style={styles.signOutCard}>
          <CustomButton
            title="Sign Out of Roastery"
            onPress={logout}
            variant="outline"
            icon={<BespokeIcon name="log-out" size={18} color={Colors.light.error} />}
            iconPosition="left"
            fullWidth
            style={styles.signOutButton}
          />
        </View>
      </ScrollView>

      {/* ── Coffee Quiz Modal ── */}
      <CoffeeQuizModal
        visible={quizVisible}
        onClose={() => setQuizVisible(false)}
        onSelectProduct={handleSelectQuizProduct}
      />
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
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
    gap: Spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.soft,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDetails: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  userName: {
    ...Typography.titleLarge,
    color: Colors.light.textPrimary,
  },
  userEmail: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 2,
  },
  tierBadge: {
    backgroundColor: '#FAF3E8',
    borderColor: '#DEB887',
  },
  pointsText: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.soft,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    color: Colors.light.textPrimary,
  },
  sectionSubtitle: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  tasteBox: {
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs + 2,
    marginBottom: Spacing.md,
  },
  tasteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  tasteKey: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
  },
  tasteValue: {
    ...Typography.bodySmall,
    color: Colors.light.primaryDark,
    fontWeight: '600',
  },
  quizBtn: {
    alignSelf: 'flex-start',
  },
  emptyCardBox: {
    backgroundColor: '#FAF7F2',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: Spacing.xs,
  },
  emptyTitle: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
    fontWeight: '700',
  },
  emptySubtext: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  addIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.light.primaryLight,
    gap: 4,
  },
  addBtnLabel: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    fontWeight: '700',
  },
  addressBox: {
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.sm,
  },
  addressTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressName: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
  },
  addressText: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  addressPhone: {
    ...Typography.bodySmall,
    color: Colors.light.primaryDark,
    marginTop: 4,
    fontWeight: '600',
  },
  addAddressForm: {
    backgroundColor: '#FAF7F2',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.borderStrong,
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  formSectionTitle: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  formInput: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Typography.bodySmall,
    color: Colors.light.textPrimary,
  },
  formRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  formBtnRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  grindChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.light.borderStrong,
    backgroundColor: Colors.light.surfaceElevated,
    gap: 6,
  },
  grindChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  grindChipText: {
    ...Typography.bodySmall,
    color: Colors.light.textPrimary,
    fontWeight: '500',
  },
  grindChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  aboutCard: {
    backgroundColor: '#FAF5EE',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E8DCB8',
    alignItems: 'center',
  },
  aboutTitle: {
    ...Typography.titleSmall,
    color: Colors.light.primaryDark,
    marginBottom: Spacing.xs,
  },
  aboutText: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  versionText: {
    ...Typography.labelSmall,
    color: Colors.light.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  signOutCard: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  signOutButton: {
    borderColor: '#E8B4B8',
    backgroundColor: '#FFF8F8',
  },
});
