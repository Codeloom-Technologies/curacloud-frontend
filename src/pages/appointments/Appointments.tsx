import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  User,
  Stethoscope,
} from "lucide-react";
import { fetchPatients } from "@/services/patient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllDoctors } from "@/services/staff";
import {
  APPOINTMENT_PRIORITY,
  APPOINTMENT_TYPES,
} from "@/constants/medical/appointment-types";
import {
  createAppointments,
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { APPOINTMENT_STATUS } from "@/constants";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { useUserRole } from "@/hooks/useUserRole";

export default function Appointments() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [debouncedPatientSearch, setDebouncedPatientSearch] = useState("");
  const [doctorSearchQuery, setDoctorSearchQuery] = useState("");
  const [debouncedDoctorSearch, setDebouncedDoctorSearch] = useState("");
  const { isHealthcare, isAdmin, isReceptionist, isDoctor } = useUserRole();

  const showCreateAppointmentButton =
    isDoctor || isAdmin || isHealthcare || isReceptionist;

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    date: "",
    priority: "",
    type: "",
  });

  const perPage = 10;

  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientId: "",
    appointmentDate: "",
    appointmentTime: new Date().toTimeString().slice(0, 5),
    doctorId: "",
    reason: "",
    type: "",
    notes: "",
    priority: "",
    name: "",
  });

  // Debounce patient search for the booking form
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPatientSearch(patientSearchQuery.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [patientSearchQuery]);

  // Fetch patients for the booking form dropdown
  const {
    data: patientData,
    isLoading: isLoadingPatient,
    isFetching: isFetchingPatient,
  } = useQuery({
    queryKey: ["patients-search", debouncedPatientSearch],
    queryFn: () => fetchPatients(1, 50, debouncedPatientSearch),
    enabled: showBookingForm, // Only fetch when form is open
  });

  // In the handlePatientSelect function, update it to:
  const handlePatientSelect = (patientId: string) => {
    const patient = patientData?.patients?.find((p: any) => p.id === patientId);

    if (patient) {
      setSelectedPatient(patient);
      setFormData((prev) => ({
        ...prev,
        patientId: patient.id,
        name: patient.user?.fullName || "", // This will auto-populate the name
      }));
    }
  };

  // Debounce main search term
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Debounce doctor search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDoctorSearch(doctorSearchQuery.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [doctorSearchQuery]);

  // Fetch doctors with search
  const {
    data: doctorsData,
    isFetching: isFetchingDoctor,
    isLoading: isLoadingDoctor,
  } = useQuery({
    queryKey: ["getAllDoctors", debouncedDoctorSearch],
    queryFn: () => getAllDoctors(1, 50, debouncedDoctorSearch),
  });

  const doctors = doctorsData?.doctors || [];
  // Fetch appointments
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
    mutationFn: createAppointments,
    onSuccess: () => {
      toast({
        title: "Appointment Scheduled",
        description: "The appointment has been successfully scheduled",
        variant: "success",
      });
      setShowBookingForm(false);
      refetch();
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Appointments Failed",
        description: error.message || "Failed to create appointment",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      patientId: "",
      appointmentDate: "",
      appointmentTime: new Date().toTimeString().slice(0, 5),
      doctorId: "",
      reason: "",
      type: "",
      notes: "",
      priority: "",
      name: "",
    });
    setSelectedPatient(null);
    setPatientSearchQuery("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient) {
      toast({
        title: "Patient Required",
        description: "Please select a patient",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      patientId: selectedPatient.id,
      doctorId: formData.doctorId,
      name: formData.name,
      type: formData.type,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      reason: formData.reason,
      notes: formData.notes,
      priority: formData.priority,
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
      refetch();
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
      status: "checked-in",
    };
    updateStatusMutation.mutate({ id, payload });
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      status: "",
      date: "",
      priority: "",
      type: "",
    });
    setCurrentPage(1);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.toString().trim() !== "") {
        count++;
      }
    });
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "checked-in":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "in-progress":
        return "bg-green-100 text-green-800 border-green-200";
      case "waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-consultation":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "no-show":
        return "bg-red-100 text-red-800 border-red-200";
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Appointment Scheduling
                </h1>
                <p className="text-muted-foreground">
                  Manage and schedule patient appointments
                </p>
              </div>
              {showCreateAppointmentButton && (
                <Button
                  onClick={() => setShowBookingForm(true)}
                  className="bg-gradient-primary hover:shadow-glow transition-all"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              )}
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search appointments by patient name, ID, phone, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2 relative">
                        <Filter className="h-4 w-4" />
                        Filters
                        {activeFilterCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full px-1.5 py-0.5">
                            {activeFilterCount}
                          </span>
                        )}
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Filter Appointments</DialogTitle>
                      </DialogHeader>

                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                          <Label>Appointment Type</Label>
                          <Select
                            value={filters.type}
                            onValueChange={(val) =>
                              setFilters((f) => ({ ...f, type: val }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {APPOINTMENT_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Priority</Label>
                          <Select
                            value={filters.priority}
                            onValueChange={(val) =>
                              setFilters((f) => ({ ...f, priority: val }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              {APPOINTMENT_PRIORITY.map((priority) => (
                                <SelectItem key={priority} value={priority}>
                                  {priority}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Date From</Label>
                          <Input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) =>
                              setFilters((f) => ({
                                ...f,
                                startDate: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <Label>Date To</Label>
                          <Input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) =>
                              setFilters((f) => ({
                                ...f,
                                endDate: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <Label>Status</Label>
                          <Select
                            value={filters.status}
                            onValueChange={(val) =>
                              setFilters((f) => ({ ...f, status: val }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {APPOINTMENT_STATUS.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Specific Date</Label>
                          <Input
                            type="date"
                            value={filters.date}
                            onChange={(e) =>
                              setFilters((f) => ({
                                ...f,
                                date: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={handleClearFilters}>
                          Clear Filters
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentPage(1);
                            refetch();
                            setIsFilterOpen(false);
                          }}
                        >
                          Apply Filters
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                                (
                                {
                                  appointment?.patient?.patientProvider[0]
                                    ?.medicalRecordNumber
                                }
                                )
                              </span>
                            </div>
                            <Badge
                              className={getStatusColor(appointment.status)}
                            >
                              {appointment?.status.charAt(0).toUpperCase() +
                                appointment?.status?.slice(1)}
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
                          {appointment.status === "scheduled" && (
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                          )}

                          {appointment.status === "scheduled" && (
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
                                : "Check-in"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

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

            {/* Booking Form Modal */}
            {showBookingForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>Schedule New Appointment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-4">
                        {/* Patient Selection */}
                        <div className="space-y-2">
                          <Label htmlFor="patient">Patient *</Label>

                          {/* Selected Patient Display */}
                          {selectedPatient && (
                            <div className="p-3 rounded-md  bg-green-50 border border-green-200">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-green-800">
                                    {selectedPatient.user?.fullName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    MRN:{" "}
                                    {
                                      selectedPatient?.patientProvider[0]
                                        ?.medicalRecordNumber
                                    }
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedPatient(null);
                                    setFormData((prev) => ({
                                      ...prev,
                                      patientId: "",
                                      name: "",
                                    }));
                                  }}
                                >
                                  Change
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Patient Search and Select */}
                          {!selectedPatient && (
                            <>
                              <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Search patients by name or MRN..."
                                  className="pl-10"
                                  value={patientSearchQuery}
                                  onChange={(e) =>
                                    setPatientSearchQuery(e.target.value)
                                  }
                                />
                              </div>

                              {/* Patient List */}
                              <div className="max-h-48 overflow-y-auto border rounded-md">
                                {(isLoadingPatient || isFetchingPatient) && (
                                  <div className="p-4 text-center text-sm text-muted-foreground">
                                    Loading patients...
                                  </div>
                                )}

                                {!isLoadingPatient &&
                                  !isFetchingPatient &&
                                  patientData?.patients?.length === 0 && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                      No patients found
                                    </div>
                                  )}

                                {patientData?.patients?.map((patient: any) => (
                                  <div
                                    key={patient.id}
                                    className="p-3 border-b last:border-b-0 hover:bg-muted cursor-pointer"
                                    onClick={() =>
                                      handlePatientSelect(patient.id)
                                    }
                                  >
                                    <div className="flex justify-between items-start">
                                      <span className="font-medium">
                                        {patient.user?.fullName}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                                      <span>
                                        MRN:{" "}
                                        {
                                          patient?.patientProvider[0]
                                            ?.medicalRecordNumber
                                        }
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="patientName">Patient Name *</Label>
                            <Input
                              id="patientName"
                              placeholder="John Smith"
                              required
                              value={formData.name}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                              readOnly={!!selectedPatient} // Make it read-only when patient is selected
                              className={selectedPatient ? "bg-muted" : ""} // Visual feedback
                            />
                            {selectedPatient && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Name auto-filled from selected patient
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="doctor">Doctor *</Label>
                            <Select
                              value={formData.doctorId}
                              onValueChange={(value) =>
                                handleInputChange("doctorId", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    isFetchingDoctor || isLoadingDoctor
                                      ? "Loading..."
                                      : "Select Doctor"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {/* Search Input inside dropdown */}
                                <div className="p-2 border-b">
                                  <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      placeholder="Search doctors..."
                                      className="pl-8"
                                      value={doctorSearchQuery}
                                      onChange={(e) =>
                                        setDoctorSearchQuery(e.target.value)
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                </div>

                                {/* Loading State */}
                                {(isFetchingDoctor || isLoadingDoctor) && (
                                  <div className="p-4 text-center text-sm text-muted-foreground">
                                    Loading doctors...
                                  </div>
                                )}

                                {/* No Results */}
                                {!isFetchingDoctor &&
                                  !isLoadingDoctor &&
                                  doctors.length === 0 && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                      No doctors found
                                    </div>
                                  )}

                                {/* Doctors List */}
                                {doctors.map((doctor: any) => (
                                  <SelectItem
                                    key={doctor.user.id}
                                    value={doctor.user.id.toString()}
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {doctor.user?.fullName}
                                      </span>
                                      {doctor.user?.email && (
                                        <span className="text-xs text-muted-foreground">
                                          {doctor.user.email}
                                        </span>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="appointmentType">
                              Appointment Type *
                            </Label>
                            <Select
                              value={formData.type}
                              onValueChange={(value) =>
                                handleInputChange("type", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {APPOINTMENT_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                              value={formData.priority}
                              onValueChange={(value) =>
                                handleInputChange("priority", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Priority" />
                              </SelectTrigger>
                              <SelectContent>
                                {APPOINTMENT_PRIORITY.map((priority) => (
                                  <SelectItem key={priority} value={priority}>
                                    {priority}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="appointmentDate">Date *</Label>
                            <Input
                              id="appointmentDate"
                              type="date"
                              required
                              value={formData.appointmentDate}
                              onChange={(e) =>
                                handleInputChange(
                                  "appointmentDate",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="appointmentTime">Time *</Label>
                            <br />
                            <TimePicker
                              onChange={(value: string) =>
                                handleInputChange("appointmentTime", value)
                              }
                              value={formData.appointmentTime}
                              disableClock
                              format="hh:mm a"
                              clearIcon={null}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="reason">Reason for Visit *</Label>
                          <Textarea
                            value={formData.reason}
                            onChange={(e) =>
                              handleInputChange("reason", e.target.value)
                            }
                            id="reason"
                            placeholder="Describe the reason for the appointment..."
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea
                            value={formData.notes}
                            onChange={(e) =>
                              handleInputChange("notes", e.target.value)
                            }
                            id="notes"
                            placeholder="Add additional notes for the appointment..."
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowBookingForm(false);
                            resetForm();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-gradient-primary hover:shadow-glow transition-all"
                          disabled={mutation.isPending || !selectedPatient}
                        >
                          {mutation.isPending
                            ? "Scheduling..."
                            : "Schedule Appointment"}
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
