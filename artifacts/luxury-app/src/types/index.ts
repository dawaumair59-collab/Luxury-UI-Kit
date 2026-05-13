export interface LuxuryTheme {
  name: string;
  primaryColor: string;
  accentColor: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  progress: number;
  message?: string;
}
