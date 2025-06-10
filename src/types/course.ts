import { LucideIcon } from 'lucide-react';

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  level: string;
  hours: number;
  students: string;
  topics: string[];
  progress?: number | null;
  isProFeature?: boolean;
  aiFeatures?: {
    name: string;
    icon: LucideIcon;
  }[];
  rating?: number;
  icon?: LucideIcon;
} 