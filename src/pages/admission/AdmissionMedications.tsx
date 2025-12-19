import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Clock,
  Pill,
  Syringe,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  History,
  Edit,
  Trash2,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Shield,
  AlertTriangle,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import {
  administerMedication,
  getActiveMedications,
  getAdmissionMedications,
  prescribeMedication,
  type Medication,
  cancelMedication,
  getMedicationHistory,
  getDueMedications,
  getMedicationStats,
} from "@/services/medication";
import { fetchAdmissionById } from "@/services/admission";
import { useUserRole } from "@/hooks/useUserRole";

// Medication Status Badge
const MedicationStatusBadge = ({
  status,
}: {
  status: Medication["status"];
}) => {
  const variants = {
    prescribed: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    administered: "bg-green-100 text-green-700 hover:bg-green-100",
    cancelled: "bg-red-100 text-red-700 hover:bg-red-100",
    completed: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  };

  const labels = {
    prescribed: "Prescribed",
    administered: "Administered",
    cancelled: "Cancelled",
    completed: "Completed",
  };

  return (
    <Badge variant="outline" className={variants[status]}>
      {labels[status]}
    </Badge>
  );
};

// Medication Routes
const MEDICATION_ROUTES = [
  { value: "oral", label: "Oral" },
  { value: "intravenous", label: "Intravenous (IV)" },
  { value: "intramuscular", label: "Intramuscular (IM)" },
  { value: "subcutaneous", label: "Subcutaneous (SC)" },
  { value: "topical", label: "Topical" },
  { value: "inhalation", label: "Inhalation" },
  { value: "rectal", label: "Rectal" },
  { value: "sublingual", label: "Sublingual" },
  { value: "transdermal", label: "Transdermal" },
  { value: "nasal", label: "Nasal" },
  { value: "otic", label: "Otic" },
  { value: "ophthalmic", label: "Ophthalmic" },
];

// Frequencies
const FREQUENCIES = [
  { value: "once_daily", label: "Once Daily" },
  { value: "twice_daily", label: "Twice Daily" },
  { value: "thrice_daily", label: "Three Times Daily" },
  { value: "four_times_daily", label: "Four Times Daily" },
  { value: "every_6_hours", label: "Every 6 Hours" },
  { value: "every_8_hours", label: "Every 8 Hours" },
  { value: "every_12_hours", label: "Every 12 Hours" },
  { value: "as_needed", label: "As Needed (PRN)" },
  { value: "before_meals", label: "Before Meals" },
  { value: "after_meals", label: "After Meals" },
  { value: "at_bedtime", label: "At Bedtime" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function AdmissionMedications() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAdministerDialogOpen, setIsAdministerDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const [selectedMedicationHistory, setSelectedMedicationHistory] = useState<
    any[]
  >([]);
  const [expandedMedications, setExpandedMedications] = useState<number[]>([]);
  const [cancelReason, setCancelReason] = useState("");
  const [administerNotes, setAdministerNotes] = useState("");
  const { isHealthcare, isDoctor } = useUserRole();

  const showAddButton = isHealthcare || isDoctor;

  // Form state
  const [formData, setFormData] = useState({
    medicationName: "",
    dosage: "",
    frequency: "once_daily",
    route: "oral",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    notes: "",
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      medicationName: "",
      dosage: "",
      frequency: "once_daily",
      route: "oral",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      notes: "",
    });
  };

  // Fetch admission details
  const {
    data: admission,
    isLoading: isLoadingAdmission,
    error: admissionError,
  } = useQuery({
    queryKey: ["admission", id],
    queryFn: () => fetchAdmissionById(id!),
    enabled: !!id,
  });

  // Fetch medications
  const {
    data: medications,
    isLoading: isLoadingMedications,
    error: medicationsError,
    refetch: refetchMedications,
  } = useQuery({
    queryKey: ["medications", admission?.id],
    queryFn: () => getAdmissionMedications(admission?.id!),
    enabled: !!admission?.id,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    staleTime: 60000,
  });

  // Fetch active medications
  const { data: activeMedications, isLoading: isLoadingActiveMedications } =
    useQuery({
      queryKey: ["active-medications", admission?.id],
      queryFn: () => getActiveMedications(admission?.id!),
      enabled: !!admission?.id,
    });

  // Fetch due medications
  const { data: dueMedications, isLoading: isLoadingDueMedications } = useQuery(
    {
      queryKey: ["due-medications", admission?.id],
      queryFn: () => getDueMedications(admission?.id!),
      enabled: !!admission?.id,
    }
  );

  // Fetch medication statistics
  const { data: medicationStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["medication-stats", admission?.id],
    queryFn: () => getMedicationStats(admission?.id!),
    enabled: !!admission?.id,
  });

  // Mutations
  const prescribeMutation = useMutation({
    mutationFn: prescribeMedication,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Medication prescribed successfully",
        variant: "success",
      });
      setIsAddDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({
        queryKey: ["medications", admission?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["active-medications", admission?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["due-medications", admission?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["medication-stats", admission?.id],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Prescription Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const administerMutation = useMutation({
    mutationFn: ({
      medicationId,
      notes,
    }: {
      medicationId: number;
      notes?: string;
    }) => administerMedication(medicationId, notes as any),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Medication administered successfully",
        variant: "success",
      });
      setIsAdministerDialogOpen(false);
      setAdministerNotes("");
      queryClient.invalidateQueries({
        queryKey: ["medications", admission?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["due-medications", admission?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["medication-stats", admission?.id],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Administration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({
      medicationId,
      reason,
    }: {
      medicationId: number;
      reason: string;
    }) => cancelMedication(medicationId, reason),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Medication cancelled successfully",
        variant: "success",
      });
      setIsCancelDialogOpen(false);
      setCancelReason("");
      queryClient.invalidateQueries({
        queryKey: ["medications", admission?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["active-medications", admission?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["medication-stats", admission?.id],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Cancellation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleAddMedication = () => {
    if (!admission?.id) return;

    const medicationData: any = {
      admissionId: admission.id,
      medicationName: formData.medicationName.trim(),
      dosage: formData.dosage.trim(),
      frequency: formData.frequency,
      route: formData.route,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      notes: formData.notes.trim() || undefined,
    };

    // Validation
    if (!medicationData.medicationName) {
      toast({
        title: "Validation Error",
        description: "Medication name is required",
        variant: "destructive",
      });
      return;
    }

    if (!medicationData.dosage) {
      toast({
        title: "Validation Error",
        description: "Dosage is required",
        variant: "destructive",
      });
      return;
    }

    prescribeMutation.mutate(medicationData);
  };

  const handleAdministerMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsAdministerDialogOpen(true);
  };

  const handleConfirmAdminister = () => {
    if (!selectedMedication?.id) return;

    administerMutation.mutate({
      medicationId: selectedMedication.id,
      notes: administerNotes || undefined,
    });
  };

  const handleViewHistory = async (medication: Medication) => {
    setSelectedMedication(medication);
    try {
      const history = await getMedicationHistory(medication.id!);
      setSelectedMedicationHistory(history);
      setIsHistoryDialogOpen(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load medication history",
        variant: "destructive",
      });
    }
  };

  const handleCancelMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedMedication?.id || !cancelReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for cancellation",
        variant: "destructive",
      });
      return;
    }

    cancelMutation.mutate({
      medicationId: selectedMedication.id,
      reason: cancelReason,
    });
  };

  const toggleMedicationDetails = (medicationId: number) => {
    setExpandedMedications((prev) =>
      prev.includes(medicationId)
        ? prev.filter((id) => id !== medicationId)
        : [...prev, medicationId]
    );
  };

  // Filter medications based on search
  const filteredMedications = medications?.filter(
    (med: Medication) =>
      med.medicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.dosage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats for display
  const stats = {
    total: medications?.length || 0,
    prescribed:
      medications?.filter((m: Medication) => m.status === "prescribed")
        .length || 0,
    administered:
      medications?.filter((m: Medication) => m.status === "administered")
        .length || 0,
    completed:
      medications?.filter((m: Medication) => m.status === "completed").length ||
      0,
    cancelled:
      medications?.filter((m: Medication) => m.status === "cancelled").length ||
      0,
    active: activeMedications?.length || 0,
    due: dueMedications?.length || 0,
    todayAdministered:
      medications?.filter(
        (m: Medication) =>
          m.status === "administered" &&
          m.administeredAt &&
          new Date(m.administeredAt).toDateString() ===
            new Date().toDateString()
      ).length || 0,
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Error handling
  if (admissionError) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="text-center py-12">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Error Loading Admission
              </h1>
              <p className="text-muted-foreground mb-6">
                {admissionError.message}
              </p>
              <Button onClick={() => navigate("/dashboard/admissions")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admissions
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoadingAdmission) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-8 w-64" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-lg" />
                ))}
              </div>
              <Skeleton className="h-96 rounded-lg" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!admission) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Admission Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                The admission record you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate("/dashboard/admissions")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admissions
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const patient = admission.patient;
  const daysAdmitted = Math.floor(
    (new Date().getTime() - new Date(admission.admissionDate).getTime()) /
      (1000 * 3600 * 24)
  );

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
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    navigate(`/dashboard/admissions/${id}/details`)
                  }
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    Medication Management
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium">
                      {patient?.user?.fullName}
                    </span>
                    <span>•</span>
                    <span>
                      Admission: {admission.reference?.substring(0, 5)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Day {daysAdmitted}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetchMedications()}
                  disabled={isLoadingMedications}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isLoadingMedications ? "animate-spin" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/dashboard/admissions/${id}/details`)
                  }
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Admission
                </Button>

                {
                  showAddButton && (
  <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  disabled={prescribeMutation.isPending}
                  className="bg-gradient-primary hover:shadow-glow transition-all"
                >
                  {prescribeMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Prescribe Medication
                </Button>
                  )
                }
              
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {stats.active}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active Medications
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <Pill className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <Progress
                    value={(stats.active / Math.max(stats.total, 1)) * 100}
                    className="mt-2 h-1.5"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-warning">
                        {stats.due}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Due for Administration
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-yellow-100">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  {stats.due > 0 && (
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Action Required
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {stats.todayAdministered}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Administered Today
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {stats.administered} total administered
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.total}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Prescribed
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {stats.completed} completed • {stats.cancelled} cancelled
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="all" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <TabsList>
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    All Medications
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Active
                    {stats.active > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 h-5 w-5 p-0 text-xs"
                      >
                        {stats.active}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="due" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Due
                    {stats.due > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-1 h-5 w-5 p-0 text-xs"
                      >
                        {stats.due}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="flex items-center gap-2"
                  >
                    <History className="h-4 w-4" />
                    History
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search medications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* All Medications Tab */}
              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Medication List</CardTitle>
                        <CardDescription>
                          All medications prescribed for this admission
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{stats.total} total</Badge>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700"
                        >
                          {stats.active} active
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingMedications ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))}
                      </div>
                    ) : medicationsError ? (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          Failed to load medications. Please try again.
                        </AlertDescription>
                      </Alert>
                    ) : filteredMedications?.length === 0 ? (
                      <div className="text-center py-12">
                        <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No Medications Found
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {searchQuery
                            ? "No medications match your search."
                            : "No medications have been prescribed for this patient."}
                        </p>
                        {!searchQuery && (
                          <Button onClick={() => setIsAddDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Prescribe First Medication
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredMedications?.map((medication: Medication) => (
                          <MedicationCard
                            key={medication.id}
                            medication={medication}
                            isExpanded={expandedMedications.includes(
                              medication.id!
                            )}
                            onToggleExpand={() =>
                              toggleMedicationDetails(medication.id!)
                            }
                            onAdminister={() =>
                              handleAdministerMedication(medication)
                            }
                            onViewHistory={() => handleViewHistory(medication)}
                            onCancel={() => handleCancelMedication(medication)}
                            formatDate={formatDate}
                            formatDateTime={formatDateTime}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Active Medications Tab */}
              <TabsContent value="active">
                <ActiveMedicationsTab
                  medications={activeMedications}
                  isLoading={isLoadingActiveMedications}
                  onAdminister={handleAdministerMedication}
                  formatDate={formatDate}
                />
              </TabsContent>

              {/* Due Medications Tab */}
              <TabsContent value="due">
                <DueMedicationsTab
                  medications={dueMedications}
                  isLoading={isLoadingDueMedications}
                  onAdminister={handleAdministerMedication}
                  formatDate={formatDate}
                />
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history">
                <MedicationHistoryTab
                  medications={medications}
                  formatDate={formatDate}
                  formatDateTime={formatDateTime}
                />
              </TabsContent>
            </Tabs>
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

      {/* Add Medication Dialog */}
        <AddMedicationDialog
          isOpen={isAddDialogOpen}
          onClose={() => {
            setIsAddDialogOpen(false);
            resetForm();
          }}
          formData={formData}
          onFormChange={(key, value) =>
            setFormData((prev) => ({ ...prev, [key]: value }))
          }
          onSubmit={handleAddMedication}
          isLoading={prescribeMutation.isPending}
        />

      {/* Administer Medication Dialog */}
      <AdministerMedicationDialog
        isOpen={isAdministerDialogOpen}
        onClose={() => {
          setIsAdministerDialogOpen(false);
          setSelectedMedication(null);
          setAdministerNotes("");
        }}
        medication={selectedMedication}
        notes={administerNotes}
        onNotesChange={setAdministerNotes}
        onConfirm={handleConfirmAdminister}
        isLoading={administerMutation.isPending}
        formatDateTime={formatDateTime}
      />

      {/* Cancel Medication Dialog */}
      {showAddButton && (
        <CancelMedicationDialog
          isOpen={isCancelDialogOpen}
          onClose={() => {
            setIsCancelDialogOpen(false);
            setSelectedMedication(null);
            setCancelReason("");
          }}
          medication={selectedMedication}
          reason={cancelReason}
          onReasonChange={setCancelReason}
          onConfirm={handleConfirmCancel}
          isLoading={cancelMutation.isPending}
        />
      )}

      {/* Medication History Dialog */}
      <MedicationHistoryDialog
        isOpen={isHistoryDialogOpen}
        onClose={() => {
          setIsHistoryDialogOpen(false);
          setSelectedMedication(null);
          setSelectedMedicationHistory([]);
        }}
        medication={selectedMedication}
        history={selectedMedicationHistory}
        formatDate={formatDate}
        formatDateTime={formatDateTime}
      />
    </div>
  );
}

// Reusable Medication Card Component
function MedicationCard({
  medication,
  isExpanded,
  onToggleExpand,
  onAdminister,
  onViewHistory,
  onCancel,
  formatDate,
  formatDateTime,
}: any) {
  return (
    <div className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="p-4 bg-card">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div
              className={`p-2 rounded-full ${
                medication.status === "prescribed"
                  ? "bg-blue-100 text-blue-600"
                  : medication.status === "administered"
                  ? "bg-green-100 text-green-600"
                  : medication.status === "completed"
                  ? "bg-purple-100 text-purple-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              <Pill className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-lg">
                    {medication.medicationName}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span className="font-medium">{medication.dosage}</span>
                    <span>•</span>
                    <span>
                      {
                        FREQUENCIES.find(
                          (f) => f.value === medication.frequency
                        )?.label
                      }
                    </span>
                    <span>•</span>
                    <span>
                      {
                        MEDICATION_ROUTES.find(
                          (r) => r.value === medication.route
                        )?.label
                      }
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MedicationStatusBadge status={medication.status} />
                  <Button variant="ghost" size="icon" onClick={onToggleExpand}>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Start:</span>
                  <span className="font-medium ml-2">
                    {formatDate(medication.startDate)}
                  </span>
                </div>
                {medication.endDate && (
                  <div>
                    <span className="text-muted-foreground">End:</span>
                    <span className="font-medium ml-2">
                      {formatDate(medication.endDate)}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Prescribed By:</span>
                  <span className="font-medium ml-2">
                    {medication.prescriber?.fullName || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {medication.status === "administered" &&
                    medication.administeredAt && (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-muted-foreground">
                          Administered:
                        </span>
                        <span className="font-medium">
                          {formatDate(medication.administeredAt)}
                        </span>
                      </>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t p-4 bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Schedule Details
                </Label>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Frequency:</span>
                    <span className="font-medium">
                      {
                        FREQUENCIES.find(
                          (f) => f.value === medication.frequency
                        )?.label
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span className="font-medium">
                      {
                        MEDICATION_ROUTES.find(
                          (r) => r.value === medication.route
                        )?.label
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Start Date:</span>
                    <span className="font-medium">
                      {formatDate(medication.startDate)}
                    </span>
                  </div>
                  {medication.endDate && (
                    <div className="flex justify-between">
                      <span>End Date:</span>
                      <span className="font-medium">
                        {formatDate(medication.endDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {medication.prescriber && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Prescription Details
                  </Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Prescribed by{" "}
                      <span className="font-medium">
                        {medication.prescriber.fullName}
                      </span>
                      {medication.prescriber.role && (
                        <span className="text-muted-foreground">
                          {" "}
                          ({medication.prescriber.role})
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {medication.administrator && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Administration Details
                  </Label>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Administered By:</span>
                      <span className="font-medium">
                        {medication.administrator.fullName}
                      </span>
                    </div>
                    {medication.administeredAt && (
                      <div className="flex justify-between">
                        <span>Administered At:</span>
                        <span className="font-medium">
                          {formatDateTime(medication.administeredAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {medication.notes && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Notes
                  </Label>
                  <p className="text-sm bg-white p-3 rounded border">
                    {medication.notes}
                  </p>
                </div>
              )}

              {medication.cancellationReason && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Cancellation Reason
                  </Label>
                  <Alert variant="destructive" className="py-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {medication.cancellationReason}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="ghost" size="sm" onClick={onViewHistory}>
              <History className="h-4 w-4 mr-2" />
              View History
            </Button>

            {medication.status === "prescribed" && (
              <>
                <Button variant="default" size="sm" onClick={onAdminister}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Administer
                </Button>
                <Button variant="destructive" size="sm" onClick={onCancel}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Component for Active Medications Tab
function ActiveMedicationsTab({
  medications,
  isLoading,
  onAdminister,
  formatDate,
}: any) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!medications || medications.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active Medications</h3>
            <p className="text-muted-foreground">
              All medications have been administered, completed, or cancelled.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Medications</CardTitle>
        <CardDescription>
          Medications currently prescribed and active ({medications.length})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((med: Medication) => (
              <TableRow key={med.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-primary" />
                    {med.medicationName}
                  </div>
                </TableCell>
                <TableCell>{med.dosage}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>
                      {
                        FREQUENCIES.find((f) => f.value === med.frequency)
                          ?.label
                      }
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {
                        MEDICATION_ROUTES.find((r) => r.value === med.route)
                          ?.label
                      }
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {formatDate(med.startDate)}
                  {med.endDate && (
                    <div className="text-xs text-muted-foreground">
                      Ends: {formatDate(med.endDate)}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => onAdminister(med)}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Administer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Component for Due Medications Tab
function DueMedicationsTab({
  medications,
  isLoading,
  onAdminister,
  formatDate,
}: any) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!medications || medications.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Due Medications</h3>
            <p className="text-muted-foreground">
              All medications are up to date. Next doses will appear here when
              due.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Due for Administration</CardTitle>
            <CardDescription>
              Medications scheduled for administration now or soon
            </CardDescription>
          </div>
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {medications.length} Due
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medications.map((med: Medication) => (
            <div
              key={med.id}
              className="border rounded-lg p-4 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{med.medicationName}</h4>
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-700"
                      >
                        Due Now
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>{med.dosage}</span>
                      <span>•</span>
                      <span>
                        {
                          FREQUENCIES.find((f) => f.value === med.frequency)
                            ?.label
                        }
                      </span>
                      <span>•</span>
                      <span>
                        {
                          MEDICATION_ROUTES.find((r) => r.value === med.route)
                            ?.label
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => onAdminister(med)}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <Syringe className="h-4 w-4 mr-2" />
                  Mark as Administered
                </Button>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Started:</span>
                  <span className="font-medium ml-2">
                    {formatDate(med.startDate)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="font-medium ml-2">
                    {FREQUENCIES.find((f) => f.value === med.frequency)?.label}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Route:</span>
                  <span className="font-medium ml-2">
                    {
                      MEDICATION_ROUTES.find((r) => r.value === med.route)
                        ?.label
                    }
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <MedicationStatusBadge status={med.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Component for Medication History Tab
function MedicationHistoryTab({
  medications,
  formatDate,
  formatDateTime,
}: any) {
  if (!medications || medications.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Medication History</h3>
            <p className="text-muted-foreground">
              No medication history available for this admission.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medication History</CardTitle>
        <CardDescription>
          Complete history of all medications for this admission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {medications.map((med: any) => (
            <Card key={med.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {med.medicationName}
                    </CardTitle>
                    <CardDescription>
                      {med.dosage} •{" "}
                      {
                        FREQUENCIES.find((f) => f.value === med.frequency)
                          ?.label
                      }
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <MedicationStatusBadge status={med.status} />
                    <Badge variant="outline">{formatDate(med.startDate)}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Prescription Details
                      </Label>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Route:</span>
                          <span className="font-medium">
                            {
                              MEDICATION_ROUTES.find(
                                (r) => r.value === med.route
                              )?.label
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Start Date:</span>
                          <span className="font-medium">
                            {formatDate(med.startDate)}
                          </span>
                        </div>
                        {med.endDate && (
                          <div className="flex justify-between">
                            <span>End Date:</span>
                            <span className="font-medium">
                              {formatDate(med.endDate)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Prescribed By:</span>
                          <span className="font-medium">
                            {med.prescriber?.fullName || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Administration History
                      </Label>
                      {med.administrator ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Administered By:</span>
                            <span className="font-medium">
                              {med.administrator?.fullName || "N/A"}
                            </span>
                          </div>
                          {med.administeredAt && (
                            <div className="flex justify-between">
                              <span>Administered At:</span>
                              <span className="font-medium">
                                {formatDateTime(med.administeredAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Not administered
                        </p>
                      )}
                    </div>

                    {med.notes && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                          Notes
                        </Label>
                        <p className="text-sm bg-white p-3 rounded border">
                          {med.notes}
                        </p>
                      </div>
                    )}

                    {med.cancellationReason && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                          Cancellation Reason
                        </Label>
                        <Alert variant="destructive" className="py-2">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            {med.cancellationReason}
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Add Medication Dialog Component
function AddMedicationDialog({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSubmit,
  isLoading,
}: any) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Prescribe New Medication
          </DialogTitle>
          <DialogDescription>
            Add a new medication to the patient's treatment plan
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="medicationName"
                  className="flex items-center gap-1"
                >
                  Medication Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="medicationName"
                  placeholder="e.g., Amoxicillin, Paracetamol"
                  value={formData.medicationName}
                  onChange={(e) =>
                    onFormChange("medicationName", e.target.value)
                  }
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage" className="flex items-center gap-1">
                  Dosage <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 500mg, 10ml"
                  value={formData.dosage}
                  onChange={(e) => onFormChange("dosage", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency" className="flex items-center gap-1">
                  Frequency <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => onFormChange("frequency", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="route" className="flex items-center gap-1">
                  Route of Administration{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.route}
                  onValueChange={(value) => onFormChange("route", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDICATION_ROUTES.map((route) => (
                      <SelectItem key={route.value} value={route.value}>
                        {route.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-1">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => onFormChange("startDate", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => onFormChange("endDate", e.target.value)}
                  min={formData.startDate}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Special instructions, contraindications, or additional information"
                value={formData.notes}
                onChange={(e) => onFormChange("notes", e.target.value)}
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-primary hover:shadow-glow transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Prescribing...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Prescribe Medication
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Administer Medication Dialog Component
function AdministerMedicationDialog({
  isOpen,
  onClose,
  medication,
  notes,
  onNotesChange,
  onConfirm,
  isLoading,
  formatDateTime,
}: any) {
  if (!medication) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Administer Medication
          </DialogTitle>
          <DialogDescription>
            Confirm administration of {medication.medicationName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="rounded-lg border p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-green-100">
                  <Pill className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">{medication.medicationName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {medication.dosage} •{" "}
                    {
                      FREQUENCIES.find((f) => f.value === medication.frequency)
                        ?.label
                    }
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Route:</span>
                  <span className="font-medium">
                    {
                      MEDICATION_ROUTES.find(
                        (r) => r.value === medication.route
                      )?.label
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Last Administered:
                  </span>
                  <span className="font-medium">
                    {medication.administeredAt
                      ? formatDateTime(medication.administeredAt)
                      : "Never"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="administer-notes">
                Administration Notes (Optional)
              </Label>
              <Textarea
                id="administer-notes"
                placeholder="Any observations or special instructions..."
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                rows={2}
                disabled={isLoading}
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                This action will mark the medication as administered at the
                current time. Please verify the medication, dosage, and patient
                before proceeding.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Administration
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Cancel Medication Dialog Component
function CancelMedicationDialog({
  isOpen,
  onClose,
  medication,
  reason,
  onReasonChange,
  onConfirm,
  isLoading,
}: any) {
  if (!medication) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Cancel Medication
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please provide a reason for
            cancellation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="rounded-lg border p-4 bg-red-50 border-red-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-red-100">
                  <Pill className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold">{medication.medicationName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {medication.dosage} •{" "}
                    {
                      FREQUENCIES.find((f) => f.value === medication.frequency)
                        ?.label
                    }
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <MedicationStatusBadge status={medication.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span className="font-medium">
                    {new Date(medication.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="cancel-reason"
                className="flex items-center gap-1"
              >
                Reason for Cancellation <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="cancel-reason"
                placeholder="Please provide a reason for cancelling this medication..."
                value={reason}
                onChange={(e) => onReasonChange(e.target.value)}
                rows={3}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                This reason will be recorded in the medication history.
              </p>
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription className="text-sm">
                Cancelling a medication is a permanent action. This will stop
                all future administrations and cannot be undone.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              disabled={isLoading}
            >
              Go Back
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !reason.trim()}
              variant="destructive"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Confirm Cancellation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Medication History Dialog Component
function MedicationHistoryDialog({
  isOpen,
  onClose,
  medication,
  history,
  formatDate,
  formatDateTime,
}: any) {
  if (!medication) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Medication History: {medication.medicationName}
          </DialogTitle>
          <DialogDescription>
            Complete history of actions for this medication
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Medication Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Dosage:</span>
                  <span className="font-medium ml-2">{medication.dosage}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="font-medium ml-2">
                    {
                      FREQUENCIES.find((f) => f.value === medication.frequency)
                        ?.label
                    }
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Route:</span>
                  <span className="font-medium ml-2">
                    {
                      MEDICATION_ROUTES.find(
                        (r) => r.value === medication.route
                      )?.label
                    }
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Current Status:</span>
                  <MedicationStatusBadge status={medication.status} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Activity Timeline</h3>
              <Badge variant="outline">{history.length} events</Badge>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No history available for this medication
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

                {history.map((item: any, index: number) => (
                  <div
                    key={item.id || index}
                    className="relative flex items-start gap-4 mb-6 last:mb-0"
                  >
                    <div
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full ${
                        item.action === "prescribed"
                          ? "bg-blue-100"
                          : item.action === "administered"
                          ? "bg-green-100"
                          : item.action === "adjusted"
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      }`}
                    >
                      {item.action === "prescribed" ? (
                        <Plus className="h-6 w-6 text-blue-600" />
                      ) : item.action === "administered" ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : item.action === "adjusted" ? (
                        <Edit className="h-6 w-6 text-yellow-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold capitalize">
                            {item.action}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            By{" "}
                            {item.performer?.fullName ||
                              item.user?.fullName ||
                              `User`}
                          </p>
                        </div>
                        <time className="text-sm text-muted-foreground">
                          {formatDateTime(item.createdAt)}
                        </time>
                      </div>
                      {item.notes && (
                        <p className="mt-2 text-sm bg-muted p-3 rounded">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
