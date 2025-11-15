import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type {
  CellClassParams,
  ColDef,
  ICellRendererParams,
} from 'ag-grid-community';
import { themeAlpine } from 'ag-grid-community';
import { useProductos, useDeleteProducto } from '../../hooks/useProductos';
import type { Producto } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { EditProductModal } from './EditProductModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface ActionCellRendererProps extends ICellRendererParams<Producto> {
  onEdit: (product: Producto) => void;
  onDelete: (product: Producto) => void;
}

const ActionCellRenderer = ({
  data,
  onEdit,
  onDelete,
}: ActionCellRendererProps) => {
  if (!data) return null;

  return (
    <div className="flex items-center gap-2 h-full">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(data)}
        className="text-blue-600 border-blue-300 hover:bg-blue-50"
      >
        Editar
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDelete(data)}
        className="text-red-600 border-red-300 hover:bg-red-50"
      >
        Eliminar
      </Button>
    </div>
  );
};

export const ProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Producto | null>(null);

  const { data, isLoading, isFetching, error } = useProductos({
    populate: 'categoria',
  });
  const deleteProducto = useDeleteProducto();

  // Filter products by name (client-side filtering)
  const filteredProducts = () => {
    if (!data?.data) return [];

    if (!searchTerm.trim()) {
      return data.data;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return data.data.filter((product) =>
      product.Nombre.toLowerCase().includes(searchLower),
    );
  };

  const columnDefs: ColDef<Producto>[] = [
    {
      field: 'Nombre',
      headerName: 'Nombre',
      flex: 1,
      minWidth: 200,
      sortable: true,
      filter: false, // Explicitly disable AG-Grid filtering
    },
    {
      field: 'precio_compra',
      headerName: 'Precio Compra',
      flex: 1,
      minWidth: 150,
      sortable: true,
      filter: false,
      valueFormatter: (params) => {
        if (params.value == null) return '';
        return `$${Number(params.value).toLocaleString('es-MX', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      },
    },
    {
      field: 'precio_venta',
      headerName: 'Precio Venta',
      flex: 1,
      minWidth: 150,
      sortable: true,
      filter: false,
      valueFormatter: (params) => {
        if (params.value == null) return '';
        return `$${Number(params.value).toLocaleString('es-MX', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      },
    },
    {
      field: 'stock_actual',
      headerName: 'Stock',
      flex: 1,
      minWidth: 120,
      sortable: true,
      filter: false,
      cellStyle: (params: CellClassParams<Producto, any, any>) => {
        if (params.value < 10) {
          return { color: '#dc2626', fontWeight: '600' };
        }
        return null;
      },
    },
    {
      field: 'estado',
      headerName: 'Estado',
      flex: 1,
      minWidth: 120,
      sortable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<Producto>) => {
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              params.value
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {params.value ? 'Activo' : 'Inactivo'}
          </span>
        );
      },
    },
    {
      headerName: 'Acciones',
      flex: 1,
      minWidth: 200,
      sortable: false,
      filter: false,
      cellRenderer: ActionCellRenderer,
      cellRendererParams: {
        onEdit: (product: Producto) => setEditingProduct(product),
        onDelete: (product: Producto) => setDeletingProduct(product),
      },
      pinned: 'right',
    },
  ];

  const defaultColDef: ColDef = {
    resizable: true,
    floatingFilter: false, // Explicitly disable floating filters
    filter: false, // Disable all filters
    suppressHeaderMenuButton: true, // Disable header menu button
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;

    try {
      await deleteProducto.mutateAsync(deletingProduct.documentId);
      setDeletingProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error al cargar los productos:{' '}
        {error instanceof Error ? error.message : 'Error desconocido'}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Buscar productos por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
        />
      </div>

      {/* AG-Grid Table */}
      <div className="w-full" style={{ height: '600px' }}>
        <AgGridReact<Producto>
          theme={themeAlpine}
          rowData={filteredProducts()}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          suppressCellFocus={true}
          suppressMenuHide={true}
          enableCellTextSelection={true}
          ensureDomOrder={true}
        />
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <DeleteConfirmModal
          productName={deletingProduct.Nombre}
          isOpen={!!deletingProduct}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingProduct(null)}
          isDeleting={deleteProducto.isPending}
        />
      )}
    </div>
  );
};
