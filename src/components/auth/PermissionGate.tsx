import { ReactNode } from 'react';
import { useAuth } from '../../lib/auth/authContext';

type PermissionGateProps = {
  children: ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallback?: ReactNode;
};

/**
 * A component that conditionally renders based on user roles or permissions
 * 
 * @example
 * // Only show for admins
 * <PermissionGate requiredRoles={['admin']}>
 *   <AdminPanel />
 * </PermissionGate>
 * 
 * @example
 * // Show different content based on role
 * <PermissionGate 
 *   requiredPermissions={['manage:users']} 
 *   fallback={<p>You don't have permission to manage users</p>}
 * >
 *   <UserManagement />
 * </PermissionGate>
 */
export const PermissionGate = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallback = null,
}: PermissionGateProps) => {
  const { isAuthenticated, hasRole, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Check roles if specified
  if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role))) {
    return <>{fallback}</>;
  }

  // Check permissions if specified
  if (requiredPermissions.length > 0 && !requiredPermissions.some(permission => hasPermission(permission))) {
    return <>{fallback}</>;
  }

  // If the user has the required roles/permissions, render the children
  return <>{children}</>;
}; 