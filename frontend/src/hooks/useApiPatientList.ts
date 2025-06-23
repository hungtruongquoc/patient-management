import { useQuery, gql } from '@apollo/client';

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

export function useApiPatientList() {
  const { loading, error, data } = useQuery<{ patients: Patient[] }>(
    GET_PATIENTS
  );

  return {
    loading,
    error,
    patients: data?.patients || [],
  };
}

export function useApiPatient(id: number) {
  const { loading, error, data } = useQuery<{ patient: Patient }>(
    GET_PATIENT,
    {
      variables: { id },
      skip: !id,
    }
  );

  return {
    loading,
    error,
    patient: data?.patient,
  };
}

export type { Patient }; 