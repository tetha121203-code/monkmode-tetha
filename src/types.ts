export interface UserProfile {
  username: string;
  createdAt: string;
  lastActive?: string;
}

export interface WeightData {
  start: number;
  current: number;
  target: number;
}

export interface HabitDefinition {
  id: string;
  label: string;
  color: string;
  iconName: string;
  description?: string;
}

export interface Exercise {
  name: string;
  detail: string;
  target: string;
  category?: 'primary' | 'secondary' | 'scapular';
}

export interface WorkoutDay {
  type: string;
  focus: string;
  exercises: Exercise[];
}

export type WorkoutSchedule = Record<string, WorkoutDay>;

export interface RoadmapVideo {
  id: string;
  title: string;
  url?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  desc?: string;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  week: string;
  desc: string;
  color: string;
  targetDeadline?: string;
  pl?: string;
  videos: RoadmapVideo[];
  casestudies: CaseStudy[];
}

export interface ToeflItem {
  id: string;
  title: string;
}

export interface ToeflPhase {
  id: string;
  title: string;
  week: string;
  desc: string;
  color: string;
  items: ToeflItem[];
}

export interface ToeflTask {
  name: string;
  detail: string;
  time: string;
}

export interface ToeflDaySchedule {
  type: string;
  focus: string;
  tasks: ToeflTask[];
}

export type ToeflSchedule = Record<string, ToeflDaySchedule>;

export interface DiaryEntry {
  id: number;
  date: string; // YYYY-MM-DD
  dateLabel: string;
  text: string;
  mood: 'good' | 'neutral' | 'bad';
  aiAnalysis?: string | null;
}

export interface WeeklyAnalysis {
  id: number;
  date: string;
  text: string;
}

export type HabitLog = Record<string, Record<string, boolean>>; // dateKey -> habitId -> boolean
export type ExerciseLog = Record<string, boolean>; // exKey -> boolean
export type RoadmapProgress = Record<string, boolean>; // itemId -> boolean
export type ToeflProgress = Record<string, boolean>; // itemId -> boolean
export type ToeflDailyProgress = Record<string, boolean>; // dailyKey -> boolean
