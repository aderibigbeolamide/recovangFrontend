export type UserRole = 
  | 'collector' 
  | 'agent' 
  | 'admin' 
  | 'super_admin' 
  | 'brand' 
  | 'factory' 
  | 'logistics';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}
