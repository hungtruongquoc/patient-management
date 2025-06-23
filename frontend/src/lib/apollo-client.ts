import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// HTTP link for GraphQL endpoint
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

// Auth link to add JWT token to headers
const authLink = setContext((_, { headers }) => {
  // Get token from sessionStorage
  const token = sessionStorage.getItem('demoToken');

  return {
    headers: {
      ...headers,
      // Add Authorization header if token exists
      ...(token && { authorization: `Bearer ${token}` }),
    },
  };
});

// Combine auth link with HTTP link
const link = from([authLink, httpLink]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  // Enable error handling for authentication errors
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
