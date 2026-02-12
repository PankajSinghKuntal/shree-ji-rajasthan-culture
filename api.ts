const API_BASE_URL = 'http://localhost:5000/api';

// ===================== TOKEN MANAGEMENT =====================

let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => authToken;

export const removeAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
};

const getAuthHeader = (): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

// ===================== USER API =====================

export const userAPI = {
  register: async (fullName: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    });
    const data = await response.json();
    
    if (data.token) {
      setAuthToken(data.token);
    }
    
    return data;
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    
    if (data.token) {
      setAuthToken(data.token);
    }
    
    return data;
  },

  logout: () => {
    removeAuthToken();
    return { success: true };
  },

  verifyToken: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeader()
    });
    return response.json();
  },

  getById: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: getAuthHeader()
    });
    return response.json();
  },

  delete: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return response.json();
  }
};

// ===================== ADDRESS API =====================

export const addressAPI = {
  add: async (address: any) => {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(address)
    });
    return response.json();
  },

  getByUserId: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/addresses/${userId}`, {
      headers: getAuthHeader()
    });
    return response.json();
  }
};

// ===================== PRODUCT API =====================

export const productAPI = {
  add: async (product: any) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(product)
    });
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    return response.json();
  },

  delete: async (productId: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return response.json();
  }
};

// ===================== PAYMENT API =====================

export const paymentAPI = {
  getPaymentMethods: async () => {
    const response = await fetch(`${API_BASE_URL}/payments/methods`);
    return response.json();
  },

  createRazorpayOrder: async (amount: number, orderId: string, email: string, phone: string) => {
    const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ amount, orderId, email, phone })
    });
    return response.json();
  },

  verifyPayment: async (razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string, amount: number) => {
    const response = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature,
        amount
      })
    });
    return response.json();
  },

  record: async (paymentData: any) => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  },

  getByUserId: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/payments/${userId}`, {
      headers: getAuthHeader()
    });
    return response.json();
  },

  refund: async (paymentId: string, amount?: number) => {
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/refund`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ amount })
    });
    return response.json();
  }
};

// ===================== ORDER API =====================

export const orderAPI = {
  create: async (orderData: any) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return response.json();
  },

  getByUserId: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${userId}`);
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`);
    return response.json();
  },

  updateStatus: async (orderId: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return response.json();
  }
};

// ===================== HEALTH CHECK =====================

export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  } catch (error) {
    console.error('Server health check failed:', error);
    return { success: false };
  }
};
