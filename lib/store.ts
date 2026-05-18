import { create } from 'zustand';
import { UserActivity, DashboardData } from '@/types';

interface AppState {
  // User state
  userAddress: string;
  setUserAddress: (address: string) => void;

  // Activity data
  userActivity: UserActivity | null;
  setUserActivity: (activity: UserActivity | null) => void;

  // Dashboard data
  dashboardData: DashboardData | null;
  setDashboardData: (data: DashboardData | null) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;

  // Time range filter
  timeRange: '24h' | '7d' | '30d' | 'all';
  setTimeRange: (range: '24h' | '7d' | '30d' | 'all') => void;

  // UI state
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;

  // Reset all
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  userAddress: '',
  setUserAddress: (address: string) => set({ userAddress: address }),

  userActivity: null,
  setUserActivity: (activity: UserActivity | null) => set({ userActivity: activity }),

  dashboardData: null,
  setDashboardData: (data: DashboardData | null) => set({ dashboardData: data }),

  isLoading: false,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),

  error: null,
  setError: (error: string | null) => set({ error }),

  timeRange: '30d',
  setTimeRange: (range: '24h' | '7d' | '30d' | 'all') => set({ timeRange: range }),

  isConnected: false,
  setIsConnected: (connected: boolean) => set({ isConnected: connected }),

  reset: () =>
    set({
      userAddress: '',
      userActivity: null,
      dashboardData: null,
      isLoading: false,
      error: null,
      timeRange: '30d',
      isConnected: false,
    }),
}));
