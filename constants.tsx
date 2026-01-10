
import React from 'react';
import { 
  Gamepad2, MessageSquare, Youtube, Instagram, Twitter, Github, Monitor 
} from 'lucide-react';

export const NETWORK_FACTORS = {
  'wifi-fiber': 0.005,
  'wifi-dsl': 0.015,
  '4g-lte': 0.05,
  '5g': 0.03
};

export const DEVICE_FACTORS = {
  'smartphone': 0.05,
  'tablet': 0.1,
  'laptop': 0.3,
  'desktop-pc': 0.8,
  'gaming-rig': 2.5
};

export const CATEGORY_DATA_INTENSITY = {
  video: 50,
  social: 15,
  gaming: 25,
  work: 2,
  other: 5
};

export const MOCK_APPS = [
  { id: 'yt', name: 'YouTube', category: 'video', icon: <Youtube size={18} /> },
  { id: 'ig', name: 'Instagram', category: 'social', icon: <Instagram size={18} /> },
  { id: 'tw', name: 'Twitter', category: 'social', icon: <Twitter size={18} /> },
  { id: 'gh', name: 'GitHub', category: 'work', icon: <Github size={18} /> },
  { id: 'vs', name: 'VS Code', category: 'work', icon: <Monitor size={18} /> },
  { id: 'gm', name: 'Steam Gaming', category: 'gaming', icon: <Gamepad2 size={18} /> },
  { id: 'wa', name: 'WhatsApp', category: 'social', icon: <MessageSquare size={18} /> },
];

export const MOCK_REWARDS = [
  { id: '1', title: 'Solar Surfer', description: 'Kept emissions under 300g for 3 days.', unlocked: true, pointsRequired: 0 },
  { id: '2', title: 'Data Dieter', description: 'Reduced streaming usage by 20% this week.', unlocked: true, pointsRequired: 0 },
  { id: '3', title: 'Carbon Neutralizer', description: 'Reach 10kg of lifetime offsets.', unlocked: false, pointsRequired: 1000 },
  { id: '4', title: 'Fiber Fanatic', description: 'Use only Fiber connection for 7 days.', unlocked: false, pointsRequired: 500 },
];

export const GOAL_TARGET = 450;
export const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
