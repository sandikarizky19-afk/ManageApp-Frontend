import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <Navbar
        user={user}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
