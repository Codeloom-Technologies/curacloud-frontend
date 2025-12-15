// Simple user type matching your localStorage data
export interface SimpleUser {
  reference: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: Array<{
    id: number;
    slug: string;
    name: string;
  }>;
  status: string;
  title?: string;
}

// Get user from localStorage
export const getCurrentUser = (): SimpleUser | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('authUser');
    if (!userStr) return null;
    
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Check if user has a specific role
export const hasRole = (roleSlug: string): boolean => {
  const user = getCurrentUser();
  if (!user?.roles) return false;
  
  return user.roles.some(role => role.slug === roleSlug);
};

// Check if user has any of the roles
export const hasAnyRole = (roleSlugs: string[]): boolean => {
  const user = getCurrentUser();
  if (!user?.roles) return false;
  
  return user.roles.some(role => roleSlugs.includes(role.slug));
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Get user's display name
export const getUserName = (): string => {
  const user = getCurrentUser();
  return user?.fullName || 'Guest';
};