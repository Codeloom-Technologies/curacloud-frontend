import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DOCTOR_SPECIALIZATIONS,
  EMPLOYMENT_TYPES,
  GENDERS,
  TITLES,
} from "@/constants";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchDepartments, fetchRoles, registerStaff } from "@/services/staff";
import {
  Country,
  fetchCities,
  fetchCountries,
  fetchStates,
} from "@/services/onboarding";
import { Role } from "@/types/auth";
import { CreateStaffRequest, DoctorSpecialization } from "@/types";

const RegisterStaff = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [_, setSelectedState] = useState<number | null>(null);

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const {
    data: countries = [],
    isLoading: loadingCountries,
    isFetching: isFetchingCountries,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

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

  // Fetch roles
  const {
    data: rolesData = [],
    isLoading: isLoadingRoles,
    isFetching: isFetchingRoles,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  // Fetch departments
  const {
    data: departmentsData = [],
    isLoading: isLoadingDepartments,
    isFetching: isFetchingDepartments,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });

  // Update local state when query data changes
  useEffect(() => {
    if (rolesData) {
      setRoles(rolesData);
    }
  }, [rolesData]); // only runs when rolesData changes

  useEffect(() => {
    if (departmentsData) {
      setDepartments(departmentsData);
    }
  }, [departmentsData]); // only runs when departmentsData changes

  const mutation = useMutation({
    mutationFn: registerStaff,
    onSuccess: () => {
      toast({
        title: "Staff Registered",
        description: "Staff member has been successfully registered.",
        variant: "success",
      });
      navigate("/dashboard/staff");
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register a staff",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateStaffRequest = {
      email: formData.email,
      phoneNumber:
        selectedCountry?.phoneCode + formData.phoneNumber.replace(/^0+/, ""),
      countryId: Number(formData.countryId),
      roleId: Number(formData.roleId),
      title: formData.title,
      stateId: Number(formData.stateId),
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      dob: formData.dateOfBirth,
      cityId: Number(formData.cityId) || ("" as any),
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
          {/* <Button
          variant="ghost"
          onClick={() => navigate("/staff")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Staff Directory
        </Button>

        <h1 className="text-3xl font-bold mb-6">Register New Staff</h1> */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard/staff")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Staff Directory
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Register New Staff
              </h1>
              <p className="text-muted-foreground pb-5">
                Enter staff information to create new record
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title * </Label>
                  <Select
                    required={true}
                    value={formData.title}
                    onValueChange={(value) =>
                      setFormData({ ...formData, title: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Title" />
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
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
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
                      id="phoneNumber"
                      placeholder="8012345678"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    required={true}
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    required={true}
                    value={formData.roleId.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, roleId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingRoles || isFetchingRoles
                            ? "Loading..."
                            : "Select Role"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    required={true}
                    value={formData.departmentId.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, departmentId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingDepartments || isFetchingDepartments
                            ? "Loading..."
                            : "Select Department"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
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
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select
                    required={true}
                    value={formData.specialization}
                    onValueChange={(value) =>
                      setFormData({ ...formData, specialization: value })
                    }
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
                <div>
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      handleInputChange("licenseNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="joinDate">Join Date *</Label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) =>
                      handleInputChange("joinDate", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="employmentType">Employment Type *</Label>
                  <Select
                    value={formData.employmentType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, employmentType: value })
                    }
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select
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
                        <SelectItem key={state.id} value={state.id.toString()}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
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
                <div>
                  <Label htmlFor="emergencyContact">
                    Emergency Contact Name *
                  </Label>
                  <Input
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      handleInputChange("emergencyContact", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">
                    Emergency Contact Phone *
                  </Label>
                  <Input
                    id="emergencyPhone"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) =>
                      handleInputChange("emergencyPhone", e.target.value)
                    }
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/staff")}
              >
                Cancel
              </Button>
              <Button type="submit">Register Staff</Button>
            </div>
          </form>
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

export default RegisterStaff;
