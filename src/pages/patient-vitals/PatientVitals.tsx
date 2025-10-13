import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Search,
  User,
  Stethoscope,
  Book,
  Edit,
  Plus,
  Eye,
  Heart,
  Thermometer,
  Weight,
  Ruler,
  Activity,
  Wind,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  createPatientVital,
  fetchPatientVital,
  updatePatientVital,
} from "@/services/patient-vital";

export default function PatientVitals() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false); // New state for details popup
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [selectedVital, setSelectedVital] = useState<any>(null); // For details view
  const [showBookingForm, setShowBookingForm] = useState(false);

  const perPage = 10;
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientId: "",
    heightCm: "",
    weightKg: "",
    temperatureC: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRateBpm: "",
    name: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    notes: "",
    appointmentId: "",
    doctor: "",
    id: "",
  });

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch vitals
  const {
    data,
    isLoading: isLoadingVitals,
    isFetching: isFetchingVitals,
    refetch,
  } = useQuery({
    queryKey: ["patientVitals", currentPage, debouncedSearch],
    queryFn: () => fetchPatientVital(currentPage, perPage, debouncedSearch),
  });

  const vitals = data?.vitals ?? [];
  const meta = data?.meta ?? {};
  const totalPages = meta.lastPage ?? 1;

  // Handle View Details
  const handleViewDetails = (vital: any) => {
    setSelectedVital(vital);
    setShowDetails(true);
  };

  // Handle Create New Vitals
  const handleCreateNewVitals = () => {
    setIsEditing(false);
    setShowForm(true);
    resetForm();
  };

  // Handle Edit Vitals
  const handleEditVitals = (vital: any) => {
    setIsEditing(true);
    setShowForm(true);
    populateForm(vital);
  };

  // Populate form with vital data
  const populateForm = (vital: any) => {
    setFormData({
      patientId: vital.patient?.medicalRecordNumber || vital.patientId || "",
      name: vital.patient?.user?.fullName || "",
      id: vital.id || "",
      doctor: vital.recordedByUser?.fullName || vital.doctor || "",
      heightCm: vital.heightCm?.toString() || "",
      weightKg: vital.weightKg?.toString() || "",
      temperatureC: vital.temperatureC?.toString() || "",
      bloodPressureSystolic: vital.bloodPressureSystolic?.toString() || "",
      bloodPressureDiastolic: vital.bloodPressureDiastolic?.toString() || "",
      heartRateBpm: vital.heartRateBpm?.toString() || "",
      respiratoryRate: vital.respiratoryRate?.toString() || "",
      oxygenSaturation: vital.oxygenSaturation?.toString() || "",
      notes: vital.notes || "",
      appointmentId: vital.appointmentId || "",
    });
  };

  // Handle Input Changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Page Change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      refetch();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: createPatientVital,
    onSuccess: () => {
      toast({
        title: "Patient Vitals Created",
        description: "The vitals has been successfully added",
        variant: "success",
      });
      refetch();
      setShowForm(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create Patient Vitals",
        variant: "destructive",
      });
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updatePatientVital(id as any, payload),
    onSuccess: () => {
      toast({
        title: "Patient Vitals Updated",
        description: "The vital has been successfully updated.",
        variant: "success",
      });
      refetch();
      setShowForm(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update vital.",
        variant: "destructive",
      });
    },
  });

  // Reset Form
  const resetForm = () => {
    setFormData({
      patientId: "",
      heightCm: "",
      weightKg: "",
      temperatureC: "",
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      heartRateBpm: "",
      name: "",
      respiratoryRate: "",
      oxygenSaturation: "",
      notes: "",
      appointmentId: "",
      doctor: "",
      id: "",
    });
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      patientId: formData.patientId,
      heightCm: formData.heightCm ? parseFloat(formData.heightCm) : null,
      weightKg: formData.weightKg ? parseFloat(formData.weightKg) : null,
      temperatureC: formData.temperatureC
        ? parseFloat(formData.temperatureC)
        : null,
      bloodPressureSystolic: formData.bloodPressureSystolic
        ? parseInt(formData.bloodPressureSystolic)
        : null,
      bloodPressureDiastolic: formData.bloodPressureDiastolic
        ? parseInt(formData.bloodPressureDiastolic)
        : null,
      heartRateBpm: formData.heartRateBpm
        ? parseInt(formData.heartRateBpm)
        : null,
      respiratoryRate: formData.respiratoryRate
        ? parseInt(formData.respiratoryRate)
        : null,
      oxygenSaturation: formData.oxygenSaturation
        ? parseFloat(formData.oxygenSaturation)
        : null,
      notes: formData.notes,
      appointmentId: formData.appointmentId,
    };

    if (isEditing && formData.id) {
      updateMutation.mutate({ id: formData.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Format BMI interpretation
  const getBMIInterpretation = (bmi: number) => {
    if (!bmi) return "N/A";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  // Get blood pressure category
  const getBloodPressureCategory = (systolic: number, diastolic: number) => {
    if (!systolic || !diastolic) return "N/A";

    if (systolic < 120 && diastolic < 80) return "Normal";
    if (systolic < 130 && diastolic < 80) return "Elevated";
    if (systolic < 140 || diastolic < 90) return "High (Stage 1)";
    return "High (Stage 2)";
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
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Vitals Entries</h1>
                <p className="text-muted-foreground">
                  Manage patient vitals entries
                </p>
              </div>
              <Button
                onClick={handleCreateNewVitals}
                className="bg-gradient-primary hover:shadow-glow transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Vitals Entry
              </Button>
            </div>

            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients by name, ID, phone, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vitals List */}
            <div className="grid gap-4">
              {isLoadingVitals || isFetchingVitals ? (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Loading Vitals...
                </p>
              ) : vitals.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground text-sm">
                    No vitals entries found.
                  </p>
                </div>
              ) : (
                vitals.map((vital) => (
                  <Card
                    key={vital.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    // onClick={() => handleViewDetails(vital)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold">
                                {vital?.patient?.user?.fullName}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                ({vital?.patient?.medicalRecordNumber})
                              </span>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Recorded
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-muted-foreground" />
                              <span>{vital?.recordedByUser?.fullName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {new Date(vital.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Book className="h-4 w-4 text-muted-foreground" />
                              <span>{vital?.notes || "No notes"}</span>
                            </div>
                          </div>

                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground">
                              <strong>Height:</strong>{" "}
                              {vital?.heightCm || "N/A"} cm |
                              <strong> Weight:</strong>{" "}
                              {vital?.weightKg || "N/A"} kg |
                              <strong> BMI:</strong> {vital.bmi || "N/A"} |
                              <strong> Temp:</strong>{" "}
                              {vital?.temperatureC || "N/A"}°C
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditVitals(vital);
                            }}
                            className="bg-gradient-primary hover:shadow-glow transition-all"
                            size="sm"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(vital);
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Pagination */}
            {!isFetchingVitals && vitals.length > 0 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 && handlePageChange(currentPage - 1)
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => handlePageChange(i + 1)}
                          isActive={currentPage === i + 1}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages &&
                          handlePageChange(currentPage + 1)
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {/* Vitals Details Popup */}
            {showDetails && selectedVital && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <CardHeader className="border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Patient Vitals Details
                        </CardTitle>
                        <p className="text-muted-foreground mt-1">
                          Recorded on{" "}
                          {new Date(selectedVital.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDetails(false)}
                      >
                        Close
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Patient Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Patient Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">
                              Patient Name
                            </Label>
                            <p className="text-base">
                              {selectedVital.patient?.user?.fullName || "N/A"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Medical Record Number
                            </Label>
                            <p className="text-base">
                              {selectedVital.patient?.medicalRecordNumber ||
                                "N/A"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Recorded By
                            </Label>
                            <p className="text-base">
                              {selectedVital.recordedByUser?.fullName || "N/A"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Recorded At
                            </Label>
                            <p className="text-base">
                              {new Date(
                                selectedVital.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Vital Signs */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Vital Signs
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Height and Weight */}
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Ruler className="h-4 w-4 text-blue-500" />
                                <Label className="text-sm font-medium">
                                  Height
                                </Label>
                              </div>
                              <p className="text-2xl font-bold">
                                {selectedVital.heightCm || "N/A"}{" "}
                                <span className="text-sm font-normal">cm</span>
                              </p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Weight className="h-4 w-4 text-green-500" />
                                <Label className="text-sm font-medium">
                                  Weight
                                </Label>
                              </div>
                              <p className="text-2xl font-bold">
                                {selectedVital.weightKg || "N/A"}{" "}
                                <span className="text-sm font-normal">kg</span>
                              </p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Activity className="h-4 w-4 text-purple-500" />
                                <Label className="text-sm font-medium">
                                  BMI
                                </Label>
                              </div>
                              <p className="text-2xl font-bold">
                                {selectedVital.bmi || "N/A"}
                              </p>
                              {selectedVital.bmi && (
                                <p className="text-sm text-muted-foreground">
                                  {getBMIInterpretation(selectedVital.bmi)}
                                </p>
                              )}
                            </CardContent>
                          </Card>

                          {/* Temperature */}
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Thermometer className="h-4 w-4 text-red-500" />
                                <Label className="text-sm font-medium">
                                  Temperature
                                </Label>
                              </div>
                              <p className="text-2xl font-bold">
                                {selectedVital.temperatureC || "N/A"}{" "}
                                <span className="text-sm font-normal">°C</span>
                              </p>
                            </CardContent>
                          </Card>

                          {/* Heart Rate */}
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Heart className="h-4 w-4 text-pink-500" />
                                <Label className="text-sm font-medium">
                                  Heart Rate
                                </Label>
                              </div>
                              <p className="text-2xl font-bold">
                                {selectedVital.heartRateBpm || "N/A"}{" "}
                                <span className="text-sm font-normal">BPM</span>
                              </p>
                            </CardContent>
                          </Card>

                          {/* Blood Pressure */}
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Activity className="h-4 w-4 text-orange-500" />
                                <Label className="text-sm font-medium">
                                  Blood Pressure
                                </Label>
                              </div>
                              {selectedVital.bloodPressureSystolic &&
                              selectedVital.bloodPressureDiastolic ? (
                                <>
                                  <p className="text-2xl font-bold">
                                    {selectedVital.bloodPressureSystolic}/
                                    {selectedVital.bloodPressureDiastolic}
                                    <span className="text-sm font-normal">
                                      {" "}
                                      mmHg
                                    </span>
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {getBloodPressureCategory(
                                      selectedVital.bloodPressureSystolic,
                                      selectedVital.bloodPressureDiastolic
                                    )}
                                  </p>
                                </>
                              ) : (
                                <p className="text-2xl font-bold">N/A</p>
                              )}
                            </CardContent>
                          </Card>

                          {/* Respiratory Rate */}
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Wind className="h-4 w-4 text-cyan-500" />
                                <Label className="text-sm font-medium">
                                  Respiratory Rate
                                </Label>
                              </div>
                              <p className="text-2xl font-bold">
                                {selectedVital.respiratoryRate || "N/A"}{" "}
                                <span className="text-sm font-normal">
                                  breaths/min
                                </span>
                              </p>
                            </CardContent>
                          </Card>

                          {/* Oxygen Saturation */}
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Activity className="h-4 w-4 text-teal-500" />
                                <Label className="text-sm font-medium">
                                  Oxygen Saturation
                                </Label>
                              </div>
                              <p className="text-2xl font-bold">
                                {selectedVital.oxygenSaturation || "N/A"}{" "}
                                <span className="text-sm font-normal">%</span>
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Notes */}
                      {selectedVital.notes && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Book className="h-4 w-4" />
                            Clinical Notes
                          </h3>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm whitespace-pre-wrap">
                                {selectedVital.notes}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Vitals Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>
                      {isEditing ? "Edit Vital" : "Create New Vital"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="patientId">Patient ID *</Label>
                          <Input
                            readOnly
                            id="patientId"
                            placeholder="P001"
                            required
                            value={formData.patientId}
                            onChange={(e) =>
                              handleInputChange("patientId", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="patientName">Patient Name *</Label>
                          <Input
                            readOnly
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            id="patientName"
                            placeholder="John Smith"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="weightKg">weight (Kg) *</Label>
                          <Input
                            id="weightKg"
                            type="number"
                            required
                            value={formData.weightKg}
                            onChange={(e) =>
                              handleInputChange("weightKg", e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor="heightCm">Height (Cm) *</Label>
                          <Input
                            id="heightCm"
                            type="number"
                            required
                            value={formData.heightCm}
                            onChange={(e) =>
                              handleInputChange("heightCm", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="temperatureC">
                            temperature (C) *
                          </Label>
                          <Input
                            id="temperatureC"
                            type="number"
                            required
                            value={formData.temperatureC}
                            onChange={(e) =>
                              handleInputChange("temperatureC", e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor="bloodPressureSystolic">
                            Blood Pressure Systolic
                          </Label>
                          <Input
                            id="bloodPressureSystolic"
                            type="number"
                            value={formData.bloodPressureSystolic}
                            onChange={(e) =>
                              handleInputChange(
                                "bloodPressureSystolic",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor="heartRateBpm">Heart Rate (Bpm)</Label>
                          <Input
                            id="heartRateBpm"
                            type="number"
                            value={formData.heartRateBpm}
                            onChange={(e) =>
                              handleInputChange("heartRateBpm", e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor="respiratoryRate">
                            Respiratory Rate
                          </Label>
                          <Input
                            id="respiratoryRate"
                            type="number"
                            value={formData.respiratoryRate}
                            onChange={(e) =>
                              handleInputChange(
                                "respiratoryRate",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor="oxygenSaturation">
                            oxygen Saturation
                          </Label>
                          <Input
                            id="oxygenSaturation"
                            type="number"
                            value={formData.oxygenSaturation}
                            onChange={(e) =>
                              handleInputChange(
                                "oxygenSaturation",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor="weightKg">Doctor Name*</Label>
                          <Input
                            id="doctor"
                            type="text"
                            required
                            readOnly
                            value={formData.doctor}
                            onChange={(e) =>
                              handleInputChange("doctor", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Input
                          id="id"
                          type="hidden"
                          value={formData.id.toString()}
                          onChange={(e) =>
                            handleInputChange("id", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Enter notes..."
                          value={formData.notes}
                          onChange={(e) =>
                            handleInputChange("notes", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex justify-end gap-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowForm(false);
                            resetForm();
                            setIsEditing(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-gradient-primary hover:shadow-glow transition-all"
                          disabled={createMutation.isPending}
                        >
                          {createMutation.isPending
                            ? "Create Vital..."
                            : "Create Vital"}
                        </Button>
                      </div>{" "}
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
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
