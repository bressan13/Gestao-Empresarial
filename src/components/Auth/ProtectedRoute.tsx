import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { Permission } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permissions?: Permission[];
}

export function ProtectedRoute({ children, permissions = [] }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasPermission = permissions.length === 0 || 
    permissions.some(permission => 
      permission.route === location.pathname && 
      permission.allowedRoles.includes(user?.cargo || 'colaborador')
    );

  if (!hasPermission) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <>{children}</>;
}