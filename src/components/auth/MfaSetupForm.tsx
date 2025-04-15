"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export const MfaSetupForm = () => {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1 = setup, 2 = backup codes

  useEffect(() => {
    // Get MFA setup data when component mounts
    const fetchMfaSetup = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/mfa-setup', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to initialize MFA setup');
        }

        setQrCodeUrl(data.qrCode);
        setSecretKey(data.secret);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMfaSetup();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Limit to 6 digits
    if (/^\d{0,6}$/.test(value)) {
      setVerificationCode(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Verify and enable MFA
      const response = await fetch('/api/auth/verify-mfa-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: verificationCode,
          secret: secretKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify MFA code');
      }

      // Set backup codes and proceed to next step
      setBackupCodes(data.backupCodes);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const finishSetup = () => {
    // Redirect to profile or settings page after setup is complete
    router.push('/profile');
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
  };

  // Step 1: Set up MFA with QR code
  if (step === 1) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Set Up Two-Factor Authentication</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Scan this QR code with your authenticator app (like Google Authenticator or Authy) to set up 2FA for your account.
          </p>
          
          <div className="flex flex-col items-center mb-4">
            {qrCodeUrl ? (
              <div className="border border-gray-300 p-2 rounded-md mb-2">
                <Image src={qrCodeUrl} alt="QR Code for MFA" width={200} height={200} />
              </div>
            ) : (
              <div className="animate-pulse bg-gray-200 w-[200px] h-[200px]"></div>
            )}
            
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Or enter this code manually:</p>
              <div className="font-mono text-center bg-gray-100 p-2 rounded select-all">
                {secretKey || 'Loading...'}
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                inputMode="numeric"
                required
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest"
                value={verificationCode}
                onChange={handleChange}
                placeholder="123456"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the 6-digit code from your authenticator app to verify setup
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify and Continue'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 2: Show backup codes
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Save Your Backup Codes</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Keep these backup codes in a safe place. If you lose your authenticator device, you can use these codes to access your account.
        </p>
        
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((code, index) => (
              <div key={index} className="font-mono text-sm p-1">
                {code}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={copyBackupCodes}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Copy Codes
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Print Codes
          </button>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Important:</strong> Each backup code can only be used once. Once you've used all your backup codes, you'll need to generate new ones.
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={finishSetup}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          I've Saved My Backup Codes
        </button>
      </div>
    </div>
  );
}; 