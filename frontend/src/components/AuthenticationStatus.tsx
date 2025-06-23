import { Shield, ShieldCheck, ShieldX, RefreshCw, LogOut } from 'lucide-react';
import { useDemoToken } from '@/contexts/TokenContext';

/**
 * AuthenticationStatus component displays the current authentication state
 * and provides controls for token management
 */
function AuthenticationStatus() {
  const {
    token,
    loading,
    error,
    fetchToken,
    clearToken,
    isAuthenticated,
    refreshToken,
  } = useDemoToken();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
        <span className="text-sm text-blue-700">Loading authentication...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <ShieldX className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-700">Authentication failed</span>
        </div>
        <button
          onClick={fetchToken}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-between px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-yellow-700">Not authenticated</span>
        </div>
        <button
          onClick={fetchToken}
          className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
        >
          Get Token
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center space-x-2">
        <ShieldCheck className="h-4 w-4 text-green-600" />
        <span className="text-sm text-green-700">Authenticated</span>
        {token && (
          <span className="text-xs text-green-600 font-mono bg-green-100 px-2 py-1 rounded">
            {token.substring(0, 20)}...
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={refreshToken}
          className="p-1 text-green-600 hover:text-green-800 transition-colors"
          title="Refresh token"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
        <button
          onClick={clearToken}
          className="p-1 text-green-600 hover:text-green-800 transition-colors"
          title="Clear token"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Compact version of AuthenticationStatus for smaller spaces
 */
export function AuthenticationBadge() {
  const { isAuthenticated, loading } = useDemoToken();

  if (loading) {
    return (
      <div className="flex items-center space-x-1">
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />
        <span className="text-xs text-gray-600">Auth...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      {isAuthenticated ? (
        <ShieldCheck className="h-3 w-3 text-green-600" />
      ) : (
        <ShieldX className="h-3 w-3 text-red-600" />
      )}
      <span className={`text-xs ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
        {isAuthenticated ? 'Auth' : 'No Auth'}
      </span>
    </div>
  );
}

export default AuthenticationStatus;
