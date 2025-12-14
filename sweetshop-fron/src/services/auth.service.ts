const API_BASE =  'http://localhost:3000/api';

// Authentication service using cookie-based sessions
export const authService = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Login failed');
    }

    const data = await response.json().catch(() => null);
    return data;
  },

  signup: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed');
    }

    const data = await response.json().catch(() => null);
    return data;
  },

  logout: async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    }).catch(() => null);
    return { success: true };
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      credentials: 'include'
    }).catch(() => null);
    if (!response || !response.ok) return null;
    const data = await response.json().catch(() => null);
    // backend returns { success: true, data: { user } }
    // normalize to return the user object directly
    return data?.data?.user || data?.user || data?.data || data;
  }
};
