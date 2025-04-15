"use client";

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './authContext';

type ProtectedRouteProps = {
  children: ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
};

export const ProtectedRoute = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user, hasRole, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while we're loading
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Check if user has the required roles (if specified)
    if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role))) {
      router.push('/unauthorized');
      return;
    }

    // Check if user has the required permissions (if specified)
    if (requiredPermissions.length > 0 && !requiredPermissions.some(permission => hasPermission(permission))) {
      router.push('/unauthorized');
      return;
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, requiredPermissions, router, hasRole, hasPermission]);

  // Show nothing while loading
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // If not authenticated or doesn't have required roles/permissions, show nothing (redirect is handled by useEffect)
  if (!isAuthenticated || 
      (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role))) ||
      (requiredPermissions.length > 0 && !requiredPermissions.some(permission => hasPermission(permission)))) {
    return null;
  }

  // Otherwise, render the children
  return <>{children}</>;
};

// HOC version of the protected route
export const withProtectedRoute = (
  Component: React.ComponentType<any>,
  { requiredRoles = [], requiredPermissions = [] }: { requiredRoles?: string[]; requiredPermissions?: string[] } = {}
) => {
  const WithProtectedRoute = (props: any) => (
    <ProtectedRoute requiredRoles={requiredRoles} requiredPermissions={requiredPermissions}>
      <Component {...props} />
    </ProtectedRoute>
  );

  return WithProtectedRoute;
}; 