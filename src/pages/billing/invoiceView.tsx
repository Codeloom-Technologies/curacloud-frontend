import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Download,
  Send,
  Printer,
  Copy,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getInvoiceByInvoiceId } from "@/services/billing";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNaira } from "@/lib/formatters";

const InvoiceView = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { invoiceId } = useParams();

  const {
    data: invoice,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => getInvoiceByInvoiceId(invoiceId!),
    enabled: !!invoiceId,
  });

  console.log(invoice);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      paid: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      pending: <Clock className="h-5 w-5 text-yellow-600" />,
      overdue: <AlertCircle className="h-5 w-5 text-red-600" />,
      unpaid: <Clock className="h-5 w-5 text-yellow-600" />,
      draft: <FileText className="h-5 w-5 text-gray-600" />,
    };
    return (
      icons[status as keyof typeof icons] || <FileText className="h-5 w-5" />
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      paid: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      overdue: "bg-red-100 text-red-800 border-red-200",
      unpaid: "bg-yellow-100 text-yellow-800 border-yellow-200",
      draft: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleCopyInvoiceId = () => {
    navigator.clipboard.writeText(invoice?.invoiceId || "");
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Invoice ID copied to clipboard",
      variant: "success",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintInvoice = () => {
    toast({
      title: "Printing",
      description: "Opening print dialog...",
    });
    window.print();
  };

  const handleDownloadInvoice = () => {
    toast({
      title: "Download Started",
      description: `Downloading invoice ${invoice?.invoiceId}...`,
    });
  };

  const handleSendInvoice = () => {
    toast({
      title: "Sending",
      description: `Sending invoice ${invoice?.invoiceId} to patient...`,
    });
  };

  if (isError) {
    return (
      <div className="flex h-screen bg-background">
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform md:relative md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto text-center py-16">
              <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-destructive mb-2">
                Invoice Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                The invoice you're looking for doesn't exist or has been
                removed.
              </p>
              <Button onClick={() => navigate("/dashboard/billing/invoices")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Invoices
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/dashboard/billing/invoices")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Invoices
                </Button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Invoice Details
                  </h1>
                  <p className="text-muted-foreground">
                    View and manage invoice information
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrintInvoice}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" onClick={handleSendInvoice}>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
                <Button variant="outline" onClick={handleDownloadInvoice}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>

            {isLoading ? (
              // Loading State
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Data State
              <div className="space-y-6">
                {/* Invoice Header */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold">
                            {invoice?.invoiceId}
                          </h2>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyInvoiceId}
                            className="h-8 w-8 p-0"
                          >
                            {copied ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                            invoice?.status
                          )}`}
                        >
                          {getStatusIcon(invoice?.status)}
                          {invoice?.status?.charAt(0).toUpperCase() +
                            invoice?.status?.slice(1)}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-3xl font-bold text-primary">
                          {formatNaira(invoice?.amount || 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Due {formatDate(invoice?.dueDate || "")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Patient Information */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Patient Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="font-semibold text-lg">
                          {invoice?.patient?.user?.fullName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          MRN: {invoice?.patient?.medicalRecordNumber}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {invoice?.patient?.user?.email || "No email"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {invoice?.patient?.user?.phoneNumber || "No phone"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {invoice?.patient?.address?.street || "No address"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Invoice Details */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Invoice Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Invoice Date</p>
                          <p className="text-muted-foreground">
                            {formatDate(invoice?.billingDate || "")}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Due Date</p>
                          <p className="text-muted-foreground">
                            {formatDate(invoice?.dueDate || "")}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Service Type</p>
                          <p className="text-muted-foreground">
                            {invoice?.service || "General Consultation"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Payment Method</p>
                          <p className="text-muted-foreground">
                            {invoice?.paymentMethod
                              ? invoice.paymentMethod.charAt(0).toUpperCase() +
                                invoice.paymentMethod.slice(1)
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Service Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Service Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{invoice?.service}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {invoice?.notes || "No additional notes"}
                          </p>
                        </div>
                        <p className="font-semibold text-lg">
                          {formatNaira(invoice?.amount || 0)}
                        </p>
                      </div>

                      <Separator />

                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-primary">
                          {formatNaira(invoice?.amount || 0)}
                        </span>
                      </div>
                    </div>
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
};

export default InvoiceView;
