// We import types from other modules that the user types depend on.
import { ShippingAddress } from './order';
import { GrindOption, RoastLevel } from './product';

// ── UserTasteProfile ──────────────────────────────────────────────────────────
// Stores the user's coffee/tea preferences, collected via the Palate Matcher Quiz.
// These preferences are displayed on the Profile screen and used for recommendations.
export interface UserTasteProfile {
  preferredRoast: RoastLevel[];          // e.g. ['Light', 'Medium-Light']
  preferredBrewMethods: string[];        // e.g. ['Hario V60', 'AeroPress']
  tasteLeaning: 'Bright & Fruity' | 'Balanced & Sweet' | 'Dark & Chocolaty' | 'Adventurous';
  milkPreference: 'Black / Straight' | 'Oat Milk' | 'Dairy Milk' | 'Cold Foam';
  cupFrequencyDaily: number;             // How many cups of coffee/tea the user drinks per day
}

// ── UserProfile ───────────────────────────────────────────────────────────────
// The complete profile of the logged-in user.
// Stored in userStore and displayed on the Profile/Palate screen.
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;

  // memberTier is the loyalty program tier — earned by accumulating memberPoints.
  // Bronze → Gold → Connoisseur Black (higher tiers unlock exclusive micro-lots).
  memberTier: 'Artisan Bronze' | 'Roastery Gold' | 'Connoisseur Black';
  memberPoints: number;  // Points earned: 1 point per ₹10 spent

  tasteProfile: UserTasteProfile | null; // null until calibrated via CoffeeQuiz
  addresses: ShippingAddress[];          // Empty until added by user
  defaultGrindPreference: GrindOption | null; // null until selected by user
}

// ── RegisteredUser ───────────────────────────────────────────────────────────
// Stored locally in userStore. Keeps user registration credentials & local password.
export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string; // Kept in local state only
  createdAt: string;
}

