import { useState } from "react";
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
import { ArrowLeft, Save, User, MapPin, Phone, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchCountries,
  fetchStates,
  Country,
  fetchCities,
} from "@/services/onboarding";
import { registerPatient } from "@/services/patient";
import {
  BLOOD_GROUPS,
  GENDERS,
  GENOTYPES,
  MARITAL_STATUSES,
  TITLES,
} from "@/constants";
import { Textarea } from "@/components/ui/textarea";

export default function RegisterPatient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [_, setSelectedState] = useState<number | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  /* ============================
   * FORM DATA
  ================================
   */
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
    postal: "",
    cityId: "",
    bloodGroup: "",
    genotype: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    currentMedications: "",
    allergies: "",
    medicalHistory: "",
  });

  /* ============================
   * FETCH COUNTRIES
  ================================
   */
  const {
    data: countries = [],
    isFetching: isFetchingCountries,
    isLoading: loadingCountries,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  /* ============================
   * FETCH STATES
  ================================
   */
  const {
    data: states = [],
    isLoading: loadingState,
    isFetching: isFetchingStates,
  } = useQuery({
    queryKey: ["states", selectedCountry?.id],
    queryFn: () => fetchStates(selectedCountry!.id),
    enabled: !!selectedCountry,
  });

  /* ============================
   * FETCH CITY
  ================================
   */
  const { data: cities = [], isLoading: loadingCities } = useQuery({
    queryKey: ["cities", formData.stateId],
    queryFn: () => fetchCities(Number(formData.stateId)),
    enabled: !!formData.stateId,
  });

  /* ============================
   * HANDLE ON CHANGE EVENT
  ================================
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ============================
   * REGISTER A PATIENT
  ================================
   */
  const mutation = useMutation({
    mutationFn: registerPatient,
    onSuccess: () => {
      toast({
        title: "Patient Registered Successfully",
        description: "New patient has been added to the system",
        variant: "success",
      });
      navigate("/dashboard/patients");
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register patient",
        variant: "destructive",
      });
    },
  });

  /* ============================
   * SUBMIT DATA 
  ================================
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email: formData.email,
      phoneNumber:
        selectedCountry?.phoneCode + formData.phone.replace(/\D/g, ""),
      countryId: Number(formData.countryId),
      roleId: 17,
      title: formData.title,
      stateId: Number(formData.stateId),
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      nationalId: formData.nationalId || undefined,
      maritalStatus: formData.maritalStatus || undefined,
      address: {
        street:
          formData.address1 +
          (formData.address2 ? `, ${formData.address2}` : ""),
        postalCode: formData.postal,
      },
      address2: formData.address2,
      bloodGroup: formData.bloodGroup || undefined,
      genotype: formData.genotype || undefined,
      patientEmergencyContact: {
        fullName: formData.emergencyName,
        phoneNumber: formData.emergencyPhone,
        relationship: formData.emergencyRelation,
      },
      currentMedications: formData.currentMedications,
      allergies: formData.allergies,
      medicalHistory: formData.medicalHistory,
    };

    mutation.mutate(payload);
  };

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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/patients")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Directory
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Register New Patient
                </h1>
                <p className="text-muted-foreground">
                  Enter patient information to create a new medical record
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Select
                        required={true}
                        value={formData.title}
                        onValueChange={(value) =>
                          handleInputChange("title", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
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
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Smith"
                        required
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        value={formData.gender}
                        required={true}
                        onValueChange={(value) =>
                          handleInputChange("gender", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
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
                    <div>
                      <Label htmlFor="dob">Date of Birth *</Label>
                      <Input
                        id="dob"
                        type="date"
                        required
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationalId">National ID / SSN</Label>
                      <Input
                        id="nationalId"
                        placeholder="123-45-6789"
                        value={formData.nationalId}
                        onChange={(e) =>
                          handleInputChange("nationalId", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="maritalStatus">Marital Status *</Label>
                      <Select
                        required={true}
                        value={formData.maritalStatus}
                        onValueChange={(value) =>
                          handleInputChange("maritalStatus", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {MARITAL_STATUSES.map((maritalStatus) => (
                            <SelectItem
                              key={maritalStatus}
                              value={maritalStatus}
                            >
                              {maritalStatus}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bloodGroup">Blood Group *</Label>
                      <Select
                        required={true}
                        value={formData.bloodGroup}
                        onValueChange={(value) =>
                          handleInputChange("bloodGroup", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {BLOOD_GROUPS.map((bloodGroup) => (
                            <SelectItem key={bloodGroup} value={bloodGroup}>
                              {bloodGroup}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="genotype">Genotype *</Label>
                      <Select
                        required={true}
                        value={formData.genotype}
                        onValueChange={(value) =>
                          handleInputChange("genotype", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
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

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Primary Phone *</Label>
                      <div className="flex gap-2">
                        {selectedCountry && (
                          <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted min-w-[100px]">
                            <img
                              src={selectedCountry.flag.svg}
                              alt={selectedCountry.name}
                              className="w-5 h-4 object-cover"
                            />
                            <span className="text-sm">
                              {selectedCountry.phoneCode}
                            </span>
                          </div>
                        )}
                        <Input
                          id="phone"
                          placeholder="8012345678"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.smith@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select
                        required
                        value={formData.countryId}
                        onValueChange={(value) => {
                          handleInputChange("countryId", value);
                          const country = countries.find(
                            (c) => c.id === Number(value)
                          );
                          setSelectedCountry(country || null);
                          setSelectedState(null);
                          handleInputChange("stateId", "");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingCountries || isFetchingCountries
                                ? "Loading..."
                                : "Select Country"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.id}
                              value={country.id.toString()}
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={country.flag.svg}
                                  alt={country.name}
                                  className="w-5 h-4 object-cover"
                                />
                                <span>{country.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select
                        required
                        value={formData.stateId}
                        onValueChange={(value) => {
                          handleInputChange("stateId", value);
                          setSelectedState(Number(value));
                        }}
                        disabled={!selectedCountry}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingState || isFetchingStates
                                ? "Loading..."
                                : "Select State"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
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

                  <div>
                    <Label htmlFor="address1">Address Line 1 *</Label>
                    <Textarea
                      id="address1"
                      placeholder="123 Main Street"
                      required
                      value={formData.address1}
                      onChange={(e) =>
                        handleInputChange("address1", e.target.value)
                      }
                    />
                  </div>
                  {/* <div>
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input
                      id="address2"
                      placeholder="Apt 4B"
                      value={formData.address2}
                      onChange={(e) =>
                        handleInputChange("address2", e.target.value)
                      }
                    />
                  </div> */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Select
                        value={formData.cityId}
                        onValueChange={(value) => {
                          const city = cities.find(
                            (c) => c.id === Number(value)
                          );
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
                    <div>
                      <Label htmlFor="postal">Postal Code</Label>
                      <Input
                        id="postal"
                        placeholder="10001"
                        value={formData.postal}
                        onChange={(e) =>
                          handleInputChange("postal", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postal">Postal Code</Label>
                      <Input
                        id="postal"
                        placeholder="10001"
                        value={formData.postal}
                        onChange={(e) =>
                          handleInputChange("postal", e.target.value)
                        }
                      />
                    </div>
                  </div> */}
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="emergencyName">Contact Name *</Label>
                      <Input
                        id="emergencyName"
                        placeholder="Jane Smith"
                        required
                        value={formData.emergencyName}
                        onChange={(e) =>
                          handleInputChange("emergencyName", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyRelation">Relationship *</Label>
                      <Select
                        value={formData.emergencyRelation}
                        onValueChange={(value) =>
                          handleInputChange("emergencyRelation", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
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
                    <div>
                      <Label htmlFor="emergencyPhone">Contact Phone *</Label>
                      <Input
                        id="emergencyPhone"
                        placeholder="+1 (555) 987-6543"
                        required
                        value={formData.emergencyPhone}
                        onChange={(e) =>
                          handleInputChange("emergencyPhone", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Information */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Insurance Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                      <Input id="insuranceProvider" placeholder="Blue Cross Blue Shield" />
                    </div>
                    <div>
                      <Label htmlFor="policyNumber">Policy Number</Label>
                      <Input id="policyNumber" placeholder="BC123456789" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="groupNumber">Group Number</Label>
                      <Input id="groupNumber" placeholder="GRP001" />
                    </div>
                    <div>
                      <Label htmlFor="primaryDoctor">Primary Care Doctor</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dr-johnson">Dr. Sarah Johnson</SelectItem>
                          <SelectItem value="dr-brown">Dr. Michael Brown</SelectItem>
                          <SelectItem value="dr-chen">Dr. Lisa Chen</SelectItem>
                          <SelectItem value="dr-wilson">Dr. James Wilson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              {/* Medical History */}
              <Card>
                <CardHeader>
                  <CardTitle>Medical History & Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="allergies">Known Allergies</Label>
                    <Textarea
                      value={formData.allergies}
                      onChange={(e) =>
                        handleInputChange("allergies", e.target.value)
                      }
                      id="allergies"
                      placeholder="List any known allergies (medications, food, environmental)..."
                      className="min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea
                      value={formData.currentMedications}
                      onChange={(e) =>
                        handleInputChange("currentMedications", e.target.value)
                      }
                      id="medications"
                      placeholder="List current medications and dosages..."
                      className="min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      value={formData.medicalHistory}
                      onChange={(e) =>
                        handleInputChange("medicalHistory", e.target.value)
                      }
                      id="medicalHistory"
                      placeholder="Previous surgeries, chronic conditions, family history..."
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/patients")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-primary hover:shadow-glow transition-all"
                  disabled={mutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {mutation.isPending ? "Registering..." : "Register Patient"}
                </Button>
              </div>
            </form>
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
