const API_BASE =  'http://localhost:3000/api';

export const orderService = {
  createOrder: async (orderData: any) => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create order');
    }
    const data = await res.json();
    return data.data || data;
  },

  getUserOrders: async () => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  },

  getOrderById: async (orderId: string | number) => {
    const res = await fetch(`${API_BASE}/orders/${orderId}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Order not found');
    const data = await res.json();
    return data.data || data;
  },

  updateOrderStatus: async (orderId: string | number, status: string) => {
    const res = await fetch(`${API_BASE}/orders/${orderId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update order');
    const data = await res.json();
    return data.data || data;
  },

  cancelOrder: async (orderId: string | number) => {
    const res = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to cancel order');
    const data = await res.json();
    return data.data || data;
  },

  getAllOrders: async (page = 1, limit = 10) => {
    const res = await fetch(`${API_BASE}/orders?page=${page}&limit=${limit}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) return { data: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    const data = await res.json();
    return data;
  },

  getOrderStats: async () => {
    const res = await fetch(`${API_BASE}/orders/stats`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) return {};
    const data = await res.json();
    return data.data || data;
  }
};