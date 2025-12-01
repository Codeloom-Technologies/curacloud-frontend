import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  Users,
  MapPin,
  Check,
  Loader2,
  EyeOff,
  Eye,
  Star,
  Heart,
  Stethoscope,
  Mail,
  Phone,
  User,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  submitOnboarding,
  mapFormToApiPayload,
  fetchCountries,
  fetchStates,
  fetchCities,
} from "@/services/onboarding";
import { OnboardingFormData } from "@/types/onboarding";
import {
  GENDERS,
  HEALTHCARE_PROVIDER_FACILITY_SIZE,
  HEALTHCARE_PROVIDER_ROLES,
  HEALTHCARE_PROVIDER_TYPES,
} from "@/constants";
import { z } from "zod";

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// type PasswordFormData = z.infer<typeof passwordSchema>;

// Password Strength Component
function PasswordStrengthIndicator({ password }: { password: string }) {
  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500", "bg-green-600"];

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-blue-900">Password Strength</span>
        <span className={`font-medium ${
          strength >= 4 ? "text-green-600" : 
          strength >= 2 ? "text-yellow-600" : "text-red-600"
        }`}>
          {strengthLabels[strength]}
        </span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full transition-colors ${
              index <= strength ? strengthColors[strength] : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneCode, setPhoneCode] = useState("+--");
  const { toast } = useToast();

  const [formData, setFormData] = useState<OnboardingFormData>({
    role: "",
    facilityName: "",
    facilityType: "",
    facilitySize: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    countryId: "",
    stateId: "",
    cityId: "",
    fullName: "",
    email: "",
    phone: "",
    phoneCode: "",
    password: "",
    gender: "",
    position: "",
  });

  const { data: countries = [], isLoading: loadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  const { data: states = [], isLoading: loadingStates } = useQuery({
    queryKey: ["states", formData.countryId],
    queryFn: () => fetchStates(Number(formData.countryId)),
    enabled: !!formData.countryId,
  });

  const { data: cities = [], isLoading: loadingCities } = useQuery({
    queryKey: ["cities", formData.stateId],
    queryFn: () => fetchCities(Number(formData.stateId)),
    enabled: !!formData.stateId,
  });

  useEffect(() => {
    if (formData.countryId) {
      setFormData((prev) => ({
        ...prev,
        stateId: "",
        cityId: "",
        state: "",
        city: "",
      }));
    }
  }, [formData.countryId]);

  useEffect(() => {
    if (formData.stateId) {
      setFormData((prev) => ({ ...prev, cityId: "", city: "" }));
    }
  }, [formData.stateId]);

  useEffect(() => {
    if (formData.countryId && countries.length > 0) {
      const selectedCountry = countries.find(
        (c) => c.id === Number(formData.countryId)
      );
      const code = selectedCountry?.phoneCode || "+--";
      setPhoneCode(code);
      setFormData((prev) => ({ ...prev, phoneCode: code }));
    } else {
      setPhoneCode("+--");
      setFormData((prev) => ({ ...prev, phoneCode: "+--" }));
    }
  }, [formData.countryId, countries]);

  const mutation = useMutation({
    mutationFn: submitOnboarding,
    onSuccess: (_) => {
      toast({
        title: "Healthcare Onboarded",
        description: "Onboarding complete! Please check your mailbox!",
        variant: "success",
      });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Onboarding Failed",
        description: error.message || "Failed to complete onboarding",
        variant: "destructive",
      });
    },
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.role) {
      toast({
        title: "Please select your role",
        description: "This helps us customize your experience",
        variant: "destructive",
      });
      return;
    }
    if (
      step === 2 &&
      (!formData.facilityName ||
        !formData.facilityType ||
        !formData.facilitySize)
    ) {
      toast({
        title: "Incomplete facility information",
        description: "Please fill in all facility details",
        variant: "destructive",
      });
      return;
    }
    if (
      step === 3 &&
      (!formData.address ||
        !formData.countryId ||
        !formData.stateId ||
        !formData.cityId)
    ) {
      toast({
        title: "Location details required",
        description: "Please complete your location information",
        variant: "destructive",
      });
      return;
    }
    if (
      step === 4 &&
      (!formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.phoneCode ||
        !formData.password ||
        !formData.gender)
    ) {
      toast({
        title: "Contact information incomplete",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
         toast({
        title: "Onboarding",
        description: "Please book a demo with the team",
        variant: "destructive",
      });
      return;
    const payload = mapFormToApiPayload(formData);
    mutation.mutate(payload);
  };

  const getStepIcon = (stepNumber: number) => {
    const icons = [Stethoscope, Building2, MapPin, User];
    const Icon = icons[stepNumber - 1];
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      
      <div className="w-full max-w-2xl">
        {/* Header with branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
           <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Curacloud
                </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Join thousands of healthcare providers transforming patient care
          </p>
        </div>

        {/* Progress Bar with steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step >= stepNumber
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg scale-110"
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}>
                  {step > stepNumber ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    getStepIcon(stepNumber)
                  )}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  step >= stepNumber ? "text-blue-600" : "text-muted-foreground"
                }`}>
                  Step {stepNumber}
                </span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2 bg-muted" />
          <div className="flex justify-between mt-2">
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progress)}% Complete
            </span>
            <span className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              {step === 1 && <Stethoscope className="h-8 w-8 text-white" />}
              {step === 2 && <Building2 className="h-8 w-8 text-white" />}
              {step === 3 && <MapPin className="h-8 w-8 text-white" />}
              {step === 4 && <User className="h-8 w-8 text-white" />}
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {step === 1 && "Welcome to Curacloud! 👋"}
              {step === 2 && "Facility Information 🏥"}
              {step === 3 && "Location Details 📍"}
              {step === 4 && "Personal Information 👤"}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {step === 1 && "Let's personalize your healthcare management experience"}
              {step === 2 && "Tell us about your healthcare facility"}
              {step === 3 && "Where do you provide care?"}
              {step === 4 && "Final step to complete your profile"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-8 pb-8">
            {/* Step 1: Role Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Label className="text-lg font-semibold text-gray-900">
                    What's your primary role in healthcare?
                  </Label>
                  <p className="text-muted-foreground mt-1">
                    Choose the role that best describes your work
                  </p>
                </div>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => updateFormData("role", value)}
                  className="space-y-4"
                >
                  {HEALTHCARE_PROVIDER_ROLES.map((role, index) => {
                    const id = role.title.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <div
                        key={id}
                        className="flex items-center space-x-4 border-2 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group"
                      >
                        <RadioGroupItem
                          value={role.title.toLowerCase()}
                          id={id}
                          className="h-5 w-5 text-blue-600"
                        />
                        <Label htmlFor={id} className="flex-1 cursor-pointer">
                          <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {role.title}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {role.description}
                          </div>
                        </Label>
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Facility Information */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="facilityName"
                      className="flex items-center gap-2 text-base font-semibold"
                    >
                      <Building2 className="h-5 w-5 text-blue-600" />
                      Facility Name *
                    </Label>
                    <Input
                      id="facilityName"
                      type="text"
                      placeholder="e.g., General Hospital Lagos"
                      value={formData.facilityName}
                      onChange={(e) =>
                        updateFormData("facilityName", e.target.value)
                      }
                      className="h-12 text-lg border-2 focus:border-blue-300 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="facilityType" className="text-base font-semibold">
                        Type of Facility *
                      </Label>
                      <Select
                        value={formData.facilityType}
                        onValueChange={(value) =>
                          updateFormData("facilityType", value)
                        }
                      >
                        <SelectTrigger 
                          id="facilityType"
                          className="h-12 border-2 focus:border-blue-300"
                        >
                          <SelectValue placeholder="Select facility type" />
                        </SelectTrigger>
                        <SelectContent>
                          {HEALTHCARE_PROVIDER_TYPES.map((provider) => (
                            <SelectItem key={provider} value={provider}>
                              {provider}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="facilitySize"
                        className="flex items-center gap-2 text-base font-semibold"
                      >
                        <Users className="h-5 w-5 text-blue-600" />
                        Facility Size *
                      </Label>
                      <Select
                        value={formData.facilitySize}
                        onValueChange={(value) =>
                          updateFormData("facilitySize", value)
                        }
                      >
                        <SelectTrigger 
                          id="facilitySize"
                          className="h-12 border-2 focus:border-blue-300"
                        >
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {HEALTHCARE_PROVIDER_FACILITY_SIZE.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="address" className="flex items-center gap-2 text-base font-semibold">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Street Address *
                  </Label>
                  <Input
                    type="text"
                    id="address"
                    placeholder="e.g., 123 Healthcare Avenue"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    className="h-12 text-lg border-2 focus:border-blue-300 transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="country" className="text-base font-semibold">Country *</Label>
                  <Select
                    value={formData.countryId}
                    onValueChange={(value) => {
                      const country = countries.find(
                        (c) => c.id === Number(value)
                      );
                      setFormData((prev) => ({
                        ...prev,
                        countryId: value,
                        country: country?.name || "",
                      }));
                    }}
                  >
                    <SelectTrigger 
                      id="country"
                      className="h-12 border-2 focus:border-blue-300"
                    >
                      <SelectValue
                        placeholder={
                          loadingCountries ? "Loading countries..." : "Select country"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={String(country.id)}>
                          <div className="flex items-center gap-3">
                            <img
                              src={country.flag.png}
                              alt={country.name}
                              className="w-6 h-4 object-cover rounded"
                            />
                            <span className="font-medium">{country.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="state" className="text-base font-semibold">State *</Label>
                    <Select
                      value={formData.stateId}
                      onValueChange={(value) => {
                        const state = states.find(
                          (s) => s.id === Number(value)
                        );
                        setFormData((prev) => ({
                          ...prev,
                          stateId: value,
                          state: state?.name || "",
                        }));
                      }}
                      disabled={!formData.countryId}
                    >
                      <SelectTrigger 
                        id="state"
                        className="h-12 border-2 focus:border-blue-300"
                      >
                        <SelectValue
                          placeholder={
                            loadingStates ? "Loading states..." : "Select state"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.id} value={String(state.id)}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="city" className="text-base font-semibold">City *</Label>
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
                      <SelectTrigger 
                        id="city"
                        className="h-12 border-2 focus:border-blue-300"
                      >
                        <SelectValue
                          placeholder={
                            loadingCities ? "Loading cities..." : "Select city"
                          }
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
                </div>

                <div className="space-y-3">
                  <Label htmlFor="postalCode" className="text-base font-semibold">Postal Code</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="e.g., 100001"
                    value={formData.postalCode}
                    onChange={(e) =>
                      updateFormData("postalCode", e.target.value)
                    }
                    className="h-12 text-lg border-2 focus:border-blue-300 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Contact Information */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="fullName" className="text-base font-semibold">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Your full name"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        updateFormData("fullName", e.target.value)
                      }
                      className="h-12 text-lg border-2 focus:border-blue-300 transition-colors"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="gender" className="text-base font-semibold">Gender *</Label>
                    <Select
                      required={true}
                      value={formData.gender}
                      onValueChange={(value) =>
                        updateFormData("gender", value)
                      }
                    >
                      <SelectTrigger className="h-12 border-2 focus:border-blue-300">
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

                <div className="space-y-3">
                  <Label htmlFor="email" className="flex items-center gap-2 text-base font-semibold">
                    <Mail className="h-5 w-5 text-blue-600" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@hospital.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="h-12 text-lg border-2 focus:border-blue-300 transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-base font-semibold">
                    <Phone className="h-5 w-5 text-blue-600" />
                    Phone Number *
                  </Label>
                  <div className="flex gap-3">
                    <div className="flex items-center px-4 border-2 rounded-xl bg-blue-50 min-w-[100px] justify-center border-blue-200">
                      <span className="text-sm font-semibold text-blue-700">
                        {phoneCode}
                      </span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="xxx xxx xxxx"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className="h-12 text-lg border-2 focus:border-blue-300 transition-colors flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="flex items-center gap-2 text-base font-semibold">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={(e) =>
                        updateFormData("password", e.target.value)
                      }
                      className="h-12 text-lg border-2 focus:border-blue-300 transition-colors pr-12"
                    />
                         {/* Password Strength Indicator */}
              {formData.password && (
                <PasswordStrengthIndicator password={formData.password} />
              )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-3 top-3 h-6 w-6 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4 text-gray-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="position" className="text-base font-semibold">Position/Title</Label>
                  <Input
                    id="position"
                    type="text"
                    placeholder="e.g., Chief Medical Officer"
                    value={formData.position}
                    onChange={(e) => updateFormData("position", e.target.value)}
                    className="h-12 text-lg border-2 focus:border-blue-300 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="h-12 px-6 border-2 text-base font-semibold rounded-xl transition-all hover:scale-105"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={mutation.isPending}
                className="h-12 px-8 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-105 shadow-lg"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : step === totalSteps ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Complete Onboarding
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground" onClick={() => navigate('/auth/login')}>
            Already have an account?{" "}
            <Button
                variant="link"
              onClick={() => navigate('/auth/login')}
              className="text-blue-600 hover:text-blue-700 font-semibold underline bg-transparent border-none cursor-pointer p-0 hover:underline-offset-2 transition-all"
            >
              Sign in here
            </Button>
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Secure & Encrypted
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              HIPAA Compliant
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Trusted by 10,000+ Providers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}