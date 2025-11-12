import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Stethoscope,
} from "lucide-react";
import {
  fetchAppointmentsInQueue,
  fetchAppointmentStats,
  updateAppointmentStatus,
} from "@/services/appointment";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function CheckinQueue() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const perPage = 20;
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    data: queueAppointments,
    isLoading: isLoadingAppointments,
    isFetching: isFetchingAppointments,
    refetch: QueueAppointmentsRefetch,
  } = useQuery({
    queryKey: ["appointments", currentPage, debouncedSearch],
    queryFn: () =>
      fetchAppointmentsInQueue(currentPage, perPage, debouncedSearch),
  });

  const appointments = queueAppointments?.appointments ?? [];

  const meta = queueAppointments?.meta ?? {};
  const totalPages = meta.lastPage ?? 1;

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateAppointmentStatus(id as any, payload),
    onSuccess: () => {
      toast({
        title: "Appointment Updated",
        description: "The appointment has been successfully updated.",
        variant: "success",
      });
      QueueAppointmentsRefetch();
      refetch();
      navigate("/dashboard/appointments/checkin");
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update appointment.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateAppointmentStatus = (id: number, status: string) => {
    const payload = {
      status,
    };
    updateStatusMutation.mutate({ id, payload });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "In-consultation":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "No-show":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Emergency":
        return "bg-red-100 text-red-800 border-red-200";
      case "Urgent":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Routine":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Waiting":
        return <Clock className="h-4 w-4" />;
      case "Ready":
        return <CheckCircle className="h-4 w-4" />;
      case "In-consultation":
        return <Stethoscope className="h-4 w-4" />;
      case "No-show":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Debounce search term (wait 400ms after user stops typing)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleStatusUpdate = (appointmentId: number, newStatus: string) => {
    handleUpdateAppointmentStatus(appointmentId, newStatus);
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["appointmentStats"],
    queryFn: () => fetchAppointmentStats(),
  });

  const queueStats = {
    total: data?.total,
    waiting: data?.waiting,
    inConsultation: data?.inConsultatiton,
    ready: data?.ready,
    completed: data?.completed,
    avgWaitTime: 18,
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      QueueAppointmentsRefetch();
      refetch();
      window.scrollTo({ top: 0, behavior: "smooth" });
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
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Check-in Queue{" "}
              </h1>
              <p className="text-muted-foreground">
                Manage patient check-ins and appointment flow
              </p>
            </div>

            {/* Queue Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Appointments
                      </p>
                      <p className="text-2xl font-bold">
                        {isLoading || isFetching ? (
                          <Skeleton className="h-8 w-16" />
                        ) : (
                          queueStats.total || 0
                        )}
                      </p>
                    </div>
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Waiting</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {isLoading || isFetching ? (
                          <Skeleton className="h-8 w-16" />
                        ) : (
                          queueStats.waiting || 0
                        )}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        In Consultation
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {isLoading || isFetching ? (
                          <Skeleton className="h-8 w-16" />
                        ) : (
                          queueStats.inConsultation || 0
                        )}
                      </p>
                    </div>
                    <Stethoscope className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Ready</p>
                      <p className="text-2xl font-bold text-green-600">
                        {isLoading || isFetching ? (
                          <Skeleton className="h-8 w-16" />
                        ) : (
                          queueStats.ready || 0
                        )}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Wait</p>
                      <p className="text-2xl font-bold">
                        {queueStats.avgWaitTime}min
                      </p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by patient name, ID, or doctor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Queue List */}
            <div className="space-y-4">
              {isFetchingAppointments || isLoadingAppointments ? (
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
                appointments.map((item) => (
                  <Card
                    key={item.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold text-lg">
                                {item.patientName}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                ({item.patient.medicalRecordNumber})
                              </span>
                            </div>
                            <Badge className={getStatusColor(item.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(item.status)}
                                <span className="capitalize">
                                  {item.status.replace("-", " ")}
                                </span>
                              </div>
                            </Badge>
                            <Badge className={getPriorityColor(item.priority)}>
                              <span className="capitalize">
                                {item.priority}
                              </span>
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Appointment:
                              </span>
                              <div className="font-medium">
                                {item.appointmentTime}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Doctor:
                              </span>
                              <div className="font-medium">
                                {item?.doctor?.fullName}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Department:
                              </span>
                              <div className="font-medium">
                                {item?.doctor?.department?.name}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Check-in:
                              </span>
                              <div className="font-medium">
                                {new Date(
                                  item.checkinTime as any
                                ).toLocaleString() || "Not checked in"}
                              </div>
                            </div>
                          </div>

                          {item.status === "Waiting" && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 inline mr-1" />
                              Estimated wait time: {item.estimatedWai ||
                                18}{" "}
                              minutes
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {item.status === "Scheduled" && (
                            <Button
                              disabled={updateStatusMutation.isPending}
                              size="sm"
                              className="bg-gradient-primary"
                              onClick={() =>
                                handleStatusUpdate(item.id, "Waiting")
                              }
                            >
                              Check In
                            </Button>
                          )}
                          {item.status === "Waiting" && (
                            <>
                              <Button
                                disabled={updateStatusMutation.isPending}
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(item.id, "Ready")
                                }
                              >
                                Mark Ready
                              </Button>
                              <Button
                                disabled={updateStatusMutation.isPending}
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(item.id, "No-show")
                                }
                              >
                                No Show
                              </Button>
                            </>
                          )}
                          {item.status === "Ready" && (
                            <Button
                              disabled={updateStatusMutation.isPending}
                              size="sm"
                              className="bg-gradient-primary"
                              onClick={() =>
                                handleStatusUpdate(item.id, "In-consultation")
                              }
                            >
                              Start Consultation
                            </Button>
                          )}
                          {item.status === "In-consultation" && (
                            <Button
                              disabled={updateStatusMutation.isPending}
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(item.id, "Completed")
                              }
                            >
                              Complete
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

            {/*  */}
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
