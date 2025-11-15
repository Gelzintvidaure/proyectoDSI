import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Login } from './pages/Login';
import { Inventario } from './pages/Inventario';
import { useAuthStore } from './stores/authStore';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Navigate to="/dashboard/inventario" replace />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/inventario"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Inventario />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/venta"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Venta</h1>
                <p className="text-gray-500">Página de ventas en desarrollo.</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/caja"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Caja</h1>
                <p className="text-gray-500">Página de caja en desarrollo.</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/reportes"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Reportes
                </h1>
                <p className="text-gray-500">
                  Página de reportes en desarrollo.
                </p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/usuarios"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Usuarios
                </h1>
                <p className="text-gray-500">
                  Página de usuarios en desarrollo.
                </p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={<Navigate to="/dashboard/inventario" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard/inventario" replace />}
      />
    </Routes>
  );
}

export default App;
