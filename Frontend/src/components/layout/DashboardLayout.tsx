import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '../../stores/authStore';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bienvenido al Dashboard</h2>
              <p className="text-sm text-gray-500 mt-1">Gestiona tu tienda de manera eficiente</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              {user && (
                <div className="w-full h-full flex items-center justify-center text-gray-600 font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

