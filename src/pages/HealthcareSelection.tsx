import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, User, Shield, LogIn, Loader2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Hospital {
  id: number;
  name: string;
  xHospitalId: string;
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
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get login data from localStorage
    const hospitalsData = localStorage.getItem('hospitals');
    const authUserData = localStorage.getItem('authUser');

    console.log('Hospitals from localStorage:', hospitalsData);
    console.log('User data from localStorage:', authUserData);

    if (hospitalsData && authUserData) {
      try {
        const parsedHospitals = JSON.parse(hospitalsData);
        const parsedUserData = JSON.parse(authUserData);

        console.log('Parsed hospitals:', parsedHospitals);
        console.log('Parsed user data:', parsedUserData);

        setUserData(parsedUserData);
        setHospitals(parsedHospitals);
        
        // Auto-select if only one hospital
        if (parsedHospitals?.length === 1) {
          setSelectedHospital(parsedHospitals[0]);
        }
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
        toast({
          title: "Data Error",
          description: "Failed to load your healthcare facilities",
          variant: "destructive",
        });
      }
    } else {
      console.error('Missing data in localStorage');
      toast({
        title: "Missing Data",
        description: "Unable to find your healthcare facilities. Please login again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  const handleContinue = async () => {
    if (!selectedHospital) {
      toast({
        title: "Select Healthcare Facility",
        description: "Please select a healthcare facility to continue",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get the initial access token from wherever it's stored
      const initialLoginData = localStorage.getItem('initialLoginData');
      const accessToken = initialLoginData 
        ? JSON.parse(initialLoginData).data.accessToken.value
        : localStorage.getItem('authToken');

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/set-hospital`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          hospitalId: selectedHospital.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store new token and navigate to dashboard
        localStorage.setItem('authToken', data.data.accessToken.value);
        localStorage.setItem('userData', JSON.stringify(data.data.user));
        localStorage.setItem('selectedHospital', JSON.stringify(selectedHospital));
        
        // Clean up temporary storage
        localStorage.removeItem('initialLoginData');
        localStorage.removeItem('hospitals');
        localStorage.removeItem('authUser');
        
        toast({
          title: "Welcome!",
          description: `Successfully logged into ${selectedHospital.name}`,
          variant: "success",
        });

        navigate("/dashboard");
      } else {
        throw new Error(data.message || "Failed to set hospital");
      }
    } catch (error) {
      console.error('Hospital selection error:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Unable to connect to healthcare facility",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (roleSlug: string) => {
    const colors: { [key: string]: string } = {
      health_care: "bg-blue-100 text-blue-800 border-blue-200",
      doctor: "bg-blue-100 text-blue-800 border-blue-200",
      nurse: "bg-blue-100 text-blue-800 border-blue-200",
      inventory_manager: "bg-blue-100 text-blue-800 border-blue-200",
      admin: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return colors[roleSlug] || "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!userData || hospitals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-800">Loading your healthcare facilities...</p>
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
            </CardContent>
          </Card>

          {/* Healthcare Selection */}
          <Card className="lg:col-span-2 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-blue-900">
                <Building2 className="h-6 w-6 text-blue-600" />
                Available Healthcare Facilities
              </CardTitle>
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
                  disabled={!selectedHospital || isLoading}
                  className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  {isLoading ? (
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