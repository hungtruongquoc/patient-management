import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  useQuery,
  ApolloClient,
  ObservableQuery,
  ApolloError,
} from '@apollo/client';
import PatientList from './PatientList';

// Mock the useQuery hook
vi.mocked(useQuery).mockReturnValue({
  loading: false,
  error: undefined,
  data: {
    patients: [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-1234',
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '555-5678',
      },
    ],
  },
  refetch: vi.fn(),
  networkStatus: 7,
  called: true,
  client: {} as ApolloClient<unknown>,
  variables: {},
  fetchMore: vi.fn(),
  subscribeToMore: vi.fn(),
  updateQuery: vi.fn(),
  startPolling: vi.fn(),
  stopPolling: vi.fn(),
  observable: {} as ObservableQuery<unknown, Record<string, unknown>>,
  reobserve: vi.fn(),
});

describe('PatientList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders patient list with data', async () => {
    render(<PatientList />);

    await waitFor(() => {
      expect(screen.getByText('Patients (2)')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
    });
  });

  it('displays patient information correctly', async () => {
    render(<PatientList />);

    await waitFor(() => {
      // Check for patient details
      expect(screen.getByText('555-1234')).toBeInTheDocument();
      expect(screen.getByText('555-5678')).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    vi.mocked(useQuery).mockReturnValue({
      loading: true,
      error: undefined,
      data: undefined,
      refetch: vi.fn(),
      networkStatus: 1,
      called: true,
      client: {} as ApolloClient<unknown>,
      variables: {},
      fetchMore: vi.fn(),
      subscribeToMore: vi.fn(),
      updateQuery: vi.fn(),
      startPolling: vi.fn(),
      stopPolling: vi.fn(),
      observable: {} as ObservableQuery<unknown, Record<string, unknown>>,
      reobserve: vi.fn(),
    });

    render(<PatientList />);
    expect(screen.getByText('Loading patients...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    vi.mocked(useQuery).mockReturnValue({
      loading: false,
      error: { message: 'Failed to fetch patients' } as ApolloError,
      data: undefined,
      refetch: vi.fn(),
      networkStatus: 7,
      called: true,
      client: {} as ApolloClient<unknown>,
      variables: {},
      fetchMore: vi.fn(),
      subscribeToMore: vi.fn(),
      updateQuery: vi.fn(),
      startPolling: vi.fn(),
      stopPolling: vi.fn(),
      observable: {} as ObservableQuery<unknown, Record<string, unknown>>,
      reobserve: vi.fn(),
    });

    render(<PatientList />);
    expect(screen.getByText('Error loading patients')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch patients')).toBeInTheDocument();
  });

  it('shows empty state when no patients', () => {
    vi.mocked(useQuery).mockReturnValue({
      loading: false,
      error: undefined,
      data: { patients: [] },
      refetch: vi.fn(),
      networkStatus: 7,
      called: true,
      client: {} as ApolloClient<unknown>,
      variables: {},
      fetchMore: vi.fn(),
      subscribeToMore: vi.fn(),
      updateQuery: vi.fn(),
      startPolling: vi.fn(),
      stopPolling: vi.fn(),
      observable: {} as ObservableQuery<unknown, Record<string, unknown>>,
      reobserve: vi.fn(),
    });

    render(<PatientList />);
    expect(screen.getByText('No patients found')).toBeInTheDocument();
  });
});
