import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock Apollo Client
vi.mock('@apollo/client', () => ({
  ApolloProvider: ({ children }: { children: React.ReactNode }) => children,
  useQuery: vi.fn(),
  gql: vi.fn(),
}));

// Mock GraphQL
vi.mock('graphql', () => ({
  gql: vi.fn(),
}));

// Mock React Router
vi.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  useParams: () => ({}),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  Routes: ({ children }: { children: React.ReactNode }) => children,
  Route: ({ children }: { children: React.ReactNode }) => children,
}));
