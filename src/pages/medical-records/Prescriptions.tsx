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
import { createPrescription, getPrescriptions } from "@/services/prescription";
import { getAllDoctors } from "@/services/staff";
import { fetchPatientByMRN } from "@/services/patient";
import { FREQUENCY_OPTIONS } from "@/constants/medical/prescription";

// Sample prescription data
// const prescriptions = [
//   {
//     id: "RX001",
//     patientName: "Sarah Johnson",
//     patientId: "P001",
//     doctorName: "Dr. Michael Chen",
//     date: "2024-01-15",
//     status: "Active",
//     medications: [
//       {
//         name: "Lisinopril",
//         dosage: "10mg",
//         frequency: "Once daily",
//         duration: "30 days",
//         instructions: "Take with or without food",
//         quantity: 30,
//       },
//       {
//         name: "Metformin",
//         dosage: "500mg",
//         frequency: "Twice daily",
//         duration: "90 days",
//         instructions: "Take with meals",
//         quantity: 180,
//       },
//     ],
//     diagnosis: "Hypertension, Type 2 Diabetes",
//     notes: "Monitor blood pressure and glucose levels",
//     refillsRemaining: 2,
//   },
//   {
//     id: "RX002",
//     patientName: "Robert Wilson",
//     patientId: "P002",
//     doctorName: "Dr. Emily Rodriguez",
//     date: "2024-01-14",
//     status: "Pending",
//     medications: [
//       {
//         name: "Ibuprofen",
//         dosage: "400mg",
//         frequency: "Every 6 hours as needed",
//         duration: "7 days",
//         instructions: "Take with food to reduce stomach irritation",
//         quantity: 28,
//       },
//     ],
//     diagnosis: "Chronic headaches",
//     notes: "Pending MRI results before long-term treatment",
//     refillsRemaining: 0,
//   },
//   {
//     id: "RX003",
//     patientName: "Maria Garcia",
//     patientId: "P003",
//     doctorName: "Dr. James Thompson",
//     date: "2024-01-13",
//     status: "Dispensed",
//     medications: [
//       {
//         name: "Amoxicillin",
//         dosage: "500mg",
//         frequency: "Three times daily",
//         duration: "10 days",
//         instructions: "Complete full course even if feeling better",
//         quantity: 30,
//       },
//       {
//         name: "Acetaminophen",
//         dosage: "500mg",
//         frequency: "Every 4-6 hours as needed",
//         duration: "As needed",
//         instructions: "Do not exceed 3000mg in 24 hours",
//         quantity: 60,
//       },
//     ],
//     diagnosis: "Post-operative infection prevention",
//     notes: "Post-appendectomy care",
//     refillsRemaining: 0,
//   },
// ];

export default function Prescriptions() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState<
    (typeof prescriptions)[0] | null
  >(null);
  const [doctors, setDoctors] = useState<any>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [typeFilter, setTypeFilter] = useState("all");
  const [debouncedId, setDebouncedId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showNewPrescriptionForm, setShowNewPrescriptionForm] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    prescripBy: "",
    name: "",
    medicationName: "",
    frequency: "",
    dosage: "",
    duration: "",
    instructions: "",
    notes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const mutation = useMutation({
    mutationFn: createPrescription,
    onSuccess: () => {
      toast({
        title: "Prescription created Successfully",
        description: "New prescription has been added to the system",
        variant: "success",
      });
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
    queryKey: ["prescriptions", currentPage, debouncedSearch],
    queryFn: () => getPrescriptions(currentPage, perPage, debouncedSearch),
  });
  const prescriptions = prescriptionsData?.["prescriptions"] ?? [];

  // console.log({ prescriptionsData });
  console.log({ prescriptions });

  const meta = prescriptionsData?.meta ?? {};
  const total = meta.total ?? 0;
  const perPage = meta.perPage ?? 10; // default to 10
  const totalPages = Math.ceil(total / perPage);

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

  console.log({ patient: debouncedId });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      patientId: patient.id,
      prescripBy: formData.prescripBy,
      name: formData.name,
      dosage: formData.dosage,
      duration: formData.duration,
      instructions: formData.instructions,
      medicationName: formData.medicationName,
      frequency: formData.frequency,
      notes: formData.notes,
    };

    mutation.mutate(payload);
  };

  // const filteredPrescriptions = prescriptions.filter((prescription) => {
  //   const matchesSearch =
  //     prescription.patientName
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase()) ||
  //     prescription.doctorName
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase()) ||
  //     prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     prescription.medications.some((med) =>
  //       med.name.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   const matchesStatus =
  //     statusFilter === "all" ||
  //     prescription.status.toLowerCase() === statusFilter;

  //   return matchesSearch && matchesStatus;
  // });

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
                    Active Prescriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
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
                  <div className="text-2xl font-bold">8</div>
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
                  <div className="text-2xl font-bold">23</div>
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
                    4 <AlertTriangle className="h-4 w-4 ml-2 text-yellow-600" />
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              {prescriptions?.map((prescription) => (
                <Card
                  key={prescription.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {prescription?.patient.user?.fullName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {prescription?.prescriber?.fullName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {prescription?.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Pill className="h-4 w-4" />
                            {prescription?.medications?.length} medication
                            {prescription?.medications?.length > 1 ? "s" : ""}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(prescription?.status)}>
                          {prescription?.status}
                        </Badge>
                        {prescription.refillsRemaining > 0 && (
                          <Badge variant="outline">
                            {prescription?.refillsRemaining} refill
                            {prescription?.refillsRemaining > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-sm">Diagnosis: </span>
                        <span className="text-sm text-muted-foreground">
                          {prescription?.diagnosis}
                        </span>
                      </div>

                      {/* Medications Preview */}
                      <div>
                        <span className="font-medium text-sm">
                          Medications:
                        </span>
                        <div className="mt-2 space-y-1">
                          {prescription?.medications
                            ?.slice(0, 2)
                            ?.map((med, index) => (
                              <div
                                key={index}
                                className="text-sm text-muted-foreground bg-muted/50 p-2 rounded"
                              >
                                <span className="font-medium">
                                  {med?.name} {med?.dosage}
                                </span>{" "}
                                - {med?.frequency}
                              </div>
                            ))}
                          {prescription?.medications?.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{prescription?.medications?.length - 2} more
                              medication
                              {prescription?.medications?.length > 3 ? "s" : ""}
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
                                  {selectedPrescription?.patientName}
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
                                          <TableHead>Quantity</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {selectedPrescription.medications.map(
                                          (med, index) => (
                                            <TableRow key={index}>
                                              <TableCell className="font-medium">
                                                {med.name}
                                              </TableCell>
                                              <TableCell>
                                                {med.dosage}
                                              </TableCell>
                                              <TableCell>
                                                {med.frequency}
                                              </TableCell>
                                              <TableCell>
                                                {med.duration}
                                              </TableCell>
                                              <TableCell>
                                                {med.quantity}
                                              </TableCell>
                                            </TableRow>
                                          )
                                        )}
                                      </TableBody>
                                    </Table>
                                    <div className="mt-4">
                                      <h4 className="font-medium mb-2">
                                        Instructions:
                                      </h4>
                                      {selectedPrescription.medications.map(
                                        (med, index) => (
                                          <div
                                            key={index}
                                            className="text-sm text-muted-foreground mb-1"
                                          >
                                            <span className="font-medium">
                                              {med.name}:
                                            </span>{" "}
                                            {med.instructions}
                                          </div>
                                        )
                                      )}
                                    </div>
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
                                          {selectedPrescription?.patientName}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Doctor
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedPrescription?.doctorName}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Date Prescribed
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedPrescription.date}
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
                                        Diagnosis
                                      </Label>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedPrescription?.diagnosis}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Clinical Notes
                                      </Label>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedPrescription?.notes}
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
                                            {selectedPrescription.date}
                                          </p>
                                        </div>
                                        <Check className="h-4 w-4 text-green-600" />
                                      </div>
                                      {selectedPrescription.status ===
                                        "dispensed" && (
                                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                          <div>
                                            <p className="font-medium text-sm">
                                              Dispensed by Pharmacy
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              Central Pharmacy
                                            </p>
                                          </div>
                                          <Check className="h-4 w-4 text-green-600" />
                                        </div>
                                      )}
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
                          {prescription.status === "active" && (
                            <Button variant="outline" size="sm">
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* New Prescription Form Modal */}
            {showNewPrescriptionForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>New Prescription</CardTitle>
                    <CardDescription>
                      Create a new prescription for a patient
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
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
                              Success
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
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="prescriptionDoctor">
                          Prescribing Doctor *
                        </Label>
                        <Select
                          value={formData.prescripBy.toString()}
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

                      <div className="space-y-4">
                        <Label className="text-base font-semibold">
                          Medications
                        </Label>
                        <div className="border rounded-lg p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="medicationName">
                                Medication Name *
                              </Label>
                              <Input
                                value={formData.medicationName}
                                onChange={(e) =>
                                  handleInputChange(
                                    "medicationName",
                                    e.target.value
                                  )
                                }
                                id="medicationName"
                                placeholder="Lisinopril"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="dosage">Dosage *</Label>
                              <Input
                                id="dosage"
                                placeholder="10mg"
                                required
                                value={formData.dosage}
                                onChange={(e) =>
                                  handleInputChange("dosage", e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="frequency">Frequency *</Label>
                              <Select
                                value={formData.frequency}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    frequency: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
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
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="duration">Duration *</Label>
                              <Input
                                value={formData.duration}
                                onChange={(e) =>
                                  handleInputChange("duration", e.target.value)
                                }
                                id="duration"
                                placeholder="30 days"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="instructions">Instructions</Label>
                            <Textarea
                              value={formData.instructions}
                              onChange={(e) =>
                                handleInputChange(
                                  "instructions",
                                  e.target.value
                                )
                              }
                              id="instructions"
                              placeholder="Take with food..."
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="prescriptionNotes">
                          Additional Notes
                        </Label>
                        <Textarea
                          value={formData.notes}
                          onChange={(e) =>
                            handleInputChange("notes", e.target.value)
                          }
                          id="prescriptionNotes"
                          placeholder="Any additional notes or warnings..."
                        />
                      </div>

                      <div className="flex justify-end gap-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowNewPrescriptionForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-primary">
                          Create Prescription
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
