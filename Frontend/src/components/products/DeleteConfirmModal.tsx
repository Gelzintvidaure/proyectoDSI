import { Button } from '../ui/Button';

interface DeleteConfirmModalProps {
  productName: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const DeleteConfirmModal = ({
  productName,
  isOpen,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Estás seguro?
            </h3>
            <p className="text-gray-600">
              ¿Estás seguro de que deseas eliminar el producto{' '}
              <span className="font-semibold text-gray-900">
                "{productName}"
              </span>
              ? Esta acción no se puede deshacer.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={onConfirm}
              isLoading={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
