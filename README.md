# Patient Management System

A comprehensive patient management system with a NestJS GraphQL backend and modern frontend (coming soon).

## 🏗️ **Project Structure**

```
patient-management/
├── backend/                 # NestJS GraphQL API
│   ├── src/                # Source code
│   ├── prisma/             # Database schema and migrations
│   ├── Dockerfile          # Production Docker image
│   └── docker-compose.yml  # Local development
├── frontend/               # Frontend application (coming soon)
├── types/                  # Shared TypeScript types
├── .github/                # GitHub Actions workflows
│   ├── workflows/          # CI/CD pipelines
│   └── pull_request_template.md
└── README.md               # This file
```

## 🧠 **Knowledge Base**

### Architecture Overview

This project follows a layered architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   GraphQL       │    │   Database      │
│   Form          │───▶│   DTO           │───▶│   Entity        │
│                 │    │   Validation    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Components

#### 1. **Entities** (`patient.entity.ts`)
- **Purpose**: Database structure and GraphQL response shape
- **Decorators**: 
  - `@Column()` - TypeORM database mapping
  - `@Field()` - GraphQL schema exposure
- **Example**:
  ```typescript
  @Column('datetime', { select: false, nullable: true })
  @Field({ nullable: true })
  dateOfBirth: Date;
  ```

#### 2. **DTOs** (Data Transfer Objects)
- **Purpose**: API input validation and business rules
- **Types**:
  - `CreatePatientInput` - Required fields for creation
  - `UpdatePatientInput` - Optional fields for updates
- **Example**:
  ```typescript
  @InputType()
  export class CreatePatientInput {
    @Field()
    dateOfBirth: Date;  // Required for form submission
    @Field()
    ssn: string;        // Required for form submission
  }
  ```

#### 3. **Services** (`patient.service.ts`)
- **Purpose**: Business logic and database operations
- **Methods**:
  - `findAll()` - Default queries (no sensitive data)
  - `findOneWithSensitiveData()` - Explicit sensitive data retrieval

#### 4. **Resolvers** (`patient.resolver.ts`)
- **Purpose**: GraphQL routing and request handling
- **Queries**:
  - `patients` - Public data only
  - `findOneWithSensitiveData` - Explicit sensitive data access

### Data Flow Patterns

#### **Create Patient Flow**
1. **Frontend Form** → Submits required `dateOfBirth` and `ssn`
2. **GraphQL DTO** → Validates required fields are present
3. **Service** → Processes the validated data
4. **Entity** → Stores in database (with `select: false` for privacy)

#### **Query Patient Flow**
1. **Default Query** → Returns public fields only
2. **Sensitive Query** → Explicitly requests sensitive data
3. **Service** → Uses `.addSelect()` to include sensitive fields
4. **Response** → Returns data based on entity's `@Field()` decorators

### Security Patterns

#### **Sensitive Data Handling**
- **Storage**: All sensitive fields use `select: false` in TypeORM
- **Retrieval**: Sensitive data only returned with explicit requests
- **Validation**: Required for creation, optional for updates
- **GraphQL**: Optional in queries, required in mutations

#### **Field Visibility**
```typescript
// Hidden by default, explicit selection required
@Column({ select: false })
@Field({ nullable: true })
ssn?: string;

// Always visible
@Column()
@Field()
firstName: string;
```

### GraphQL vs REST Differences

#### **GraphQL**
- **Returns only requested fields**: Must explicitly specify fields in query
- **Client-driven**: Client decides what data to request
- **Single endpoint**: All operations through `/graphql`
- **Type safety**: Strong typing with TypeScript

#### **REST**
- **Returns everything**: Server decides response structure
- **Server-driven**: Fixed response format
- **Multiple endpoints**: Different URLs for different operations
- **Less type safety**: Manual type checking

### Shared Types (`types/` folder)

#### **Purpose**
- **Type consistency** across frontend and backend
- **Query generation** with TypeScript `keyof`
- **API contract** definition

#### **Usage**
```typescript
import { PatientFields, buildPatientQuery } from '../types';

// Type-safe field selection
const fields: PatientFields[] = ['id', 'firstName', 'lastName'];

// Generate GraphQL query
const query = buildPatientQuery('patients', fields);
```

### Validation Layers

1. **GraphQL Level**: `@Field()` decorators define required/optional fields
2. **DTO Level**: Business rules and input validation
3. **Service Level**: Business logic validation
4. **Database Level**: Schema constraints and relationships

### GraphQL Query Anatomy

#### **Basic Structure**
```graphql
query GetPatients {
  patients {
    id
    firstName
    lastName
  }
}
```

**Components:**
- `query` - Operation type (can also be `mutation` or `subscription`)
- `GetPatients` - Operation name (optional but recommended)
- `patients` - Field name (resolver name)

#### **Field Selection**
```graphql
query {
  patients {
    id          # Field
    firstName   # Field
    lastName    # Field
    email {     # Nested object
      address   # Nested field
      verified  # Nested field
    }
  }
}
```

#### **Arguments**
```graphql
query {
  patient(id: 1) {           # id: 1 is an argument
    firstName
    lastName
  }
  
  patients(limit: 10, offset: 0) {  # Multiple arguments
    id
    firstName
  }
}
```

#### **Variables** (Dynamic Values)
```graphql
query GetPatient($patientId: Int!) {
  patient(id: $patientId) {
    id
    firstName
    lastName
  }
}

# Variables sent separately:
{
  "patientId": 1
}
```

#### **Fragments** (Reusable Field Sets)
```graphql
fragment PatientFields on Patient {
  id
  firstName
  lastName
  email
}

query {
  patients {
    ...PatientFields
    phone  # Additional field
  }
}
```

#### **Aliases** (Rename Fields)
```graphql
query {
  firstPatient: patient(id: 1) {
    firstName
  }
  secondPatient: patient(id: 2) {
    firstName
  }
}
```

#### **Complete Example**
```graphql
query GetPatientsWithDetails($limit: Int = 10) {
  patients(limit: $limit) {
    id
    firstName
    lastName
    email
    address {
      street
      city
      country
    }
    appointments {
      date
      doctor {
        name
        specialty
      }
    }
  }
}
```

#### **Key Concepts**
- **Operation Type**: `query`, `mutation`, `subscription`
- **Field Names**: Must match resolver names
- **Arguments**: Passed to resolvers
- **Variables**: Dynamic values (prefixed with `$`)
- **Nested Objects**: Represent relationships
- **Fragments**: Reusable field sets
- **Aliases**: Rename fields in response

### Resolver Types

#### **Query Resolvers** (Required for Entry Points)
```typescript
@Resolver(() => Patient)
export class PatientResolver {
  // Required - this is how clients access your data
  @Query(() => [Patient])
  async patients(): Promise<Patient[]> {
    return this.patientService.findAll();
  }
}
```

#### **Field Resolvers** (Optional - for Complex Logic)
```typescript
@Resolver(() => Patient)
export class PatientResolver {
  // Optional - only if you need custom logic
  @ResolveField(() => String)
  fullName(@Parent() patient: Patient): string {
    return `${patient.firstName} ${patient.lastName}`;
  }
}
```

#### **When Resolvers Are Needed**
- **Query Resolvers**: Required for entry points (`@Query()`)
- **Field Resolvers**: Optional for custom logic (`@ResolveField()`)
- **Simple Fields**: Automatic - no resolver needed

## 🚀 **Quick Start**

### Backend (NestJS + GraphQL + Prisma)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup database
npm run prisma:generate
npm run prisma:migrate

# Start development server
npm run start:dev

# Access GraphQL Playground
open http://localhost:3000/graphql
```

### Docker (Recommended)

```bash
# Start with Docker Compose
cd backend
npm run docker:compose:up

# Access API
curl http://localhost:3000/health
```

## 🔧 **Development**

### Prerequisites
- Node.js 18+ (22 recommended)
- Docker (optional)
- Git

### Backend Features
- **GraphQL API** with Apollo Server
- **Prisma ORM** with SQLite database
- **HIPAA-compliant** data modeling
- **Health check** endpoint
- **Docker** containerization
- **Comprehensive testing** suite

# NestJS Module Architecture

This document explains how our NestJS modules are structured and how they work together, particularly focusing on GraphQL integration and dependency injection patterns.

## Module Structure Overview

Our application follows a domain-driven module structure where each feature (like `Patient`) has its own dedicated module containing all related components.

### Typical Module Pattern

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([EntityName])],
  providers: [EntityService, EntityResolver],
  exports: [EntityService],
})
export class EntityModule {}
```

## Key Components

### Imports
- **TypeOrmModule.forFeature([Entity])**: Registers entities with TypeORM for this module
- Provides access to repository pattern for database operations
- `forFeature()` is used at module level, `forRoot()` is used globally

### Providers
- **Service Classes**: Contains business logic and database operations
- **Resolver Classes**: Handles GraphQL queries and mutations
- Both are registered as providers for dependency injection

### Exports
- **Services Only**: Business logic services are exported for use in other modules
- **Resolvers Not Exported**: GraphQL resolvers are discovered automatically

## GraphQL Integration

### Automatic Schema Discovery

```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: true, // Enables automatic schema generation
  playground: process.env.APP_ENV === 'local',
  introspection: process.env.APP_ENV === 'local',
})
```

With `autoSchemaFile: true`, NestJS automatically:
- Scans all imported modules for `@Resolver()` decorated classes
- Generates GraphQL schema from TypeScript types and decorators
- Includes resolvers in the schema regardless of export status

### Why Resolvers Don't Need Export

```typescript
// In PatientModule
providers: [PatientService, PatientResolver]
exports: [PatientService] // Only service is exported
```

- **GraphQL Discovery**: Happens during application bootstrap
- **Module Scanning**: NestJS scans all providers in imported modules
- **Decorator Detection**: Classes with `@Resolver()` are automatically included
- **Schema Generation**: Resolvers become part of the GraphQL schema

## Dependency Injection Flow

### Cross-Module Service Usage

```typescript
// AppointmentModule can use PatientService
@Module({
  imports: [PatientModule], // Import the module
  providers: [AppointmentService],
})
export class AppointmentModule {}

// In AppointmentService
@Injectable()
export class AppointmentService {
  constructor(
    private patientService: PatientService // Inject exported service
  ) {}
}
```

### Internal Module Dependencies

```typescript
// Within PatientModule
@Resolver(() => Patient)
export class PatientResolver {
  constructor(
    private patientService: PatientService // Internal injection
  ) {}
}
```

## Best Practices

### 1. Export Strategy
- ✅ **Export Services**: For business logic reuse across modules
- ❌ **Don't Export Resolvers**: GraphQL handles discovery automatically
- ✅ **Export Utilities**: Shared helpers and validators

### 2. Module Organization
```
src/
├── patient/
│   ├── patient.entity.ts
│   ├── patient.service.ts
│   ├── patient.resolver.ts
│   └── patient.module.ts
├── appointment/
│   ├── appointment.entity.ts
│   ├── appointment.service.ts
│   ├── appointment.resolver.ts
│   └── appointment.module.ts
└── app.module.ts
```

### 3. Import Patterns
```typescript
@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({ isGlobal: true }),
    
    // Database setup
    DatabaseModule,
    
    // Feature modules
    PatientModule,
    AppointmentModule,
    
    // GraphQL setup (should be after feature modules)
    GraphQLModule.forRoot(/* config */),
  ],
})
```

## Common Patterns

### Repository Pattern with TypeORM
```typescript
@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}
}
```

### GraphQL Resolver Structure
```typescript
@Resolver(() => Patient)
export class PatientResolver {
  constructor(private patientService: PatientService) {}

  @Query(() => [Patient])
  async patients(): Promise<Patient[]> {
    return this.patientService.findAll();
  }

  @Mutation(() => Patient)
  async createPatient(@Args('input') input: CreatePatientInput): Promise<Patient> {
    return this.patientService.create(input);
  }
}
```

## Environment Configuration

### Development vs Production
```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: true,
  playground: process.env.APP_ENV === 'local',    // Only in local
  introspection: process.env.APP_ENV === 'local', // Only in local
})
```

- **Playground**: GraphQL IDE for development
- **Introspection**: Allows schema querying (security consideration for production)

## Troubleshooting

### Common Issues

1. **Resolver Not Found**: Ensure module is imported in `AppModule`
2. **Circular Dependencies**: Use `forwardRef()` when modules depend on each other
3. **Repository Not Found**: Check `TypeOrmModule.forFeature([Entity])` is imported
4. **Service Not Available**: Verify service is exported from its module

### Debug Tips
- Use `@nestjs/cli` to generate modules: `nest g module patient`
- Check module import order in `AppModule`
- Verify entity imports in `TypeOrmModule.forFeature([])`

### Frontend (Coming Soon)
- Modern React/Next.js application
- TypeScript support
- GraphQL client integration
- Responsive design

## 🏥 **API Endpoints**

- **Health Check**: `GET /health`
- **GraphQL**: `POST /graphql`
- **GraphQL Playground**: `GET /graphql` (when `APP_ENV=local`)

## 🐳 **Docker**

The application is fully containerized:

```bash
# Production
npm run docker:compose:up

# Development
npm run docker:compose:dev

# Build image
npm run docker:build
```

## 🔄 **CI/CD**

GitHub Actions workflows provide:

- **Automated testing** on multiple Node.js versions
- **Linting and formatting** checks
- **Security scanning** with Snyk
- **Docker image** building and publishing
- **Test coverage** reporting
- **Pull request** validation

### Workflows
- `backend-ci.yml` - Backend-specific testing
- `frontend-ci.yml` - Frontend-specific testing
- `docker.yml` - Docker image building and publishing

## 📚 **Documentation**

- [Backend Documentation](./backend/README.md) - Comprehensive backend guide
- [GitHub Actions Documentation](./.github/README.md) - CI/CD workflows
- [API Documentation](./backend/README.md#graphql-api) - GraphQL schema and examples

## 🛡️ **Security**

- **HIPAA compliance** considerations
- **Non-root Docker** containers
- **Security scanning** in CI/CD
- **Environment-based** configuration
- **Sensitive data** protection

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests locally
5. Submit a pull request

GitHub Actions will automatically:
- Run linting and formatting checks
- Execute unit and e2e tests
- Perform security scans
- Validate Docker builds

## 📄 **License**

This project is licensed under the MIT License.
