import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
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

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const errorData = error.response.data as any;
      const errorMessage = errorData?.error?.message || errorData?.message || 'Request failed';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error(error.message || 'An error occurred');
    }
  }
);

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.auth.login, credentials);
    setAuthToken(data.jwt);
    return data;
  },

  logout: (): void => {
    removeAuthToken();
  },

  getMe: async (): Promise<User> => {
    const { data } = await axiosInstance.get<User>(API_ENDPOINTS.auth.me);
    return data;
  },
};

// Productos API
export const productosAPI = {
  getAll: async (params?: {
    populate?: string;
    filters?: Record<string, any>;
    pagination?: { page?: number; pageSize?: number };
  }): Promise<StrapiCollectionResponse<Producto>> => {
    const axiosParams: Record<string, any> = {};
    
    if (params?.populate) {
      axiosParams.populate = params.populate;
    }
    
    if (params?.pagination) {
      axiosParams['pagination[page]'] = params.pagination.page || 1;
      axiosParams['pagination[pageSize]'] = params.pagination.pageSize || 25;
    }

    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        axiosParams[`filters[${key}]`] = value;
      });
    }
    
    const { data } = await axiosInstance.get<StrapiCollectionResponse<Producto>>(
      API_ENDPOINTS.productos,
      { params: axiosParams }
    );
    return data;
  },

  getById: async (id: number, populate?: string): Promise<StrapiResponse<Producto>> => {
    const params: Record<string, any> = {};
    if (populate) {
      params.populate = populate;
    }
    
    const { data } = await axiosInstance.get<StrapiResponse<Producto>>(
      `${API_ENDPOINTS.productos}/${id}`,
      { params }
    );
    return data;
  },

  create: async (data: Partial<Producto>): Promise<StrapiResponse<Producto>> => {
    const { data: responseData } = await axiosInstance.post<StrapiResponse<Producto>>(
      API_ENDPOINTS.productos,
      { data }
    );
    return responseData;
  },

  update: async (id: number, data: Partial<Producto>): Promise<StrapiResponse<Producto>> => {
    const { data: responseData } = await axiosInstance.put<StrapiResponse<Producto>>(
      `${API_ENDPOINTS.productos}/${id}`,
      { data }
    );
    return responseData;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.productos}/${id}`);
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
      axiosInstance.get<StrapiCollectionResponse<any>>(API_ENDPOINTS.categorias, {
        params: { 'pagination[pageSize]': 1000 },
      }),
    ]);

    const productos = productosResponse.data;
    const totalProductos = productos.length;
    
    const stockBajo = productos.filter((p) => p.stock_actual < 10).length;
    
    const valorTotal = productos.reduce(
      (sum, p) => sum + p.precio_compra * p.stock_actual,
      0
    );
    
    const categorias = categoriasResponse.data.data.length;

    return {
      totalProductos,
      stockBajo,
      valorTotal,
      categorias,
    };
  },
};

