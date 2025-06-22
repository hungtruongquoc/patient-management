# Shared Types Package

This package contains shared TypeScript types for the Patient Management System that can be used by both frontend and backend.

## Usage

### Importing Types

```typescript
import { 
  Patient, 
  PatientFields, 
  PatientSensitiveFields,
  buildPatientQuery 
} from '@patient-management/types';
```

### Building GraphQL Queries

```typescript
// Build a query with specific fields
const fields: PatientFields[] = ['id', 'firstName', 'lastName', 'email'];
const query = buildPatientQuery('patients', fields);

// Build a query with variables
const sensitiveQuery = buildPatientQuery(
  'findOneWithSensitiveData', 
  ['id', 'firstName', 'lastName', 'dateOfBirth', 'ssn'],
  { id: 1 }
);
```

### Type Safety

```typescript
// This will give you autocomplete and type checking
const publicFields: PatientPublicFields[] = ['id', 'firstName', 'lastName', 'email'];
const sensitiveFields: PatientSensitiveFields[] = ['dateOfBirth', 'ssn'];

// TypeScript will catch errors
const invalidField: PatientFields = 'invalidField'; // ❌ Error
```

## Available Types

- `Patient` - Main patient interface
- `PatientFields` - All possible field names
- `PatientRequiredFields` - Required fields only
- `PatientSensitiveFields` - Sensitive fields that need special access
- `PatientPublicFields` - Public (non-sensitive) fields
- `CreatePatientInput` - Type for creating new patients
- `UpdatePatientInput` - Type for updating patients

## Helper Functions

- `buildPatientQueryFields()` - Build field string for GraphQL
- `buildPatientQuery()` - Build complete GraphQL query 