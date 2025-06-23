import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { client } from './lib/apollo-client';
import Layout from './components/Layout';
import PatientList from './components/PatientList';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<PatientList />} />
            <Route path="/patients" element={<PatientList />} />
            {/* Add more routes here as we build them */}
            {/* <Route path="/patients/:id" element={<PatientDetails />} /> */}
            {/* <Route path="/patients/new" element={<PatientForm />} /> */}
            {/* <Route path="/patients/:id/edit" element={<PatientForm />} /> */}
          </Routes>
        </Layout>
      </Router>
    </ApolloProvider>
  );
}

export default App;
