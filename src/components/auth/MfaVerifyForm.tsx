"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const MfaVerifyForm = () => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Limit to 6 digits
    if (/^\d{0,6}$/.test(value)) {
      setCode(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // This would call the MFA verification API endpoint
      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'MFA verification failed');
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Two-Factor Authentication</h2>
      
      <p className="text-gray-600 mb-6 text-center">
        Please enter the 6-digit code from your authenticator app
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Authentication Code
          </label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest"
            value={code}
            onChange={handleChange}
            placeholder="123456"
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          Lost your authenticator device?{' '}
          <a href="#" className="text-blue-600 hover:text-blue-800">
            Use a recovery code
          </a>
        </p>
      </div>
    </div>
  );
}; 