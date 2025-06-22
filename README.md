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
