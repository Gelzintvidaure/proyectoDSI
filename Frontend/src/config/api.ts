// API Configuration
export const API_BASE_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337/api';

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/local',
    register: '/auth/local/register',
    me: '/users/me',
  },
  productos: '/productos',
  categorias: '/categorias',
  inventarios: '/inventarios',
  ventas: '/ventas',
  detalleVentas: '/detalle-ventas',
} as const;

