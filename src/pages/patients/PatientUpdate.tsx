import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Save,
  User,
  MapPin,
  Phone,
  Heart,
  Droplet,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchCountries,
  fetchStates,
  Country,
  fetchCities,
} from "@/services/onboarding";
import { fetchPatientById, updatePatient } from "@/services/patient";
import PatientUpdateSkeleton from "@/components/dashboard/PatientUpdateSkeleton";
import {
  BLOOD_GROUPS,
  GENDERS,
  GENOTYPES,
  MARITAL_STATUSES,
  TITLES,
} from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Form steps configuration
const FORM_STEPS = [
  { id: "personal", title: "Personal Info", icon: User },
  { id: "contact", title: "Contact Details", icon: Phone },
  { id: "address", title: "Address", icon: MapPin },
  { id: "emergency", title: "Emergency Contact", icon: Heart },
];

export default function UpdatePatient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const { patientId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    nationalId: "",
    maritalStatus: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    countryId: "",
    stateId: "",
    cityId: "",
    postal: "",
    bloodGroup: "",
    genotype: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  /* ============================
   * FETCH COUNTRIES
  ================================
   */
  const {
    data: countries = [],
    isFetching: isFetchingCountries,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  // Fetch states when country changes
  const {
    data: states = [],
    isLoading: loadingState,
  } = useQuery({
    queryKey: ["states", selectedCountry?.id],
    queryFn: () => fetchStates(selectedCountry!.id),
    enabled: !!selectedCountry,
  });

  const { data: cities = [], isLoading: loadingCities } = useQuery({
    queryKey: ["cities", formData.stateId],
    queryFn: () => fetchCities(Number(formData.stateId)),
    enabled: !!formData.stateId,
  });

  // Fetch existing patient data
  const {
    data: patientData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => fetchPatientById(patientId!),
    enabled: !!patientId,
  });

  // Update form data when patient data loads
  useEffect(() => {
    if (patientData) {
      // Extract address parts safely
      const address = patientData.address || {};
      const addressStreet = address.street || "";
      const addressParts = addressStreet.split(",");

      const emergencyContact = patientData.emergencyContacts?.[0] || {};
      const user = patientData.user || {};

      const updatedFormData = {
        title: patientData.title || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        gender: patientData.gender || "",
        dateOfBirth: patientData.dateOfBirth || "",
        nationalId: patientData.nationalId || "",
        maritalStatus: patientData.maritalStatus || "",
        phone: user.phoneNumber || "",
        email: user.email || "",
        address1: addressParts[0] || "",
        address2: addressParts[1]?.trim() || "",
        city: address.city || "",
        state: patientData.user?.stateId?.toString() || "",
        countryId: patientData.user?.countryId?.toString() || "",
        stateId: patientData.user?.stateId?.toString() || "",
        cityId: patientData.user?.cityId?.toString() || "",
        postal: address.postalCode || "",
        bloodGroup: patientData.bloodGroup || "",
        genotype: patientData.genotype || "",
        emergencyName: emergencyContact.fullName || "",
        emergencyRelation: emergencyContact.relationship || "",
        emergencyPhone: emergencyContact.phoneNumber || "",
      };

      setFormData(updatedFormData);

      // Set selected country for dropdown
      if (patientData.user?.countryId && countries.length > 0) {
        const country = countries.find(
          (c: Country) => c.id === patientData.user.countryId
        );
        setSelectedCountry(country || null);
      }
    }
  }, [patientData, countries]);

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
                 formData.gender && formData.dateOfBirth && formData.maritalStatus &&
                 formData.bloodGroup && formData.genotype);
      case 1: // Contact Details
        return !!(formData.phone && formData.email);
      case 2: // Address
        return !!(formData.countryId && formData.stateId && formData.cityId && formData.address1);
      case 3: // Emergency Contact
        return !!(formData.emergencyName && formData.emergencyRelation && formData.emergencyPhone);
      default:
        return true;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountryChange = (value: string) => {
    const countryId = value;
    const country = countries.find((c: Country) => c.id === Number(countryId));
    setSelectedCountry(country || null);
    handleInputChange("countryId", countryId);
    handleInputChange("stateId", ""); // Reset state when country changes
  };

  const handleStateChange = (value: string) => {
    handleInputChange("stateId", value);
  };

  const mutation = useMutation({
    mutationFn: (payload: any) => updatePatient(patientId!, payload),
    onSuccess: () => {
      toast({
        title: "Patient Updated Successfully",
        description: "Patient information has been updated",
        variant: "success",
      });
      navigate("/dashboard/patients");
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update patient",
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

    const payload = {
      title: formData.title,
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      nationalId: formData.nationalId || undefined,
      maritalStatus: formData.maritalStatus,
      phoneNumber: formData.phone,
      email: formData.email,
      countryId: Number(formData.countryId),
      stateId: Number(formData.stateId),
      cityId: Number(formData.cityId),
      address: {
        street: [formData.address1, formData.address2]
          .filter(Boolean)
          .join(", "),
        city: formData.city,
        postalCode: formData.postal,
      },
      bloodGroup: formData.bloodGroup,
      genotype: formData.genotype,
      emergencyContact: {
        fullName: formData.emergencyName,
        phoneNumber: formData.emergencyPhone,
        relationship: formData.emergencyRelation,
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
                  onClick={() => navigate("/dashboard/patients")}
                  className="hover:bg-accent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Directory
                </Button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Update Patient
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Update patient information for {formData.firstName} {formData.lastName}
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
                      Basic demographic and identification details
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
                          value={formData.gender}
                          required
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dob" className="flex items-center gap-1">
                          Date of Birth <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="dob"
                          type="date"
                          required
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="nationalId">National ID / SSN</Label>
                        <Input
                          id="nationalId"
                          placeholder="123-45-6789"
                          value={formData.nationalId}
                          onChange={(e) => handleInputChange("nationalId", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maritalStatus" className="flex items-center gap-1">
                          Marital Status <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          required
                          value={formData.maritalStatus}
                          onValueChange={(value) => handleInputChange("maritalStatus", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {MARITAL_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bloodGroup" className="flex items-center gap-1">
                          Blood Group <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          required
                          value={formData.bloodGroup}
                          onValueChange={(value) => handleInputChange("bloodGroup", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                          <SelectContent>
                            {BLOOD_GROUPS.map((group) => (
                              <SelectItem key={group} value={group}>
                                {group}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="genotype" className="flex items-center gap-1">
                          Genotype <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          required
                          value={formData.genotype}
                          onValueChange={(value) => handleInputChange("genotype", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select genotype" />
                          </SelectTrigger>
                          <SelectContent>
                            {GENOTYPES.map((genotype) => (
                              <SelectItem key={genotype} value={genotype}>
                                {genotype}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 1 && (
                <Card className="animate-in fade-in-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Phone className="h-5 w-5 text-primary" />
                      Contact Information
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Primary contact details for communication
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-1">
                          Primary Phone <span className="text-destructive">*</span>
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
                            id="phone"
                            placeholder="8012345678"
                            required
                            readOnly
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      
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

              {/* Step 3: Address */}
              {currentStep === 2 && (
                <Card className="animate-in fade-in-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <MapPin className="h-5 w-5 text-primary" />
                      Address Information
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Current residential address details
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              placeholder={isFetchingCountries ? "Loading countries..." : "Select country"}
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
                      <Label htmlFor="address1" className="flex items-center gap-1">
                        Street Address <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="address1"
                        placeholder="123 Main Street, Apartment 4B"
                        required
                        value={formData.address1}
                        onChange={(e) => handleInputChange("address1", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="flex items-center gap-1">
                          City <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.cityId}
                          onValueChange={(value) => {
                            const city = cities.find((c) => c.id === Number(value));
                            setFormData((prev) => ({
                              ...prev,
                              cityId: value,
                              city: city?.name || "",
                            }));
                          }}
                          disabled={!formData.stateId}
                        >
                          <SelectTrigger id="city">
                            <SelectValue
                              placeholder={loadingCities ? "Loading cities..." : "Select city"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.id} value={String(city.id)}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="postal">Postal Code</Label>
                        <Input
                          id="postal"
                          placeholder="10001"
                          value={formData.postal}
                          onChange={(e) => handleInputChange("postal", e.target.value)}
                        />
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
                      Contact person in case of emergencies
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyName" className="flex items-center gap-1">
                          Contact Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="emergencyName"
                          placeholder="Jane Smith"
                          required
                          value={formData.emergencyName}
                          onChange={(e) => handleInputChange("emergencyName", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="emergencyRelation" className="flex items-center gap-1">
                          Relationship <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.emergencyRelation}
                          onValueChange={(value) => handleInputChange("emergencyRelation", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Spouse">Spouse</SelectItem>
                            <SelectItem value="Parent">Parent</SelectItem>
                            <SelectItem value="Child">Child</SelectItem>
                            <SelectItem value="Sibling">Sibling</SelectItem>
                            <SelectItem value="Friend">Friend</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
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
                    onClick={() => navigate("/dashboard/patients")}
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
                      {mutation.isPending ? "Updating..." : "Update Patient"}
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
}