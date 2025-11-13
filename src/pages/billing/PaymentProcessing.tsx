import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  CheckCircle2,
  AlertCircle,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { markInvoiceAsPaid, fetchAllBillings } from "@/services/billing";
import { useToast } from "@/hooks/use-toast";

const PaymentProcessing = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("cash");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
  const [selectedInvoiceData, setSelectedInvoiceData] = useState<any>(null);
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
  const [debouncedInvoiceSearch, setDebouncedInvoiceSearch] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    paymentReference: "",
    notes: "",
    insuranceId: "",
  });

  // Debounce invoice search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInvoiceSearch(invoiceSearchQuery.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [invoiceSearchQuery]);

  // Fetch all invoices with search
  const {
    data: invoicesData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["invoices", "unpaid", debouncedInvoiceSearch],
    queryFn: () => fetchAllBillings(1, 50, debouncedInvoiceSearch, "unpaid"),
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Mutation for marking invoice as paid
  const markAsPaidMutation = useMutation({
    mutationFn: (paymentData: any) =>
      markInvoiceAsPaid(selectedInvoiceId as any, paymentData),
    onSuccess: () => {
      toast({
        title: "Payment Processed Successfully",
        description: "Invoice has been marked as paid.",
        variant: "success",
      });
      // Reset form
      setFormData({
        paymentReference: "",
        notes: "",
        insuranceId: "",
      });
      setSelectedInvoiceId("");
      setSelectedInvoiceData(null);
      setSelectedPaymentMethod("cash");
      setInvoiceSearchQuery("");
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedInvoiceId || !selectedPaymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please select an invoice and payment method",
        variant: "destructive",
      });
      return;
    }

    const paymentData = {
      paymentMethod: selectedPaymentMethod,
      paymentReference: formData.paymentReference,
      notes: formData.notes,
      insuranceId:
        selectedPaymentMethod === "insurance"
          ? formData.insuranceId
          : undefined,
      amount: selectedInvoiceData?.amount || 0,
    };

    markAsPaidMutation.mutate(paymentData);
    refetch();
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: { variant: "default" as const, label: "Paid" },
      pending: { variant: "secondary" as const, label: "Pending" },
      overdue: { variant: "destructive" as const, label: "Overdue" },
      unpaid: { variant: "destructive" as const, label: "Unpaid" },
      draft: { variant: "outline" as const, label: "Draft" },
    };

    const config =
      variants[status as keyof typeof variants] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount?.toLocaleString() || "0"}`;
  };

  const handleInvoiceSelect = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    const invoice = invoicesData?.invoices?.find(
      (i) => String(i.id) === invoiceId
    );
    setSelectedInvoiceData(invoice || null);
  };
  const handleClearAll = () => {
    setSelectedPaymentMethod("cash");
    setSelectedInvoiceId("");
    setSelectedInvoiceData(null);
    setInvoiceSearchQuery("");
    setFormData({
      paymentReference: "",
      notes: "",
      insuranceId: "",
    });
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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Payment Processing
              </h1>
              <p className="text-muted-foreground mt-2">
                Process patient payments and transactions securely
              </p>
            </div>

            {/* Payment Method Selection */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card
                className={`cursor-pointer transition-all ${
                  selectedPaymentMethod === "card"
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() => {
                  toast({
                    title: "Card Payment Unavailable",
                    description: "Card payments are currently disabled",
                    variant: "destructive",
                  });
                }}
                // onClick={() => setSelectedPaymentMethod("card")}
              >
                <CardHeader className="text-center p-4">
                  <div
                    className={`p-3 rounded-full w-fit mx-auto ${
                      selectedPaymentMethod === "card"
                        ? "bg-primary/10"
                        : "bg-muted"
                    }`}
                  >
                    <CreditCard
                      className={`h-6 w-6 ${
                        selectedPaymentMethod === "card"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <CardTitle className="text-sm">Card Payment</CardTitle>
                  <CardDescription className="text-xs">
                    Credit/Debit
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${
                  selectedPaymentMethod === "cash"
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedPaymentMethod("cash")}
              >
                <CardHeader className="text-center p-4">
                  <div
                    className={`p-3 rounded-full w-fit mx-auto ${
                      selectedPaymentMethod === "cash"
                        ? "bg-primary/10"
                        : "bg-muted"
                    }`}
                  >
                    <Banknote
                      className={`h-6 w-6 ${
                        selectedPaymentMethod === "cash"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <CardTitle className="text-sm">Cash Payment</CardTitle>
                  <CardDescription className="text-xs">
                    Cash transaction
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${
                  selectedPaymentMethod === "mobile"
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedPaymentMethod("mobile")}
              >
                <CardHeader className="text-center p-4">
                  <div
                    className={`p-3 rounded-full w-fit mx-auto ${
                      selectedPaymentMethod === "mobile"
                        ? "bg-primary/10"
                        : "bg-muted"
                    }`}
                  >
                    <Smartphone
                      className={`h-6 w-6 ${
                        selectedPaymentMethod === "mobile"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <CardTitle className="text-sm">Mobile Payment</CardTitle>
                  <CardDescription className="text-xs">
                    Digital wallets
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${
                  selectedPaymentMethod === "insurance"
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() => {
                  toast({
                    title: "Card Payment Unavailable",
                    description: "Insurance are currently disabled",
                    variant: "destructive",
                  });
                }}

                // onClick={() => setSelectedPaymentMethod("insurance")}
              >
                <CardHeader className="text-center p-4">
                  <div
                    className={`p-3 rounded-full w-fit mx-auto ${
                      selectedPaymentMethod === "insurance"
                        ? "bg-primary/10"
                        : "bg-muted"
                    }`}
                  >
                    <Building
                      className={`h-6 w-6 ${
                        selectedPaymentMethod === "insurance"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <CardTitle className="text-sm">Insurance</CardTitle>
                  <CardDescription className="text-xs">
                    Insurance claim
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedPaymentMethod ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Process{" "}
                      {selectedPaymentMethod.charAt(0).toUpperCase() +
                        selectedPaymentMethod.slice(1)}{" "}
                      Payment
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      Select Payment Method
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedPaymentMethod
                    ? `Enter ${selectedPaymentMethod} payment details below`
                    : "Choose a payment method to continue"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Patient Selection (Auto-filled from invoice) */}
                    <div className="space-y-2">
                      <Label htmlFor="patient">Patient</Label>
                      <Input
                        id="patient"
                        value={
                          selectedInvoiceData?.patient?.user?.fullName ||
                          "Select invoice to auto-fill"
                        }
                        readOnly
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Auto-filled from selected invoice
                      </p>
                    </div>

                    {/* Invoice Selection with Search */}
                    <div className="space-y-2">
                      <Label htmlFor="invoice">Invoice *</Label>
                      <Select
                        value={selectedInvoiceId}
                        onValueChange={handleInvoiceSelect}
                      >
                        <SelectTrigger id="invoice">
                          <SelectValue placeholder="Search and select invoice">
                            {selectedInvoiceData ? (
                              <div className="flex items-center justify-between w-full">
                                <span>{selectedInvoiceData.invoiceId}</span>
                                <span className="text-sm text-muted-foreground">
                                  {formatCurrency(selectedInvoiceData.amount)}
                                </span>
                              </div>
                            ) : null}
                          </SelectValue>{" "}
                        </SelectTrigger>
                        <SelectContent>
                          {/* Search Input */}
                          <div className="p-2">
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search by invoice ID or patient..."
                                className="pl-8"
                                value={invoiceSearchQuery}
                                onChange={(e) =>
                                  setInvoiceSearchQuery(e.target.value)
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>

                          {/* Loading State */}
                          {(isLoading || isFetching) && (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              Loading invoices...
                            </div>
                          )}

                          {/* No Results */}
                          {!isLoading &&
                            invoicesData?.invoices?.length === 0 && (
                              <div className="p-4 text-center text-sm text-muted-foreground">
                                No unpaid invoices found
                              </div>
                            )}

                          {/* Invoice List */}
                          {invoicesData?.invoices?.map((invoice) => (
                            <SelectItem key={invoice.id} value={invoice.id}>
                              <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-start">
                                  <span className="font-medium">
                                    {invoice.invoiceId}
                                  </span>
                                  <span className="text-sm font-semibold">
                                    {formatCurrency(invoice.amount)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-muted-foreground">
                                    {invoice.patient?.user?.fullName}
                                  </span>
                                  {getStatusBadge(invoice.status)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Due:{" "}
                                  {new Date(
                                    invoice.dueDate
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Amount (Auto-filled from invoice) */}
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={selectedInvoiceData?.amount || ""}
                        readOnly
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Amount auto-filled from selected invoice
                      </p>
                    </div>

                    {/* Payment Method (Auto-filled from selection) */}
                    <div className="space-y-2">
                      <Label htmlFor="method">Payment Method *</Label>
                      <Input
                        id="method"
                        value={
                          selectedPaymentMethod
                            ? selectedPaymentMethod.charAt(0).toUpperCase() +
                              selectedPaymentMethod.slice(1)
                            : ""
                        }
                        readOnly
                        className="bg-muted"
                      />
                    </div>

                    {/* Dynamic Fields based on Payment Method */}
                    {selectedPaymentMethod === "insurance" && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="insuranceId">Insurance ID *</Label>
                        <Input
                          id="insuranceId"
                          value={formData.insuranceId}
                          onChange={(e) =>
                            handleInputChange("insuranceId", e.target.value)
                          }
                          placeholder="Insurance policy number"
                          required
                        />
                      </div>
                    )}

                    {/* Common Fields */}
                    <div className="space-y-2 md:col-span-2">
                      {selectedPaymentMethod !== "card" ? (
                        <Label htmlFor="reference">
                          Reference Number{" "}
                          {selectedPaymentMethod !== "cash" && "*"}
                        </Label>
                      ) : null}
                      {selectedPaymentMethod !== "card" ? (
                        <Input
                          id="reference"
                          value={formData.paymentReference}
                          onChange={(e) =>
                            handleInputChange(
                              "paymentReference",
                              e.target.value
                            )
                          }
                          placeholder="Transaction reference number"
                          required={selectedPaymentMethod !== "cash"}
                        />
                      ) : null}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional payment notes..."
                        rows={3}
                        value={formData.notes}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={
                        !selectedPaymentMethod ||
                        !selectedInvoiceId ||
                        markAsPaidMutation.isPending
                      }
                    >
                      {markAsPaidMutation.isPending ? (
                        "Processing..."
                      ) : (
                        <>
                          Process{" "}
                          {selectedPaymentMethod
                            ? selectedPaymentMethod.charAt(0).toUpperCase() +
                              selectedPaymentMethod.slice(1)
                            : ""}{" "}
                          Payment
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClearAll}
                    >
                      Clear All
                    </Button>
                  </div>
                </form>
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
};

export default PaymentProcessing;
