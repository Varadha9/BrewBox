/**
 * RootNavigator.tsx — Defines the full screen navigation structure.
 * Combines the bottom tab bar with full-screen pages like
 * Product Details, Checkout, and Order Tracking.
 */

import React from 'react';
// createNativeStackNavigator = screens stack on top of each other like cards
// "Native" = uses phone's built-in animations (faster than JS-based)
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  CheckoutScreen,
  OrderHistoryScreen,
  ProductDetailsScreen,
  SignInScreen,
  SignUpScreen,
} from '../screens';
import { useUserStore } from '../store';
// RootStackParamList = TypeScript type listing every screen + what data it needs
import { RootStackParamList } from '../types';
// BottomTabNavigator = the 5-tab bar (Home, Explore, Wishlist, Cart, Profile)
import { BottomTabNavigator } from './BottomTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useUserStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,            // We build custom headers per screen
        animation: 'slide_from_right', // Default: new screen slides in from right
      }}
    >
      {!isAuthenticated ? (
        // ── Auth Stack: User must sign up or sign in first ──
        <>
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </>
      ) : (
        // ── Main App Stack: Available only after authentication ──
        <>
          {/* Base layer — the 5-tab bar */}
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

          {/* Slides up from bottom when user taps a product card */}
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetailsScreen}
            options={{ animation: 'fade_from_bottom' }}
          />

          {/* Slides up from bottom — reinforces "next step" feel */}
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ animation: 'slide_from_bottom' }}
          />

          {/* Slides in from right — standard forward navigation */}
          <Stack.Screen
            name="OrderTracking"
            component={OrderHistoryScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
