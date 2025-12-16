import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  ArrowLeft,
  Bed,
  Users,
  Building2,
  Search,
  Filter,
  Activity,
  AlertCircle,
  Clock,
  Eye,
  BarChart3,
  MapPin,
  DollarSign,
  UserCheck,
  Stethoscope,
  Hospital,
  Users2,
  Thermometer,
  HeartPulse,
  ClipboardList,
} from "lucide-react";
import { fetchWardById } from "@/services/ward";
import { fetchBeds } from "@/services/bed";

// Bed Status Colors
const BED_STATUS_COLORS = {
  available: "bg-green-100 text-green-700 border-green-200",
  occupied: "bg-red-100 text-red-700 border-red-200",
  reserved: "bg-yellow-100 text-yellow-700 border-yellow-200",
  maintenance: "bg-gray-100 text-gray-700 border-gray-200",
  cleaning: "bg-blue-100 text-blue-700 border-blue-200",
};

// Bed Type Colors
const BED_TYPE_COLORS = {
  regular: "bg-gray-100 text-gray-700",
  icu: "bg-red-100 text-red-700",
  ventilator: "bg-purple-100 text-purple-700",
  isolation: "bg-yellow-100 text-yellow-700",
  maternity: "bg-pink-100 text-pink-700",
};

// Bed type icons
const BED_TYPE_ICONS = {
  regular: Bed,
  icu: Activity,
  ventilator: Stethoscope,
  isolation: AlertCircle,
  maternity: HeartPulse,
};

export default function WardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bedTypeFilter, setBedTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch ward details
  const {
    data: ward,
    isLoading: isLoadingWard,
    isError: isWardError,
    error: wardError,
    refetch: refetchWard,
  } = useQuery({
    queryKey: ["ward", id],
    queryFn: () => fetchWardById(id),
    enabled: !!id,
  });

  // Fetch beds with pagination and filters
  const {
    data: bedsData,
    isLoading: isLoadingBeds,
    refetch: refetchBeds,
  } = useQuery({
    queryKey: [
      "ward-beds",
      id,
      page,
      perPage,
      searchQuery,
      statusFilter,
      bedTypeFilter,
    ],
    queryFn: () =>
      fetchBeds(currentPage, perPage, searchQuery, {
        status: statusFilter === "all" ? "" : statusFilter,
        bedType: bedTypeFilter === "all" ? "" : bedTypeFilter,
        wardId: ward.id,
      }),
    enabled: !!id,
  });

  const beds = bedsData?.beds || [];
  const pagination = bedsData?.meta;

  // Calculate statistics from ward data
  const calculateStatistics = () => {
    if (!ward || !beds) return null;

    const occupiedBeds = beds.filter((bed) => bed.status === "occupied").length;
    const availableBeds = beds.filter(
      (bed) => bed.status === "available"
    ).length;
    const occupancyPercentage =
      ward.capacity > 0 ? (occupiedBeds / ward.capacity) * 100 : 0;

    // Group beds by type
    const bedTypesCount: Record<string, number> = {};
    beds.forEach((bed) => {
      bedTypesCount[bed.bed_type] = (bedTypesCount[bed.bed_type] || 0) + 1;
    });

    return {
      total_beds: ward.capacity,
      occupied_beds: occupiedBeds,
      available_beds: availableBeds,
      occupancy_percentage: Math.round(occupancyPercentage),
      bed_types: Object.entries(bedTypesCount).map(([type, count]) => ({
        type,
        count,
      })),
      bed_types_count: Object.keys(bedTypesCount).length,
    };
  };

  const statistics = calculateStatistics();

  // Extract patients from occupied beds
  const patients = beds
    .filter((bed) => bed.status === "occupied" && bed.currentPatient)
    .map((bed) => ({
      ...bed?.currentPatient?.patient,
      bedNumber: bed?.bedNumber,
      assignedAt: bed?.currentPatient?.assignedAt,
    }));

  // Handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  // Loading state
  if (isLoadingWard) {
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
              <div className="flex items-center gap-4 mb-8">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-10 w-64" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-96 rounded-xl" />
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

  // Error state
  if (isWardError) {
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
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Ward Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                {wardError?.message ||
                  "The ward you're looking for doesn't exist."}
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => navigate(-1)} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button onClick={() => refetchWard()}>Retry</Button>
              </div>
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

  if (!ward) {
    return null;
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
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/dashboard/wards")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-10 rounded"
                      style={{ backgroundColor: ward.color_code }}
                    />
                    <h1 className="text-3xl font-bold text-gray-900">
                      {ward.name}
                    </h1>
                    <Badge
                      variant={
                        ward.status === "active"
                          ? "default"
                          : ward.status === "maintenance"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {ward.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm">{ward.code}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">
                        Floor {ward.floorNumber}, {ward.wing}
                      </span>
                    </div>
                    {ward.charge_per_day && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm">
                          ${ward.chargePerDay}/day
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ward Description */}
            {ward.description && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <ClipboardList className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Description
                      </h3>
                      <p className="text-gray-600">{ward.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Total Beds</p>
                      <h3 className="text-2xl font-bold">{ward.capacity}</h3>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <Bed className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <Progress
                    value={statistics?.occupancy_percentage || 0}
                    className="mt-4 h-2"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {statistics?.occupied_beds || 0} occupied •{" "}
                    {statistics?.available_beds || 0} available
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Current Patients</p>
                      <h3 className="text-2xl font-bold">
                        {patients?.length || 0}
                      </h3>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                      <Users2 className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {statistics?.occupied_beds || 0} beds in use
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Ward Type</p>
                      <h3 className="text-2xl font-bold">
                        {ward.is_icu
                          ? "ICU"
                          : ward.isIsolation
                          ? "Isolation"
                          : "General"}
                      </h3>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <Hospital className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {ward.isIcu && (
                      <Badge variant="outline" className="text-xs bg-red-50">
                        ICU
                      </Badge>
                    )}
                    {ward.isIsolation && (
                      <Badge variant="outline" className="text-xs bg-yellow-50">
                        Isolation
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Bed Types</p>
                      <h3 className="text-2xl font-bold">
                        {statistics?.bed_types_count || 0}
                      </h3>
                    </div>
                    <div className="p-3 rounded-full bg-orange-100">
                      <Thermometer className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {statistics?.bed_types?.slice(0, 2).map((type: any) => (
                      <Badge
                        key={type.type}
                        variant="outline"
                        className="text-xs"
                      >
                        {type.type}: {type.count}
                      </Badge>
                    ))}
                    {statistics && statistics.bed_types_count > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{statistics.bed_types_count - 2} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="beds" className="space-y-6">
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="beds" className="flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  Beds ({bedsData?.meta?.total || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="patients"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Patients ({patients?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Details
                </TabsTrigger>
              </TabsList>

              {/* Beds Tab */}
              <TabsContent value="beds" className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search beds by number..."
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
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="occupied">Occupied</SelectItem>
                            <SelectItem value="reserved">Reserved</SelectItem>
                            <SelectItem value="maintenance">
                              Maintenance
                            </SelectItem>
                            <SelectItem value="cleaning">Cleaning</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={bedTypeFilter}
                          onValueChange={(value) => {
                            setBedTypeFilter(value);
                            setPage(1);
                          }}
                        >
                          <SelectTrigger className="w-[140px]">
                            <Bed className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Bed Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="icu">ICU</SelectItem>
                            <SelectItem value="ventilator">
                              Ventilator
                            </SelectItem>
                            <SelectItem value="isolation">Isolation</SelectItem>
                            <SelectItem value="maternity">Maternity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Beds Grid */}
                <Card>
                  <CardHeader>
                    <CardTitle>Beds in {ward.name}</CardTitle>
                    <CardDescription>
                      Showing {beds.length} of {pagination?.total || 0} beds
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingBeds ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <Skeleton key={i} className="h-48 rounded-xl" />
                        ))}
                      </div>
                    ) : beds.length === 0 ? (
                      <div className="text-center py-12">
                        <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No beds found
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {searchQuery ||
                          statusFilter !== "all" ||
                          bedTypeFilter !== "all"
                            ? "No beds match your filters. Try adjusting your search criteria."
                            : "This ward has no beds configured."}
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Grid View for Beds */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                          {beds.map((bed: any) => {
                            const BedTypeIcon =
                              BED_TYPE_ICONS[
                                bed.bedType as keyof typeof BED_TYPE_ICONS
                              ] || Bed;
                            return (
                              <Card
                                key={bed.id}
                                className={`overflow-hidden border-2 ${
                                  bed.status === "occupied"
                                    ? "border-red-200"
                                    : bed.status === "available"
                                    ? "border-green-200"
                                    : "border-gray-200"
                                }`}
                              >
                                <CardHeader className="pb-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle className="flex items-center gap-2">
                                        <BedTypeIcon className="h-5 w-5" />
                                        {bed.bedNumber}
                                      </CardTitle>
                                      <CardDescription className="mt-1">
                                        {bed.ward?.name}
                                      </CardDescription>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                      <Badge
                                        className={
                                          BED_TYPE_COLORS[
                                            bed.bedType as keyof typeof BED_TYPE_COLORS
                                          ]
                                        }
                                      >
                                        {bed.bedType}
                                      </Badge>
                                      <Badge
                                        className={
                                          BED_STATUS_COLORS[
                                            bed.status as keyof typeof BED_STATUS_COLORS
                                          ]
                                        }
                                      >
                                        {bed.status}
                                      </Badge>
                                    </div>

                                    {bed?.currentPatient && (
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <UserCheck className="h-4 w-4 text-gray-500" />
                                          <div className="text-sm">
                                            <div className="font-medium">
                                              {
                                                bed?.currentPatient?.patient
                                                  ?.user?.fullName
                                              }
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              Admitted:{" "}
                                              {new Date(
                                                bed?.currentPatient?.assignedAt
                                              ).toLocaleDateString()}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {bed.equipment?.length > 0 && (
                                      <div className="space-y-1">
                                        <div className="text-xs font-medium text-gray-500">
                                          Equipment:
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                          {bed.equipment
                                            .slice(0, 2)
                                            .map((eq: string, idx: number) => (
                                              <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="text-xs"
                                              >
                                                {eq}
                                              </Badge>
                                            ))}
                                          {bed.equipment.length > 2 && (
                                            <Badge
                                              variant="secondary"
                                              className="text-xs"
                                            >
                                              +{bed.equipment.length - 2} more
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {bed?.lastCleanedAt && (
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        Cleaned:{" "}
                                        {new Date(
                                          bed?.lastCleanedAt
                                        ).toLocaleDateString()}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                                <CardFooter className="pt-0">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/beds/${bed.reference}/details`
                                      )
                                    }
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Bed Details
                                  </Button>
                                </CardFooter>
                              </Card>
                            );
                          })}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.last_page > 1 && (
                          <div className="flex items-center justify-between border-t pt-6">
                            <div className="text-sm text-gray-600">
                              Showing {pagination.from} to {pagination.to} of{" "}
                              {pagination.total} results
                            </div>
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
                                  { length: Math.min(5, pagination.last_page) },
                                  (_, i) => {
                                    let pageNum = i + 1;
                                    if (pagination.last_page > 5) {
                                      if (page <= 3) {
                                        pageNum = i + 1;
                                      } else if (
                                        page >=
                                        pagination.last_page - 2
                                      ) {
                                        pageNum = pagination.last_page - 4 + i;
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
                                        Math.min(pagination.last_page, page + 1)
                                      )
                                    }
                                    className={
                                      page === pagination.last_page
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
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Patients Tab */}
              <TabsContent value="patients">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Patients</CardTitle>
                    <CardDescription>
                      Patients currently assigned to beds in this ward
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {patients && patients.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Bed</TableHead>
                            <TableHead>Admitted On</TableHead>
                            <TableHead>Days Admitted</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {patients.map((patient: any, index: number) => {
                            const admittedDate = new Date(patient.assigned_at);
                            const today = new Date();
                            const daysAdmitted = Math.floor(
                              (today.getTime() - admittedDate.getTime()) /
                                (1000 * 3600 * 24)
                            );

                            return (
                              <TableRow key={index}>
                                <TableCell>
                                  <div className="font-medium">
                                    {patient?.user?.fullName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {patient?.patientProvider?.[0]
                                      ?.medicalRecordNumber ||
                                      `PID-${patient?.id}`}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {patient.bedNumber}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {admittedDate.toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      daysAdmitted > 7
                                        ? "destructive"
                                        : "outline"
                                    }
                                  >
                                    {daysAdmitted} days
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/patients/records/${patient?.user?.reference}`
                                      )
                                    }
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Patients in Ward
                        </h3>
                        <p className="text-gray-600">
                          There are no patients currently assigned to beds in
                          this ward.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ward Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">
                              Ward Code
                            </Label>
                            <p className="font-medium">{ward.code}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">
                              Floor
                            </Label>
                            <p className="font-medium">
                              {ward.floorNumber || "Not specified"}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">
                              Wing/Section
                            </Label>
                            <p className="font-medium">
                              {ward.wing || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">
                              Status
                            </Label>
                            <Badge
                              variant={
                                ward.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {ward.status}
                            </Badge>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Created On
                          </Label>
                          <p className="font-medium">
                            {new Date(ward.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {ward.chargePerDay && (
                          <>
                            <Separator />
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Daily Charge
                              </Label>
                              <p className="font-medium">
                                ${ward.chargePerDay} per day
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Bed Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-sm font-medium">
                              Occupancy Rate
                            </Label>
                            <span className="text-sm font-bold">
                              {statistics?.occupancy_percentage || 0}%
                            </span>
                          </div>
                          <Progress
                            value={statistics?.occupancy_percentage || 0}
                            className="h-3"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-700">
                              {statistics?.available_beds || 0}
                            </div>
                            <div className="text-sm text-green-600">
                              Available Beds
                            </div>
                          </div>
                          <div className="text-center p-4 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-700">
                              {statistics?.occupied_beds || 0}
                            </div>
                            <div className="text-sm text-red-600">
                              Occupied Beds
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <Label className="text-sm font-medium mb-3 block">
                            Bed Type Distribution
                          </Label>
                          <div className="space-y-3">
                            {statistics?.bed_types?.map((type: any) => {
                              const percentage =
                                (type.count / ward.capacity) * 100;
                              const BedTypeIcon =
                                BED_TYPE_ICONS[
                                  type.type as keyof typeof BED_TYPE_ICONS
                                ] || Bed;

                              return (
                                <div key={type.type} className="space-y-1">
                                  <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                      <BedTypeIcon className="h-4 w-4" />
                                      <span className="font-medium">
                                        {type.type}
                                      </span>
                                    </div>
                                    <span>
                                      {type.count} beds (
                                      {Math.round(percentage)}%)
                                    </span>
                                  </div>
                                  <Progress
                                    value={percentage}
                                    className="h-2"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
    </div>
  );
}
