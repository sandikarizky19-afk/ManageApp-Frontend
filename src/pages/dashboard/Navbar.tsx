import { Logs } from 'lucide-react';

interface NavbarProps {
  user: string | null;
  onToggleSidebar: () => void;
}

export function Navbar({ user, onToggleSidebar }: NavbarProps) {
  return (
    <nav className="border-b px-8 py-4 border-gray-300 bg-white">
      <div className="flex h-full items-center px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Buka atau tutup sidebar"
            className="flex h-9 w-9 items-center justify-center
              rounded-lg text-xl text-gray-600
              transition hover:bg-gray-100 hover:text-gray-900"
          >
            <Logs className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div
              className=" flex h-9 w-9 items-center justify-center
              rounded-lg bg-teal-600 text-white"
            >
              ◈
            </div>
          </div>

          <span className="text-lg font-bold text-gray-900">ManageApp</span>
        </div>

        {/* User */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-900">
              {user ?? 'User'}
            </p>

            <div className="flex items-center justify-end gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>

          <div
            className="
            flex h-10 w-10 items-center justify-center
            rounded-full bg-teal-50
            text-sm font-semibold text-teal-700
            ring-1 ring-teal-100
          "
          >
            {user?.charAt(0).toUpperCase() ?? 'U'}
          </div>
        </div>
      </div>
    </nav>
  );
}
