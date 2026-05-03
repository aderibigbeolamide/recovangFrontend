import React from "react";
import { useAuth } from "@/store/auth";

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ 
  permission, 
  permissions, 
  requireAll = false, 
  children, 
  fallback = null 
}: PermissionGuardProps) {
  const { user } = useAuth();

  // Super Admin bypasses everything
  if (user?.role?.toUpperCase() === "SUPER_ADMIN") return <>{children}</>;

  const userPermissions = user?.permissions || [];
  const checkPermissions = permissions || (permission ? [permission] : []);

  if (checkPermissions.length === 0) return <>{children}</>;

  const hasPermission = requireAll
    ? checkPermissions.every(p => userPermissions.includes(p))
    : checkPermissions.some(p => userPermissions.includes(p));

  if (!hasPermission) return <>{fallback}</>;

  return <>{children}</>;
}
