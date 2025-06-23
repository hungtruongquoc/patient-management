import { useDemoToken } from '@/contexts/TokenContext';
import { useApiPatientList } from '@/hooks/useApiPatientList';

/**
 * Example component showing how to use the token system
 */
function TokenUsageExamples() {
  const {
    token,
    loading,
    error,
    fetchToken,
    clearToken,
    isAuthenticated,
    hasToken,
    refreshToken,
  } = useDemoToken();

  const {
    patients,
    loading: patientsLoading,
    error: patientsError,
    isAuthenticated: patientsAuth,
  } = useApiPatientList();

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Token Usage Examples</h2>

      {/* Token Status */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Token Status</h3>
        <div className="space-y-2 text-sm">
          <p>Has Token: {hasToken ? '✅' : '❌'}</p>
          <p>Is Authenticated: {isAuthenticated ? '✅' : '❌'}</p>
          <p>Loading: {loading ? '⏳' : '✅'}</p>
          <p>Error: {error ? '❌ ' + error.message : '✅'}</p>
          {token && (
            <p className="font-mono bg-gray-100 p-2 rounded">
              Token: {token.substring(0, 50)}...
            </p>
          )}
        </div>
      </div>

      {/* Token Actions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Token Actions</h3>
        <div className="space-x-2">
          <button
            onClick={fetchToken}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Fetching...' : 'Fetch Token'}
          </button>
          <button
            onClick={refreshToken}
            disabled={loading}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Refresh Token
          </button>
          <button
            onClick={clearToken}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear Token
          </button>
        </div>
      </div>

      {/* API Usage Example */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">API Usage with Authentication</h3>
        <div className="space-y-2 text-sm">
          <p>Patients Auth Status: {patientsAuth ? '✅' : '❌'}</p>
          <p>Patients Loading: {patientsLoading ? '⏳' : '✅'}</p>
          <p>Patients Error: {patientsError ? '❌ ' + patientsError.message : '✅'}</p>
          <p>Patients Count: {patients.length}</p>
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Code Examples</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Basic Token Usage:</h4>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`import { useDemoToken } from '@/contexts/TokenContext';

function MyComponent() {
  const { token, loading, fetchToken, isAuthenticated } = useDemoToken();
  
  if (!isAuthenticated) {
    return <button onClick={fetchToken}>Get Token</button>;
  }
  
  return <div>Authenticated with token: {token}</div>;
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium">API Hook with Authentication:</h4>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`import { useApiPatientList } from '@/hooks/useApiPatientList';

function PatientComponent() {
  const { 
    patients, 
    loading, 
    error, 
    isAuthenticated, 
    fetchToken 
  } = useApiPatientList();
  
  if (!isAuthenticated) {
    return <button onClick={fetchToken}>Authenticate</button>;
  }
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {patients.map(patient => (
        <div key={patient.id}>{patient.firstName}</div>
      ))}
    </div>
  );
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenUsageExamples;
