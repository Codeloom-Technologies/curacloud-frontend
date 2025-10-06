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

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [_, setPhoneCode] = useState("+--");
  const { toast } = useToast();

  const [formData, setFormData] = useState<OnboardingFormData>({
    // Step 1: Role
    role: "",

    // Step 2: Facility Info
    facilityName: "",
    facilityType: "",
    facilitySize: "",

    // Step 3: Location
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    countryId: "",
    stateId: "",
    cityId: "",

    // Step 4: Contact
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

  // Automatically update phone code when country changes
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
      // toast.success("Onboarding complete! Welcome to Curacloud!");
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
    // Validate current step
    if (step === 1 && !formData.role) {
      toast({
        title: "Onboarding Failed",
        description: "Please select your role",
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
        title: "Onboarding Failed",
        description: "Please fill in all facility information",
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
        title: "Onboarding Failed",
        description: "Please fill in location details",
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
        title: "Onboarding Failed",
        description: "Please fill in all contact information",
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
    const payload = mapFormToApiPayload(formData);
    mutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 && "Welcome to Curacloud!"}
              {step === 2 && "Tell us about your facility"}
              {step === 3 && "Where are you located?"}
              {step === 4 && "Your contact information"}
            </CardTitle>
            <CardDescription>
              {step === 1 &&
                "Let's get you set up with the right healthcare management tools"}
              {step === 2 && "This helps us customize your experience"}
              {step === 3 && "We'll use this for compliance and support"}
              {step === 4 && "Almost done! Just a few more details"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Role Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <Label className="text-base">What's your role?</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => updateFormData("role", value)}
                >
                  {HEALTHCARE_PROVIDER_ROLES.map((role, index) => {
                    const id = role.title.toLowerCase().replace(/\s+/g, "-"); // generate a unique id
                    return (
                      <div
                        key={id}
                        className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <RadioGroupItem
                          value={role.title.toLowerCase()}
                          id={id}
                        />
                        <Label htmlFor={id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{role.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {role.description}
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Facility Information */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="facilityName"
                    className="flex items-center gap-2"
                  >
                    <Building2 className="h-4 w-4" />
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facilityType">Type of Facility *</Label>
                  <Select
                    value={formData.facilityType}
                    onValueChange={(value) =>
                      updateFormData("facilityType", value)
                    }
                  >
                    <SelectTrigger id="facilityType">
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

                <div className="space-y-2">
                  <Label
                    htmlFor="facilitySize"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Facility Size *
                  </Label>
                  <Select
                    value={formData.facilitySize}
                    onValueChange={(value) =>
                      updateFormData("facilitySize", value)
                    }
                  >
                    <SelectTrigger id="facilitySize">
                      <SelectValue placeholder="Select facility size" />
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
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Street Address *
                  </Label>
                  <Input
                    type="text"
                    id="address"
                    placeholder="e.g., 123 Healthcare Avenue"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
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
                    <SelectTrigger id="country">
                      <SelectValue
                        placeholder={
                          loadingCountries ? "Loading..." : "Select country"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={String(country.id)}>
                          <div className="flex items-center gap-2">
                            <img
                              src={country.flag.png}
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
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
                      <SelectTrigger id="state">
                        <SelectValue
                          placeholder={
                            loadingStates ? "Loading..." : "Select state"
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

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
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
                          placeholder={
                            loadingCities ? "Loading..." : "Select city"
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

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="e.g., 100001"
                    value={formData.postalCode}
                    onChange={(e) =>
                      updateFormData("postalCode", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {/* Step 4: Contact Information */}
            {step === 4 && (
              //

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Your full name"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        updateFormData("fullName", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        // onChange={(e) =>
                        //   updateFormData("gender", e.target.value)
                        // }
                        required={true}
                        value={formData.gender}
                        onValueChange={(value) =>
                          updateFormData("gender", value)
                        }
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@hospital.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 border rounded-md bg-muted min-w-[80px] justify-center">
                      <span className="text-sm font-medium">
                        {formData.countryId
                          ? countries.find(
                              (c) => c.id === Number(formData.countryId)
                            )?.phoneCode || "+--"
                          : "+--"}
                      </span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="xxx xxx xxxx"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className="flex-1"
                    />

                    <Input
                      id="postalCode"
                      type="hidden"
                      hidden={true}
                      placeholder="Phone Code"
                      value={formData.phoneCode}
                      onChange={(e) =>
                        updateFormData("phoneCode", e.target.value)
                      }
                      className="flex-1 border rounded-lg px-2 py-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="false"
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={(e) =>
                        updateFormData("password", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-7 w-7 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position/Title</Label>
                  <Input
                    id="position"
                    type="text"
                    placeholder="e.g., Chief Medical Officer"
                    value={formData.position}
                    onChange={(e) => updateFormData("position", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                className="bg-gradient-primary"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : step === totalSteps ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
