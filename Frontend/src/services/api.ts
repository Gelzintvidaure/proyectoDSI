import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type {
  AuthResponse,
  LoginCredentials,
  Producto,
  StrapiCollectionResponse,
  StrapiResponse,
  User,
} from '../types';

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

const fetchAPI = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.error?.message || error.message || 'Request failed');
  }

  return response.json();
};

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetchAPI<AuthResponse>(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setAuthToken(response.jwt);
    return response;
  },

  logout: (): void => {
    removeAuthToken();
  },

  getMe: async (): Promise<User> => {
    return fetchAPI<User>(API_ENDPOINTS.auth.me);
  },
};

// Productos API
export const productosAPI = {
  getAll: async (params?: {
    populate?: string;
    filters?: Record<string, any>;
    pagination?: { page?: number; pageSize?: number };
  }): Promise<StrapiCollectionResponse<Producto>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.populate) {
      queryParams.append('populate', params.populate);
    }
    
    if (params?.pagination) {
      queryParams.append('pagination[page]', String(params.pagination.page || 1));
      queryParams.append('pagination[pageSize]', String(params.pagination.pageSize || 25));
    }

    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        queryParams.append(`filters[${key}]`, String(value));
      });
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.productos}?${queryString}` : API_ENDPOINTS.productos;
    
    return fetchAPI<StrapiCollectionResponse<Producto>>(endpoint);
  },

  getById: async (id: number, populate?: string): Promise<StrapiResponse<Producto>> => {
    const queryParams = new URLSearchParams();
    if (populate) {
      queryParams.append('populate', populate);
    }
    const queryString = queryParams.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.productos}/${id}?${queryString}` : `${API_ENDPOINTS.productos}/${id}`;
    
    return fetchAPI<StrapiResponse<Producto>>(endpoint);
  },

  create: async (data: Partial<Producto>): Promise<StrapiResponse<Producto>> => {
    return fetchAPI<StrapiResponse<Producto>>(API_ENDPOINTS.productos, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  },

  update: async (id: number, data: Partial<Producto>): Promise<StrapiResponse<Producto>> => {
    return fetchAPI<StrapiResponse<Producto>>(`${API_ENDPOINTS.productos}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  },

  delete: async (id: number): Promise<void> => {
    await fetchAPI<void>(`${API_ENDPOINTS.productos}/${id}`, {
      method: 'DELETE',
    });
  },
};

export const inventoryAPI = {
  getStats: async (): Promise<{
    totalProductos: number;
    stockBajo: number;
    valorTotal: number;
    categorias: number;
  }> => {
    const [productosResponse, categoriasResponse] = await Promise.all([
      productosAPI.getAll({ populate: '*' }),
      fetchAPI<StrapiCollectionResponse<any>>(`${API_ENDPOINTS.categorias}?pagination[pageSize]=1000`),
    ]);

    const productos = productosResponse.data;
    const totalProductos = productos.length;
    
    const stockBajo = productos.filter((p) => p.stock_actual < 10).length;
    
    const valorTotal = productos.reduce(
      (sum, p) => sum + p.precio_compra * p.stock_actual,
      0
    );
    
    const categorias = categoriasResponse.data.length;

    return {
      totalProductos,
      stockBajo,
      valorTotal,
      categorias,
    };
  },
};

