// API Types
export interface Producto {
  id: number;
  documentId: string; // Strapi v5 uses documentId for create, update, delete operations
  Nombre: string;
  descripcion?: any;
  precio_compra: number;
  precio_venta: number;
  estado: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  stock_actual: number;
  categoria?: Categoria;
  inventarios?: Inventario[];
  detalle_venta?: DetalleVenta;
}

export interface Categoria {
  id: number;
  nombre?: string;
  descripcion?: string;
  productos?: Producto[];
}

export interface Inventario {
  id: number;
  producto?: Producto;
  cantidad_movida: number;
  fecha_movimiento?: string;
  descripcion_mov: string;
}

export interface Venta {
  id: number;
  fecha_venta: string;
  total: number;
  detalle_venta?: DetalleVenta[];
}

export interface DetalleVenta {
  id: number;
  producto?: Producto;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  venta?: Venta;
}

// Strapi Response Types
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiCollectionResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Auth Types
export interface LoginCredentials {
  identifier: string; // username or email
  password: string;
}

export interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
}

// Dashboard Stats Types
export interface InventoryStats {
  totalProductos: number;
  stockBajo: number;
  valorTotal: number;
  categorias: number;
}
