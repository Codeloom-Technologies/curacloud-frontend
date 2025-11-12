import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Calendar,
  User,
  Pill,
  AlertTriangle,
  Eye,
  Edit,
  Check,
  X,
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sidebar } from "@/components/layout/Sidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  createPrescription,
  getPrescriptions,
  getPrescriptionStats,
} from "@/services/prescription";
import { getAllDoctors } from "@/services/staff";
import { fetchPatientByMRN } from "@/services/patient";
import { FREQUENCY_OPTIONS } from "@/constants/medical/prescription";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface MedicationItem {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function Prescriptions() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [doctors, setDoctors] = useState<any>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  // const [typeFilter, setTypeFilter] = useState("");
  const [debouncedId, setDebouncedId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showNewPrescriptionForm, setShowNewPrescriptionForm] = useState(false);

  // Updated form state to handle multiple medications
  const [formData, setFormData] = useState({
    patientId: "",
    prescripBy: "",
    name: "",
    notes: "",
  });

  const [medications, setMedications] = useState<MedicationItem[]>([
    {
      medicationName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMedicationChange = (
    index: number,
    field: keyof MedicationItem,
    value: string
  ) => {
    setMedications((prev) =>
      prev.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    );
  };

  const addMedication = () => {
    setMedications((prev) => [
      ...prev,
      {
        medicationName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications((prev) => prev.filter((_, i) => i !== index));
    } else {
      toast({
        title: "Cannot remove",
        description: "At least one medication is required",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: "",
      prescripBy: "",
      name: "",
      notes: "",
    });
    setMedications([
      {
        medicationName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };

  const mutation = useMutation({
    mutationFn: createPrescription,
    onSuccess: () => {
      toast({
        title: "Prescription created Successfully",
        description: "New prescription has been added to the system",
        variant: "success",
      });
      resetForm();
      setShowNewPrescriptionForm(false);
      navigate("/dashboard/prescriptions");
    },
    onError: (error: any) => {
      toast({
        title: "Prescription Failed",
        description: error.message || "Failed to create Prescription",
        variant: "destructive",
      });
    },
  });

  const {
    data: doctorsData,
    isFetching: isFetchingDoctor,
    isLoading: isLoadingDoctor,
  } = useQuery({
    queryKey: ["getAllDoctors"],
    queryFn: () => getAllDoctors(),
  });

  const {
    data: prescriptionsData,
    isLoading: isLoadingPrescriptions,
    isFetching: isFetchingPrescriptions,
    refetch,
  } = useQuery({
    queryKey: ["prescriptions", currentPage, debouncedSearch, statusFilter],
    queryFn: () =>
      getPrescriptions(currentPage, 10, debouncedSearch, statusFilter),
  });
  const prescriptions = prescriptionsData?.prescriptions ?? [];

  const meta = prescriptionsData?.meta ?? {};
  const totalPages = meta?.lastPage ?? 1;

  useEffect(() => {
    if (doctorsData) {
      setDoctors(doctorsData.doctors);
    }
  }, [doctorsData]);

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
    if (patient?.user?.fullName && !isFetching) {
      handleInputChange("name", patient.user.fullName);
    }
  }, [patient, isFetching]);

  // Reset or fill name when data/error changes
  useEffect(() => {
    if (isError || !patient) {
      handleInputChange("name", ""); // clear name
    } else if (patient?.user?.fullName) {
      handleInputChange("name", patient.user.fullName); // prefill name
    }
  }, [isError, patient]);

  // 🕒 Debounce logic: wait 500ms after typing stops
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page when new search
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data: statsData,
    isLoading: isLoadingStats,
    isFetching: isFetchingStats,
  } = useQuery({
    queryKey: ["prescription-stats"],
    queryFn: () => getPrescriptionStats(),
  });

  // Pagination handler
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // No need to call refetch() here if you're using react-query with proper query keys
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate medications
    const hasEmptyMedications = medications.some(
      (med) =>
        !med.medicationName || !med.dosage || !med.frequency || !med.duration
    );

    if (hasEmptyMedications) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields for all medications",
        variant: "destructive",
      });
      return;
    }

    const payload: any = {
      patientId: patient?.id,
      prescribedBy: formData.prescripBy,
      prescriptions: medications,
      notes: formData.notes,
    };

    mutation.mutate(payload);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "dispensed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "expired":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
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
                <h1 className="text-3xl font-bold">Prescriptions</h1>
                <p className="text-muted-foreground">
                  Manage patient prescriptions and medications
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Prescriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats && isFetchingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData?.total || 0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">+12 this week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Prescriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats && isFetchingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData?.active || 0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">+12 this week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Approval
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats && isFetchingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData?.pending || 0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting review
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Dispensed Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats && isFetchingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData?.dispensedToday || 0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pharmacy fulfilled
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Expiring Soon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center">
                    {isLoadingStats && isFetchingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData?.expiringSoon || 0
                    )}{" "}
                    <AlertTriangle className="h-4 w-4 ml-2 text-yellow-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">Next 7 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search prescriptions or medications..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="dispensed">Dispensed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="shrink-0"
                onClick={() => setShowNewPrescriptionForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Prescription
              </Button>
            </div>

            {/* Prescriptions List */}
            <div className="grid gap-4">
              {isLoadingPrescriptions || isFetchingPrescriptions ? (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Loading Prescriptions...
                </p>
              ) : prescriptions.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground text-sm">
                    No Prescriptions found.
                  </p>
                </div>
              ) : (
                prescriptions?.map((prescription) => (
                  <Card
                    key={prescription.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {prescription?.patient?.user?.fullName}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {prescription?.prescriber?.fullName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(
                                prescription?.createdAt
                              ).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Pill className="h-4 w-4" />
                              {prescription?.items?.length} medication
                              {prescription?.items?.length > 1 ? "s" : ""}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getStatusColor(prescription?.status)}
                          >
                            {prescription?.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Medications Preview */}
                        <div>
                          <span className="font-medium text-sm">
                            Medications:
                          </span>
                          <div className="mt-2 space-y-1">
                            {prescription?.items
                              ?.slice(0, 2)
                              ?.map((item, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-muted-foreground bg-muted/50 p-2 rounded"
                                >
                                  <span className="font-medium">
                                    {item?.medicationName} {item?.dosage}
                                  </span>{" "}
                                  - {item?.frequency}
                                </div>
                              ))}
                            {prescription?.items?.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{prescription?.items?.length - 2} more
                                medication
                                {prescription?.items?.length > 3 ? "s" : ""}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs text-muted-foreground">
                            ID: {prescription?.reference}
                          </span>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setSelectedPrescription(prescription)
                                  }
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    Prescription Details -{" "}
                                    {
                                      selectedPrescription?.patient?.user
                                        ?.fullName
                                    }
                                  </DialogTitle>
                                  <DialogDescription>
                                    Prescription ID: {selectedPrescription?.id}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedPrescription && (
                                  <Tabs
                                    defaultValue="medications"
                                    className="w-full"
                                  >
                                    <TabsList className="grid w-full grid-cols-3">
                                      <TabsTrigger value="medications">
                                        Medications
                                      </TabsTrigger>
                                      <TabsTrigger value="details">
                                        Details
                                      </TabsTrigger>
                                      <TabsTrigger value="history">
                                        History
                                      </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="medications">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Medication</TableHead>
                                            <TableHead>Dosage</TableHead>
                                            <TableHead>Frequency</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Instructions</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {selectedPrescription.items.map(
                                            (item, index) => (
                                              <TableRow key={index}>
                                                <TableCell className="font-medium">
                                                  {item.medicationName}
                                                </TableCell>
                                                <TableCell>
                                                  {item.dosage}
                                                </TableCell>
                                                <TableCell>
                                                  {item.frequency}
                                                </TableCell>
                                                <TableCell>
                                                  {item.duration}
                                                </TableCell>
                                                <TableCell>
                                                  {item.instructions}
                                                </TableCell>
                                              </TableRow>
                                            )
                                          )}
                                        </TableBody>
                                      </Table>
                                    </TabsContent>
                                    <TabsContent
                                      value="details"
                                      className="space-y-4"
                                    >
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-sm font-medium">
                                            Patient
                                          </Label>
                                          <p className="text-sm text-muted-foreground">
                                            {
                                              selectedPrescription?.patient
                                                ?.user?.fullName
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">
                                            Doctor
                                          </Label>
                                          <p className="text-sm text-muted-foreground">
                                            {
                                              selectedPrescription?.prescriber
                                                ?.fullName
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">
                                            Date Prescribed
                                          </Label>
                                          <p className="text-sm text-muted-foreground">
                                            {new Date(
                                              selectedPrescription.createdAt
                                            ).toLocaleDateString()}
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">
                                            Status
                                          </Label>
                                          <Badge
                                            className={getStatusColor(
                                              selectedPrescription.status
                                            )}
                                          >
                                            {selectedPrescription.status}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Notes
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedPrescription?.notes ||
                                            "No additional notes"}
                                        </p>
                                      </div>
                                    </TabsContent>
                                    <TabsContent value="history">
                                      <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                          <div>
                                            <p className="font-medium text-sm">
                                              Prescription Created
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              {new Date(
                                                selectedPrescription.createdAt
                                              ).toLocaleDateString()}
                                            </p>
                                          </div>
                                          <Check className="h-4 w-4 text-green-600" />
                                        </div>
                                      </div>
                                    </TabsContent>
                                  </Tabs>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}{" "}
              {/* Pagination */}
              {!isFetchingPrescriptions && !isLoadingPrescriptions && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
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
            </div>

            {/* New Prescription Form Modal */}
            {showNewPrescriptionForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>New Prescription</CardTitle>
                    <CardDescription>
                      Create a new prescription for a patient
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      {/* Patient Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="prescriptionPatientId">
                            Patient ID *
                          </Label>
                          <Input
                            id="prescriptionPatientId"
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
                              Patient found
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="prescriptionPatientName">
                            Patient Name *
                          </Label>
                          <Input
                            id="prescriptionPatientName"
                            placeholder="John Smith"
                            required
                            readOnly
                            value={formData.name}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="prescriptionDoctor">
                          Prescribing Doctor *
                        </Label>
                        <Select
                          value={formData.prescripBy}
                          onValueChange={(value) =>
                            setFormData({ ...formData, prescripBy: value })
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

                      {/* Medications Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-semibold">
                            Medications
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addMedication}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Medication
                          </Button>
                        </div>

                        {medications.map((medication, index) => (
                          <div
                            key={index}
                            className="border rounded-lg p-4 space-y-4 relative"
                          >
                            {medications.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                onClick={() => removeMedication(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`medicationName-${index}`}>
                                  Medication Name *
                                </Label>
                                <Input
                                  id={`medicationName-${index}`}
                                  placeholder="Lisinopril"
                                  required
                                  value={medication.medicationName}
                                  onChange={(e) =>
                                    handleMedicationChange(
                                      index,
                                      "medicationName",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor={`dosage-${index}`}>
                                  Dosage *
                                </Label>
                                <Input
                                  id={`dosage-${index}`}
                                  placeholder="10mg"
                                  required
                                  value={medication.dosage}
                                  onChange={(e) =>
                                    handleMedicationChange(
                                      index,
                                      "dosage",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`frequency-${index}`}>
                                  Frequency *
                                </Label>
                                <Select
                                  value={medication.frequency}
                                  onValueChange={(value) =>
                                    handleMedicationChange(
                                      index,
                                      "frequency",
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {FREQUENCY_OPTIONS.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor={`duration-${index}`}>
                                  Duration *
                                </Label>
                                <Input
                                  id={`duration-${index}`}
                                  placeholder="30 days"
                                  required
                                  value={medication.duration}
                                  onChange={(e) =>
                                    handleMedicationChange(
                                      index,
                                      "duration",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor={`instructions-${index}`}>
                                Instructions
                              </Label>
                              <Textarea
                                id={`instructions-${index}`}
                                placeholder="Take with food..."
                                value={medication.instructions}
                                onChange={(e) =>
                                  handleMedicationChange(
                                    index,
                                    "instructions",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Additional Notes */}
                      <div>
                        <Label htmlFor="prescriptionNotes">
                          Additional Notes
                        </Label>
                        <Textarea
                          id="prescriptionNotes"
                          placeholder="Any additional notes or warnings..."
                          value={formData.notes}
                          onChange={(e) =>
                            handleInputChange("notes", e.target.value)
                          }
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowNewPrescriptionForm(false);
                            resetForm();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-gradient-primary"
                          disabled={mutation.isPending}
                        >
                          {mutation.isPending
                            ? "Creating..."
                            : "Create Prescription"}
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
