const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'https://ai-kata-sweetshop-7tuv.vercel.app/api';

// Sweets service using cookie-based auth (credentials included)
export const sweetService = {
  // Get all sweets with pagination
  getAll: async (page = 1, limit = 10) => {
    const response = await fetch(
      `${API_BASE}/sweets?page=${page}&limit=${limit}`,
      { credentials: 'include' }
    );
    const json = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(json?.message || 'Failed to fetch sweets');
    }
    return json;
  },

  // Get single sweet by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE}/sweets/${id}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Sweet not found');
    }

    const data = await response.json();
    return data.data || data;
  },

  // Search sweets
  search: async (query: string) => {
    const response = await fetch(
      `${API_BASE}/sweets/search?q=${encodeURIComponent(query)}`,
      {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();
    return data.data || data;
  },

  // Admin: Create new sweet
  create: async (sweetData: any) => {
    const response = await fetch(`${API_BASE}/sweets`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sweetData),
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(json?.message || 'Failed to create sweet');
    }

    return json?.data?.sweet || json;
  },

  // Admin: Update sweet
  update: async (id: string, updates: any) => {
    const response = await fetch(`${API_BASE}/sweets/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to update sweet');
    }

    return data.data || data;
  },

  // Admin: Delete sweet
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE}/sweets/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to delete sweet');
    }

    return data.data || data;
  },

  // Admin: Restock sweet
  restock: async (id: string, quantity: number) => {
    const response = await fetch(`${API_BASE}/sweets/${id}/restock`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to restock sweet');
    }

    return data.data || data;
  },

  // ✅ FIXED: Admin stats endpoint
  getStats: async () => {
    const response = await fetch(
      `${API_BASE}/sweets/stats/statistics`,
      { credentials: 'include' }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to fetch statistics');
    }

    return data.data || data;
  },
};
