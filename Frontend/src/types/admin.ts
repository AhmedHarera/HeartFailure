export interface AdminStats {
  totalUsers: number;
  totalPredictions: number;
  activeUsers: number;
  averageAccuracy: number;
}

export interface UserListItem {
  id: string;
  email: string;
  created_at: string;
  last_sign_in: string;
  role: string;
  is_banned: boolean;
}

export interface PredictionStats {
  date: string;
  count: number;
  accuracy: number;
}