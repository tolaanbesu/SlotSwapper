import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Logo from '../common/logo';
import { User } from 'lucide-react';

export default function AppLayout({ children, currentPage, setPage }) {
  const { user, logout } = useAuth();

  return (
    <div className="relative min-h-screen bg-gray-50 pb-11">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md px-6 py-5 flex justify-between items-center w-full fixed top-0 left-0 z-20 h-20">
        <div className="flex items-center gap-6">
          <div className="font-bold text-green-700 flex items-center gap-2">
            <Logo />
          </div>

          {user && (
            <div className="flex items-center gap-4 text-gray-700">
              <span className="font-medium hover:text-green-600 cursor-pointer transition">Dashboard</span>
              <span className="font-medium hover:text-green-600 cursor-pointer transition">Marketplace</span>
              <span className="font-medium hover:text-green-600 cursor-pointer transition">Requests</span>
            </div>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-4">
            {/* Creative Username Section */}
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full shadow-sm">
              <User size={18} className="text-green-600" />
              <span className="font-semibold text-green-700 tracking-wide">
                {user?.name?.split(' ')[0] || 'User'}
              </span>
            </div>

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition shadow-sm"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Content Section */}
      <div className="flex pt-20">
        <Sidebar user={user} currentPage={currentPage} setPage={setPage} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
