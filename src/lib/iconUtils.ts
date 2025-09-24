import { 
  Heart, 
  Users, 
  Briefcase, 
  Music, 
  Star, 
  Crown, 
  Zap,
  Building,
  PartyPopper,
  LucideIcon
} from 'lucide-react';

// Mapare icon string -> ComponentType
export const iconMap: Record<string, LucideIcon> = {
  Heart,
  Users,
  Briefcase,
  Music,
  Star,
  Crown,
  Zap,
  Building,
  PartyPopper,
};

// Funcție helper pentru a obține componenta icon
export const getIconComponent = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Music; // fallback la Music icon
};