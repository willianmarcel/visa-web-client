import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth/authContext';

export const metadata: Metadata = {
  title: 'Visa Platform',
  description: 'Visa Platform Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
