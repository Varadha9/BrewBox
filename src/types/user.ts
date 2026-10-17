import { ShippingAddress } from './order';
import { GrindOption, RoastLevel } from './product';

export interface UserTasteProfile {
  preferredRoast: RoastLevel[];
  preferredBrewMethods: string[];
  tasteLeaning: 'Bright & Fruity' | 'Balanced & Sweet' | 'Dark & Chocolaty' | 'Adventurous';
  milkPreference: 'Black / Straight' | 'Oat Milk' | 'Dairy Milk' | 'Cold Foam';
  cupFrequencyDaily: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberTier: 'Artisan Bronze' | 'Roastery Gold' | 'Connoisseur Black';
  memberPoints: number;
  tasteProfile: UserTasteProfile;
  addresses: ShippingAddress[];
  defaultGrindPreference: GrindOption;
}
