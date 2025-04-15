import { MfaSetupForm } from '@/components/auth';
import { ProtectedRoute } from '@/lib/auth/protectedRoute';

export default function MfaSetupPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <MfaSetupForm />
      </div>
    </ProtectedRoute>
  );
} 