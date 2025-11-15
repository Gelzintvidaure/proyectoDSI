import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productosAPI } from '../services/api';
import type { Producto } from '../types';

export const useProductos = (params?: {
  populate?: string;
  filters?: Record<string, any>;
  pagination?: { page?: number; pageSize?: number };
}) => {
  return useQuery({
    queryKey: ['productos', params],
    queryFn: () => productosAPI.getAll(params),
  });
};

export const useProducto = (id: number, populate?: string) => {
  return useQuery({
    queryKey: ['producto', id, populate],
    queryFn: () => productosAPI.getById(id, populate),
    enabled: !!id,
  });
};

export const useCreateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Producto>) => productosAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
    },
  });
};

export const useUpdateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      data,
    }: {
      documentId: string;
      data: Partial<Producto>;
    }) => productosAPI.update(documentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
    },
  });
};

export const useDeleteProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => productosAPI.delete(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
    },
  });
};
