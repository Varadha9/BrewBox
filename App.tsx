/**
 * App.tsx — ROOT of the entire BrewBox application.
 * This is the first file React Native runs. It wraps the whole app
 * with safe area support, navigation, and our brand theme.
 */

import React from 'react';
// StatusBar = phone's top bar (battery, time icons)
// StyleSheet = define styles (like CSS)
// useColorScheme = detect if phone is in dark/light mode
// View = basic layout box (like a <div>)
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
// NavigationContainer = required root wrapper for all navigation
// DefaultTheme = default nav colors we customize with our brand palette
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// SafeAreaProvider = prevents content from hiding behind phone notch/status bar
import { SafeAreaProvider } from 'react-native-safe-area-context';
// RootNavigator = our full screen & tab navigation setup
import { RootNavigator } from './src/navigation';
// Colors = our centralized brand color tokens
import { Colors } from './src/theme';

// Override React Navigation's default colors with BrewBox brand colors
const BrewBoxTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.primary,        // Terracotta amber
    background: Colors.light.background,  // Warm parchment
    card: Colors.light.surface,           // White card surface
    text: Colors.light.textPrimary,       // Deep espresso text
    border: Colors.light.border,          // Warm sand border
  },
};

function App(): React.JSX.Element {
  // Reads phone's dark/light mode setting
  const isDarkMode = useColorScheme() === 'dark';

  return (
    // Wraps entire app — enables safe area insets on all child screens
    <SafeAreaProvider>
      <View style={styles.rootContainer}>
        {/* Adjusts status bar icon color based on dark/light mode */}
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        {/* Holds all navigation state — which screen is active, history, etc. */}
        <NavigationContainer theme={BrewBoxTheme}>
          {/* All screens and tabs are defined inside RootNavigator */}
          <RootNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,                                   // Fill entire screen
    backgroundColor: Colors.light.background,  // Warm parchment base
  },
});

export default App;
