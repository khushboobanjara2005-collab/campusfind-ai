import { ItemCategory, ItemColor } from '../types';

export const CATEGORIES: { label: ItemCategory; iconName: string }[] = [
  { label: 'Bottles & Tumblers', iconName: 'CupSoda' },
  { label: 'Electronics & Gadgets', iconName: 'Laptop' },
  { label: 'Bags & Backpacks', iconName: 'Backpack' },
  { label: 'Wallets & Identification', iconName: 'Wallet' },
  { label: 'Keys & Access Badges', iconName: 'Key' },
  { label: 'Books & Notebooks', iconName: 'Book' },
  { label: 'Clothing & Wearables', iconName: 'Shirt' },
  { label: 'Eyewear', iconName: 'Glasses' },
  { label: 'Jewelry & Accessories', iconName: 'Watch' },
  { label: 'Other', iconName: 'HelpCircle' },
];

export const COLORS: { label: ItemColor; hex: string }[] = [
  { label: 'Black', hex: '#111827' },
  { label: 'Blue', hex: '#3B82F6' },
  { label: 'Silver / Grey', hex: '#9CA3AF' },
  { label: 'White', hex: '#F9FAFB' },
  { label: 'Red', hex: '#EF4444' },
  { label: 'Green', hex: '#10B981' },
  { label: 'Gold / Yellow', hex: '#F59E0B' },
  { label: 'Brown', hex: '#78350F' },
  { label: 'Pink / Purple', hex: '#A855F7' },
  { label: 'Multi-color / Pattern', hex: 'linear-gradient(135deg, #EC4899, #8B5CF6, #3B82F6)' },
];
