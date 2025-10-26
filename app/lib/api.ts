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

  async updateProfile(userData: UpdateProfileData): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }, true);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
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
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());

    // Debug: Log dos dados sendo enviados
    console.log('Check-in data:', {
      photo: photo.name,
      latitude: latitude,
      longitude: longitude
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
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());

    // Debug: Log dos dados sendo enviados
    console.log('Check-out data:', {
      photo: photo.name,
      latitude: latitude,
      longitude: longitude
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

  async getTimeLogs(startDate?: string, endDate?: string): Promise<TimeLog[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const url = queryString ? `/timelog?${queryString}` : '/timelog';

    return this.request<TimeLog[]>(url, {}, true);
  }

  // Manager registration
  async registerManager(managerData: ManagerRegisterData): Promise<ManagerRegisterResponse> {
    const response = await this.request<ManagerRegisterResponse>('/auth/register-manager', {
      method: 'POST',
      body: JSON.stringify(managerData),
    });

    // Store tokens
    if (response.accessToken && response.refreshToken) {
      this.setTokens(response.accessToken, response.refreshToken);
    }

    return response;
  }

  // Employee registration
  async registerEmployee(employeeData: EmployeeRegisterData): Promise<EmployeeRegisterResponse> {
    return this.request<EmployeeRegisterResponse>('/auth/register-employee', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  }

  // Company management
  async getCompany(): Promise<{ company: Company }> {
    return this.request<{ company: Company }>('/manager/company', {}, true);
  }

  async updateCompany(companyData: UpdateCompanyData): Promise<{ message: string; company: Company }> {
    return this.request<{ message: string; company: Company }>('/manager/company', {
      method: 'PUT',
      body: JSON.stringify(companyData),
    }, true);
  }

  // Invitation management
  async createInvitation(invitationData: CreateInvitationData): Promise<{ message: string; invitation: Invitation }> {
    return this.request<{ message: string; invitation: Invitation }>('/manager/invitations', {
      method: 'POST',
      body: JSON.stringify(invitationData),
    }, true);
  }

  async getInvitations(page: number = 1, limit: number = 10, status?: 'used' | 'active' | 'expired'): Promise<InvitationsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);

    return this.request<InvitationsResponse>(`/manager/invitations?${params.toString()}`, {}, true);
  }

  async cancelInvitation(invitationId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/manager/invitations/${invitationId}`, {
      method: 'DELETE',
    }, true);
  }

  // Employee approval
  async getPendingEmployees(page: number = 1, limit: number = 10, search?: string): Promise<UsersResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);

    return this.request<UsersResponse>(`/manager/employees/pending?${params.toString()}`, {}, true);
  }

  async approveEmployee(userId: number, approved: boolean, notes?: string): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>('/manager/employees/approve', {
      method: 'POST',
      body: JSON.stringify({ userId, approved, notes }),
    }, true);
  }

  // Manager endpoints
  async getUsers(page: number = 1, limit: number = 10, search?: string, role?: string): Promise<UsersResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (role) params.append('role', role);

    return this.request<UsersResponse>(`/manager/users?${params.toString()}`, {}, true);
  }

  async getUserById(id: number): Promise<{ user: User }> {
    return this.request<{ user: User }>(`/manager/users/${id}`, {}, true);
  }

  async createUser(userData: CreateUserData): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>('/manager/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, true);
  }

  async updateUser(id: number, userData: UpdateUserData): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/manager/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }, true);
  }

  async toggleUserStatus(id: number): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/manager/users/${id}/toggle-status`, {
      method: 'PATCH',
    }, true);
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/manager/users/${id}`, {
      method: 'DELETE',
    }, true);
  }

  async changeUserPassword(id: number, newPassword: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/manager/users/change-password', {
      method: 'POST',
      body: JSON.stringify({ userId: id, newPassword }),
    }, true);
  }

  async getUserTimeLogs(userId: number, page: number = 1, limit: number = 10): Promise<TimeLogsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return this.request<TimeLogsResponse>(`/manager/users/${userId}/time-logs?${params.toString()}`, {}, true);
  }

  async createManualTimeLog(data: ManualTimeLogData): Promise<{ message: string; timeLog: TimeLog }> {
    return this.request<{ message: string; timeLog: TimeLog }>('/manager/time-logs/manual', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  async approveTimeLog(timeLogId: number, approved: boolean, rejectionReason?: string): Promise<{ message: string; timeLog: TimeLog }> {
    return this.request<{ message: string; timeLog: TimeLog }>('/manager/time-logs/approve', {
      method: 'POST',
      body: JSON.stringify({ timeLogId, approved, rejectionReason }),
    }, true);
  }

  async getPendingTimeLogs(page: number = 1, limit: number = 10): Promise<TimeLogsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return this.request<TimeLogsResponse>(`/manager/time-logs/pending?${params.toString()}`, {}, true);
  }

  async getTimeLogReport(startDate: string, endDate: string, userId?: number, department?: string): Promise<TimeLogReportResponse> {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    if (userId) params.append('userId', userId.toString());
    if (department) params.append('department', department);

    return this.request<TimeLogReportResponse>(`/manager/time-logs/report?${params.toString()}`, {}, true);
  }
}

// Types
export interface TimeLog {
  id: number;
  checkIn: string;
  checkOut: string | null;
  checkInPhoto?: string;
  checkOutPhoto?: string;
  latitude: number;
  longitude: number;
  outLatitude?: number | null;
  outLongitude?: number | null;
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
  isApproved?: boolean;
  role?: 'manager' | 'employee';
  companyId?: number;
  invitationId?: number;
  invitationCode?: string;
  company?: Company;
  invitation?: Invitation;
  createdAt?: string;
  updatedAt?: string;
}

export interface Company {
  id: number;
  name: string;
  cnpj: string;
  corporateName?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  addressNumber?: string;
  addressComplement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Invitation {
  id: number;
  code: string;
  email: string;
  name?: string;
  position?: string;
  department?: string;
  isUsed: boolean;
  usedAt?: string | null;
  expiresAt?: string | null;
  isActive: boolean;
  companyId: number;
  createdById: number;
  usedById?: number;
  company?: Company;
  createdBy?: User;
  usedBy?: User;
  createdAt: string;
  updatedAt: string;
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

export interface UpdateProfileData {
  name?: string;
  email?: string;
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

// Manager-specific types
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'manager' | 'employee';
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

export interface UpdateUserData {
  name?: string;
  email?: string;
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
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TimeLogsResponse {
  timeLogs: TimeLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ManualTimeLogData {
  userId: number;
  checkIn: string;
  checkOut: string;
  reason: string;
  checkInLocation?: string;
  checkOutLocation?: string;
}

export interface TimeLogReportResponse {
  timeLogs: TimeLog[];
  statistics: {
    totalApproved: number;
    totalPending: number;
    totalRejected: number;
    totalHoursWorked: number;
    averageHoursPerDay: number;
  };
}

// New types for company and invitation system
export interface ManagerRegisterData {
  name: string;
  email: string;
  password: string;
  company: {
    name: string;
    cnpj: string;
    corporateName?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    addressNumber?: string;
    addressComplement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    description?: string;
  };
  cpf?: string;
  rg?: string;
  birthDate?: string;
  gender?: 'Masculino' | 'Feminino' | 'Outro' | 'Prefiro não informar';
  maritalStatus?: 'Solteiro(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viúvo(a)' | 'União Estável';
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
  bankName?: string;
  bankAccount?: string;
  bankAgency?: string;
  bankAccountType?: 'Corrente' | 'Poupança' | 'Salário';
  pix?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  education?: 'Fundamental' | 'Médio' | 'Superior' | 'Pós-graduação' | 'Mestrado' | 'Doutorado';
  notes?: string;
}

export interface EmployeeRegisterData {
  invitationCode: string;
  name: string;
  email: string;
  password: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  gender?: 'Masculino' | 'Feminino' | 'Outro' | 'Prefiro não informar';
  maritalStatus?: 'Solteiro(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viúvo(a)' | 'União Estável';
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
  employmentType?: 'CLT' | 'PJ' | 'Estagiário' | 'Freelancer' | 'Temporário' | 'Autônomo';
  directSupervisor?: string;
  bankName?: string;
  bankAccount?: string;
  bankAgency?: string;
  bankAccountType?: 'Corrente' | 'Poupança' | 'Salário';
  pix?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  education?: 'Fundamental' | 'Médio' | 'Superior' | 'Pós-graduação' | 'Mestrado' | 'Doutorado';
  notes?: string;
}

export interface ManagerRegisterResponse {
  message: string;
  user: User;
  company: Company;
  accessToken: string;
  refreshToken: string;
}

export interface EmployeeRegisterResponse {
  message: string;
  user: User;
  requiresApproval: boolean;
}

export interface UpdateCompanyData {
  name?: string;
  cnpj?: string;
  corporateName?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  addressNumber?: string;
  addressComplement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  description?: string;
}

export interface CreateInvitationData {
  email: string;
  name?: string;
  position?: string;
  department?: string;
  expiresAt?: string;
}

export interface InvitationsResponse {
  invitations: Invitation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);
