import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Search,
  Download,
  Eye,
  Plus,
  Filter,
  MoreHorizontal,
  FileText,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchPatientByMRN } from "@/services/patient";
import {
  createInvoice,
  fetchAllBillings,
  getInvoiceStats,
} from "@/services/billing";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

const Invoices = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [debouncedId, setDebouncedId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientId: "",
    amount: "",
    notes: "",
    service: "",
    dueDate: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (formData.patientId) setDebouncedId(formData.patientId.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [formData.patientId]);

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const {
    data: invoiceStats,
    isFetching: isFetchingInvoiceStats,
    isLoading: isLoadingInvoiceStats,
  } = useQuery({
    queryKey: ["invoice-stats", debouncedId],
    queryFn: () => getInvoiceStats(),
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: { variant: "default" as const, label: "Paid" },
      pending: { variant: "secondary" as const, label: "Pending" },
      overdue: { variant: "destructive" as const, label: "Overdue" },
      draft: { variant: "outline" as const, label: "Draft" },
    };

    const config =
      variants[status as keyof typeof variants] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const mutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      toast({
        title: "Invoice Created",
        description: "New invoice has been created successfully.",
        variant: "success",
      });
      setDialogOpen(false);
      setFormData({
        patientId: "",
        amount: "",
        notes: "",
        service: "",
        dueDate: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Invoice Failed",
        description: error.message || "Failed to create Invoice",
        variant: "destructive",
      });
    },
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ ...formData, patientId: patient?.id } as any);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download Started",
      description: `Downloading invoice ${invoiceId}...`,
    });
  };

  const handleSendInvoice = (invoiceId: string) => {
    toast({
      title: "Sending",
      description: `sending invoice ${invoiceId}...`,
    });
  };

  const {
    data: invoicesData,
    isLoading: isLoadingInvoices,
    isFetching: isFetchingInvoices,
  } = useQuery({
    queryKey: ["invoices", currentPage, debouncedSearch, statusFilter],
    queryFn: () =>
      fetchAllBillings(currentPage, 10, debouncedSearch, statusFilter),
  });

  const invoices = invoicesData?.invoices ?? [];

  const meta = invoicesData?.meta ?? {};
  const totalPages = meta?.lastPage ?? 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Invoices
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage patient billing and invoices
                </p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                    <DialogDescription>
                      Enter invoice details to create a new billing record.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateInvoice}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
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
                              Patient found {patient?.user?.fullName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₦) *</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          required
                          value={formData.amount}
                          onChange={(e) =>
                            handleInputChange("amount", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="service">Service/Description *</Label>
                        <Input
                          id="service"
                          placeholder="e.g., Consultation, Lab Test"
                          required
                          value={formData.service}
                          onChange={(e) =>
                            handleInputChange("service", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="invoice-date">Invoice Date</Label>
                          <Input
                            readOnly
                            id="invoice-date"
                            type="date"
                            defaultValue={
                              new Date().toISOString().split("T")[0]
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="due-date">Due Date *</Label>
                          <Input
                            id="due-date"
                            type="date"
                            required
                            value={formData.dueDate}
                            onChange={(e) =>
                              handleInputChange("dueDate", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Input
                          id="notes"
                          placeholder="Additional notes (optional)"
                          value={formData.notes}
                          onChange={(e) =>
                            handleInputChange("notes", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Create Invoice</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Summary */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Invoices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isFetchingInvoiceStats || isLoadingInvoiceStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      invoiceStats?.total || 0
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Paid</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {isFetchingInvoiceStats || isLoadingInvoiceStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      invoiceStats?.paid || 0
                    )}{" "}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {isFetchingInvoiceStats || isLoadingInvoiceStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      invoiceStats?.unpaid || 0
                    )}{" "}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {isFetchingInvoiceStats || isLoadingInvoiceStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      invoiceStats?.overdue || 0
                    )}{" "}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Invoices Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>All Invoices</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search invoices..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full sm:w-32">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="whitespace-nowrap">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No invoices found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      invoices.map((invoice) => (
                        <TableRow
                          key={invoice.id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {invoice.invoiceId}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {invoice?.patient?.user?.fullName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {invoice?.patient?.medicalRecordNumber}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDate(invoice?.billingDate)}
                          </TableCell>
                          <TableCell>
                            <div
                              className={
                                invoice.status === "overdue"
                                  ? "text-red-600 font-medium"
                                  : ""
                              }
                            >
                              {formatDate(invoice.dueDate)}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(invoice.amount)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(invoice.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigate(
                                    `/dashboard/billing/invoices/${invoice.invoiceId}`
                                  )
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSendInvoice(invoice.id)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDownloadInvoice(invoice.id)
                                }
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {/* Pagination */}
            {!isFetchingInvoices && !isLoadingInvoices && (
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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Invoices;
