import { useState, useEffect } from 'react';

export const useUserRole = () => {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const userStr = localStorage.getItem('authUser');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);
  
  // Simple role checks
  const isNurse = user?.roles?.some((r: any) => r.slug === 'nurse');
  const isDoctor = user?.roles?.some((r: any) => r.slug === 'doctor');
  const isPharmacist = user?.roles?.some((r: any) => r.slug === 'pharmacist');
  const isAdmin = user?.roles?.some((r: any) => r.slug === 'admin');
const isHealthcare = user?.roles?.some((r: any) => r.slug === 'health_care');
const isLabTechnician = user?.roles?.some((r: any) => r.slug === 'lab_echnician');
const isReceptionist = user?.roles?.some((r: any) => r.slug === 'receptionist');
const isCashier = user?.roles?.some((r: any) => r.slug === 'cashier');
// const isCashier = user?.roles?.some((r: any) => r.slug === 'cashier');

  return {
    user,
    isNurse,
    isDoctor,
    isPharmacist,
      isAdmin,
    isHealthcare, isCashier,isLabTechnician,isReceptionist,
    isAuthenticated: !!user,
  };
};