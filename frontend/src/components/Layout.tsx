import { Link, useLocation, Outlet } from 'react-router-dom';
import { Users, Home } from 'lucide-react';

function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 w-screen">
      {/* Header */}
      <header className="bg-blue-100 shadow-sm border-b border-gray-200 py-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                <Users className="h-6 w-6 mr-2" />
                Patient Management
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              <Link
                to="/"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home className="h-4 w-4 mr-1" />
                Home
              </Link>
              <Link
                to="/patients"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/patients')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Users className="h-4 w-4 mr-1" />
                Patients
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
