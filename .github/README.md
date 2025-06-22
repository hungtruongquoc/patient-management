# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the Patient Management project.

## Workflows

### 🔄 **CI** (`ci.yml`)
**Triggers**: All pushes and pull requests to `main` and `develop` branches

**Jobs**:
- **Backend Tests**: Linting, formatting, unit tests, e2e tests
- **Frontend Tests**: Linting, type checking, unit tests, e2e tests
- **Security Scan**: npm audit and Snyk security scanning
- **Build**: Production builds for both apps (main branch only)

### 🐳 **Docker** (`docker.yml`)
**Triggers**: Backend changes on `main` branch and pull requests

**Jobs**:
- **Build and Push**: Builds Docker image and pushes to GitHub Container Registry
- **Test**: Validates Docker image functionality

### 🔧 **Backend CI** (`backend-ci.yml`)
**Triggers**: Backend-specific changes

**Jobs**:
- **Test**: Multi-Node.js version testing (18, 20, 22)
- **Docker**: Docker build validation
- **Security**: Security scanning
- **Build**: Production build artifacts

### 🎨 **Frontend CI** (`frontend-ci.yml`)
**Triggers**: Frontend-specific changes

**Jobs**:
- **Test**: Multi-Node.js version testing
- **Build**: Production build artifacts

## Usage

### Local Development
```bash
# Run tests locally before pushing
cd backend
npm run test
npm run lint:check
npm run format:check

# Run Docker build locally
npm run docker:build
```

### Pull Request Process
1. Create a feature branch
2. Make your changes
3. Run tests locally
4. Push and create a PR
5. GitHub Actions will automatically run:
   - Linting and formatting checks
   - Unit and e2e tests
   - Security scans
   - Docker build validation (for backend changes)

### Deployment
- **Main branch**: Automatically builds and pushes Docker images
- **Pull requests**: Builds but doesn't push (for validation only)

## Secrets

The following secrets are used in the workflows:

- `SNYK_TOKEN`: For Snyk security scanning (optional)
- `GITHUB_TOKEN`: Automatically provided by GitHub

## Cache

Workflows use GitHub Actions cache for:
- Node.js dependencies (`node_modules`)
- Docker layers (for faster builds)

## Coverage

Test coverage is uploaded to Codecov for:
- Backend: `backend/coverage/lcov.info`
- Frontend: `frontend/coverage/lcov.info`

## Docker Images

Docker images are published to:
- **Registry**: `ghcr.io`
- **Image**: `{repository}/patient-management-api`
- **Tags**: Branch names, commit SHAs, and semantic versions

## Troubleshooting

### Common Issues

1. **Linting fails**: Run `npm run lint:fix` locally
2. **Formatting fails**: Run `npm run format` locally
3. **Tests fail**: Check test output and run locally
4. **Docker build fails**: Test Docker build locally first

### Local Testing

```bash
# Test backend workflow locally
cd backend
npm ci
npm run lint:check
npm run format:check
npm run test
npm run test:e2e

# Test Docker build
docker build -t test-image .
docker run --rm -p 3000:3000 test-image
curl http://localhost:3000/health
```

## Workflow Optimization

- **Path filtering**: Workflows only run when relevant files change
- **Parallel jobs**: Tests run in parallel for faster feedback
- **Caching**: Dependencies and Docker layers are cached
- **Conditional builds**: Production builds only on main branch 