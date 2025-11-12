import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, FileText, CheckCircle, Clock, PillIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
  getPrescriptions,
  getPrescriptionStats,
  updateStatus,
} from "@/services/prescription";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export default function PrescriptionProcessing() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const {
    data: prescriptionsData,
    isLoading: isLoadingPrescriptions,
    isFetching: isFetchingPrescriptions,
  } = useQuery({
    queryKey: ["prescriptions", currentPage, debouncedSearch, statusFilter],
    queryFn: () =>
      getPrescriptions(currentPage, 10, debouncedSearch, statusFilter),
  });

  const prescriptions = prescriptionsData?.prescriptions ?? [];
  const meta = prescriptionsData?.meta ?? {};
  const totalPages = meta?.lastPage ?? 1;

  const {
    data: statsData,
    isLoading: isLoadingStats,
    isFetching: isFetchingStats,
  } = useQuery({
    queryKey: ["prescriptions-stats"],
    queryFn: () => getPrescriptionStats(),
  });

  const processPrescriptionMutation = useMutation({
    mutationFn: () => updateStatus(selectedPrescription.id!, "processed"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      toast({
        title: "Success",
        variant: "success",
        description: "Prescription processed successfully",
      });
      setSelectedPrescription(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process prescription",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "processed":
        return <Badge variant="default">Processed</Badge>;
      case "dispensed":
        return <Badge variant="default">Dispensed</Badge>;
      case "active":
        return <Badge variant="outline">Active</Badge>;
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Prescription Processing</h1>
              <p className="text-muted-foreground">
                Review and process patient prescriptions
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Prescriptions
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats || isFetchingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData?.total || 0
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats || isFetchingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData?.pending || 0
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Processed
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats || isFetchingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData?.processed || 0
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Dispensed Today
                  </CardTitle>
                  <PillIcon className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats || isFetchingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData?.dispensedToday || 0
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by patient name or medication..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Medications</TableHead>
                      <TableHead>Prescribed By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingPrescriptions ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Loading prescriptions...
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : prescriptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">
                            No prescriptions found
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      prescriptions.map((prescription: any) => (
                        <TableRow key={prescription.id}>
                          <TableCell className="font-medium">
                            {prescription.patient?.user?.firstName}{" "}
                            {prescription.patient?.user?.lastName}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {prescription.items
                                ?.slice(0, 2)
                                .map((item: any, index: number) => (
                                  <div key={index} className="text-sm">
                                    <span className="font-medium">
                                      {item.medicationName}
                                    </span>
                                    <span className="text-muted-foreground ml-1">
                                      {item.dosage}
                                    </span>
                                  </div>
                                ))}
                              {prescription.items?.length > 2 && (
                                <div className="text-xs text-muted-foreground">
                                  +{prescription.items.length - 2} more
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {prescription.prescriber?.firstName}{" "}
                            {prescription.prescriber?.lastName}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              prescription.createdAt
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(prescription.status)}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setSelectedPrescription(prescription)
                                  }
                                >
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    Prescription Details
                                  </DialogTitle>
                                </DialogHeader>
                                {selectedPrescription && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-medium text-sm">
                                          Patient
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {
                                            selectedPrescription.patient?.user
                                              ?.firstName
                                          }{" "}
                                          {
                                            selectedPrescription.patient?.user
                                              ?.lastName
                                          }
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-sm">
                                          Prescribed By
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {
                                            selectedPrescription.prescriber
                                              ?.firstName
                                          }{" "}
                                          {
                                            selectedPrescription.prescriber
                                              ?.lastName
                                          }
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-sm">
                                          Date
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {new Date(
                                            selectedPrescription.createdAt
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-sm">
                                          Status
                                        </h4>
                                        <div className="mt-1">
                                          {getStatusBadge(
                                            selectedPrescription.status
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-medium text-sm mb-2">
                                        Medications
                                      </h4>
                                      <div className="space-y-3">
                                        {selectedPrescription.items?.map(
                                          (item: any, index: number) => (
                                            <div
                                              key={index}
                                              className="border rounded-lg p-3"
                                            >
                                              <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                  <span className="font-medium">
                                                    Medication:
                                                  </span>
                                                  <p className="text-muted-foreground">
                                                    {item.medicationName}
                                                  </p>
                                                </div>
                                                <div>
                                                  <span className="font-medium">
                                                    Dosage:
                                                  </span>
                                                  <p className="text-muted-foreground">
                                                    {item.dosage}
                                                  </p>
                                                </div>
                                                <div>
                                                  <span className="font-medium">
                                                    Frequency:
                                                  </span>
                                                  <p className="text-muted-foreground">
                                                    {item.frequency}
                                                  </p>
                                                </div>
                                                <div>
                                                  <span className="font-medium">
                                                    Duration:
                                                  </span>
                                                  <p className="text-muted-foreground">
                                                    {item.duration}
                                                  </p>
                                                </div>
                                                {item.instructions && (
                                                  <div className="col-span-2">
                                                    <span className="font-medium">
                                                      Instructions:
                                                    </span>
                                                    <p className="text-muted-foreground">
                                                      {item.instructions}
                                                    </p>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>

                                    {selectedPrescription.notes && (
                                      <div>
                                        <h4 className="font-medium text-sm">
                                          Notes
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedPrescription.notes}
                                        </p>
                                      </div>
                                    )}

                                    {selectedPrescription.status?.toLowerCase() ===
                                      "pending" && (
                                      <Button
                                        className="w-full"
                                        onClick={() =>
                                          processPrescriptionMutation.mutate(
                                            selectedPrescription.id
                                          )
                                        }
                                        disabled={
                                          processPrescriptionMutation.isPending
                                        }
                                      >
                                        {processPrescriptionMutation.isPending
                                          ? "Processing..."
                                          : "Process Prescription"}
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {prescription?.status?.toLowerCase() ===
                              "processed" && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigate(
                                    `/dashboard/pharmacy/dispensing/${prescription.reference}`
                                  )
                                }
                              >
                                Dispense
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            {!isLoadingPrescriptions &&
              !isFetchingPrescriptions &&
              prescriptions.length > 0 && (
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
        </main>
      </div>
    </div>
  );
}
