export interface Solve {
  id: string;
  userId: string;
  time: number;
  scramble: string;
  timestamp: number;
  dnf: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  country: string;
  passwordHash: string;
  createdAt: Date;
  resetToken?: string;
  tokenExpiry?: number;
}

export interface UserStats {
  totalSolves: number;
  bestTime: number | null;
  worstTime: number | null;
  avgTime: number | null;
  ao5: number | null;
  ao12: number | null;
  ao50: number | null;
  ao100: number | null;
  dnfCount: number;
  dnfRate: string;
  totalTime: string;
  currentStreak: number;
  longestStreak: number;
}

export interface ConsistencyStats {
  excellent: number;
  good: number;
  fair: number;
  poor: number;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
}

export interface AIAnalysis {
  score: number;
  scoreLabel: string;
  insights: string[];
  recommendations: string[];
}
