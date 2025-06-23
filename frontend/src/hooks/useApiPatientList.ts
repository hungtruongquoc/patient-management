import { useQuery, gql, ApolloError } from '@apollo/client';

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
}

// Return type for useApiPatient hook
interface UseApiPatientReturn {
  loading: boolean;
  error: ApolloError | undefined;
  patient: Patient | undefined;
}

export function useApiPatientList(): UseApiPatientListReturn {
  const { loading, error, data } = useQuery<{ patients: Patient[] }>(
    GET_PATIENTS
  );

  return {
    loading,
    error,
    patients: data?.patients || [],
  };
}

export function useApiPatient(id: number): UseApiPatientReturn {
  const { loading, error, data } = useQuery<{ patient: Patient }>(GET_PATIENT, {
    variables: { id },
    skip: !id,
  });

  return {
    loading,
    error,
    patient: data?.patient,
  };
}

export type { Patient };
