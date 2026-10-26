// ProfileScreen.tsx — User's account page showing membership tier, palate preferences,
// saved addresses, default grind, and an "About BrewBox" section.
// Also opens the CoffeeQuizModal for palate recalibration.

import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, BespokeIcon, CustomButton } from '../../components';
// useUserStore — reads the logged-in user's profile data
import { useUserStore } from '../../store';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../theme';
import { Product } from '../../types';
// CoffeeQuizModal — the 3-step palate matcher quiz shown as a bottom sheet
import { CoffeeQuizModal } from './CoffeeQuizModal';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  // profile = full user object (name, email, tier, taste preferences, addresses)
  const { profile } = useUserStore();
  // quizVisible = controls whether the Palate Matcher quiz modal is open
  const [quizVisible, setQuizVisible] = useState(false);

  // After quiz completes, navigate to the recommended product's details page
  const handleSelectQuizProduct = (product: Product) => {
    navigation.navigate('ProductDetails', { product });
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
          {/* Avatar circle with coffee bean icon */}
          <View style={styles.avatarCircle}>
            <BespokeIcon name="coffee-bean" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.userEmail}>{profile.email}</Text>
            <View style={styles.badgeRow}>
              {/* Loyalty tier badge — Bronze / Gold / Connoisseur Black */}
              <Badge label={profile.memberTier} variant="micro-lot" style={styles.tierBadge} />
              {/* Points earned: 1 point per ₹10 spent */}
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
              <Text style={styles.sectionSubtitle}>Custom sensory calibration for curated drops</Text>
            </View>
          </View>

          {/* Taste preference key-value rows */}
          <View style={styles.tasteBox}>
            <View style={styles.tasteRow}>
              <Text style={styles.tasteKey}>Flavor Leaning:</Text>
              <Text style={styles.tasteValue}>{profile.tasteProfile.tasteLeaning}</Text>
            </View>
            <View style={styles.tasteRow}>
              <Text style={styles.tasteKey}>Favorite Brew Gear:</Text>
              {/* Join multiple brew methods with comma */}
              <Text style={styles.tasteValue}>{profile.tasteProfile.preferredBrewMethods.join(', ')}</Text>
            </View>
            <View style={styles.tasteRow}>
              <Text style={styles.tasteKey}>Milk Ritual:</Text>
              <Text style={styles.tasteValue}>{profile.tasteProfile.milkPreference}</Text>
            </View>
            <View style={styles.tasteRow}>
              <Text style={styles.tasteKey}>Daily Frequency:</Text>
              <Text style={styles.tasteValue}>{profile.tasteProfile.cupFrequencyDaily} cups / day</Text>
            </View>
          </View>

          {/* Button to open the quiz and recalibrate taste profile */}
          <CustomButton
            title="Recalibrate Palate (Coffee Quiz)"
            onPress={() => setQuizVisible(true)}
            variant="outline"
            size="small"
            style={styles.quizBtn}
            icon={<BespokeIcon name="sliders" size={16} color={Colors.light.primary} />}
          />
        </View>

        {/* ── Saved Addresses ── list of delivery addresses */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <BespokeIcon name="map-pin" size={18} color={Colors.light.primary} />
            </View>
            <Text style={styles.sectionTitle}>Saved Addresses</Text>
          </View>

          {profile.addresses.map((addr) => (
            <View key={addr.id} style={styles.addressBox}>
              <View style={styles.addressTitleRow}>
                <Text style={styles.addressName}>{addr.fullName}</Text>
                {/* Show "Default" badge on the pre-selected address */}
                {addr.isDefault && <Badge label="Default" variant="in-stock" />}
              </View>
              <Text style={styles.addressText}>{addr.street}</Text>
              <Text style={styles.addressText}>
                {addr.city}, {addr.state} - {addr.postalCode}
              </Text>
              <Text style={styles.addressPhone}>{addr.phone}</Text>
            </View>
          ))}
        </View>

        {/* ── Default Grind Preference ── one-click grind setting */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <BespokeIcon name="pourover" size={18} color={Colors.light.primary} />
            </View>
            <Text style={styles.sectionTitle}>Default Roastery Grind</Text>
          </View>
          {/* Shows the grind pre-selected on product details screen */}
          <View style={styles.prefRow}>
            <Text style={styles.prefKey}>One-Click Grind Setting:</Text>
            <Text style={styles.prefValue}>{profile.defaultGrindPreference}</Text>
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
      </ScrollView>

      {/* ── Coffee Quiz Modal ── slides up from bottom when quiz button is tapped */}
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
  // Horizontal card: avatar left, details right
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
  // Amber circle avatar
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
  // Row: tier badge + points text
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
  // White card used for each section block
  sectionCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.soft,
  },
  // Icon circle + title row at top of each section
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    ...Typography.titleMedium,
    color: Colors.light.textPrimary,
  },
  sectionSubtitle: {
    ...Typography.bodySmall,
    color: Colors.light.textMuted,
    fontSize: 12,
  },
  // Latte cream box holding taste preference rows
  tasteBox: {
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs + 2,
    marginBottom: Spacing.md,
  },
  // Each key-value row inside taste box
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
  // Address box with subtle border
  addressBox: {
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
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
  // Single row showing default grind preference
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surfaceElevated,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  prefKey: {
    ...Typography.bodyMedium,
    color: Colors.light.textSecondary,
  },
  prefValue: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.light.primaryDark,
  },
  // Warm parchment about card at the bottom
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
});
