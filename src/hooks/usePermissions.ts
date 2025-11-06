import { useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { rolePermissions, Permission, navigationPermissions } from "@/config/acl";
import { RoleSlug } from "@/types/auth";

export const usePermissions = () => {
  const { user } = useAuthStore();

  const userPermissions = useMemo(() => {
    if (!user || !user.roles || user.roles.length === 0) {
      return new Set<Permission>();
    }

    // Collect all permissions from all user roles
    const allPermissions = user.roles.reduce((acc, role) => {
      const roleSlug = role.slug as RoleSlug;
      const permissions = rolePermissions[roleSlug] || [];
      return [...acc, ...permissions];
    }, [] as Permission[]);

    return new Set(allPermissions);
  }, [user]);

  const hasPermission = (permission: Permission): boolean => {
    return userPermissions.has(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => userPermissions.has(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => userPermissions.has(permission));
  };

  const canAccessRoute = (route: string): boolean => {
    const permission = navigationPermissions[route];
    if (!permission) return true; // If no permission is defined, allow access
    return hasPermission(permission);
  };

  return {
    permissions: userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
  };
};
