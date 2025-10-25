// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// API client utility
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Token management
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  private isRefreshing = false;
  private refreshPromise: Promise<RefreshTokenResponse> | null = null;

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useAuth: boolean = false,
    isRetry: boolean = false
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add Authorization header if useAuth is true
    if (useAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.error('No access token found for authenticated request to:', endpoint);
        throw new Error('Você precisa fazer login para acessar esta funcionalidade');
      }
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && useAuth && !isRetry && endpoint !== '/auth/refresh-token') {
        // Wait for ongoing refresh or start new one
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshPromise = this.refreshToken()
            .catch((error) => {
              // If refresh fails, clear tokens and reject
              this.clearTokens();
              throw error;
            })
            .finally(() => {
              this.isRefreshing = false;
              this.refreshPromise = null;
            });
        }

        try {
          await this.refreshPromise;
          // Retry the original request with new token
          return this.request<T>(endpoint, options, useAuth, true);
        } catch (refreshError) {
          // If refresh failed, throw the original 401 error
          const error = await response.json().catch(() => ({ message: 'Unauthorized' }));
          throw new Error(error.message || 'Unauthorized');
        }
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    console.log('Attempting login for:', email);
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store tokens
    if (response.accessToken && response.refreshToken) {
      this.setTokens(response.accessToken, response.refreshToken);
      console.log('Login successful, tokens stored');
    } else {
      console.warn('Login response missing tokens:', response);
    }

    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Store tokens
    if (response.accessToken && response.refreshToken) {
      this.setTokens(response.accessToken, response.refreshToken);
    }

    return response;
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<RefreshTokenResponse>('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    // Update tokens
    if (response.accessToken && response.refreshToken) {
      this.setTokens(response.accessToken, response.refreshToken);
    }

    return response;
  }

  async logout(): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    }, true);

    // Clear tokens
    this.clearTokens();

    return response;
  }

  async getProfile(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/profile', {}, true);
  }

  async uploadPhoto(file: File): Promise<{ message: string; profilePhoto: string }> {
    const url = `${this.baseURL}/auth/upload-photo`;
    const formData = new FormData();
    formData.append('photo', file);

    const token = this.getAccessToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }

  // Time log endpoints
  async checkIn(photo: File, latitude: number, longitude: number) {
    const url = `${this.baseURL}/timelog/checkin`;
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('checkInLatitude', latitude.toString());
    formData.append('checkInLongitude', longitude.toString());

    // Debug: Log dos dados sendo enviados
    console.log('Check-in data:', {
      photo: photo.name,
      checkInLatitude: latitude,
      checkInLongitude: longitude
    });

    // Debug: Log de todos os campos do FormData
    console.log('FormData fields:');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
    }

    const token = this.getAccessToken();
    if (!token) {
      throw new Error('Você precisa fazer login para fazer check-in');
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Falha ao fazer check-in' }));
      throw new Error(error.message || 'Falha ao fazer check-in');
    }

    return response.json();
  }

  async checkOut(photo: File, latitude: number, longitude: number) {
    const url = `${this.baseURL}/timelog/checkout`;
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('checkOutLatitude', latitude.toString());
    formData.append('checkOutLongitude', longitude.toString());

    // Debug: Log dos dados sendo enviados
    console.log('Check-out data:', {
      photo: photo.name,
      checkOutLatitude: latitude,
      checkOutLongitude: longitude
    });

    // Debug: Log de todos os campos do FormData
    console.log('FormData fields:');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
    }

    const token = this.getAccessToken();
    if (!token) {
      throw new Error('Você precisa fazer login para fazer check-out');
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Falha ao fazer check-out' }));
      throw new Error(error.message || 'Falha ao fazer check-out');
    }

    return response.json();
  }

  async getTimeLogs(): Promise<TimeLog[]> {
    return this.request<TimeLog[]>('/timelog', {}, true);
  }
}

// Types
export interface TimeLog {
  id: number;
  checkIn: string;
  checkOut: string | null;
  checkInPhoto?: string;
  checkOutPhoto?: string;
  checkInLatitude?: number;
  checkInLongitude?: number;
  checkOutLatitude?: number;
  checkOutLongitude?: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  profilePhoto?: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  gender?: string;
  maritalStatus?: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  addressComplement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  employeeId?: string;
  department?: string;
  position?: string;
  hireDate?: string;
  salary?: number;
  workSchedule?: string;
  employmentType?: string;
  directSupervisor?: string;
  bankName?: string;
  bankAccount?: string;
  bankAgency?: string;
  bankAccountType?: string;
  pix?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  education?: string;
  notes?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  gender?: string;
  maritalStatus?: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  addressComplement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  employeeId?: string;
  department?: string;
  position?: string;
  hireDate?: string;
  salary?: number;
  workSchedule?: string;
  employmentType?: string;
  directSupervisor?: string;
  bankName?: string;
  bankAccount?: string;
  bankAgency?: string;
  bankAccountType?: string;
  pix?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  education?: string;
  notes?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);
