import { Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Patient } from '@/hooks/useApiPatientList';

interface PatientCardProps {
  patient: Patient;
}

function PatientCard({ patient }: PatientCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {patient.firstName} {patient.lastName}
          </h3>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2 text-gray-400" />
          {patient.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          {patient.phone}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          to={`/patients/${patient.id}`}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default PatientCard;
