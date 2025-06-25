export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
}

export interface UserStatistics {
  totalCorrections: number;
  averageScore: number;
  favoriteCount: number;
  feedbackTypeDistribution: Record<string, number>;
}