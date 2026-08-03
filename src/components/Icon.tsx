import React from 'react';
import {
  Zap,
  LayoutDashboard,
  BookOpen,
  Dumbbell,
  Map,
  Book,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  X,
  Trash2,
  Pencil,
  Play,
  ExternalLink,
  Scale,
  Calendar,
  Lock,
  Loader2,
  AlertTriangle,
  CheckSquare,
  Laptop,
  Cpu,
  Sparkles,
  Flame,
  Award,
  BarChart2,
  ListTodo,
  StickyNote,
  Copy,
  Minimize2,
  Maximize2
} from 'lucide-react';

export const iconMap: Record<string, React.ElementType> = {
  monk: Zap,
  home: LayoutDashboard,
  diary: BookOpen,
  fitness: Dumbbell,
  map: Map,
  book: Book,
  settings: Settings,
  logout: LogOut,
  chL: ChevronLeft,
  chR: ChevronRight,
  plus: Plus,
  check: Check,
  x: X,
  trash: Trash2,
  pencil: Pencil,
  play: Play,
  ext: ExternalLink,
  scale: Scale,
  cal: Calendar,
  lock: Lock,
  loader: Loader2,
  warn: AlertTriangle,
  habits: CheckSquare,
  laptop: Laptop,
  cpu: Cpu,
  sparkles: Sparkles,
  flame: Flame,
  award: Award,
  chart: BarChart2,
  todo: ListTodo,
  note: StickyNote,
  copy: Copy,
  min: Minimize2,
  max: Maximize2
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ name, size = 18, className = '', style }) => {
  const Component = iconMap[name] || Zap;
  return <Component size={size} className={className} style={{ display: 'inline-flex', flexShrink: 0, ...style }} />;
};
