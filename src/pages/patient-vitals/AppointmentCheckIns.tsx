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
import { Calendar, Clock, Plus, Search, User, Stethoscope } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchAppointments,
  updateAppointmentStatus,
} from "@/services/appointment";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { createPatientVital } from "@/services/patient-vital";

export default function AppointmentCheckIns() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "Checked-in",
    date: "",
    priority: "",
    type: "",
  });

  const perPage = 10;

  const { toast } = useToast();
  const navigate = useNavigate();

  const [debouncedId, setDebouncedId] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const [formData, setFormData] = useState({
    patientId: "",
    heightCm: "",
    weightKg: "", // "HH:mm"
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
  });

  // debounce the ID to avoid multiple fetches while typing
  useEffect(() => {
    const handler = setTimeout(() => {
      if (formData.patientId) setDebouncedId(formData.patientId.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [formData.patientId]);

  // Debounce search term (wait 400ms after user stops typing)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // React Query handles pagination + search refetch
  const {
    data,
    isLoading: isLoadingAppointments,
    isFetching: isFetchingAppointments,
    refetch,
  } = useQuery({
    queryKey: ["appointments", currentPage, debouncedSearch, filters],
    queryFn: () =>
      fetchAppointments(currentPage, perPage, debouncedSearch, filters),
  });

  const appointments = data?.appointments ?? [];

  const meta = data?.meta ?? {};
  const totalPages = meta.lastPage ?? 1;

  const handleCreateVitalsClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowBookingForm(true);

    // Auto-populate patient data from the appointment
    setFormData((prev) => ({
      ...prev,
      patientId: appointment.patient?.medicalRecordNumber || "",
      name: appointment.patient?.user?.fullName || "",
      appointmentId: appointment?.id || "",
      doctor: appointment?.doctor?.fullName || "",
    }));
  };

  /* ============================
   * HANDLE ON CHANGE EVENT
  ================================
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      refetch();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const mutation = useMutation({
    mutationFn: createPatientVital,
    onSuccess: () => {
      toast({
        title: "Patient Vitals",
        description: "The vitals has been successfully added",
        variant: "success",
      });
      refetch();

      setFormData({
        patientId: "",
        heightCm: "",
        weightKg: "", // "HH:mm"
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
      });

      navigate("/dashboard/appointment-check-ins");
    },
    onError: (error: any) => {
      toast({
        title: "Patient Vitals Failed",
        description: error.message || "Failed to create Patient Vitals",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      patientId: formData.patientId,
      name: formData.name,
      bloodPressureDiastolic: formData.bloodPressureDiastolic,
      heightCm: formData.heightCm,
      temperatureC: formData.temperatureC,
      bloodPressureSystolic: formData.bloodPressureSystolic,
      notes: formData.notes,
      oxygenSaturation: formData.oxygenSaturation,
      weightKg: formData.weightKg,
      appointmentId: formData.appointmentId,
      doctor: formData.doctor,
    };

    mutation.mutate(payload);
  };

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateAppointmentStatus(id as any, payload),
    onSuccess: () => {
      toast({
        title: "Appointment Updated",
        description: "The appointment has been successfully updated.",
        variant: "success",
      });

      navigate("/dashboard/appointment-check-ins");
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update appointment.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateAppointmentStatus = (id: number) => {
    const payload = {
      status: "Waiting",
    };
    updateStatusMutation.mutate({ id, payload });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Checked-in":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "In-progress":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
                <h1 className="text-3xl font-bold">Patient Vitals</h1>
                <p className="text-muted-foreground">Manage patient vitals</p>
              </div>
              {/* <Button
                onClick={() => setShowBookingForm(true)}
                className="bg-gradient-primary hover:shadow-glow transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Vitals
              </Button> */}
            </div>

            {/* Search and Filters */}
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

            {/* Appointments List */}
            <div className="grid gap-4">
              {isLoadingAppointments || isFetchingAppointments ? (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Loading Appointments...
                </p>
              ) : appointments.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground text-sm">
                    No appointments found.
                  </p>
                </div>
              ) : (
                appointments.map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold">
                                {appointment?.patient?.user?.fullName}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                ({appointment?.patient?.medicalRecordNumber})
                              </span>
                            </div>
                            <Badge
                              className={getStatusColor(appointment.status)}
                            >
                              {appointment.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment?.doctor?.fullName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment.appointmentDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment.appointmentTime}</span>
                            </div>
                          </div>

                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground">
                              <strong>Department:</strong> Not Available |
                              <strong> Type:</strong> {appointment.type} |
                              <strong> priority:</strong> {appointment.priority}{" "}
                              |<strong> Reason:</strong> {appointment.reason}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {appointment.status === "Scheduled" && (
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          )}

                          {appointment.status === "Scheduled" && (
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                          )}

                          {appointment.status === "Scheduled" && (
                            <Button
                              disabled={updateStatusMutation.isPending}
                              onClick={() =>
                                handleUpdateAppointmentStatus(appointment.id)
                              }
                              size="sm"
                              className="bg-gradient-primary"
                            >
                              {updateStatusMutation.isPending
                                ? "Check-in..."
                                : " Check-in"}
                            </Button>
                          )}

                          <Button
                            onClick={() => handleCreateVitalsClick(appointment)}
                            className="bg-gradient-primary hover:shadow-glow transition-all"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Vitals
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/*  */}
            {/* Pagination */}
            {!isFetchingAppointments && appointments.length > 0 && (
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

            {/*  */}

            {/* Booking Form Modal */}
            {showBookingForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>Create New Vital</CardTitle>
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
                          id="appointmentId"
                          type="hidden"
                          value={formData.appointmentId}
                          onChange={(e) =>
                            handleInputChange("appointmentId", e.target.value)
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
                          onClick={() => setShowBookingForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-gradient-primary hover:shadow-glow transition-all"
                          disabled={mutation.isPending}
                        >
                          {mutation.isPending
                            ? "Create Vital..."
                            : "Create Vital"}
                        </Button>
                      </div>
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
