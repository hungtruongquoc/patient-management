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
├── .github/                # GitHub Actions workflows
│   ├── workflows/          # CI/CD pipelines
│   └── pull_request_template.md
└── README.md               # This file
```

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
