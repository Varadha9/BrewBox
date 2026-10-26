// Barrel export file for all TypeScript types and interfaces.
//
// Instead of importing from individual type files like:
//   import { Product } from '../types/product'
//   import { CartItem } from '../types/cart'
//   import { Order } from '../types/order'
//
// Any file in the project can now do a single clean import:
//   import { Product, CartItem, Order, UserProfile, RootStackParamList } from '../types'
//
// This is the standard "barrel export" pattern used throughout the codebase.
export * from './product';
export * from './cart';
export * from './order';
export * from './user';
export * from './navigation';
