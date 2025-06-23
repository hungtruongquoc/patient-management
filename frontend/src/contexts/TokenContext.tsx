import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useLazyQuery, gql, type ApolloError } from '@apollo/client';

// GraphQL query to get demo token
const GET_DEMO_TOKEN = gql`
  query GetDemoToken {
    getDemoToken
  }
`;

// Token context interface
interface TokenContextType {
  token: string | null;
  loading: boolean;
  error: ApolloError | undefined;
  fetchToken: () => void;
  clearToken: () => void;
  isAuthenticated: boolean;
}

// Create context with default values
const TokenContext = createContext<TokenContextType | undefined>(undefined);

// Session storage key for token persistence
const TOKEN_STORAGE_KEY = 'demoToken';

// Token provider props
interface TokenProviderProps {
  children: ReactNode;
}

/**
 * TokenProvider component that manages JWT token state and persistence
 * 
 * Features:
 * - Fetches demo tokens from GraphQL API
 * - Persists tokens in sessionStorage
 * - Provides token state to child components
 * - Handles loading and error states
 * - Auto-loads existing tokens on mount
 */
export function TokenProvider({ children }: TokenProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Apollo lazy query for fetching demo token
  const [fetchDemoToken, { loading, error }] = useLazyQuery<{ getDemoToken: string }>(
    GET_DEMO_TOKEN,
    {
      onCompleted: (data) => {
        if (data?.getDemoToken) {
          const newToken = data.getDemoToken;
          setToken(newToken);
          sessionStorage.setItem(TOKEN_STORAGE_KEY, newToken);
        }
      },
      onError: (error) => {
        console.error('Failed to fetch demo token:', error);
        // Clear any existing token on error
        clearToken();
      },
      fetchPolicy: 'network-only', // Always fetch fresh token
    }
  );

  // Load existing token from sessionStorage on mount
  useEffect(() => {
    const existingToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (existingToken) {
      setToken(existingToken);
    }
    setIsInitialized(true);
  }, []);

  // Function to fetch a new token
  const fetchToken = () => {
    fetchDemoToken();
  };

  // Function to clear the token
  const clearToken = () => {
    setToken(null);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  // Check if user is authenticated
  const isAuthenticated = Boolean(token);

  // Context value
  const contextValue: TokenContextType = {
    token,
    loading: loading || !isInitialized,
    error,
    fetchToken,
    clearToken,
    isAuthenticated,
  };

  return (
    <TokenContext.Provider value={contextValue}>
      {children}
    </TokenContext.Provider>
  );
}

/**
 * Custom hook to use the token context
 * 
 * @returns TokenContextType - Token context with state and methods
 * @throws Error if used outside of TokenProvider
 */
export function useTokenContext(): TokenContextType {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokenContext must be used within a TokenProvider');
  }
  return context;
}

/**
 * Hook specifically for demo token management
 * Provides a clean interface for components that need token functionality
 */
export function useDemoToken() {
  const {
    token,
    loading,
    error,
    fetchToken,
    clearToken,
    isAuthenticated,
  } = useTokenContext();

  return {
    token,
    loading,
    error,
    fetchToken,
    clearToken,
    isAuthenticated,
    // Helper methods
    hasToken: Boolean(token),
    refreshToken: () => {
      clearToken();
      fetchToken();
    },
  };
}
