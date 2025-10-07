import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Calendar,
  Clock,
  User,
  FileText,
  Filter,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sidebar } from "@/components/layout/Sidebar";
import { CONSULTATION_TYPES } from "@/constants/medical/consultation-types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { createConsultation, getConsultations } from "@/services/consultation";
import { fetchPatientByMRN } from "@/services/patient";
import { getAllDoctors } from "@/services/staff";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export default function Consultations() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [debouncedId, setDebouncedId] = useState("");
  const [doctors, setDoctors] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedConsultation, setSelectedConsultation] = useState<
    (typeof consultations)[0] | null
  >(null);
  const [showNewConsultationForm, setShowNewConsultationForm] = useState(false);

  // 🕒 Debounce logic: wait 500ms after typing stops
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page when new search
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);
  // Pagination handler
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      refetch();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const [formData, setFormData] = useState({
    patientId: "",
    consultBy: "",
    name: "",
    consultationType: "",
    date: "",
    time: "",
    complain: "",
    diagnosis: "",
    treatmentPlan: "",
    clinicalNotes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const { toast } = useToast();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createConsultation,
    onSuccess: () => {
      toast({
        title: "Consultation created Successfully",
        description: "New consultation has been added to the system",
        variant: "success",
      });
      navigate("/dashboard/consultations");
    },
    onError: (error: any) => {
      toast({
        title: "Consultation Failed",
        description: error.message || "Failed to create Consultation",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      patientId: patient.id,
      consultBy: formData.consultBy,
      name: formData.name,
      consultationType: formData.consultationType,
      date: formData.date,
      time: formData.time,
      complain: formData.complain,
      diagnosis: formData.diagnosis,
      treatmentPlan: formData.treatmentPlan,
      clinicalNotes: formData.clinicalNotes,
    };

    mutation.mutate(payload);
  };

  // debounce the ID to avoid multiple fetches while typing
  useEffect(() => {
    const handler = setTimeout(() => {
      if (formData.patientId) setDebouncedId(formData.patientId.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [formData.patientId]);

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

  const {
    data: consultationsData,
    isLoading: isLoadingConsultations,
    isFetching: isFetchingConsultation,
    refetch,
  } = useQuery({
    queryKey: ["consultations", currentPage, debouncedSearch],
    queryFn: () => getConsultations(currentPage, perPage, debouncedSearch),
  });
  const consultations = consultationsData?.consultations ?? [];
  const meta = consultationsData?.meta ?? {};
  const total = meta.total ?? 0;
  const perPage = meta.perPage ?? 10; // default to 10
  const totalPages = Math.ceil(total / perPage);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "in progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "emergency":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "follow-up":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "initial":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
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
                <h1 className="text-3xl font-bold">Medical Consultations</h1>
                <p className="text-muted-foreground">
                  Manage patient consultations and medical visits
                </p>
              </div>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Today's Consultations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    In Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    Currently active
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">9</div>
                  <p className="text-xs text-muted-foreground">
                    Average 45 min
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Emergency Cases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search consultations..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="initial">Initial</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="shrink-0"
                onClick={() => setShowNewConsultationForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Consultation
              </Button>
            </div>

            {/* Consultations List */}
            <div className="grid gap-4">
              {isLoadingConsultations || isFetchingConsultation ? (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Loading consultations...
                </p>
              ) : consultations.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground text-sm">
                    No consultations found.
                  </p>
                </div>
              ) : (
                consultations.map((consultation) => (
                  <Card
                    key={consultation.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {consultation.patient.user.fullName}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {consultation.prescriber.fullName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(consultation.date).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {consultation.time}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getStatusColor(
                              consultation?.status ?? "In Progress"
                            )}
                          >
                            {consultation?.status ?? "In Progress"}
                          </Badge>
                          <Badge
                            className={getTypeColor(
                              consultation.consultationType
                            )}
                          >
                            {consultation.consultationType}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-sm">
                            Chief Complaint:{" "}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {consultation.complain}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-sm">
                            Diagnosis:{" "}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {consultation.diagnosis}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs text-muted-foreground">
                            ID: {consultation.reference}
                          </span>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setSelectedConsultation(consultation)
                                  }
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Consultation Details -{" "}
                                    {
                                      selectedConsultation?.patient?.user
                                        .fullName
                                    }
                                  </DialogTitle>
                                  <DialogDescription>
                                    Consultation ID:{" "}
                                    {selectedConsultation?.reference}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedConsultation && (
                                  <Tabs
                                    defaultValue="overview"
                                    className="w-full"
                                  >
                                    <TabsList className="grid w-full grid-cols-3">
                                      <TabsTrigger value="overview">
                                        Overview
                                      </TabsTrigger>
                                      <TabsTrigger value="notes">
                                        Notes
                                      </TabsTrigger>
                                      <TabsTrigger value="treatment">
                                        Treatment
                                      </TabsTrigger>
                                    </TabsList>
                                    <TabsContent
                                      value="overview"
                                      className="space-y-4"
                                    >
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-sm font-medium">
                                            Patient
                                          </Label>
                                          <p className="text-sm text-muted-foreground">
                                            {
                                              selectedConsultation.patient.user
                                                .fullName
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">
                                            Doctor
                                          </Label>
                                          <p className="text-sm text-muted-foreground">
                                            {
                                              selectedConsultation.prescriber
                                                .fullName
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">
                                            Date & Time
                                          </Label>
                                          <p className="text-sm text-muted-foreground">
                                            {new Date(
                                              consultation.date
                                            ).toLocaleString()}
                                            at {""} {selectedConsultation.time}
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">
                                            Duration
                                          </Label>
                                          <p className="text-sm text-muted-foreground">
                                            {selectedConsultation.duration ??
                                              "Not applicable"}
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Chief Complaint
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedConsultation.complain}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Diagnosis
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedConsultation.diagnosis}
                                        </p>
                                      </div>
                                    </TabsContent>
                                    <TabsContent value="notes">
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Clinical Notes
                                        </Label>
                                        <p className="text-sm text-muted-foreground mt-2">
                                          {selectedConsultation.clinicalNotes}
                                        </p>
                                      </div>
                                    </TabsContent>
                                    <TabsContent value="treatment">
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Treatment Plan
                                        </Label>
                                        <p className="text-sm text-muted-foreground mt-2">
                                          {selectedConsultation.treatmentPlan}
                                        </p>
                                      </div>
                                    </TabsContent>
                                  </Tabs>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/*  */}
            {/* Pagination */}
            {!isLoadingConsultations && consultations.length > 0 && (
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

            {/* New Consultation Form Modal */}
            {showNewConsultationForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>New Consultation</CardTitle>
                    <CardDescription>
                      Create a new patient consultation record
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="consultationPatientId">
                            Patient ID *
                          </Label>
                          <Input
                            id="consultationPatientId"
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
                          <Label htmlFor="consultationPatientName">
                            Patient Name *
                          </Label>
                          <Input
                            readOnly
                            id="consultationPatientName"
                            placeholder="John Smith"
                            required
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="consultationDoctor">Doctor *</Label>
                          <Select
                            value={formData.consultBy.toString()}
                            onValueChange={(value) =>
                              setFormData({ ...formData, consultBy: value })
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
                                  key={doctor.id}
                                  value={doctor.id.toString()}
                                >
                                  {doctor?.user?.fullName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="consultationType">
                            Consultation Type *
                          </Label>
                          <Select
                            required={true}
                            value={formData.consultationType}
                            onValueChange={(value) =>
                              handleInputChange("consultationType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {CONSULTATION_TYPES.map((type) => (
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
                          <Label htmlFor="consultationDate">Date *</Label>
                          <Input
                            id="consultationDate"
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) =>
                              handleInputChange("date", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="consultationTime">Time *</Label>
                          <Input
                            id="consultationTime"
                            value={formData.time}
                            onChange={(e) =>
                              handleInputChange("time", e.target.value)
                            }
                            type="time"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="chiefComplaint">
                          Chief Complaint *
                        </Label>
                        <Textarea
                          id="chiefComplaint"
                          placeholder="Describe the patient's main complaint..."
                          required
                          value={formData.complain}
                          onChange={(e) =>
                            handleInputChange("complain", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="diagnosis">Diagnosis</Label>
                        <Textarea
                          id="diagnosis"
                          placeholder="Enter diagnosis..."
                          value={formData.diagnosis}
                          onChange={(e) =>
                            handleInputChange("diagnosis", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="treatment">Treatment Plan</Label>
                        <Textarea
                          id="treatment"
                          placeholder="Enter treatment plan..."
                          value={formData.treatmentPlan}
                          onChange={(e) =>
                            handleInputChange("treatmentPlan", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="consultationNotes">
                          Clinical Notes
                        </Label>
                        <Textarea
                          value={formData.clinicalNotes}
                          onChange={(e) =>
                            handleInputChange("clinicalNotes", e.target.value)
                          }
                          id="consultationNotes"
                          placeholder="Additional clinical notes..."
                        />
                      </div>

                      <div className="flex justify-end gap-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowNewConsultationForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-primary">
                          Create Consultation
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
