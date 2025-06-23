import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { client } from './lib/apollo-client';
import Layout from './components/Layout';
import PatientList from './components/PatientList';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/">
              <Route path="patients">
                <Route index element={<PatientList />} />
                <Route path=":id" element={<PatientList />} />
              </Route>
            </Route>
            {/* Add more routes here as we build them */}
            {/* <Route path="patients/:id" element={<PatientDetails />} /> */}
            {/* <Route path="patients/new" element={<PatientForm />} /> */}
            {/* <Route path="patients/:id/edit" element={<PatientForm />} /> */}
          </Route>
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
