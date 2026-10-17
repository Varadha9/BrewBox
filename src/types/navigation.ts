import { NavigatorScreenParams } from '@react-navigation/native';
import { Product } from './product';

export type MainTabParamList = {
  HomeTab: undefined;
  ExploreTab: { initialCategory?: string };
  WishlistTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  ProductDetails: { product: Product };
  Checkout: undefined;
  OrderTracking: { orderId: string };
  CoffeeQuiz: undefined;
  BrewGuideDetails: { product: Product };
};
