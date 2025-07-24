import {
  Shield,
  Trophy,
  Star,
  Book,
  Crown,
  Users,
  Zap,
  Gem,
  LucideIcon,
} from 'lucide-react';

type IconName =
  | 'shield'
  | 'trophy'
  | 'star'
  | 'book'
  | 'crown'
  | 'users'
  | 'zap'
  | 'gem';

type IconColor =
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'gray'
  | 'indigo'
  | 'slate';

const iconMap: Record<IconName, LucideIcon> = {
  shield: Shield,
  trophy: Trophy,
  star: Star,
  book: Book,
  crown: Crown,
  users: Users,
  zap: Zap,
  gem: Gem,
};

const bgColorMap: Record<IconColor, string> = {
  blue: 'bg-blue-100',
  yellow: 'bg-yellow-100',
  purple: 'bg-purple-100',
  orange: 'bg-orange-100',
  pink: 'bg-pink-100',
  gray: 'bg-gray-100',
  indigo: 'bg-indigo-100',
  slate: 'bg-slate-100',
};

const iconColorMap: Record<IconColor, string> = {
  blue: 'text-blue-600',
  yellow: 'text-yellow-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
  pink: 'text-pink-600',
  gray: 'text-gray-600',
  indigo: 'text-indigo-600',
  slate: 'text-slate-600',
};

type ColoredIconProps = {
  name: string; // string dari backend
  color?: IconColor;
  className?: string;
};

export default function ColoredIcon({ name, color = 'blue', className = '' }: ColoredIconProps) {
  const IconComponent = iconMap[name as IconName] || Shield; // fallback ke Shield kalau tidak cocok
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColorMap[color]} ${className}`}
    >
      <IconComponent className={`w-5 h-5 ${iconColorMap[color]}`} />
    </div>
  );
}
