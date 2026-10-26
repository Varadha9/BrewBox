// NavigatorScreenParams is a React Navigation utility type.
// It allows a screen in one navigator to accept the params of a nested navigator.
// We use it so RootStack's "MainTabs" screen can accept tab-level params.
import { NavigatorScreenParams } from '@react-navigation/native';

// Product is needed because ProductDetails and BrewGuideDetails screens
// receive a full Product object as a navigation parameter.
import { Product } from './product';

// ── MainTabParamList ──────────────────────────────────────────────────────────
// Defines the 5 screens in the BottomTabNavigator and what params each accepts.
// `undefined` means the screen takes no navigation parameters.
// TypeScript uses this to validate navigate() calls — no typos, no missing params.
export type MainTabParamList = {
  HomeTab: undefined;
  ExploreTab: { initialCategory?: string }; // Optional: pre-select a category filter
  WishlistTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};

// ── RootStackParamList ────────────────────────────────────────────────────────
// Defines all screens in the RootNavigator (the full-screen stack on top of tabs).
// This is the complete navigation map of the entire app.
export type RootStackParamList = {
  // ── Auth Stack ──
  SignUp: undefined;
  SignIn: undefined;

  // ── Main App Stack ──
  // MainTabs wraps the entire bottom tab navigator.
  // NavigatorScreenParams<MainTabParamList> allows passing tab-level params through.
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;

  // ProductDetails receives the full product object so it doesn't need to re-fetch data.
  ProductDetails: { product: Product };

  // Checkout takes no params — it reads cart state directly from cartStore.
  Checkout: undefined;

  // OrderTracking receives the orderId to look up the order in userStore.
  OrderTracking: { orderId: string };

  // CoffeeQuiz is the Palate Matcher modal — no params needed.
  CoffeeQuiz: undefined;

  // BrewGuideDetails shows the full brew guide for a specific product.
  BrewGuideDetails: { product: Product };
};
