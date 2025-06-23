import { useQuery, gql, ApolloError } from '@apollo/client';
import { useDemoToken } from '@/contexts/TokenContext';

const GET_PATIENTS = gql`
  query GetPatients {
    patients {
      id
      firstName
      lastName
      email
      phone
    }
  }
`;

const GET_PATIENT = gql`
  query GetPatient($id: Int!) {
    patient(id: $id) {
      id
      firstName
      lastName
      email
      phone
    }
  }
`;

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Return type for useApiPatientList hook
interface UseApiPatientListReturn {
  loading: boolean;
  error: ApolloError | undefined;
  patients: Patient[];
  isAuthenticated: boolean;
  tokenLoading: boolean;
  fetchToken: () => void;
}

// Return type for useApiPatient hook
interface UseApiPatientReturn {
  loading: boolean;
  error: ApolloError | undefined;
  patient: Patient | undefined;
  isAuthenticated: boolean;
  tokenLoading: boolean;
  fetchToken: () => void;
}

export function useApiPatientList(): UseApiPatientListReturn {
  const { token, loading: tokenLoading, fetchToken, isAuthenticated } = useDemoToken();

  const { loading, error, data } = useQuery<{ patients: Patient[] }>(
    GET_PATIENTS,
    {
      // Skip query if no token is available
      skip: !token,
      // Refetch when token becomes available
      notifyOnNetworkStatusChange: true,
    }
  );

  return {
    loading: loading || (tokenLoading && !token),
    error,
    patients: data?.patients || [],
    isAuthenticated,
    tokenLoading,
    fetchToken,
  };
}

export function useApiPatient(id: number): UseApiPatientReturn {
  const { token, loading: tokenLoading, fetchToken, isAuthenticated } = useDemoToken();

  const { loading, error, data } = useQuery<{ patient: Patient }>(GET_PATIENT, {
    variables: { id },
    // Skip query if no ID or no token is available
    skip: !id || !token,
    notifyOnNetworkStatusChange: true,
  });

  return {
    loading: loading || (tokenLoading && !token),
    error,
    patient: data?.patient,
    isAuthenticated,
    tokenLoading,
    fetchToken,
  };
}

export type { Patient };
