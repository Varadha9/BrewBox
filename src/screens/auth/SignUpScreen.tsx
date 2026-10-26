/**
 * SignUpScreen.tsx — User registration screen for BrewBox.
 *
 * Allows new users to create an artisanal roastery account with:
 * - Full Name, Email, Phone, Password, and Confirm Password
 * - Real-time client-side validation
 * - Passwords stored locally in Zustand store (userStore)
 * - Automatic welcome bonus: 100 Bean Rewards + Artisan Bronze status
 */

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BespokeIcon, CustomButton } from '../../components';
import { useUserStore } from '../../store';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../theme';

interface SignUpScreenProps {
  navigation: any;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { signup } = useUserStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = () => {
    setErrorMessage(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Please enter your phone number.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter a password.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);

    // Simulate brief local processing for smooth native feedback
    setTimeout(() => {
      const result = signup({
        name,
        email,
        phone,
        password,
      });

      setIsLoading(false);

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to create account.');
      }
      // On success, isAuthenticated becomes true, RootNavigator automatically
      // transitions to MainTabs.
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Brand Monogram & Header ── */}
          <View style={styles.brandHeader}>
            <View style={styles.logoBadge}>
              <BespokeIcon name="coffee-bean" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.brandTitle}>BrewBox</Text>
            <Text style={styles.brandSubtitle}>ARTISANAL ROASTERY & BOTANICALS</Text>
          </View>

          {/* ── Welcome & Incentive Card ── */}
          <View style={styles.headerCard}>
            <Text style={styles.title}>Join the Roastery</Text>
            <Text style={styles.subtitle}>
              Create your account to unlock small-batch micro-lots, custom grind dial-ins, and peak-freshness order tracking.
            </Text>

            <View style={styles.incentiveBadge}>
              <BespokeIcon name="sparkles" size={16} color={Colors.light.primary} />
              <Text style={styles.incentiveText}>
                Earn Bean Rewards On Every Order • Artisan Bronze Tier
              </Text>
            </View>
          </View>

          {/* ── Error Banner ── */}
          {errorMessage && (
            <View style={styles.errorBanner}>
              <BespokeIcon name="close" size={16} color={Colors.light.error} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* ── Form Inputs ── */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>FULL NAME</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <BespokeIcon name="user" size={18} color={Colors.light.textSecondary} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Varad Mandhare"
                  placeholderTextColor={Colors.light.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <BespokeIcon name="mail" size={18} color={Colors.light.textSecondary} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="you@brewbox.craft"
                  placeholderTextColor={Colors.light.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PHONE NUMBER (FOR DELIVERY DISPATCH)</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <BespokeIcon name="truck" size={18} color={Colors.light.textSecondary} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="+91 98765 43210"
                  placeholderTextColor={Colors.light.textMuted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <BespokeIcon name="lock" size={18} color={Colors.light.textSecondary} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="At least 4 characters"
                  placeholderTextColor={Colors.light.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  style={styles.visibilityToggle}
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={8}
                >
                  <BespokeIcon
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={Colors.light.textSecondary}
                  />
                </Pressable>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <BespokeIcon name="lock" size={18} color={Colors.light.textSecondary} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Re-enter password"
                  placeholderTextColor={Colors.light.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  style={styles.visibilityToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  hitSlop={8}
                >
                  <BespokeIcon
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={Colors.light.textSecondary}
                  />
                </Pressable>
              </View>
            </View>

            {/* Action CTA */}
            <CustomButton
              title="Create Roastery Account"
              onPress={handleSignUp}
              loading={isLoading}
              variant="primary"
              size="large"
              fullWidth
              style={styles.submitButton}
            />
          </View>

          {/* ── Switch to Sign In ── */}
          <View style={styles.switchAuthRow}>
            <Text style={styles.switchAuthText}>Already have a BrewBox account?</Text>
            <Pressable onPress={() => navigation.navigate('SignIn')} hitSlop={8}>
              <Text style={styles.switchAuthLink}> Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.soft,
  },
  brandTitle: {
    ...Typography.headlineMedium,
    color: Colors.light.espresso,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  headerCard: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.headlineSmall,
    color: Colors.light.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  incentiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF3E8',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E8DCB8',
    gap: Spacing.sm,
  },
  incentiveText: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    fontWeight: '700',
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECEC',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: '#F5C2C7',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.light.error,
    flex: 1,
  },
  formContainer: {
    gap: Spacing.md,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  inputLabel: {
    ...Typography.labelSmall,
    color: Colors.light.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.borderStrong,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 52,
    ...Shadows.soft,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    ...Typography.bodyMedium,
    color: Colors.light.textPrimary,
    paddingVertical: 0,
  },
  visibilityToggle: {
    padding: Spacing.xs,
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
  switchAuthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  switchAuthText: {
    ...Typography.bodyMedium,
    color: Colors.light.textSecondary,
  },
  switchAuthLink: {
    ...Typography.bodyMedium,
    color: Colors.light.primary,
    fontWeight: '700',
  },
});
