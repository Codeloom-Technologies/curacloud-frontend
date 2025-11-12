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
import { fetchPatientByMRN } from "@/services/patient";
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

export default function Appointments() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  const [debouncedId, setDebouncedId] = useState("");
  const [doctors, setDoctors] = useState<any>([]);

  const [formData, setFormData] = useState({
    patientId: "",
    appointmentDate: "",
    appointmentTime: new Date().toTimeString().slice(0, 5), // "HH:mm"
    doctorId: "",
    reason: "",
    type: "",
    notes: "",
    priority: "",
    name: "",
  });

  // fetch patient details
  const {
    data: patient,
    isFetching,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["fetchPatientByMRN", debouncedId],
    queryFn: () => fetchPatientByMRN(debouncedId),
    enabled: !!debouncedId,
  });

  // auto-fill the name once data is fetched
  useEffect(() => {
    if (patient?.user.fullName && !isFetching) {
      handleInputChange("name", patient.user.fullName);
    }
  }, [patient, isFetching]);

  // Reset or fill name when data/error changes
  useEffect(() => {
    if (isError || !patient) {
      handleInputChange("name", ""); // clear name
    } else if (patient?.fullName) {
      handleInputChange("name", patient.fullName); // prefill name
    }
  }, [isError, patient]);

  // debounce the ID to avoid multiple fetches while typing
  useEffect(() => {
    const handler = setTimeout(() => {
      if (formData.patientId) setDebouncedId(formData.patientId.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [formData.patientId]);

  const {
    data: doctorsData,
    isFetching: isFetchingDoctor,
    isLoading: isLoadingDoctor,
  } = useQuery({
    queryKey: ["getAllDoctors"],
    queryFn: () => getAllDoctors(),
  });

  useEffect(() => {
    if (doctorsData) {
      setDoctors(doctorsData.doctors);
    }
  }, [doctorsData]);

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
    mutationFn: createAppointments,
    onSuccess: () => {
      toast({
        title: "Appointment Scheduled",
        description: "The appointment has been successfully scheduled",
        variant: "success",
      });
      navigate("/dashboard/appointments");
    },
    onError: (error: any) => {
      toast({
        title: "Appointments Failed",
        description: error.message || "Failed to create appointment",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      patientId: patient.id,
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
      navigate("/dashboard/appointments");
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
      status: "Checked-in",
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
    refetch(); // refresh patients
    setIsFilterOpen(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (
        (typeof value === "string" && value.trim() !== "") ||
        (typeof value === "boolean" && value === true)
      ) {
        count++;
      }
    });
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

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
      case "Waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "In-consultation":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "No-show":
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
                  Appointment Scheduling{" "}
                </h1>
                <p className="text-muted-foreground">
                  Manage and schedule patient appointments
                </p>
              </div>
              <Button
                onClick={() => setShowBookingForm(true)}
                className="bg-gradient-primary hover:shadow-glow transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
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
                          <div>
                            <Select
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
                          <Label>Date</Label>
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
                          {/* {appointment.status === "Scheduled" && (
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          )} */}

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
                    <CardTitle>Schedule New Appointment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="patientId">Patient ID *</Label>
                          <Input
                            id="patientId"
                            placeholder="P001"
                            required
                            value={formData.patientId}
                            onChange={(e) =>
                              handleInputChange("patientId", e.target.value)
                            }
                          />
                          {isFetching && (
                            <p className="text-xs text-blue-500 mt-1 animate-pulse">
                              Fetching patient info...
                            </p>
                          )}

                          {isError && (
                            <p className="text-xs text-red-500 mt-1">
                              Unable to fetch patient info
                            </p>
                          )}

                          {isSuccess && (
                            <p className="text-xs text-green-500 mt-1">
                              Success
                            </p>
                          )}
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
                          <Label htmlFor="doctor">Doctor *</Label>
                          <Select
                            value={formData.doctorId.toString()}
                            onValueChange={(value) =>
                              setFormData({ ...formData, doctorId: value })
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
                              {doctors?.map((doctor) => (
                                <SelectItem
                                  key={doctor.user.id}
                                  value={doctor?.user.id.toString()}
                                >
                                  {doctor?.user?.fullName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
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
                          {/* <Input
                            id="appointmentTime"
                            type="time"
                            
                            required
                            value={formData.appointmentTime}
                            
                            onChange={(e) =>
                              handleInputChange(
                                "appointmentTime",
                                e.target.value
                              )
                            }
                          /> 
                          */}
                          <br />
                          <TimePicker
                            // className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
                        <Label htmlFor="reason">Notes</Label>
                        <Textarea
                          value={formData.notes}
                          onChange={(e) =>
                            handleInputChange("notes", e.target.value)
                          }
                          id="notes"
                          placeholder="Add additional notes for the appointment..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          required
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
