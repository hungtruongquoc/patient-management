import { ApolloProvider } from '@apollo/client';
import { client } from './lib/apollo-client';
import PatientList from './components/PatientList';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Patient Management System
          </h1>
          <PatientList />
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
