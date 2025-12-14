const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { requiresAuth = true, headers: customHeaders, ...restOptions } = options;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (requiresAuth) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    window.location.href = '/auth';
    throw new ApiError('Unauthorized', 401);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.message || 'Request failed', response.status);
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) return {} as T;
  
  return JSON.parse(text);
}

// Auth API
export const authApi = {
  register: async (name: string, email: string, password: string) => {
    return request<{ message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      requiresAuth: false,
    });
  },

  login: async (email: string, password: string) => {
    const response = await request<{ token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      requiresAuth: false,
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },

  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },
};

// Backend Sweet model
export interface ApiSweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

// Sweets API
export const sweetsApi = {
  getAll: async () => {
    return request<ApiSweet[]>('/api/sweets');
  },

  search: async (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.name) searchParams.append('name', params.name);
    if (params.category) searchParams.append('category', params.category);
    if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
    
    const queryString = searchParams.toString();
    return request<ApiSweet[]>(`/api/sweets/search${queryString ? `?${queryString}` : ''}`);
  },

  create: async (sweet: Omit<ApiSweet, '_id'>) => {
    return request<ApiSweet>('/api/sweets', {
      method: 'POST',
      body: JSON.stringify(sweet),
    });
  },

  update: async (id: string, sweet: Partial<Omit<ApiSweet, '_id'>>) => {
    return request<ApiSweet>(`/api/sweets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sweet),
    });
  },

  delete: async (id: string) => {
    return request<void>(`/api/sweets/${id}`, {
      method: 'DELETE',
    });
  },

  purchase: async (id: string) => {
    return request<ApiSweet>(`/api/sweets/${id}/purchase`, {
      method: 'POST',
    });
  },

  restock: async (id: string, amount: number) => {
    return request<ApiSweet>(`/api/sweets/${id}/restock`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },
};

export { ApiError };
