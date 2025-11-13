import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  FileText,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchRecentBillings,
  getInvoiceStats,
  getStatsForMonth,
} from "@/services/billing";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNaira } from "@/lib/formatters";

const BillingOverview = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const {
    data: recentInvoices,
    isLoading: isLoadingInvoices,
    isFetching: isFetchingInvoices,
  } = useQuery({
    queryKey: ["recent-invoices"],
    queryFn: () => fetchRecentBillings(),
  });

  const {
    data: invoiceStats,
    isFetching: isFetchingInvoiceStats,
    isLoading: isLoadingInvoiceStats,
  } = useQuery({
    queryKey: ["invoice-stats"],
    queryFn: () => getInvoiceStats(),
  });

  const {
    data: invoiceMonthyStats,
    isFetching: isFetchingInvoiceMonthlyStats,
    isLoading: isLoadingInvoiceMonthlyStats,
  } = useQuery({
    queryKey: ["invoice-monthy-stats"],
    queryFn: () => getStatsForMonth(),
  });

  // Map the API data to your stats structure
  const stats = [
    {
      title: "Total Revenue",
      value:
        isLoadingInvoiceStats || isFetchingInvoiceStats
          ? "Loading..."
          : `₦${(invoiceStats?.totalRevenue || 0).toLocaleString()}`,
      change: "+15.2%", //TODO You might want to calculate this from previous month data
      icon: DollarSign,
      description: "This month",
      trend: "up",
    },
    {
      title: "Outstanding",
      value:
        isLoadingInvoiceStats || isFetchingInvoiceStats
          ? "Loading..."
          : `₦${(invoiceStats?.unpaid || 0).toLocaleString()}`,
      change: "-8.1%", // You might want to calculate this from previous month data
      icon: AlertTriangle,
      description: "Unpaid invoices",
      trend: "down",
    },
    {
      title: "Paid Invoices",
      value:
        isLoadingInvoiceStats || isFetchingInvoiceStats
          ? "Loading..."
          : `${invoiceStats?.paid || 0}`,
      change: "+22%", // You might want to calculate this from previous month data
      icon: CreditCard,
      description: "Successful payments",
      trend: "up",
    },
    {
      title: "Collection Rate",
      value:
        isLoadingInvoiceStats || isFetchingInvoiceStats
          ? "Loading..."
          : invoiceStats?.total
          ? `${Math.round(
              ((invoiceStats?.paid || 0) / invoiceStats?.total) * 100
            )}%`
          : "0%",
      change: "+3.2%", // You might want to calculate this from previous month data
      icon: TrendingUp,
      description: "This month",
      trend: "up",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: { variant: "default" as const, icon: CheckCircle2, text: "Paid" },
      pending: { variant: "secondary" as const, icon: Clock, text: "Pending" },
      unPaid: { variant: "secondary" as const, icon: Clock, text: "Un Paid" },
      overdue: {
        variant: "destructive" as const,
        icon: AlertTriangle,
        text: "Overdue",
      },
    };

    const config =
      variants[status as keyof typeof variants] || variants.pending;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <IconComponent className="h-3 w-3" />
        {config.text}
      </Badge>
    );
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
                  Billing Overview
                </h1>
                <p className="text-muted-foreground mt-1">
                  Monitor revenue, invoices, and payment performance
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/dashboard/billing/invoices")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div
                      className={`p-2 rounded-lg ${
                        stat.trend === "up"
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-red-100 dark:bg-red-900/20"
                      }`}
                    >
                      <stat.icon
                        className={`h-4 w-4 ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs font-medium ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {stat.description}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Invoices */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Invoices</CardTitle>
                    <CardDescription>
                      Latest billing activity and status
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/dashboard/billing/invoices")}
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingInvoices || isFetchingInvoices ? (
                    // Loading state
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-muted animate-pulse">
                              <div className="h-4 w-4 bg-muted-foreground/20 rounded"></div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-4 w-20 bg-muted-foreground/20 rounded animate-pulse"></div>
                              <div className="h-3 w-16 bg-muted-foreground/20 rounded animate-pulse"></div>
                              <div className="h-3 w-12 bg-muted-foreground/20 rounded animate-pulse"></div>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="h-4 w-16 bg-muted-foreground/20 rounded animate-pulse"></div>
                            <div className="h-6 w-12 bg-muted-foreground/20 rounded animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentInvoices?.length === 0 ? (
                    // Empty state
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No recent invoices found
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => navigate("/dashboard/billing/invoices")}
                      >
                        View All Invoices
                      </Button>
                    </div>
                  ) : (
                    // Data state
                    <div className="space-y-4">
                      {recentInvoices?.map((invoice) => (
                        <div
                          key={invoice.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/dashboard/billing/invoices/${invoice.invoiceId}`
                            )
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                invoice.status === "paid"
                                  ? "bg-green-100 dark:bg-green-900/20"
                                  : invoice.status === "overdue"
                                  ? "bg-red-100 dark:bg-red-900/20"
                                  : "bg-blue-100 dark:bg-blue-900/20"
                              }`}
                            >
                              <FileText
                                className={`h-4 w-4 ${
                                  invoice.status === "paid"
                                    ? "text-green-600"
                                    : invoice.status === "overdue"
                                    ? "text-red-600"
                                    : "text-blue-600"
                                }`}
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {invoice?.invoiceId}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {invoice.patient?.user?.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(invoice?.billingDate)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">
                              {formatCurrency(invoice?.amount)}
                            </p>
                            {getStatusBadge(invoice?.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions & Summary */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage billing operations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full justify-start"
                      variant="default"
                      onClick={() => navigate("/dashboard/billing/invoices")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Invoice
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => navigate("/dashboard/billing/payments")}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Process Payment
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => navigate("/dashboard/billing/reports")}
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Reports
                    </Button>
                  </CardContent>
                </Card>

                {/* Payment Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                    <CardDescription>This month's performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isFetchingInvoiceMonthlyStats ||
                    isLoadingInvoiceMonthlyStats ? (
                      // Loading state
                      <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-12" />
                          </div>
                        ))}
                        <div className="pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                        </div>
                      </div>
                    ) : !invoiceMonthyStats ? (
                      // Empty/Error state
                      <div className="text-center py-6">
                        <AlertCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm">
                          No payment data available
                        </p>
                      </div>
                    ) : (
                      // Data state
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Paid Invoices
                          </span>
                          <span className="font-medium">
                            {invoiceMonthyStats?.paid || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Un Paid
                          </span>
                          <span className="font-medium">
                            {invoiceMonthyStats?.unpaid || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Overdue
                          </span>
                          <span className="font-medium text-red-600">
                            {invoiceMonthyStats?.overdue || 0}
                          </span>
                        </div>
                        <div className="pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              Total Processed
                            </span>
                            <span className="font-bold">
                              {formatNaira(
                                invoiceMonthyStats?.totalRevenue || 0
                              )}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
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
};

export default BillingOverview;
