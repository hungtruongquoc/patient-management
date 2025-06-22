/**
 * Shared Patient type definition
 * This file contains TypeScript types that can be used by both frontend and backend
 */

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  ssn?: string;
  medicalRecordNumber?: string;
  address?: string;
  emergencyContact?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  allergies?: string;
  medications?: string;
  medicalHistory?: string;
  TIN?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  lastModifiedBy?: string;
  organizationId?: string;
  deletedAt?: Date;
}

// Type for all possible field names
export type PatientFields = keyof Patient;

// Type for required fields only
export type PatientRequiredFields = keyof Omit<Patient, 
  | 'dateOfBirth' 
  | 'ssn' 
  | 'medicalRecordNumber' 
  | 'address' 
  | 'emergencyContact' 
  | 'insuranceProvider' 
  | 'insuranceNumber' 
  | 'allergies' 
  | 'medications' 
  | 'medicalHistory' 
  | 'TIN' 
  | 'createdBy' 
  | 'lastModifiedBy' 
  | 'organizationId' 
  | 'deletedAt'
>;

// Type for sensitive fields that require special access
export type PatientSensitiveFields = 'dateOfBirth' | 'ssn' | 'medicalRecordNumber' | 'insuranceNumber' | 'medicalHistory';

// Type for public fields (non-sensitive)
export type PatientPublicFields = Exclude<PatientFields, PatientSensitiveFields>;

// Utility type for creating patient input (without id, createdAt, updatedAt)
export type CreatePatientInput = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;

// Utility type for updating patient (all fields optional except id)
export type UpdatePatientInput = Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>;

// Helper function to build GraphQL query fields
export function buildPatientQueryFields(fields: PatientFields[]): string {
  return fields.join('\n    ');
}

// Helper function to build GraphQL query
export function buildPatientQuery(
  queryName: string,
  fields: PatientFields[],
  variables?: Record<string, any>
): string {
  const fieldString = buildPatientQueryFields(fields);
  const variableString = variables 
    ? Object.entries(variables)
        .map(([key, value]) => `$${key}: ${typeof value === 'number' ? 'Int' : 'String'}`)
        .join(', ')
    : '';
  
  return `
query ${queryName}${variableString ? `(${variableString})` : ''} {
  ${queryName}${variables ? `(${Object.keys(variables).map(key => `${key}: $${key}`).join(', ')})` : ''} {
    ${fieldString}
  }
}`;
} 