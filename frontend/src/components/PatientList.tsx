import { Plus, Users } from 'lucide-react';
import { useApiPatientList } from '@/hooks/useApiPatientList';
import PatientCard from '@/components/PatientCard';
import { Link } from 'react-router-dom';

interface AddNewButtonProps {
  className?: string;
}

function PatientList() {
  const { loading, error, patients } = useApiPatientList();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-3 text-gray-600">Loading patients...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error loading patients</h3>
        <p className="text-red-600 mt-1">{error.message}</p>
      </div>
    );
  }

  const AddNewButton = function ({ className }: AddNewButtonProps) {
    return (
      <Link
        to="/patients/new"
        className={`flex items-center px-3 py-2 rounded-md text-sm
          font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors ${className}`}
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Patient
      </Link>
    );
  };

  return (
    <>
      <div className="flex items-center mb-6">
        <Users className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">
          Patients ({patients.length})
        </h2>
        <AddNewButton className="ml-auto" />
      </div>

      {patients.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No patients found
          </h3>
          <p className="text-gray-600">Start by adding your first patient.</p>
          <AddNewButton />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {patients.map(patient => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </>
  );
}

export default PatientList;
