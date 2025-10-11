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
import { ArrowLeft } from "lucide-react";
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
  registerStaff,
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

const UpdateStaff = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [_, setSelectedState] = useState<number | null>(null);

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

      setSelectedState(staffData.stateId || null);
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

  const mutation = useMutation({
    mutationFn: (payload: any) => updateStaff(staffId!, payload),
    onSuccess: () => {
      toast({
        title: "Staff Updated",
        description: "Staff member has been successfully updated.",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

  const handleCountryChange = (value: string) => {
    const countryId = value;
    const country = countries.find((c: Country) => c.id === Number(countryId));
    setSelectedCountry(country || null);
    setSelectedState(null);
    handleInputChange("countryId", countryId);
    handleInputChange("stateId", "");
    handleInputChange("cityId", "");
  };

  const handleStateChange = (value: string) => {
    setSelectedState(Number(value));
    handleInputChange("stateId", value);
    handleInputChange("cityId", "");
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
                Update Staff
              </h1>
              <p className="text-muted-foreground pb-5">
                Update staff information
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Select
                    required={true}
                    value={formData.title}
                    onValueChange={(value) => handleInputChange("title", value)}
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
                    readOnly
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
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
                      readOnly
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
                      handleInputChange("gender", value)
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

            {/* Professional Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    required={true}
                    value={formData.roleId}
                    onValueChange={(value) =>
                      handleInputChange("roleId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingRoles ? "Loading..." : "Select Role"
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
                    value={formData.departmentId}
                    onValueChange={(value) =>
                      handleInputChange("departmentId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingDepartments
                            ? "Loading..."
                            : "Select Department"
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
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select
                    value={formData.specialization}
                    onValueChange={(value) =>
                      handleInputChange("specialization", value)
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
                      handleInputChange("employmentType", value)
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

            {/* Contact Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
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
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingCountries ? "Loading..." : "Select Country"
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
                          loadingState ? "Loading..." : "Select State"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state: any) => (
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
                    onValueChange={(value) =>
                      handleInputChange("cityId", value)
                    }
                    disabled={!formData.stateId}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingCities ? "Loading..." : "Select city"
                        }
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
                <div>
                  <Label htmlFor="emergencyContact">
                    Emergency Contact Name *
                  </Label>
                  <Input
                    id="emergencyContact"
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
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Updating..." : "Update Staff"}
              </Button>
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

export default UpdateStaff;
