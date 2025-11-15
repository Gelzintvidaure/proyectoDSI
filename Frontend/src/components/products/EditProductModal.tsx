import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateProducto } from '../../hooks/useProductos';
import type { Producto } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface EditProductModalProps {
  product: Producto;
  isOpen: boolean;
  onClose: () => void;
}

interface ProductFormData {
  Nombre: string;
  precio_compra: number;
  precio_venta: number;
  stock_actual: number;
  descripcion?: string;
}

export const EditProductModal = ({
  product,
  isOpen,
  onClose,
}: EditProductModalProps) => {
  const updateProducto = useUpdateProducto();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    defaultValues: {
      Nombre: product.Nombre,
      precio_compra: product.precio_compra,
      precio_venta: product.precio_venta,
      stock_actual: product.stock_actual,
      descripcion: product.descripcion || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        Nombre: product.Nombre,
        precio_compra: product.precio_compra,
        precio_venta: product.precio_venta,
        stock_actual: product.stock_actual,
        descripcion: product.descripcion || '',
      });
    }
  }, [isOpen, product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      await updateProducto.mutateAsync({
        documentId: product.documentId,
        data: {
          Nombre: data.Nombre,
          precio_compra: Number(data.precio_compra),
          precio_venta: Number(data.precio_venta),
          stock_actual: Number(data.stock_actual),
          descripcion: data.descripcion || null,
        },
      });
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Editar Producto
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nombre"
              {...register('Nombre', {
                required: 'El nombre es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres',
                },
              })}
              error={errors.Nombre?.message}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Precio de Compra"
                type="number"
                step="0.01"
                min="0"
                {...register('precio_compra', {
                  required: 'El precio de compra es requerido',
                  min: {
                    value: 0,
                    message: 'El precio debe ser mayor o igual a 0',
                  },
                })}
                error={errors.precio_compra?.message}
              />

              <Input
                label="Precio de Venta"
                type="number"
                step="0.01"
                min="0"
                {...register('precio_venta', {
                  required: 'El precio de venta es requerido',
                  min: {
                    value: 0,
                    message: 'El precio debe ser mayor o igual a 0',
                  },
                })}
                error={errors.precio_venta?.message}
              />
            </div>

            <Input
              label="Stock Actual"
              type="number"
              min="0"
              {...register('stock_actual', {
                required: 'El stock es requerido',
                min: {
                  value: 0,
                  message: 'El stock debe ser mayor o igual a 0',
                },
                valueAsNumber: true,
              })}
              error={errors.stock_actual?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Descripción
              </label>
              <textarea
                {...register('descripcion')}
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors placeholder:text-gray-400"
                placeholder="Descripción del producto (opcional)"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={updateProducto.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={updateProducto.isPending}
              >
                Confirmar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


