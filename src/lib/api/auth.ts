import { apiClient } from './client';

// Define the user type
export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  mfaEnabled: boolean;
  roles: string[];
};

// Define login payload
export type LoginPayload = {
  email: string;
  password: string;
};

// Define login response
export type LoginResponse = {
  requiresMfa?: boolean;
  token?: string;
  user?: User;
};

// Define registration payload
export type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

// Define profile update payload
export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
};

// Define MFA verify payload
export type MfaVerifyPayload = {
  code: string;
};

// Define auth API functions
export const authApi = {
  // Get current user
  getCurrentUser: () => apiClient.get<User>('/auth/me'),
  
  // Login with email and password
  login: (payload: LoginPayload) => apiClient.post<LoginResponse>('/auth/login', payload),
  
  // Register a new user
  register: (payload: RegisterPayload) => apiClient.post<{ message: string }>('/auth/register', payload),
  
  // Logout the current user
  logout: () => apiClient.post<{ message: string }>('/auth/logout', {}),
  
  // Get user profile
  getProfile: () => apiClient.get<User>('/auth/profile'),
  
  // Update user profile
  updateProfile: (payload: UpdateProfilePayload) => apiClient.put<User>('/auth/profile', payload),
  
  // Request password reset
  requestPasswordReset: (email: string) => apiClient.post<{ message: string }>('/auth/request-password-reset', { email }),
  
  // Reset password with token
  resetPassword: (token: string, password: string) => apiClient.post<{ message: string }>('/auth/reset-password', { token, password }),
  
  // Change password (when authenticated)
  changePassword: (currentPassword: string, newPassword: string) => 
    apiClient.post<{ message: string }>('/auth/change-password', { currentPassword, newPassword }),
  
  // Verify MFA code during login
  verifyMfa: (payload: MfaVerifyPayload) => apiClient.post<LoginResponse>('/auth/verify-mfa', payload),
  
  // Get MFA setup information
  getMfaSetup: () => apiClient.get<{ qrCode: string; secret: string }>('/auth/mfa-setup'),
  
  // Verify and enable MFA
  verifyMfaSetup: (code: string, secret: string) => 
    apiClient.post<{ backupCodes: string[] }>('/auth/verify-mfa-setup', { code, secret }),
  
  // Disable MFA
  disableMfa: (code: string) => apiClient.post<{ message: string }>('/auth/disable-mfa', { code }),
  
  // Verify email with token
  verifyEmail: (token: string) => apiClient.post<{ message: string }>('/auth/verify-email', { token }),
  
  // Resend verification email
  resendVerification: (email: string) => apiClient.post<{ message: string }>('/auth/resend-verification', { email }),
}; 