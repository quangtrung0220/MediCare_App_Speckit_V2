/*
 * Created: 2026-07-02
 * Purpose: Frontend auth service — login, register, logout, token management.
 * Owner: Quang Trung
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const TOKEN_KEY = 'medicare_access_token';
const USER_KEY = 'medicare_current_user';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

/** Login with email and password. Stores token and user in localStorage. */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
  }

  const data: LoginResponse = await res.json();
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

/** Register a new account (requires admin approval before login). */
export async function register(
  email: string,
  password: string,
  role?: string,
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Đăng ký thất bại.');
  }

  return res.json();
}

/** Remove stored credentials and redirect to login. */
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** Get the stored JWT token or null if not logged in. */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/** Get the stored user profile or null. */
export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/** Check if the user is currently authenticated and token is not expired. */
export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;

  try {
    // JWT structure: header.payload.signature (base64url encoded)
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return false;

    // Pad the base64url string to make it valid base64
    const padded = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(padded);
    const payload = JSON.parse(json) as { exp?: number };

    if (!payload.exp) return false;

    // exp is in seconds; Date.now() is in milliseconds
    const isExpired = Date.now() >= payload.exp * 1000;
    if (isExpired) {
      // Auto-cleanup stale credentials
      logout();
      return false;
    }

    return true;
  } catch {
    // Malformed token — treat as unauthenticated
    logout();
    return false;
  }
}

/**
 * Build fetch headers with Authorization Bearer token.
 * Use this in all protected API calls.
 */
export function authHeaders(): HeadersInit {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/** Fetch the current user's profile from /auth/me */
export async function fetchProfile(): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Không thể tải thông tin tài khoản.');
  return res.json();
}
