import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Cpu, LogOut, Home } from 'lucide-react';

const AdminNavbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Star AI Labs Admin
            </span>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <a
              href="/"
              className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <Home className="h-4 w-4 mr-2" />
              View Site
            </a>
            
            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900">Welcome, {user?.username}</p>
                <p className="text-gray-500">{user?.email}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;