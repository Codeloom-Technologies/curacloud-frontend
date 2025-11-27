import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Save, 
  User, 
  Briefcase, 
  Phone, 
  MapPin, 
  Heart,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DOCTOR_SPECIALIZATIONS,
  EMPLOYMENT_TYPES,
  GENDERS,
  TITLES,
} from "@/constants";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchDepartments,
  fetchRoles,
  fetchStaffById,
  updateStaff,
} from "@/services/staff";
import {
  Country,
  fetchCities,
  fetchCountries,
  fetchStates,
} from "@/services/onboarding";
import { Role } from "@/types/auth";
import { CreateStaffRequest, DoctorSpecialization } from "@/types";
import PatientUpdateSkeleton from "@/components/dashboard/PatientUpdateSkeleton";

// Form steps configuration
const FORM_STEPS = [
  { id: "personal", title: "Personal Info", icon: User },
  { id: "professional", title: "Professional Details", icon: Briefcase },
  { id: "contact", title: "Contact Information", icon: Phone },
  { id: "emergency", title: "Emergency Contact", icon: Heart },
];

const UpdateStaff = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const { staffId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    roleId: "",
    departmentId: "",
    specialization: "",
    licenseNumber: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    cityId: "",
    stateId: "",
    countryId: "",
    emergencyContact: "",
    emergencyPhone: "",
    joinDate: "",
    employmentType: "",
  });

  /* ============================
   * STEP NAVIGATION
  ================================
   */
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const goToStep = (step: number) => {
    if (step <= Math.max(...Array.from(completedSteps)) + 1) {
      setCurrentStep(step);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Personal Info
        return !!(formData.title && formData.firstName && formData.lastName && 
                 formData.email && formData.phoneNumber && formData.dateOfBirth && 
                 formData.gender);
      case 1: // Professional Details
        return !!(formData.roleId && formData.departmentId && formData.joinDate && 
                 formData.employmentType);
      case 2: // Contact Information
        return !!(formData.countryId && formData.stateId && formData.address);
      case 3: // Emergency Contact
        return !!(formData.emergencyContact && formData.emergencyPhone);
      default:
        return true;
    }
  };

  // Fetch staff data
  const {
    data: staffData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["staff", staffId],
    queryFn: () => fetchStaffById(staffId!),
    enabled: !!staffId,
  });

  // Update form data when staff data loads
  useEffect(() => {
    if (staffData) {
      const user = staffData.user || {};
      const address = staffData.address || {};

      const updatedFormData = {
        title: staffData.title || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        roleId: staffData.roleId?.toString() || "",
        departmentId: staffData.departmentId?.toString() || "",
        specialization: staffData.specialization || "",
        licenseNumber: staffData.licenseNumber || "",
        dateOfBirth: staffData.dateOfBirth
          ? new Date(staffData.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: staffData.gender || "",
        address: address.street || "",
        cityId: staffData.cityId?.toString() || "",
        stateId: staffData.stateId?.toString() || "",
        countryId: staffData.countryId?.toString() || "",
        emergencyContact: staffData.emergencyContactName || "",
        emergencyPhone: staffData.emergencyPhoneNumber || "",
        joinDate: staffData.joinDate
          ? new Date(staffData.joinDate).toISOString().split("T")[0]
          : "",
        employmentType: staffData.employmentType || "",
      };

      setFormData(updatedFormData);

      // Set selected country for dropdown
      if (staffData.countryId && countries.length > 0) {
        const country = countries.find(
          (c: Country) => c.id === staffData.countryId
        );
        setSelectedCountry(country || null);
      }
    }
  }, [staffData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Fetch countries
  const { data: countries = [], isLoading: loadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  // Fetch states when country changes
  const { data: states = [], isLoading: loadingState } = useQuery({
    queryKey: ["states", selectedCountry?.id],
    queryFn: () => fetchStates(selectedCountry!.id),
    enabled: !!selectedCountry,
  });

  // Fetch cities when state changes
  const { data: cities = [], isLoading: loadingCities } = useQuery({
    queryKey: ["cities", formData.stateId],
    queryFn: () => fetchCities(Number(formData.stateId)),
    enabled: !!formData.stateId,
  });

  // Fetch roles
  const { data: rolesData = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  // Fetch departments
  const { data: departmentsData = [], isLoading: isLoadingDepartments } =
    useQuery({
      queryKey: ["departments"],
      queryFn: fetchDepartments,
    });

  // Update local state when query data changes
  useEffect(() => {
    if (rolesData) {
      setRoles(rolesData);
    }
  }, [rolesData]);

  useEffect(() => {
    if (departmentsData) {
      setDepartments(departmentsData);
    }
  }, [departmentsData]);

  const handleCountryChange = (value: string) => {
    const countryId = value;
    const country = countries.find((c: Country) => c.id === Number(countryId));
    setSelectedCountry(country || null);
    handleInputChange("countryId", countryId);
    handleInputChange("stateId", "");
    handleInputChange("cityId", "");
  };

  const handleStateChange = (value: string) => {
    handleInputChange("stateId", value);
    handleInputChange("cityId", "");
  };

  const mutation = useMutation({
    mutationFn: (payload: any) => updateStaff(staffId!, payload),
    onSuccess: () => {
      toast({
        title: "Staff Updated Successfully",
        description: "Staff member information has been updated",
        variant: "success",
      });
      navigate("/dashboard/staff");
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update staff",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    // Validate all required steps before submission
    const requiredStepsValid = [0, 1, 2, 3].every(step => validateStep(step));
    
    if (!requiredStepsValid) {
      toast({
        title: "Incomplete Information",
        description: "Please complete all required fields before submitting",
        variant: "destructive",
      });
      return;
    }

    const payload: CreateStaffRequest = {
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      countryId: Number(formData.countryId),
      roleId: Number(formData.roleId),
      title: formData.title,
      stateId: Number(formData.stateId),
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      cityId: Number(formData.cityId) || undefined,
      departmentId: Number(formData.departmentId),
      emergencyContactName: formData.emergencyContact,
      employmentType: formData.employmentType,
      emergencyPhoneNumber: formData.emergencyPhone,
      licenseNumber: formData.licenseNumber,
      joinDate: formData.joinDate,
      specialization: formData.specialization as DoctorSpecialization,
      address: {
        street: formData.address,
      },
    };

    mutation.mutate(payload);
  };

  const progress = ((currentStep + 1) / FORM_STEPS.length) * 100;

  if (isLoading || isFetching) {
    return <PatientUpdateSkeleton />;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard/staff")}
                  className="hover:bg-accent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Staff Directory
                </Button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Update Staff
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Update staff information for {formData.firstName} {formData.lastName}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                Step {currentStep + 1} of {FORM_STEPS.length}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Update Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {FORM_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.has(index);
                const isCurrent = currentStep === index;
                const isAccessible = index <= Math.max(...Array.from(completedSteps)) + 1;
                
                return (
                  <button
                    type="button"
                    key={step.id}
                    onClick={() => goToStep(index)}
                    disabled={!isAccessible}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                      isCurrent
                        ? "border-primary bg-primary/5 shadow-sm"
                        : isCompleted
                        ? "border-green-200 bg-green-50 dark:bg-green-950/20"
                        : "border-border bg-card"
                    } ${isAccessible ? "hover:shadow-md cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? "bg-green-500 text-white" 
                        : isCurrent
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`text-sm font-medium ${
                        isCurrent ? "text-primary" : "text-foreground"
                      }`}>
                        {step.title}
                      </div>
                      <div className={`text-xs ${
                        isCompleted ? "text-green-600" : "text-muted-foreground"
                      }`}>
                        {isCompleted ? "Completed" : isCurrent ? "Current" : "Pending"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Form Content */}
            <div className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 0 && (
                <Card className="animate-in fade-in-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <User className="h-5 w-5 text-primary" />
                      Personal Information
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Basic personal and identification details
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="flex items-center gap-1">
                          Title <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          required
                          value={formData.title}
                          onValueChange={(value) => handleInputChange("title", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select title" />
                          </SelectTrigger>
                          <SelectContent>
                            {TITLES.map((title) => (
                              <SelectItem key={title} value={title}>
                                {title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="flex items-center gap-1">
                          First Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          required
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="flex items-center gap-1">
                          Last Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Smith"
                          required
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="flex items-center gap-1">
                          Gender <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          required
                          value={formData.gender}
                          onValueChange={(value) => handleInputChange("gender", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {GENDERS.map((gender) => (
                              <SelectItem key={gender} value={gender}>
                                {gender}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-1">
                          Email Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          readOnly
                          placeholder="john.smith@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="flex items-center gap-1">
                          Phone Number <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex gap-2">
                          {selectedCountry && (
                            <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted min-w-[120px]">
                              <img
                                src={selectedCountry.flag.svg}
                                alt={selectedCountry.name}
                                className="w-5 h-4 object-cover rounded"
                              />
                              <span className="text-sm font-medium">
                                {selectedCountry.phoneCode}
                              </span>
                            </div>
                          )}
                          <Input
                            readOnly
                            id="phoneNumber"
                            placeholder="8012345678"
                            required
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="flex items-center gap-1">
                          Date of Birth <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          required
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <div className="font-medium text-blue-800 dark:text-blue-300">
                            Contact Information
                          </div>
                          <div className="text-blue-700 dark:text-blue-400 mt-1">
                            Phone and email are read-only for security purposes. Contact support to modify these details.
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Professional Information */}
              {currentStep === 1 && (
                <Card className="animate-in fade-in-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Professional Information
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Employment and role-specific details
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role" className="flex items-center gap-1">
                          Position <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          required
                          value={formData.roleId}
                          onValueChange={(value) => handleInputChange("roleId", value)}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isLoadingRoles ? "Loading positions..." : "Select position"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id.toString()}>
                                {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department" className="flex items-center gap-1">
                          Department <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          required
                          value={formData.departmentId}
                          onValueChange={(value) => handleInputChange("departmentId", value)}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isLoadingDepartments ? "Loading departments..." : "Select department"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((department: any) => (
                              <SelectItem
                                key={department.id}
                                value={department.id.toString()}
                              >
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Select
                          value={formData.specialization}
                          onValueChange={(value) => handleInputChange("specialization", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialization" />
                          </SelectTrigger>
                          <SelectContent>
                            {DOCTOR_SPECIALIZATIONS.map((specialization) => (
                              <SelectItem key={specialization} value={specialization}>
                                {specialization}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">License Number</Label>
                        <Input
                          id="licenseNumber"
                          placeholder="MED123456"
                          value={formData.licenseNumber}
                          onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="joinDate" className="flex items-center gap-1">
                          Join Date <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="joinDate"
                          type="date"
                          required
                          value={formData.joinDate}
                          onChange={(e) => handleInputChange("joinDate", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="employmentType" className="flex items-center gap-1">
                          Employment Type <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          required
                          value={formData.employmentType}
                          onValueChange={(value) => handleInputChange("employmentType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {EMPLOYMENT_TYPES.map((employmentType) => (
                              <SelectItem key={employmentType} value={employmentType}>
                                {employmentType}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 2 && (
                <Card className="animate-in fade-in-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <MapPin className="h-5 w-5 text-primary" />
                      Contact Information
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Residential address and location details
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country" className="flex items-center gap-1">
                          Country <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.countryId}
                          onValueChange={handleCountryChange}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={loadingCountries ? "Loading countries..." : "Select country"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country: Country) => (
                              <SelectItem
                                key={country.id}
                                value={country.id.toString()}
                              >
                                <div className="flex items-center gap-2">
                                  <img
                                    src={country.flag.svg}
                                    alt={country.name}
                                    className="w-5 h-4 object-cover rounded"
                                  />
                                  <span>{country.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state" className="flex items-center gap-1">
                          State <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.stateId}
                          onValueChange={handleStateChange}
                          disabled={!selectedCountry}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={loadingState ? "Loading states..." : "Select state"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state: any) => (
                              <SelectItem
                                key={state.id}
                                value={state.id.toString()}
                              >
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-1">
                        Street Address <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="address"
                        placeholder="123 Main Street, Apartment 4B"
                        required
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="min-h-[80px] resize-vertical"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Select
                          value={formData.cityId}
                          onValueChange={(value) => handleInputChange("cityId", value)}
                          disabled={!formData.stateId}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={loadingCities ? "Loading cities..." : "Select city"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city: any) => (
                              <SelectItem key={city.id} value={city.id.toString()}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Emergency Contact */}
              {currentStep === 3 && (
                <Card className="animate-in fade-in-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Heart className="h-5 w-5 text-primary" />
                      Emergency Contact
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Contact person for emergency situations
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact" className="flex items-center gap-1">
                          Contact Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="emergencyContact"
                          placeholder="Jane Smith"
                          required
                          value={formData.emergencyContact}
                          onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone" className="flex items-center gap-1">
                          Contact Phone <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="emergencyPhone"
                          placeholder="+1 (555) 987-6543"
                          required
                          value={formData.emergencyPhone}
                          onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <div className="font-medium text-green-800 dark:text-green-300">
                            Ready to Update!
                          </div>
                          <div className="text-green-700 dark:text-green-400 mt-1">
                            Review all information before submitting. You can still make changes in previous steps if needed.
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4 pt-6 border-t">
                <div>
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="min-w-[100px]"
                    >
                      Previous
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard/staff")}
                  >
                    Cancel
                  </Button>
                  
                  {currentStep < FORM_STEPS.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="min-w-[100px] bg-primary hover:bg-primary/90"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      className="min-w-[140px] bg-gradient-primary hover:shadow-glow transition-all"
                      disabled={mutation.isPending}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {mutation.isPending ? "Updating..." : "Update Staff"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default UpdateStaff;