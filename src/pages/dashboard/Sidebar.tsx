import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  UserRoundPlus,
} from 'lucide-react';

// `to: null` menandakan menu ini belum punya rute nyata (placeholder).
// Jangan pakai '#', karena NavLink akan selalu menganggapnya "aktif".
const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Profile', to: null, icon: User },
  { label: 'Settings', to: null, icon: Settings },
  { label: 'Register', to: '/register', icon: UserRoundPlus },
] as const;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => Promise<void>;
}

export function Sidebar({ isOpen, onClose, onLogout }: SidebarProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = async () => {
    try {
      setIsLoggingOut(true);
      await onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Overlay: hanya muncul di mobile saat sidebar terbuka, klik untuk menutup */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
            h-[calc(100vh-4rem)] shrink-0 overflow-hidden
            border-r border-gray-200 bg-white
            transition-all duration-200 ease-in-out
            ${isOpen ? 'w-64' : 'w-0'}
        `}
      >
        {/* Header sidebar, tombol close hanya relevan di mobile */}
        <div className="w-64">
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 md:hidden">
            <span className="text-lg font-bold text-gray-900">Menu</span>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup sidebar"
              className="text-2xl text-gray-500 transition hover:text-gray-900"
            >
              ×
            </button>
          </div>

          <nav className="flex flex-col gap-1 p-4">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              // Item tanpa rute nyata: render non-interaktif, jangan pakai NavLink
              // supaya tidak pernah ke-treat sebagai "aktif" oleh router.
              if (item.to === null) {
                return (
                  <span
                    key={item.label}
                    title="Belum tersedia"
                    className="
                      flex cursor-not-allowed items-center gap-3
                      rounded-lg px-3 py-2 text-sm font-medium
                      text-gray-400
                    "
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </span>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === '/dashboard'}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                      isActive
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700',
                    ].join(' ')
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              );
            })}

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className="
                mt-2 flex w-full items-center gap-3 rounded-lg
                px-3 py-2 text-left text-sm font-medium
                text-red-600 transition
                hover:bg-red-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <LogOut className="h-5 w-5" />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}
