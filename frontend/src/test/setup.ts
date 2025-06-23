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
