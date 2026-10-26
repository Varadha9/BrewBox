/**
 * SignInScreen.tsx — User authentication screen for BrewBox.
 *
 * Allows registered users to sign in with:
 * - Email and Password
 * - Real-time client-side verification against locally stored accounts in userStore
 * - Clean error alerts for unregistered email or wrong password
 * - Direct navigation to SignUpScreen for new users
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

interface SignInScreenProps {
  navigation: any;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const { login } = useUserStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Brief simulation for smooth UX
    setTimeout(() => {
      const result = login(email, password);
      setIsLoading(false);

      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials.');
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

          {/* ── Welcome Heading ── */}
          <View style={styles.headerCard}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in with your email and password to access your curated micro-lots, bean rewards, and order tracking.
            </Text>
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

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <BespokeIcon name="lock" size={18} color={Colors.light.textSecondary} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
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

            {/* Sign In CTA */}
            <CustomButton
              title="Sign In to Roastery"
              onPress={handleSignIn}
              loading={isLoading}
              variant="primary"
              size="large"
              fullWidth
              style={styles.submitButton}
            />
          </View>

          {/* ── Switch to Sign Up ── */}
          <View style={styles.switchAuthRow}>
            <Text style={styles.switchAuthText}>New to BrewBox?</Text>
            <Pressable onPress={() => navigation.navigate('SignUp')} hitSlop={8}>
              <Text style={styles.switchAuthLink}> Create an Account</Text>
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
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
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
