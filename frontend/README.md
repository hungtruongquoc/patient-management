# Patient Management Frontend

A modern React application for managing patient data, built with Vite, TypeScript, and Apollo Client for GraphQL integration.

## 🚀 **Quick Start**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ **Tech Stack**

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Apollo Client** - GraphQL client for data fetching
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

## 📁 **Project Structure**

```
frontend/
├── src/
│   ├── components/          # React components
│   │   └── PatientList.tsx  # Patient list component
│   │   └── PatientForm.tsx   # Patient form component
│   │   └── PatientDetails.tsx # Patient details component
│   │   └── PatientSearch.tsx  # Patient search component
│   │   └── PatientCard.tsx    # Patient card component
│   │   └── PatientTable.tsx   # Patient table component
│   │   └── PatientFilter.tsx   # Patient filter component
│   │   └── PatientPagination.tsx # Patient pagination component
│   │   └── PatientSort.tsx     # Patient sort component
│   │   └── PatientHeader.tsx   # Patient header component
│   │   └── PatientFooter.tsx   # Patient footer component
│   │   └── PatientSidebar.tsx  # Patient sidebar component
│   │   └── PatientMain.tsx     # Patient main component
│   │   └── App.tsx            # Main app component
│   │   └── main.tsx           # App entry point
│   │   └── index.css          # Global styles (Tailwind)
│   ├── lib/                 # Utility libraries
│   │   └── apollo-client.ts # Apollo Client configuration
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles (Tailwind)
├── public/                  # Static assets
├── index.html               # HTML template
└── package.json             # Dependencies and scripts
```

## 🔗 **GraphQL Integration**

The app connects to the NestJS GraphQL backend at `http://localhost:3000/graphql`.

### Example Query
```typescript
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
```

### Apollo Client Setup
```typescript
import { ApolloProvider } from '@apollo/client';
import { client } from './lib/apollo-client';

function App() {
  return (
    <ApolloProvider client={client}>
      {/* Your app components */}
    </ApolloProvider>
  );
}
```

## 🎣 **Custom Hooks**

The app uses custom hooks to separate data fetching logic from UI components.

### Patient Data Hooks
```typescript
// Fetch all patients
const { loading, error, patients } = useApiPatientList();

// Fetch single patient
const { loading, error, patient } = useApiPatient(id);
```

### Benefits
- **Separation of Concerns**: Data logic separated from UI
- **Reusability**: Hooks can be used across multiple components
- **Testability**: Easier to test data logic independently
- **Type Safety**: Shared types across components

## 🛣️ **Routing**

The app uses **React Router v7.6.2** in **Declarative Mode** with Browser Router for clean URLs.

### Routing Mode: Declarative Mode
- Uses `<Routes>` and `<Route>` components
- Routes are defined as JSX elements
- Traditional React Router approach

### Current Routes
```tsx
<Router>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<PatientList />} />
      <Route path="patients" element={<PatientList />} />
      {/* Future routes */}
      {/* <Route path="patients/:id" element={<PatientDetails />} /> */}
      {/* <Route path="patients/new" element={<PatientForm />} /> */}
      {/* <Route path="patients/:id/edit" element={<PatientForm />} /> */}
    </Route>
  </Routes>
</Router>
```

### Layout Route Pattern
The app uses a **Layout Route** pattern where:
- `<Layout />` is the parent route that provides the common UI structure
- `<Outlet />` renders the child routes in the main content area
- All routes inherit the header navigation and layout styling
- Clean separation between layout and page content

## 🛣️ **Styling**

Built with Tailwind CSS for rapid UI development:

```tsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <h3 className="text-lg font-semibold text-gray-900">
    Patient Name
  </h3>
</div>
```

## 🐳 **Docker**

The frontend app includes Docker support using **Bun** runtime for faster builds and **Alpine Linux** with Express for a lightweight production server.

### Production Build
```bash
# Build production image
npm run docker:build

# Run production container
npm run docker:run

# Or use docker-compose
npm run docker:compose:up
```

### Development Build
```bash
# Build development image
npm run docker:build:dev

# Run development container with hot reload
npm run docker:run:dev
```

### Docker Features
- **Bun Runtime**: Faster dependency installation and builds
- **Alpine Linux**: Minimal base image (~5MB)
- **Express Server**: Lightweight Node.js server for SPA routing
- **Multi-stage Build**: Optimized production image
- **SPA Routing**: Proper handling of React Router routes
- **Development Mode**: Hot reloading with volume mounts

### Docker Files
- `Dockerfile` - Production build with Alpine + Express
- `Dockerfile.dev` - Development build with hot reloading
- `docker-compose.yml` - Multi-service orchestration
- `server.js` - Express server for SPA routing
- `.dockerignore` - Optimized build context

## 🚀 **Development**

1. **Start the backend** (NestJS GraphQL server)
   ```bash
   cd ../backend
   npm run start:dev
   ```

2. **Start the frontend**
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:5173`

## 📦 **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 **Configuration**

- **GraphQL Endpoint**: Configured in `src/lib/apollo-client.ts`
- **Tailwind CSS**: Configured in `tailwind.config.js`
- **TypeScript**: Configured in `tsconfig.json`
- **Vite**: Configured in `vite.config.ts`
