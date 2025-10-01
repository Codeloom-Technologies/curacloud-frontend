import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Building2, Users, MapPin, Check } from "lucide-react";
import { toast } from "sonner";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
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
    country: "Nigeria",
    
    // Step 4: Contact
    fullName: "",
    email: "",
    phone: "",
    position: "",
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validate current step
    if (step === 1 && !formData.role) {
      toast.error("Please select your role");
      return;
    }
    if (step === 2 && (!formData.facilityName || !formData.facilityType || !formData.facilitySize)) {
      toast.error("Please fill in all facility information");
      return;
    }
    if (step === 3 && (!formData.address || !formData.city || !formData.state)) {
      toast.error("Please fill in location details");
      return;
    }
    if (step === 4 && (!formData.fullName || !formData.email || !formData.phone)) {
      toast.error("Please fill in your contact information");
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
    toast.success("Onboarding complete! Welcome to CuraCloud!");
    // Here you would typically save the data to your backend
    console.log("Onboarding data:", formData);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 && "Welcome to CuraCloud!"}
              {step === 2 && "Tell us about your facility"}
              {step === 3 && "Where are you located?"}
              {step === 4 && "Your contact information"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Let's get you set up with the right healthcare management tools"}
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
                <RadioGroup value={formData.role} onValueChange={(value) => updateFormData("role", value)}>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="doctor" id="doctor" />
                    <Label htmlFor="doctor" className="flex-1 cursor-pointer">
                      <div className="font-medium">Healthcare Provider</div>
                      <div className="text-sm text-muted-foreground">Doctor, Physician, Specialist</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="nurse" id="nurse" />
                    <Label htmlFor="nurse" className="flex-1 cursor-pointer">
                      <div className="font-medium">Nursing Staff</div>
                      <div className="text-sm text-muted-foreground">Nurse, Care Coordinator</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin" className="flex-1 cursor-pointer">
                      <div className="font-medium">Hospital Administrator</div>
                      <div className="text-sm text-muted-foreground">Manager, Operations, Executive</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="flex-1 cursor-pointer">
                      <div className="font-medium">Other Healthcare Professional</div>
                      <div className="text-sm text-muted-foreground">Pharmacist, Lab Technician, etc.</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Facility Information */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facilityName" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Facility Name
                  </Label>
                  <Input
                    id="facilityName"
                    placeholder="e.g., General Hospital Lagos"
                    value={formData.facilityName}
                    onChange={(e) => updateFormData("facilityName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facilityType">Type of Facility</Label>
                  <Select value={formData.facilityType} onValueChange={(value) => updateFormData("facilityType", value)}>
                    <SelectTrigger id="facilityType">
                      <SelectValue placeholder="Select facility type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="clinic">Clinic</SelectItem>
                      <SelectItem value="specialty">Specialty Center</SelectItem>
                      <SelectItem value="diagnostic">Diagnostic Center</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facilitySize" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Facility Size
                  </Label>
                  <Select value={formData.facilitySize} onValueChange={(value) => updateFormData("facilitySize", value)}>
                    <SelectTrigger id="facilitySize">
                      <SelectValue placeholder="Select facility size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (1-50 staff)</SelectItem>
                      <SelectItem value="medium">Medium (51-200 staff)</SelectItem>
                      <SelectItem value="large">Large (201-500 staff)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (500+ staff)</SelectItem>
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
                    Street Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="e.g., 123 Healthcare Avenue"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select value={formData.state} onValueChange={(value) => updateFormData("state", value)}>
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Abia">Abia</SelectItem>
                        <SelectItem value="Adamawa">Adamawa</SelectItem>
                        <SelectItem value="Akwa Ibom">Akwa Ibom</SelectItem>
                        <SelectItem value="Anambra">Anambra</SelectItem>
                        <SelectItem value="Bauchi">Bauchi</SelectItem>
                        <SelectItem value="Bayelsa">Bayelsa</SelectItem>
                        <SelectItem value="Benue">Benue</SelectItem>
                        <SelectItem value="Borno">Borno</SelectItem>
                        <SelectItem value="Cross River">Cross River</SelectItem>
                        <SelectItem value="Delta">Delta</SelectItem>
                        <SelectItem value="Ebonyi">Ebonyi</SelectItem>
                        <SelectItem value="Edo">Edo</SelectItem>
                        <SelectItem value="Ekiti">Ekiti</SelectItem>
                        <SelectItem value="Enugu">Enugu</SelectItem>
                        <SelectItem value="FCT">FCT Abuja</SelectItem>
                        <SelectItem value="Gombe">Gombe</SelectItem>
                        <SelectItem value="Imo">Imo</SelectItem>
                        <SelectItem value="Jigawa">Jigawa</SelectItem>
                        <SelectItem value="Kaduna">Kaduna</SelectItem>
                        <SelectItem value="Kano">Kano</SelectItem>
                        <SelectItem value="Katsina">Katsina</SelectItem>
                        <SelectItem value="Kebbi">Kebbi</SelectItem>
                        <SelectItem value="Kogi">Kogi</SelectItem>
                        <SelectItem value="Kwara">Kwara</SelectItem>
                        <SelectItem value="Lagos">Lagos</SelectItem>
                        <SelectItem value="Nasarawa">Nasarawa</SelectItem>
                        <SelectItem value="Niger">Niger</SelectItem>
                        <SelectItem value="Ogun">Ogun</SelectItem>
                        <SelectItem value="Ondo">Ondo</SelectItem>
                        <SelectItem value="Osun">Osun</SelectItem>
                        <SelectItem value="Oyo">Oyo</SelectItem>
                        <SelectItem value="Plateau">Plateau</SelectItem>
                        <SelectItem value="Rivers">Rivers</SelectItem>
                        <SelectItem value="Sokoto">Sokoto</SelectItem>
                        <SelectItem value="Taraba">Taraba</SelectItem>
                        <SelectItem value="Yobe">Yobe</SelectItem>
                        <SelectItem value="Zamfara">Zamfara</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Select value={formData.city} onValueChange={(value) => updateFormData("city", value)}>
                      <SelectTrigger id="city">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lagos">Lagos</SelectItem>
                        <SelectItem value="Abuja">Abuja</SelectItem>
                        <SelectItem value="Kano">Kano</SelectItem>
                        <SelectItem value="Ibadan">Ibadan</SelectItem>
                        <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                        <SelectItem value="Benin City">Benin City</SelectItem>
                        <SelectItem value="Kaduna">Kaduna</SelectItem>
                        <SelectItem value="Enugu">Enugu</SelectItem>
                        <SelectItem value="Aba">Aba</SelectItem>
                        <SelectItem value="Onitsha">Onitsha</SelectItem>
                        <SelectItem value="Warri">Warri</SelectItem>
                        <SelectItem value="Calabar">Calabar</SelectItem>
                        <SelectItem value="Uyo">Uyo</SelectItem>
                        <SelectItem value="Ilorin">Ilorin</SelectItem>
                        <SelectItem value="Jos">Jos</SelectItem>
                        <SelectItem value="Abeokuta">Abeokuta</SelectItem>
                        <SelectItem value="Akure">Akure</SelectItem>
                        <SelectItem value="Owerri">Owerri</SelectItem>
                        <SelectItem value="Maiduguri">Maiduguri</SelectItem>
                        <SelectItem value="Sokoto">Sokoto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="e.g., 100001"
                      value={formData.postalCode}
                      onChange={(e) => updateFormData("postalCode", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={formData.country} onValueChange={(value) => updateFormData("country", value)}>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nigeria">Nigeria</SelectItem>
                        <SelectItem value="Ghana">Ghana</SelectItem>
                        <SelectItem value="Kenya">Kenya</SelectItem>
                        <SelectItem value="South Africa">South Africa</SelectItem>
                        <SelectItem value="Egypt">Egypt</SelectItem>
                        <SelectItem value="Tanzania">Tanzania</SelectItem>
                        <SelectItem value="Uganda">Uganda</SelectItem>
                        <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                        <SelectItem value="Morocco">Morocco</SelectItem>
                        <SelectItem value="Senegal">Senegal</SelectItem>
                        <SelectItem value="Rwanda">Rwanda</SelectItem>
                        <SelectItem value="Cameroon">Cameroon</SelectItem>
                        <SelectItem value="Ivory Coast">Ivory Coast</SelectItem>
                        <SelectItem value="Zambia">Zambia</SelectItem>
                        <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                        <SelectItem value="Botswana">Botswana</SelectItem>
                        <SelectItem value="Tunisia">Tunisia</SelectItem>
                        <SelectItem value="Algeria">Algeria</SelectItem>
                        <SelectItem value="Mozambique">Mozambique</SelectItem>
                        <SelectItem value="Angola">Angola</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact Information */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@hospital.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+234 xxx xxx xxxx"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position/Title</Label>
                  <Input
                    id="position"
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

              <Button onClick={handleNext} className="bg-gradient-primary">
                {step === totalSteps ? (
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
