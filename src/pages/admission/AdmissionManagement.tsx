import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  User,
  Users,
  Stethoscope,
  Bed,
  Building2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  FileText,
  Printer,
  Share2,
  RefreshCw,
  Loader2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Activity,
  HeartPulse,
  Thermometer,
  Pill,
  Brain,
  UserPlus,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import {
  fetchAdmissions,
  fetchAvailableBeds,
  admitPatient,
  dischargePatient,
  transferPatient,
  fetchAdmissionStats,
  fetchPatientsForAdmission,
} from "@/services/admission";
import { fetchWards } from "@/services/ward";
import { fetchPatients } from "@/services/patient";
import { useUserRole } from "@/hooks/useUserRole";

// Admission Status Colors
const ADMISSION_STATUS_COLORS = {
  admitted: "bg-blue-100 text-blue-700 border-blue-200",
  discharged: "bg-green-100 text-green-700 border-green-200",
  transferred: "bg-purple-100 text-purple-700 border-purple-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  emergency: "bg-red-100 text-red-700 border-red-200",
};

// Priority Colors
const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

export default function AdmissionManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isHealthcare, isAdmin, isReceptionist } = useUserRole();

  const showAddButton = isAdmin || isHealthcare || isReceptionist;

  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isAdmitDialogOpen, setIsAdmitDialogOpen] = useState(false);
  const [isDischargeDialogOpen, setIsDischargeDialogOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch admissions
  const {
    data: admissionsData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "admissions",
      page,
      perPage,
      debouncedSearch,
      statusFilter,
      priorityFilter,
    ],
    queryFn: () =>
      fetchAdmissions({
        page,
        perPage,
        search: debouncedSearch,
        status: statusFilter === "all" ? undefined : statusFilter,
        priority: priorityFilter === "all" ? undefined : priorityFilter,
      }),
  });

  const admissions = admissionsData?.admissions || [];

  const meta = admissionsData?.meta ?? {};
  const totalPages = meta.lastPage ?? 1;
  // Fetch admission statistics
  const { data: stats } = useQuery({
    queryKey: ["admission-stats"],
    queryFn: fetchAdmissionStats,
  });

  // Mutations
  const admitMutation = useMutation({
    mutationFn: admitPatient,
    onSuccess: () => {
      toast({
        title: "Patient Admitted",
        description: "Patient has been successfully admitted.",
        variant: "success",
      });
      setIsAdmitDialogOpen(false);
      setSelectedPatient(null);
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
      queryClient.invalidateQueries({ queryKey: ["admission-stats"] });
      queryClient.invalidateQueries({ queryKey: ["available-beds"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Admission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const dischargeMutation = useMutation({
    mutationFn: dischargePatient,
    onSuccess: () => {
      toast({
        title: "Patient Discharged",
        description: "Patient has been successfully discharged.",
        variant: "success",
      });
      setIsDischargeDialogOpen(false);
      setSelectedAdmission(null);
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
      queryClient.invalidateQueries({ queryKey: ["admission-stats"] });
      queryClient.invalidateQueries({ queryKey: ["available-beds"] });
    },
  });

  // Handlers
  const handleAdmitPatient = (admissionData: any) => {
    admitMutation.mutate(admissionData);
  };

  const handleDischargePatient = (dischargeData: any) => {
    if (!selectedAdmission) return;

    dischargeMutation.mutate({
      admissionId: selectedAdmission.id,
      ...dischargeData,
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleViewPatient = (patientId: number) => {
    navigate(`/dashboard/patients/records/${patientId}`);
  };

  const handleViewAdmission = (admissionId: number) => {
    navigate(`/dashboard/admissions/${admissionId}/details`);
  };

  // Quick Stats Component
  const QuickStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-primary">
            {isFetching ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              stats?.totalAdmissions || 0
            )}
          </div>
          <div className="text-sm text-muted-foreground">Total Admissions</div>
          <div className="text-xs text-muted-foreground mt-1">
            Today: {stats?.todayAdmissions || 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-success">
            {isFetching ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              stats?.currentAdmissions || 0
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            Currently Admitted
          </div>
          <Progress value={stats?.occupancyRate || 0} className="mt-2 h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {stats?.availableBeds || 0} beds available
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {isFetching ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              stats?.averageStayDays || 0
            )}
            d
          </div>
          <div className="text-sm text-muted-foreground">Average Stay</div>
          <div className="text-xs text-muted-foreground mt-1">
            Longest: {stats?.longestStay || 0}d
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-destructive">
            {isFetching ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              stats?.emergencyCases || 0
            )}
          </div>
          <div className="text-sm text-muted-foreground">Emergency Cases</div>
          <div className="text-xs text-muted-foreground mt-1">
            {stats?.pendingAdmissions || 0} pending
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-warning">
            {isFetching ? <Skeleton className="h-8 w-16" /> : admissions.length}
          </div>
          <div className="text-sm text-muted-foreground">Active Admissions</div>
          <div className="text-xs text-muted-foreground mt-1">
            {stats?.activeAdmissions || 0}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Quick Actions Component
  const QuickActions = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Button
        className="h-20 flex-col gap-2 bg-gradient-primary hover:shadow-glow transition-all"
        onClick={() => setIsAdmitDialogOpen(true)}
      >
        <UserPlus className="h-6 w-6" />
        <span>New Admission</span>
      </Button>

      {showAddButton && (
        <Button
          className="h-20 flex-col gap-2"
          variant="outline"
          onClick={() => navigate("/dashboard/patients/register")}
        >
          <User className="h-6 w-6" />
          <span>Register New Patient</span>
        </Button>
      )}

      <Button
        className="h-20 flex-col gap-2"
        variant="outline"
        onClick={() => navigate("/dashboard/beds")}
      >
        <Bed className="h-6 w-6" />
        <span>View Available Beds</span>
      </Button>
    </div>
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
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Admission Management
                </h1>
                <p className="text-muted-foreground">
                  Manage patient admissions, discharges, and transfers
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <QuickStats />

            {/* Quick Actions */}
            <QuickActions />

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by patient name, MRN, or bed number..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => {
                        setStatusFilter(value);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[140px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="admitted">Admitted</SelectItem>
                        <SelectItem value="discharged">Discharged</SelectItem>
                        <SelectItem value="transferred">Transferred</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={priorityFilter}
                      onValueChange={(value) => {
                        setPriorityFilter(value);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[140px]">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue="admissions" className="space-y-6">
              <TabsList className="grid w-full md:w-auto grid-cols-4">
                <TabsTrigger
                  value="admissions"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Admissions ({stats?.currentAdmissions || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Pending ({stats?.pendingAdmissions || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="discharges"
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Discharges
                </TabsTrigger>
                <TabsTrigger
                  value="emergency"
                  className="flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  Emergency ({stats?.emergencyCases || 0})
                </TabsTrigger>
              </TabsList>

              {/* Admissions Tab */}
              <TabsContent value="admissions" className="space-y-6">
                {/* Admissions Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Admissions</CardTitle>
                    <CardDescription>
                      Showing {admissions.length} of {meta?.total || 0}{" "}
                      admissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Skeleton key={i} className="h-16 rounded-lg" />
                        ))}
                      </div>
                    ) : admissions.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No admissions found
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {searchQuery ||
                          statusFilter !== "all" ||
                          priorityFilter !== "all"
                            ? "No admissions match your filters."
                            : "No active admissions at the moment."}
                        </p>
                        <Button
                          onClick={() => setIsAdmitDialogOpen(true)}
                          className="bg-gradient-primary hover:shadow-glow transition-all"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Admit First Patient
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Patient</TableHead>
                                <TableHead>Bed/Ward</TableHead>
                                <TableHead>Admission Date</TableHead>
                                <TableHead>Days</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody className="transition-all duration-300 ease-in-out">
                              {admissions.map((admission: any) => (
                                <AdmissionRow
                                  key={admission.id}
                                  admission={admission}
                                  onViewAdmission={handleViewAdmission}
                                  onViewPatient={handleViewPatient}
                                  onDischarge={() => {
                                    setSelectedAdmission(admission);
                                    setIsDischargeDialogOpen(true);
                                  }}
                                />
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Pagination */}
                        {meta && meta.lastPage > 1 && (
                          <div className="mt-4">
                            <Pagination>
                              <PaginationContent>
                                <PaginationItem>
                                  <PaginationPrevious
                                    onClick={() =>
                                      handlePageChange(Math.max(1, page - 1))
                                    }
                                    className={
                                      page === 1
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                    }
                                  />
                                </PaginationItem>

                                {Array.from(
                                  { length: Math.min(5, meta.lastPage) },
                                  (_, i) => {
                                    let pageNum = i + 1;
                                    if (meta.lastPage > 5) {
                                      if (page <= 3) {
                                        pageNum = i + 1;
                                      } else if (page >= meta.lastPage - 2) {
                                        pageNum = meta.lastPage - 4 + i;
                                      } else {
                                        pageNum = page - 2 + i;
                                      }
                                    }

                                    return (
                                      <PaginationItem key={pageNum}>
                                        <PaginationLink
                                          onClick={() =>
                                            handlePageChange(pageNum)
                                          }
                                          isActive={pageNum === page}
                                          className="cursor-pointer"
                                        >
                                          {pageNum}
                                        </PaginationLink>
                                      </PaginationItem>
                                    );
                                  }
                                )}

                                <PaginationItem>
                                  <PaginationNext
                                    onClick={() =>
                                      handlePageChange(
                                        Math.min(meta.lastPage, page + 1)
                                      )
                                    }
                                    className={
                                      page === meta.lastPage
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                    }
                                  />
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>
                          </div>
                        )}
                      </>
                    )}
                    {isFetching && !isLoading && (
                      <div className="text-center text-sm text-muted-foreground mt-2">
                        Loading more admissions...
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pending Tab */}
              <TabsContent value="pending">
                <PendingAdmissions
                  onAdmitPatient={(patient) => {
                    setSelectedPatient(patient);
                    setIsAdmitDialogOpen(true);
                  }}
                />
              </TabsContent>

              {/* Discharges Tab */}
              <TabsContent value="discharges">
                <DischargeHistory />
              </TabsContent>

              {/* Emergency Tab */}
              <TabsContent value="emergency">
                <EmergencyCases
                  onAdmitPatient={(patient) => {
                    setSelectedPatient(patient);
                    setIsAdmitDialogOpen(true);
                  }}
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

      {/* Admission Dialog */}
      <AdmissionDialog
        isOpen={isAdmitDialogOpen}
        onClose={() => {
          setIsAdmitDialogOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
        onAdmit={handleAdmitPatient}
        isLoading={admitMutation.isPending}
      />

      {/* Discharge Dialog */}
      <DischargeDialog
        isOpen={isDischargeDialogOpen}
        onClose={() => {
          setIsDischargeDialogOpen(false);
          setSelectedAdmission(null);
        }}
        admission={selectedAdmission}
        onDischarge={handleDischargePatient}
        isLoading={dischargeMutation.isPending}
      />
    </div>
  );
}

// Admission Row Component
function AdmissionRow({
  admission,
  onViewAdmission,
  onViewPatient,
  onDischarge,
}: any) {
  const daysAdmitted = Math.floor(
    (new Date().getTime() -
      new Date(admission?.admission?.admissionDate).getTime()) /
      (1000 * 3600 * 24)
  );

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium">
              {admission.patient?.user?.fullName}
            </div>
            <div className="text-sm text-muted-foreground">
              {admission.patient?.patientProvider[0]?.medicalRecordNumber}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{admission.bed?.bedNumber}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {admission?.ward?.name}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">
            {new Date(admission?.admission?.admissionDate).toLocaleDateString()}
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date(admission?.admission?.admissionDate).toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" }
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={daysAdmitted > 7 ? "destructive" : "outline"}>
          {daysAdmitted} days
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          className={
            PRIORITY_COLORS[
              admission?.admission?.priority as keyof typeof PRIORITY_COLORS
            ]
          }
        >
          {admission?.admission?.priority}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          className={
            ADMISSION_STATUS_COLORS[
              admission?.admission
                ?.status as keyof typeof ADMISSION_STATUS_COLORS
            ]
          }
        >
          {admission?.admission?.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewAdmission(admission?.admission?.reference)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewPatient(admission.patient?.user?.reference)}
          >
            <User className="h-4 w-4" />
          </Button>
          {admission.status === "admitted" && (
            <Button size="sm" variant="ghost" onClick={onDischarge}>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// Pending Admissions Component
function PendingAdmissions({ onAdmitPatient }: any) {
  const {
    data: pendingAdmissionsData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["pending-admissions"],
    queryFn: () => fetchAdmissions({ status: "pending" }),
  });

  const pendingAdmissions = pendingAdmissionsData?.admissions || [];
  const pagination = pendingAdmissionsData?.meta;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Admissions</CardTitle>
        <CardDescription>Patients waiting for bed assignment</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingAdmissions?.data?.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Pending Admissions
            </h3>
            <p className="text-muted-foreground">
              All admissions have been processed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingAdmissions?.data?.map((admission: any) => (
              <Card key={admission.id} className="border-2 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {admission.patient?.full_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            MRN: {admission.patient?.medical_record_number}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Requested:{" "}
                          {new Date(admission.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Stethoscope className="h-4 w-4" />
                          Condition: {admission.diagnosis || "Not specified"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className="bg-yellow-100 text-yellow-700">
                        Priority: {admission.priority}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => onAdmitPatient(admission.patient)}
                        className="bg-gradient-primary hover:shadow-glow transition-all"
                      >
                        <Bed className="h-4 w-4 mr-2" />
                        Assign Bed
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {isFetching && (
          <div className="text-center text-sm text-muted-foreground mt-2">
            Loading pending admissions...
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Discharge History Component
function DischargeHistory() {
  const {
    data: dischargesData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["discharge-history"],
    queryFn: () => fetchAdmissions({ status: "discharged", perPage: 20 }),
  });
  const discharges = dischargesData?.admissions || [];
  const pagination = dischargesData?.meta;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Discharges</CardTitle>
        <CardDescription>Last 20 patient discharges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Discharge Date</TableHead>
                <TableHead>Length of Stay</TableHead>
                <TableHead>Discharge Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="transition-all duration-300 ease-in-out">
              {discharges?.map((discharge: any) => {
                const admissionDate = new Date(
                  discharge?.admission?.admissionDate
                );
                const dischargeDate = new Date(
                  discharge?.admission?.admissionDate
                );
                const lengthOfStay = Math.floor(
                  (dischargeDate.getTime() - admissionDate.getTime()) /
                    (1000 * 3600 * 24)
                );

                return (
                  <TableRow key={discharge.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="font-medium">
                        {discharge.patient?.user?.fullName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Bed: {discharge.bed?.bedNumber}
                      </div>
                    </TableCell>
                    <TableCell>{admissionDate.toLocaleDateString()}</TableCell>
                    <TableCell>{dischargeDate.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{lengthOfStay} days</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {discharge.reason || "Regular discharge"}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {isFetching && (
          <div className="text-center text-sm text-muted-foreground mt-2">
            Loading discharge history...
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Emergency Cases Component
function EmergencyCases({ onAdmitPatient }: any) {
  const {
    data: emergenciesData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["emergency-cases"],
    queryFn: () =>
      fetchAdmissions({ priority: "critical", status: "admitted" }),
  });

  const emergencies = emergenciesData?.admissions || [];
  const pagination = emergenciesData?.meta;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency & Critical Cases</CardTitle>
        <CardDescription>
          Patients requiring immediate attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        {emergencies?.data?.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Emergency Cases
            </h3>
            <p className="text-muted-foreground">
              No critical cases at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencies?.data?.map((emergency: any) => (
              <Card
                key={emergency.id}
                className="border-2 border-red-200 bg-red-50"
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {emergency.patient?.user?.fulName}
                          </div>
                          <Badge className="bg-red-100 text-red-700">
                            Critical
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {emergency.bed?.bedNumber}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <HeartPulse className="h-4 w-4 text-red-500" />
                        <span>Condition: {emergency.diagnosis}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-red-500" />
                        <span>
                          Admitted:{" "}
                          {new Date(
                            emergency?.admission?.admissionDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Activity className="h-4 w-4 mr-2" />
                        View Vitals
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-primary hover:shadow-glow transition-all"
                      >
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Doctor Alert
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {isFetching && (
          <div className="text-center text-sm text-muted-foreground mt-2">
            Loading emergency cases...
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Admission Dialog Component
function AdmissionDialog({
  isOpen,
  onClose,
  patient,
  onAdmit,
  isLoading,
}: any) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State
  const [selectedPatient, setSelectedPatient] = useState<any>(patient || null);
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [debouncedPatientSearch, setDebouncedPatientSearch] = useState("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [formData, setFormData] = useState({
    patientId: patient?.id || "",
    bedId: "",
    admissionType: "routine",
    priority: "medium",
    diagnosis: "",
    symptoms: "",
    notes: "",
  });

  // Debounce patient search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPatientSearch(patientSearchQuery.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [patientSearchQuery]);

  // Update form when patient is selected or changed
  useEffect(() => {
    if (selectedPatient) {
      setFormData((prev) => ({
        ...prev,
        patientId: selectedPatient.id.toString(),
        emergency_contact: selectedPatient.user?.phoneNumber || "",
      }));
    }
  }, [selectedPatient]);

  // Fetch patients for search
  const {
    data: patientData,
    isLoading: isLoadingPatient,
    isFetching: isFetchingPatient,
  } = useQuery({
    queryKey: ["patients-search", debouncedPatientSearch],
    queryFn: () => fetchPatients(1, 50, debouncedPatientSearch, {}),
    enabled: isOpen && !selectedPatient,
  });

  // Fetch wards for selection
  const { data: wardsData, isLoading: isLoadingWards } = useQuery({
    queryKey: ["wards-for-admission"],
    queryFn: () => fetchWards(1, 100, "", {}),
    enabled: isOpen,
  });

  // Fetch available beds for selected ward
  const { data: availableBedsData, isLoading: isLoadingBeds } = useQuery({
    queryKey: ["available-beds", selectedWard],
    queryFn: () => fetchAvailableBeds(parseInt(selectedWard)),
    enabled: !!selectedWard && isOpen,
  });

  const availableBeds = availableBedsData?.beds || [];

  const wards = wardsData?.wards || [];

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setPatientSearchQuery("");
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setFormData((prev) => ({ ...prev, patientId: "" }));
  };

  const handleSubmit = () => {
    if (!selectedPatient) {
      toast({
        title: "Missing Information",
        description: "Please select a patient.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.bedId) {
      toast({
        title: "Missing Information",
        description: "Please select a bed.",
        variant: "destructive",
      });
      return;
    }

    const admissionData = {
      ...formData,
      patientId: parseInt(selectedPatient.id),
      bedId: parseInt(formData.bedId),
      wardId: parseInt(selectedWard),
      symptoms: formData.symptoms
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    };

    onAdmit(admissionData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            New Patient Admission
          </DialogTitle>
          <DialogDescription>
            Admit a patient to the hospital and assign a bed
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Selection Section */}
          <div className="space-y-4">
            <Label>Patient Selection *</Label>

            {/* Selected Patient Display */}
            {selectedPatient && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold">
                          {selectedPatient.user?.fullName ||
                            selectedPatient.fullName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          MRN:{" "}
                          {selectedPatient.patientProvider?.[0]
                            ?.medicalRecordNumber || "N/A"}{" "}
                          • Age: {selectedPatient.user?.age || "N/A"} • Gender:{" "}
                          {selectedPatient.user?.gender || "N/A"}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearPatient}
                    >
                      Change Patient
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Patient Search */}
            {!selectedPatient && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients by name, MRN, or phone..."
                    className="pl-10"
                    value={patientSearchQuery}
                    onChange={(e) => setPatientSearchQuery(e.target.value)}
                  />
                </div>

                {/* Patient List */}
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  {(isLoadingPatient || isFetchingPatient) && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                      Loading patients...
                    </div>
                  )}

                  {!isLoadingPatient &&
                    !isFetchingPatient &&
                    patientData?.patients?.length === 0 && (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No patients found. Try a different search term.
                      </div>
                    )}

                  {patientData?.patients?.map((patient: any) => (
                    <div
                      key={patient.id}
                      className="p-3 border-b last:border-b-0 hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            {patient.user?.fullName || patient.fulName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            MRN:{" "}
                            {patient.patientProvider?.[0]
                              ?.medicalRecordNumber || "No MRN"}{" "}
                            • Age: {patient.user?.age || "N/A"} • Phone:{" "}
                            {patient.user?.phoneNumber || "N/A"}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Click to select
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admission Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Admission Details Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Admission Type *</Label>
                <Select
                  value={formData.admissionType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, admissionType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority Level *</Label>
                <Select
                  required
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Medical Information Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Diagnosis *</Label>
                <Input
                  required
                  placeholder="e.g., Pneumonia, Fracture, etc."
                  value={formData.diagnosis}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnosis: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Symptoms (comma separated)</Label>
                <Input
                  placeholder="e.g., Fever, Cough, Pain"
                  value={formData.symptoms}
                  onChange={(e) =>
                    setFormData({ ...formData, symptoms: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Ward and Bed Selection */}
          <div className="space-y-4">
            <Label>Ward and Bed Selection *</Label>

            {/* Ward Selection */}
            <div className="space-y-2">
              <Label>Select Ward</Label>
              {isLoadingWards ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedWard}
                  onValueChange={setSelectedWard}
                  disabled={!selectedPatient}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        selectedPatient
                          ? "Select a ward"
                          : "Select patient first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map((ward: any) => (
                      <SelectItem key={ward.id} value={ward.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: ward.colorCode }}
                          />
                          <span>
                            {ward.name} ({ward.code})
                          </span>
                          <Badge variant="outline" className="ml-2">
                            {ward.current_occupancy}/{ward.capacity} beds
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Bed Selection */}
            {selectedWard && (
              <div className="space-y-2">
                <Label>Select Available Bed</Label>
                {isLoadingBeds ? (
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-32 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                  </div>
                ) : availableBeds?.length === 0 ? (
                  <div className="text-center p-6 border rounded-lg">
                    <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Available Beds
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      All beds in this ward are currently occupied or under
                      maintenance.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/dashboard/beds")}
                    >
                      View All Beds
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableBeds?.map((bed: any) => (
                      <Card
                        key={bed.id}
                        className={`cursor-pointer border-2 transition-all ${
                          formData.bedId === bed.id.toString()
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, bedId: bed.id.toString() })
                        }
                      >
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-semibold">
                                  {bed.bedNumber}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {bed.ward?.name}
                                </div>
                              </div>
                              {formData.bedId === bed.id.toString() ? (
                                <Badge className="bg-blue-100 text-blue-700">
                                  Selected
                                </Badge>
                              ) : (
                                <Badge className="bg-green-100 text-green-700">
                                  Available
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm">
                              <div className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                Floor {bed.ward?.floorNumber}, {bed.ward?.wing}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Bed className="h-3 w-3" />
                                {bed.bed_type} bed
                              </div>
                            </div>
                            {bed.equipment?.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {bed.equipment
                                  .slice(0, 2)
                                  .map((eq: string, idx: number) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {eq}
                                    </Badge>
                                  ))}
                                {bed.equipment.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{bed.equipment.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>

            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea
                placeholder="Any additional information..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !selectedPatient || !formData.bedId}
            className="bg-gradient-primary hover:shadow-glow transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Admission
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Discharge Dialog Component (unchanged from previous version)
function DischargeDialog({
  isOpen,
  onClose,
  admission,
  onDischarge,
  isLoading,
}: any) {
  const [formData, setFormData] = useState({
    discharge_reason: "",
    discharge_notes: "",
    follow_up_date: "",
    medication_prescribed: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    if (admission) {
      // Auto-fill today's date for follow-up (7 days from now)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setFormData((prev) => ({
        ...prev,
        follow_up_date: nextWeek.toISOString().split("T")[0],
      }));
    }
  }, [admission]);

  const handleSubmit = () => {
    if (!formData.discharge_reason) {
      toast({
        title: "Missing Information",
        description: "Please specify the discharge reason.",
        variant: "destructive",
      });
      return;
    }

    onDischarge(formData);
  };

  if (!admission) return null;

  const admissionDate = new Date(admission.admission_date);
  const daysAdmitted = Math.floor(
    (new Date().getTime() - admissionDate.getTime()) / (1000 * 3600 * 24)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Discharge Patient
          </DialogTitle>
          <DialogDescription>
            Complete the discharge process for{" "}
            {admission.patient?.user?.fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {admission.patient?.user?.fullName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        MRN:{" "}
                        {
                          admission.patient?.patientProvider[0]
                            .medicalRecordNumber
                        }
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{daysAdmitted} days admitted</Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Admission Date
                    </Label>
                    <p className="font-medium">
                      {admissionDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Bed
                    </Label>
                    <p className="font-medium">{admission.bed?.bedNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Diagnosis
                    </Label>
                    <p className="font-medium">
                      {admission.diagnosis || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Attending Doctor
                    </Label>
                    <p className="font-medium">{admission?.admittingDoctor}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discharge Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Discharge Reason *</Label>
              <Select
                value={formData.discharge_reason}
                onValueChange={(value) =>
                  setFormData({ ...formData, discharge_reason: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recovered">Recovered</SelectItem>
                  <SelectItem value="improved">Condition Improved</SelectItem>
                  <SelectItem value="referred">
                    Referred to Another Facility
                  </SelectItem>
                  <SelectItem value="requested">Patient Request</SelectItem>
                  <SelectItem value="against_advice">
                    Against Medical Advice
                  </SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Discharge Notes</Label>
              <Textarea
                placeholder="Summary of treatment, condition at discharge, instructions..."
                value={formData.discharge_notes}
                onChange={(e) =>
                  setFormData({ ...formData, discharge_notes: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Follow-up Date</Label>
                <Input
                  type="date"
                  value={formData.follow_up_date}
                  onChange={(e) =>
                    setFormData({ ...formData, follow_up_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Medications Prescribed</Label>
                <Input
                  placeholder="e.g., Antibiotics, Painkillers"
                  value={formData.medication_prescribed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medication_prescribed: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-primary hover:shadow-glow transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Discharge
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
