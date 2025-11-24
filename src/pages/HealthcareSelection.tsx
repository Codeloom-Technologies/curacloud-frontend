import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, User, Shield, LogIn, Loader2, Heart, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { connectedHospital, createSetHospital } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";

interface Hospital {
  id: number;
  name: string;
  xHospitalId: string;
}

interface UserInfo {
  reference: string;
  id: number;
  fullName: string;
  email: string;
}

interface HospitalResponse {
  id: number;
  healthcareProviderId: number;
  userId: number;
  status: string;
  healthcareProvider: Hospital;
  user: UserInfo;
}

interface Role {
  id: number;
  slug: string;
  name: string;
}

interface UserData {
  reference: string;
  email: string;
  fullName: string;
  title: string;
  status: string;
  isActive: boolean;
  roles: Role[];
}

export default function HealthcareSelection() {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAuth, clearAuth } = useAuthStore();
  const queryClient = useQueryClient();
  
  // Clear any cached data when component mounts
  useEffect(() => {
    // Clear specific queries to ensure fresh data
    queryClient.removeQueries({ queryKey: ["connected-hospitals"] });
  }, [queryClient]);

  // Fetch hospitals from API with proper configuration
  const {
    data: hospitalsResponse,
    isLoading: isHospitalsLoading,
    isError: isHospitalsError,
    error: hospitalsError,
    refetch: refetchHospitals,
  } = useQuery({
    queryKey: ["connected-hospitals"],
    queryFn: () => connectedHospital(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (react-query v4+)
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Use useMemo to prevent hospitals array recreation on every render
  const hospitals: Hospital[] = useMemo(() => {
    if (!hospitalsResponse) return [];
    
    return hospitalsResponse.map((item: HospitalResponse) => ({
      id: item.healthcareProvider.id,
      name: item.healthcareProvider.name,
      xHospitalId: item.healthcareProvider.xHospitalId
    }));
  }, [hospitalsResponse]);

  // Extract user data from the first hospital response
  const extractedUserData = useMemo(() => {
    if (hospitalsResponse && hospitalsResponse.length > 0) {
      const firstHospital = hospitalsResponse[0];
      if (firstHospital.user) {
        return {
          reference: firstHospital.user.reference,
          email: firstHospital.user.email,
          fullName: firstHospital.user.fullName,
          title: "Dr",
          status: "Active",
          isActive: true,
          roles: []
        };
      }
    }
    return null;
  }, [hospitalsResponse]);

  // Load user data from API response instead of localStorage
  useEffect(() => {
    if (extractedUserData) {
      setUserData(extractedUserData);
    } else {
      // Fallback to localStorage if API doesn't have user data
      const authUserData = localStorage.getItem('authUser');
      if (authUserData) {
        try {
          const parsedUserData = JSON.parse(authUserData);
          setUserData(parsedUserData);
        } catch (error) {
          toast({
            title: "Data Error",
            description: "Failed to load your user information",
            variant: "destructive",
          });
        }
      }
    }
  }, [extractedUserData, toast]);

  // Auto-select hospital when hospitals are loaded
  useEffect(() => {
    if (hospitals.length === 1 && !selectedHospital) {
      setSelectedHospital(hospitals[0]);
    }
  }, [hospitals, selectedHospital]);

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  const createSetHospitalMutation = useMutation({
    mutationFn: createSetHospital,
    onSuccess: (data) => {
      // Clear all cached queries before proceeding
      queryClient.clear();
      
      // Store hospital data in localStorage for API calls
      if (selectedHospital) {
        localStorage.setItem('hospital', JSON.stringify(selectedHospital));
      }
      
      setAuth(data.user, data.accessToken, null, data.hospitalToken);
      
      toast({
        title: "Welcome!",
        description: `Successfully logged into ${selectedHospital?.name}`,
        variant: "success",
      });
      
      // Navigate and force a hard reload to ensure clean state
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
        // Force reload to ensure all components get fresh data
        // window.location.reload();
      }, 100);
    },
    onError: (error: any) => {
      console.error('Hospital selection error:', error);
      toast({
        title: "Connection Failed",
        description: error?.message || "Unable to connect to healthcare facility",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    // Clear all cached data
    queryClient.clear();
    // Clear localStorage
    localStorage.removeItem('authUser');
    localStorage.removeItem('hospital');
    localStorage.removeItem('authToken');
    localStorage.removeItem('hospitalToken');
    
    // Clear auth store
    clearAuth();
    
    // Navigate to login
    navigate("/auth/login", { replace: true });
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
      variant: "default",
    });
  };

  const handleContinue = () => {
    if (!selectedHospital) {
      toast({
        title: "Select Healthcare Facility",
        description: "Please select a healthcare facility to continue",
        variant: "destructive",
      });
      return;
    }

    const payload: any = {
      hospitalId: selectedHospital.id
    };

    createSetHospitalMutation.mutate(payload);
  };

  const handleRefresh = () => {
    // Clear cache and refetch
    queryClient.removeQueries({ queryKey: ["connected-hospitals"] });
    refetchHospitals();
  };

  const getRoleBadgeColor = (roleSlug: string) => {
    const colors: { [key: string]: string } = {
      health_care: "bg-blue-100 text-blue-800 border-blue-200",
      doctor: "bg-green-100 text-green-800 border-green-200",
      nurse: "bg-purple-100 text-purple-800 border-purple-200",
      inventory_manager: "bg-orange-100 text-orange-800 border-orange-200",
      admin: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[roleSlug] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading state
  if (isHospitalsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-800">Loading your healthcare facilities...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isHospitalsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Unable to Load Facilities</h2>
          <p className="text-blue-700 mb-4">
            {hospitalsError?.message || "Failed to load healthcare facilities"}
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No user data
  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <User className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-blue-900 mb-2">User Data Missing</h2>
          <p className="text-blue-700 mb-4">Please login again to continue.</p>
          <Button 
            onClick={handleLogout}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-blue-900">Curacloud</h1>
              <p className="text-lg text-blue-700 opacity-90">Hospital Management System</p>
            </div>
          </div>
          <p className="text-lg text-blue-800 max-w-2xl mx-auto">
            Select your healthcare facility to access the medical management system
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Info Sidebar */}
          <Card className="lg:col-span-1 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-lg font-semibold">
                    {getInitials(userData.fullName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="flex items-center justify-center gap-2 text-blue-900">
                <User className="h-5 w-5 text-blue-600" />
                {userData.fullName}
              </CardTitle>
              <CardDescription className="text-blue-700">{userData.email}</CardDescription>
              
              {userData.roles && userData.roles.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                  {userData.roles.map((role) => (
                    <Badge 
                      key={role.id} 
                      variant="outline" 
                      className={getRoleBadgeColor(role.slug)}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {role.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4 pt-4 border-t border-blue-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700">Status</span>
                <Badge variant={userData.status === "Active" ? "default" : "secondary"} className="bg-blue-100 text-blue-800 border-blue-200">
                  {userData.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700">User ID</span>
                <span className="font-mono text-xs text-blue-600">{userData.reference.slice(0, 8)}...</span>
              </div>
              
              {/* Logout Button */}
              <div className="pt-4 border-t border-blue-100">
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  size="sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Healthcare Selection */}
          <Card className="lg:col-span-2 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-2xl text-blue-900">
                  <Building2 className="h-6 w-6 text-blue-600" />
                  Available Healthcare Facilities
                </CardTitle>
                <Button 
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Refresh
                </Button>
              </div>
              <CardDescription className="text-blue-700">
                Choose where you'll be working today. Your access and permissions may vary by facility.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {hospitals.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">No Facilities Available</h3>
                  <p className="text-blue-600">
                    You don't have access to any healthcare facilities. Please contact your administrator.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {hospitals.map((hospital) => (
                    <div
                      key={hospital.id}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                        selectedHospital?.id === hospital.id
                          ? "border-blue-500 bg-blue-50/80 shadow-sm"
                          : "border-blue-200 bg-white hover:border-blue-300"
                      }`}
                      onClick={() => handleHospitalSelect(hospital)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${
                            selectedHospital?.id === hospital.id
                              ? "bg-blue-100 text-blue-600"
                              : "bg-blue-50 text-blue-500"
                          }`}>
                            <Building2 className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2 text-blue-900">
                              {hospital.name}
                              {selectedHospital?.id === hospital.id && (
                                <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">
                                  Selected
                                </Badge>
                              )}
                            </h3>
                            <p className="text-sm text-blue-600 font-mono">
                              ID: {hospital.xHospitalId}
                            </p>
                          </div>
                        </div>
                        
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedHospital?.id === hospital.id
                            ? "bg-blue-500 border-blue-500"
                            : "border-blue-300"
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4 border-t border-blue-100">
                <Button
                  onClick={handleContinue}
                  disabled={!selectedHospital || createSetHospitalMutation.isPending}
                  className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  {createSetHospitalMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Connecting to {selectedHospital?.name}...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      Continue to {selectedHospital?.name || "Dashboard"}
                    </>
                  )}
                </Button>
                
                {selectedHospital && (
                  <p className="text-center text-sm text-blue-700 mt-3">
                    You'll be accessing the medical system at <strong className="text-blue-800">{selectedHospital.name}</strong>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-blue-700">
          <p>Secure Healthcare Management System • v1.0.0</p>
          <p className="mt-1">All activities are logged for security and compliance purposes</p>
        </div>
      </div>
    </div>
  );
}