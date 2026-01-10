
export type DeviceType = 'smartphone' | 'tablet' | 'laptop' | 'desktop-pc' | 'gaming-rig';
export type NetworkType = 'wifi-fiber' | 'wifi-dsl' | '4g-lte' | '5g';
export type ActiveTab = 'dash' | 'logs' | 'stats' | 'rewards' | 'settings';

export interface DeviceProfile {
  type: DeviceType;
  network: NetworkType;
}

export interface AppUsage {
  id: string;
  name: string;
  category: 'social' | 'video' | 'gaming' | 'work' | 'other';
  durationMinutes: number;
  carbonEmissionsGrams: number;
}

export interface DailySummary {
  date: string;
  totalEmissionsGrams: number;
  usageBreakdown: AppUsage[];
  profile: DeviceProfile;
}

export interface AIInsight {
  title: string;
  description: string;
  impactLevel: 'low' | 'medium' | 'high';
  actionableTip: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  pointsRequired: number;
}
