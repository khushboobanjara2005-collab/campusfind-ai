import React from 'react';
import {
  CupSoda,
  Laptop,
  Backpack,
  Wallet,
  Key,
  Book,
  Shirt,
  Glasses,
  Watch,
  HelpCircle,
} from 'lucide-react';
import { ItemCategory } from '../types';

interface CategoryIconProps {
  category: ItemCategory;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  className = '',
  size = 'md',
}) => {
  const getIconData = () => {
    switch (category) {
      case 'Bottles & Tumblers':
        return { Icon: CupSoda, bg: 'bg-cyan-50 text-cyan-600 border-cyan-100' };
      case 'Electronics & Gadgets':
        return { Icon: Laptop, bg: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'Bags & Backpacks':
        return { Icon: Backpack, bg: 'bg-amber-50 text-amber-600 border-amber-100' };
      case 'Wallets & Identification':
        return { Icon: Wallet, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
      case 'Keys & Access Badges':
        return { Icon: Key, bg: 'bg-purple-50 text-purple-600 border-purple-100' };
      case 'Books & Notebooks':
        return { Icon: Book, bg: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
      case 'Clothing & Wearables':
        return { Icon: Shirt, bg: 'bg-rose-50 text-rose-600 border-rose-100' };
      case 'Eyewear':
        return { Icon: Glasses, bg: 'bg-teal-50 text-teal-600 border-teal-100' };
      case 'Jewelry & Accessories':
        return { Icon: Watch, bg: 'bg-yellow-50 text-yellow-600 border-yellow-100' };
      default:
        return { Icon: HelpCircle, bg: 'bg-slate-50 text-slate-600 border-slate-100' };
    }
  };

  const { Icon, bg } = getIconData();
  const dimensionClass =
    size === 'lg'
      ? 'w-12 h-12 rounded-2xl'
      : size === 'md'
      ? 'w-10 h-10 rounded-xl'
      : 'w-7 h-7 rounded-lg';
  const iconSizeClass = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5';

  return (
    <div
      className={`flex items-center justify-center border shrink-0 transition-transform ${bg} ${dimensionClass} ${className}`}
    >
      <Icon className={iconSizeClass} />
    </div>
  );
};
