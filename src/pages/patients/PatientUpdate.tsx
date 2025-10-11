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
import PatientDetailsSkeleton from "@/components/dashboard/PatientDetailsSkeleton";
import PatientUpdateSkeleton from "@/components/dashboard/PatientUpdateSkeleton";
import {
  BLOOD_GROUPS,
  GENDERS,
  GENOTYPES,
  MARITAL_STATUSES,
  TITLES,
} from "@/constants";
import { Textarea } from "@/components/ui/textarea";

export default function UpdatePatient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [_, setSelectedState] = useState<number | null>(null);
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
    isLoading: loadingCountries,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  // Fetch states when country changes
  const {
    data: states = [],
    isLoading: loadingState,
    isFetching: isFetchingStates,
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
        dateOfBirth: patientData.dateOfBirth,
        nationalId: patientData.nationalId || "",
        maritalStatus: patientData.maritalStatus || "",
        phone: user.phoneNumber || "",
        email: user.email || "",
        address1: addressParts[0] || "",
        address2: addressParts[1]?.trim() || "",
        address: {
          street:
            formData.address1 +
            (formData.address2 ? `, ${formData.address2}` : ""),
          postalCode: formData.postal,
        },
        city: address.city || "",
        state: formData.state?.toString() || "",
        countryId: patientData.user.countryId || "",
        stateId: patientData.user.stateId || "",
        cityId: patientData.user.cityId || "",
        postal: address.postalCode || "",
        bloodGroup: patientData.bloodGroup || "",
        genotype: patientData.genotype || "",
        emergencyName: emergencyContact.fullName || "",
        emergencyRelation: emergencyContact.relationship || "",
        emergencyPhone: emergencyContact.phoneNumber || "",
      };

      setFormData(updatedFormData);

      // Set selected country for dropdown
      if (patientData.countryId && countries.length > 0) {
        const country = countries.find(
          (c: Country) => c.id === patientData.countryId
        );
        setSelectedCountry(country || null);
      }

      setSelectedState(patientData.stateId || null);
    }
  }, [patientData, countries]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountryChange = (value: string) => {
    const countryId = value;
    const country = countries.find((c: Country) => c.id === Number(countryId));
    setSelectedCountry(country || null);
    setSelectedState(null);
    handleInputChange("countryId", countryId);
    handleInputChange("stateId", ""); // Reset state when country changes
  };

  const handleStateChange = (value: string) => {
    setSelectedState(Number(value));
    handleInputChange("stateId", value);
  };

  const mutation = useMutation({
    mutationFn: (payload: any) => updatePatient(patientId!, payload),
    onSuccess: () => {
      toast({
        title: "Patient Updated",
        description: "Patient information has been updated successfully",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    console.log("Submitting payload:", payload);
    mutation.mutate(payload);
  };

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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard/patients")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Directory
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Update Patient
                </h1>
                <p className="text-muted-foreground">
                  Update patient information for {formData.firstName}{" "}
                  {formData.lastName}
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
                          readOnly
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
                        readOnly
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
                        value={formData.countryId}
                        onValueChange={handleCountryChange}
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
                          {countries.map((country: Country) => (
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
                        value={formData.stateId}
                        onValueChange={handleStateChange}
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
                  {mutation.isPending ? "Updating..." : "Update Patient"}
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
