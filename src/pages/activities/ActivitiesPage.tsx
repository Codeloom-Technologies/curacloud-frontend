import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import {
  getActivities,
  getActivityStats,
  searchActivities,
} from "@/services/activity";
import {
  Search,
  Filter,
  RefreshCw,
  Activity,
  User,
  Calendar,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Users,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

const statusColors = {
  completed: "bg-green-100 text-green-800 border-green-200",
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  updated: "bg-yellow-100 text-yellow-800 border-yellow-200",
  pending: "bg-orange-100 text-orange-800 border-orange-200",
  created: "bg-purple-100 text-purple-800 border-purple-200",
  deleted: "bg-red-100 text-red-800 border-red-200",
};

const typeIcons = {
  patient: User,
  appointment: Calendar,
  invoice: FileText,
  billing: TrendingUp,
  system: Activity,
  default: Activity,
};

const activityTypes = [
  { value: "all", label: "All Activities" },
  { value: "patient", label: "Patient" },
  { value: "appointment", label: "Appointment" },
  { value: "invoice", label: "Invoice" },
  { value: "billing", label: "Billing" },
  { value: "system", label: "System" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "created", label: "Created" },
  { value: "updated", label: "Updated" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "deleted", label: "Deleted" },
];

const getStatusIcon = (status: string) => {
  const icons = {
    completed: <CheckCircle2 className="h-3 w-3" />,
    scheduled: <Calendar className="h-3 w-3" />,
    updated: <RefreshCw className="h-3 w-3" />,
    pending: <Clock className="h-3 w-3" />,
    created: <CheckCircle2 className="h-3 w-3" />,
    deleted: <AlertCircle className="h-3 w-3" />,
  };
  return (
    icons[status as keyof typeof icons] || <Activity className="h-3 w-3" />
  );
};

export default function ActivitiesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch activities
  const {
    data: activitiesData,
    isLoading: isLoadingActivities,
    isFetching: isFetchingActivities,
    error: activitiesError,
    refetch: refetchActivities,
  } = useQuery({
    queryKey: [
      "activities",
      "all",
      currentPage,
      debouncedSearch,
      typeFilter,
      statusFilter,
    ],
    queryFn: () => {
      if (debouncedSearch) {
        return searchActivities(debouncedSearch, currentPage, 20);
      }
      return getActivities(
        currentPage,
        20,
        typeFilter !== "all" ? typeFilter : undefined
      );
    },
  });

  // Fetch activity stats
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["activity-stats"],
    queryFn: () => getActivityStats(),
  });

  console.log({ statsData });

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting activities...");
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const activities = activitiesData?.activities || [];
  const meta = activitiesData?.meta || {};
  const totalPages = meta.lastPage || 1;

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
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </a>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Activity Log
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Monitor all activities across your practice
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  onClick={() => refetchActivities()}
                  disabled={isFetchingActivities}
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${
                      isFetchingActivities ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Stats Overview */}
            {!isLoadingStats && statsData && (
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Activities
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoadingStats ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        statsData?.total?.toLocaleString() || 0
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoadingStats ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        statsData.today?.toLocaleString() || 0
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last 24 hours
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      This Week
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoadingStats ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        statsData.weekly?.toLocaleString() || 0
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Last 7 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoadingStats ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        statsData.byType?.find((t) => t.type === "user")
                          ?.count ||
                        0 ||
                        0
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">This week</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
                <CardDescription>
                  Filter activities by type, status, or search
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search activities..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activities List */}
            <Card>
              <CardHeader>
                <CardTitle>All Activities</CardTitle>
                <CardDescription>
                  {isFetchingActivities ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Loading activities...
                    </span>
                  ) : (
                    `Showing ${activities.length} of ${
                      meta.total || 0
                    } activities`
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingActivities ? (
                  // Loading state
                  <div className="space-y-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <div className="text-right space-y-2">
                          <Skeleton className="h-6 w-20 ml-auto" />
                          <Skeleton className="h-3 w-16 ml-auto" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activitiesError ? (
                  // Error state
                  <div className="text-center py-12">
                    <AlertCircle className="h-16 w-16 text-destructive/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-destructive mb-2">
                      Failed to Load Activities
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      There was an error loading the activity log.
                    </p>
                    <Button onClick={() => refetchActivities()}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                  </div>
                ) : activities.length === 0 ? (
                  // Empty state
                  <div className="text-center py-12">
                    <Activity className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      No Activities Found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {debouncedSearch ||
                      typeFilter !== "all" ||
                      statusFilter !== "all"
                        ? "No activities match your current filters."
                        : "No activities have been recorded yet."}
                    </p>
                    {(debouncedSearch ||
                      typeFilter !== "all" ||
                      statusFilter !== "all") && (
                      <Button variant="outline" onClick={handleClearFilters}>
                        Clear Filters
                      </Button>
                    )}
                  </div>
                ) : (
                  // Data state
                  <div className="space-y-4">
                    {activities.map((activity) => {
                      const IconComponent =
                        typeIcons[activity.type as keyof typeof typeIcons] ||
                        typeIcons.default;
                      const status =
                        activity.action || activity.status || "completed";

                      return (
                        <div
                          key={activity.id}
                          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-all duration-200 group"
                        >
                          <div className="relative">
                            <Avatar className="h-12 w-12 border-2 border-background">
                              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                {activity?.user?.fullName
                                  ?.split(" ")
                                  ?.map((n) => n[0])
                                  ?.join("")
                                  ?.toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 p-1 bg-background rounded-full border">
                              <IconComponent className="h-3 w-3 text-muted-foreground" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">
                                {activity.user?.fullName || "System"}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                •
                              </span>
                              <p className="text-xs text-muted-foreground capitalize">
                                {activity.type}
                              </p>
                            </div>
                            <p className="text-sm font-medium truncate">
                              {activity.title}
                            </p>
                            {activity.content && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {activity.content}
                              </p>
                            )}
                            {activity.metadata && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {Object.entries(activity.metadata).map(
                                  ([key, value]) => (
                                    <Badge
                                      key={key}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {key}: {String(value)}
                                    </Badge>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          <div className="text-right space-y-2 flex-shrink-0">
                            <Badge
                              variant="outline"
                              className={`flex items-center gap-1 ${
                                statusColors[
                                  status as keyof typeof statusColors
                                ] || statusColors.completed
                              }`}
                            >
                              {getStatusIcon(status)}
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Badge>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground whitespace-nowrap">
                                {format(
                                  new Date(activity.createdAt),
                                  "MMM d, yyyy"
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground whitespace-nowrap">
                                {format(new Date(activity.createdAt), "h:mm a")}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination */}
                {!isLoadingActivities &&
                  activities.length > 0 &&
                  totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6 pt-6 border-t">
                      <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
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
