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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  CreditCard,
  Eye,
  Filter,
  Plus,
  BarChart3,
  PieChart as PieChartIcon,
  RefreshCw,
  Building,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getDepartmentRevenueData,
  getInvoiceStats,
  getPaymentMethodData,
  getReports,
  getRevenueData,
} from "@/services/billing";
import { useQuery } from "@tanstack/react-query";
import { formatNaira } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";

const BillingReports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState("month");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    data: invoiceStats,
    isFetching: isFetchingInvoiceStats,
    isLoading: isLoadingInvoiceStats,
  } = useQuery({
    queryKey: ["invoice-stats"],
    queryFn: () => getInvoiceStats(),
  });

  const {
    data: revenueData,
    isLoading: isLoadingRevenue,
    refetch,
  } = useQuery({
    queryKey: ["revenue-data"],
    queryFn: () => getRevenueData(),
  });

  const { data: paymentMethodData, isLoading: isLoadingPaymentMethods } =
    useQuery({
      queryKey: ["payment-methods"],
      queryFn: () => getPaymentMethodData(),
    });

  const { data: departmentData, isLoading: isLoadingDepartmentData } = useQuery(
    {
      queryKey: ["department-revenue"],
      queryFn: () => getDepartmentRevenueData(),
    }
  );

  const { data: reports = [], isLoading: isLoadingReports } = useQuery({
    queryKey: ["reports"],
    queryFn: () => getReports(),
  });

  const handleViewReport = (report: any) => {
    // TODO Implement view report functionality
    console.log("Viewing report:", report.name);
    // You could open a modal, navigate to a details page, etc.
  };

  const stats = [
    {
      label: "Total Revenue",
      value:
        isLoadingInvoiceStats || isFetchingInvoiceStats
          ? "Loading..."
          : `${formatNaira(
              (invoiceStats?.totalRevenue || 0).toLocaleString()
            )}`,
      change: "-8.1%", // You might want to calculate this from previous month data
      icon: DollarSign,
      description: "This month",
      trend: "up",
    },
    {
      label: "Outstanding",
      value:
        isLoadingInvoiceStats || isFetchingInvoiceStats
          ? "Loading..."
          : `${formatNaira((invoiceStats?.unpaid || 0).toLocaleString())}`,
      change: "-8.1%", // You might want to calculate this from previous month data
      icon: TrendingUp,
      description: "Unpaid invoices",
      trend: "down",
    },
    {
      label: "Patients Billed",
      value:
        isLoadingInvoiceStats || isFetchingInvoiceStats
          ? "Loading..."
          : `₦${(invoiceStats?.total || 0).toLocaleString()}`,
      change: "-8.1%", // You might want to calculate this from previous month data
      icon: Users,
      description: "This month",
      trend: "up",
    },
    {
      label: "Avg Transaction",
      value:
        isLoadingInvoiceStats || isFetchingInvoiceStats
          ? "..."
          : invoiceStats?.paid && invoiceStats.paid > 0
          ? `${formatNaira(
              Math.round((invoiceStats.totalRevenue || 0) / invoiceStats.paid)
            )}`
          : "₦0",
      change: "+5.3%", // You can calculate this from previous data
      icon: CreditCard,
      description: "Per paid invoice",
      trend: "up",
    },
  ];

  const getStatusBadge = (status) => {
    const variants = {
      completed: "default",
      attention: "destructive",
      pending: "secondary",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const handleExport = (reportName) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Invoice Created",
        description: "New Exporting has been created successfully.",
        variant: "success",
      });
    }, 1000);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Billing Reports
                </h1>
                <p className="text-muted-foreground mt-2">
                  Comprehensive financial insights and analytics
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last 7 days</SelectItem>
                    <SelectItem value="month">This month</SelectItem>
                    <SelectItem value="quarter">This quarter</SelectItem>
                    <SelectItem value="year">This year</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Report
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {stats.map((stat, i) => (
                <Card key={i} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.label}
                    </CardTitle>
                    <div
                      className={`p-2 rounded-full ${
                        stat.trend === "up"
                          ? "bg-green-100 dark:bg-green-900"
                          : "bg-red-100 dark:bg-red-900"
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
                        className={`text-sm font-medium ${
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
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="revenue" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Revenue
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payments
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Revenue Trends */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Revenue Trends</CardTitle>
                        <CardDescription>
                          Monthly performance overview
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingRevenue ? (
                      // Loading state with skeleton chart
                      <div className="space-y-4">
                        {/* Chart header skeleton */}
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-8 w-20" />
                        </div>

                        {/* Chart area skeleton */}
                        <div className="relative h-[300px] w-full">
                          {/* Y-axis labels */}
                          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between py-4">
                            {[0, 1, 2, 3].map((i) => (
                              <Skeleton key={i} className="h-4 w-10" />
                            ))}
                          </div>

                          {/* Chart grid and bars */}
                          <div className="ml-12 h-full flex items-end justify-between px-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div
                                key={i}
                                className="flex flex-col items-center space-y-2 flex-1 mx-1"
                              >
                                {/* Bars */}
                                <div
                                  className="w-full flex flex-col justify-end space-y-1"
                                  style={{ height: "200px" }}
                                >
                                  <Skeleton
                                    className="w-full bg-blue-200"
                                    style={{
                                      height: `${Math.random() * 60 + 20}%`,
                                    }}
                                  />
                                  <Skeleton
                                    className="w-full bg-green-200"
                                    style={{
                                      height: `${Math.random() * 40 + 10}%`,
                                    }}
                                  />
                                  <Skeleton
                                    className="w-full bg-purple-200"
                                    style={{
                                      height: `${Math.random() * 30 + 5}%`,
                                    }}
                                  />
                                </div>
                                {/* X-axis label */}
                                <Skeleton className="h-4 w-8" />
                              </div>
                            ))}
                          </div>

                          {/* Legend skeleton */}
                          <div className="flex justify-center gap-4 mt-4">
                            {["Revenue", "Expenses", "Profit"].map(
                              (label, i) => (
                                <div
                                  key={label}
                                  className="flex items-center gap-2"
                                >
                                  <Skeleton className="h-3 w-3 rounded-full" />
                                  <Skeleton className="h-4 w-16" />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ) : revenueData?.length === 0 ? (
                      // Empty state
                      <div className="h-[300px] flex flex-col items-center justify-center text-center">
                        <BarChart3 className="h-16 w-16 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                          No Revenue Data
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                          No revenue data available for the selected period.
                          Revenue charts will appear here once you have billing
                          data.
                        </p>
                        <Button variant="outline" onClick={() => refetch()}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                      </div>
                    ) : (
                      // Data state
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="opacity-30"
                          />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value: number) =>
                              `${formatNaira(value / 1000)}k`
                            }
                          />
                          <Tooltip
                            content={
                              <CustomTooltip
                                active={undefined}
                                payload={undefined}
                                label={undefined}
                              />
                            }
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="hsl(217, 91%, 60%)"
                            strokeWidth={3}
                            dot={{
                              fill: "hsl(217, 91%, 60%)",
                              strokeWidth: 2,
                              r: 4,
                            }}
                            activeDot={{
                              r: 6,
                              stroke: "hsl(217, 91%, 60%)",
                              strokeWidth: 2,
                            }}
                            name="Revenue"
                          />
                          <Line
                            type="monotone"
                            dataKey="expenses"
                            stroke="hsl(217, 91%, 60%)"
                            strokeWidth={2}
                            dot={{
                              fill: "hsl(var(--chart-2))",
                              strokeWidth: 2,
                              r: 4,
                            }}
                            activeDot={{
                              r: 6,
                              stroke: "hsl(217, 91%, 60%)",
                              strokeWidth: 2,
                            }}
                            name="Expenses"
                          />
                          <Line
                            type="monotone"
                            dataKey="profit"
                            stroke="hsl(var(--chart-3))"
                            strokeWidth={2}
                            dot={{
                              fill: "hsl(217, 91%, 60%)",
                              strokeWidth: 2,
                              r: 4,
                            }}
                            activeDot={{
                              r: 6,
                              stroke: "hsl(217, 91%, 60%)",
                              strokeWidth: 2,
                            }}
                            name="Profit"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                {/* Department Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Department Performance</CardTitle>
                    <CardDescription>
                      Revenue distribution across departments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingDepartmentData ? (
                      // Loading state
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-3 w-3 rounded-full" />
                                <Skeleton className="h-5 w-24" />
                              </div>
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-12 rounded-full" />
                                <Skeleton className="h-5 w-16" />
                              </div>
                            </div>
                            <Skeleton className="h-2 w-full rounded-full" />
                          </div>
                        ))}
                      </div>
                    ) : departmentData?.length === 0 ? (
                      // Empty state
                      <div className="text-center py-8">
                        <Building className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                          No Department Data
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          No revenue data available for departments.
                        </p>
                      </div>
                    ) : (
                      // Data state
                      <div className="space-y-4">
                        {departmentData?.map((dept, i) => {
                          const totalRevenue = departmentData.reduce(
                            (sum, d) => sum + d.revenue,
                            0
                          );
                          const percentage =
                            totalRevenue > 0
                              ? (dept.revenue / totalRevenue) * 100
                              : 0;

                          return (
                            <div
                              key={i}
                              className="group p-3 rounded-lg border hover:bg-accent/50 transition-all duration-200 hover:shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-3 h-3 rounded-full flex-shrink-0 transition-transform group-hover:scale-125"
                                    style={{ backgroundColor: dept.color }}
                                  />
                                  <div>
                                    <span className="font-medium text-sm">
                                      {dept.department}
                                    </span>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {percentage.toFixed(1)}% of total
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge
                                    variant={
                                      dept.growth >= 0
                                        ? "default"
                                        : "destructive"
                                    }
                                    className="text-xs font-medium"
                                  >
                                    <TrendingUp
                                      className={`h-3 w-3 mr-1 ${
                                        dept.growth < 0 ? "rotate-180" : ""
                                      }`}
                                    />
                                    {dept.growth >= 0 ? "+" : ""}
                                    {dept.growth}%
                                  </Badge>
                                  <div className="text-right">
                                    <p className="font-semibold text-sm">
                                      ₦{dept.revenue.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Progress</span>
                                  <span>{percentage.toFixed(1)}%</span>
                                </div>
                                <Progress
                                  value={percentage}
                                  className="h-2 group-hover:h-3 transition-all duration-200"
                                  style={{
                                    backgroundColor: `${dept.color}15`,
                                    ["--progress-background" as string]:
                                      dept.color,
                                  }}
                                />
                              </div>

                              {/* Additional info on hover */}
                              <div className="hidden group-hover:flex items-center justify-between mt-2 pt-2 border-t text-xs text-muted-foreground">
                                <span>
                                  Last month: ₦
                                  {(dept.revenue * 0.85).toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {Math.round(dept.revenue / 2500)} patients
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {/* Total Summary */}
                        <div className="pt-4 border-t">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">
                                Total Revenue
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Across all departments
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">
                                {formatNaira(
                                  departmentData
                                    ?.reduce(
                                      (sum, dept) => sum + dept.revenue,
                                      0
                                    )
                                    .toLocaleString()
                                )}
                              </p>
                              <p className="text-xs text-green-600 font-medium">
                                +12.5% from last month
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Analysis</CardTitle>
                    <CardDescription>Monthly revenue breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="opacity-30"
                        />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          content={
                            <CustomTooltip
                              active={undefined}
                              payload={undefined}
                              label={undefined}
                            />
                          }
                        />
                        <Legend />
                        <Bar
                          dataKey="revenue"
                          fill="hsl(217, 91%, 60%)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Department Revenue</CardTitle>
                    <CardDescription>
                      Revenue distribution by department
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingDepartmentData ? (
                      // Loading state
                      <div className="flex flex-col items-center justify-center h-[300px] space-y-6">
                        {/* Animated pie chart skeleton */}
                        <div className="relative">
                          <div className="w-48 h-48 rounded-full border-8 border-muted animate-pulse bg-gradient-to-r from-muted to-muted/50"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <Skeleton className="h-6 w-20 mx-auto mb-2" />
                              <Skeleton className="h-4 w-28" />
                            </div>
                          </div>
                        </div>

                        {/* Legend skeleton */}
                        <div className="space-y-3 w-full max-w-xs">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-3 w-3 rounded-full" />
                                <Skeleton className="h-4 w-28" />
                              </div>
                              <Skeleton className="h-4 w-16" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : departmentData?.length === 0 ? (
                      // Empty state
                      <div className="h-[300px] flex flex-col items-center justify-center text-center">
                        <Building className="h-16 w-16 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                          No Department Data
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                          No revenue data available by department. Data will
                          appear here once departments start generating revenue.
                        </p>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh Data
                        </Button>
                      </div>
                    ) : (
                      // Data state
                      <div className="space-y-4">
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={departmentData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ department, percent }) =>
                                `${(percent * 100).toFixed(0)}%`
                              }
                              outerRadius={80}
                              innerRadius={40}
                              fill="hsl(217, 91%, 60%)"
                              dataKey="revenue"
                              animationBegin={0}
                              animationDuration={1000}
                            >
                              {departmentData?.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                  stroke="white"
                                  strokeWidth={2}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [
                                `₦${Number(value).toLocaleString()}`,
                                "Revenue",
                              ]}
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>

                        {/* Enhanced legend with growth indicators */}
                        <div className="space-y-3 pt-4 border-t">
                          {departmentData?.map((dept, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div
                                  className="w-3 h-3 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: dept.color }}
                                />
                                <span className="font-medium text-sm">
                                  {dept.department}
                                </span>
                                <Badge
                                  variant={
                                    dept.growth >= 0 ? "default" : "destructive"
                                  }
                                  className="text-xs"
                                >
                                  {dept.growth >= 0 ? "+" : ""}
                                  {dept.growth}%
                                </Badge>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-sm">
                                  ₦{dept.revenue.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(
                                    (dept.revenue /
                                      departmentData?.reduce(
                                        (sum, d) => sum + d.revenue,
                                        0
                                      )) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </p>
                              </div>
                            </div>
                          ))}

                          {/* Total revenue */}
                          <div className="pt-3 border-t">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                Total Revenue
                              </span>
                              <span className="font-bold text-lg">
                                ₦
                                {departmentData
                                  ?.reduce((sum, dept) => sum + dept.revenue, 0)
                                  .toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Payment Methods Chart Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      Distribution of payment types
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingPaymentMethods ? (
                      // Loading state for pie chart
                      <div className="flex flex-col items-center justify-center h-[300px] space-y-6">
                        {/* Animated pie chart skeleton */}
                        <div className="relative">
                          <div className="w-48 h-48 rounded-full border-8 border-muted animate-pulse bg-gradient-to-r from-muted to-muted/50"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <Skeleton className="h-6 w-16 mx-auto mb-2" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                        </div>
                        {/* Legend skeleton */}
                        <div className="space-y-3 w-full max-w-xs">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                              <Skeleton className="h-4 w-12" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : paymentMethodData?.length === 0 ? (
                      // Empty state
                      <div className="h-[300px] flex flex-col items-center justify-center text-center">
                        <PieChartIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                          No Payment Data
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                          No payment method data available for the current
                          period.
                        </p>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                    ) : (
                      // Data state
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={paymentMethodData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {paymentMethodData?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => [
                              `₦${props.payload.amount?.toLocaleString() || 0}`,
                              props.payload.name,
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                    <CardDescription>
                      Detailed breakdown by payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingPaymentMethods ? (
                      // Loading state for summary list
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-3 w-3 rounded-full" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                              </div>
                            </div>
                            <div className="text-right space-y-2">
                              <Skeleton className="h-4 w-16 ml-auto" />
                              <Skeleton className="h-3 w-12 ml-auto" />
                            </div>
                          </div>
                        ))}
                        {/* Total skeleton */}
                        <div className="pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-6 w-20" />
                          </div>
                        </div>
                      </div>
                    ) : paymentMethodData?.length === 0 ? (
                      // Empty state for summary
                      <div className="h-[200px] flex flex-col items-center justify-center text-center">
                        <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-3" />
                        <p className="text-muted-foreground text-sm">
                          No payment summary available
                        </p>
                      </div>
                    ) : (
                      // Data state for summary
                      <div className="space-y-4">
                        {paymentMethodData?.map((method, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: method.color }}
                              />
                              <div>
                                <p className="font-medium">{method.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {method.value}% of total
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {formatNaira(
                                  method.amount?.toLocaleString() || 0
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {method.value}%
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* Total summary */}
                        <div className="pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              Total Processed
                            </span>
                            <span className="font-bold">
                              {formatNaira(
                                paymentMethodData
                                  ?.reduce(
                                    (sum, method) => sum + (method.amount || 0),
                                    0
                                  )
                                  .toLocaleString()
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Available Reports</CardTitle>
                      <CardDescription>
                        Generate and download financial reports
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => handleExport("all_reports")}
                      disabled={loading || isLoadingReports}
                      className="min-w-[120px]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Export All
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingReports ? (
                    // Loading state
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 rounded-lg border animate-pulse"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-muted">
                              <div className="h-6 w-6 bg-muted-foreground/20 rounded"></div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-5 w-48 bg-muted-foreground/20 rounded"></div>
                              <div className="h-4 w-32 bg-muted-foreground/20 rounded"></div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="h-6 w-20 bg-muted-foreground/20 rounded"></div>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 bg-muted-foreground/20 rounded"></div>
                              <div className="h-8 w-8 bg-muted-foreground/20 rounded"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : reports.length === 0 ? (
                    // Empty state
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                        No Reports Available
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                        No financial reports have been generated yet. Reports
                        will appear here once they are created.
                      </p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Generate First Report
                      </Button>
                    </div>
                  ) : (
                    // Data state
                    <div className="space-y-4">
                      {reports?.map((report, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-all duration-200 group hover:shadow-sm"
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div
                              className={`p-3 rounded-lg transition-colors ${
                                report.status === "completed"
                                  ? "bg-green-100 dark:bg-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-800"
                                  : report.status === "attention"
                                  ? "bg-red-100 dark:bg-red-900 group-hover:bg-red-200 dark:group-hover:bg-red-800"
                                  : "bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800"
                              }`}
                            >
                              <FileText
                                className={`h-6 w-6 transition-colors ${
                                  report.status === "completed"
                                    ? "text-green-600"
                                    : report.status === "attention"
                                    ? "text-red-600"
                                    : "text-blue-600"
                                }`}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm truncate">
                                  {report.name}
                                </p>
                                {getStatusBadge(report.status)}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {report.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {report.type}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 flex-shrink-0">
                            <p
                              className={`font-semibold text-lg min-w-[100px] text-right ${
                                report.status === "attention"
                                  ? "text-destructive"
                                  : "text-foreground"
                              }`}
                            >
                              {report.amount}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 hover:scale-105 transition-transform"
                                onClick={() => handleViewReport(report)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 hover:scale-105 transition-transform"
                                onClick={() => handleExport(report.name)}
                                disabled={loading}
                              >
                                {loading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Summary */}
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            {reports?.length} report
                            {reports?.length !== 1 ? "s" : ""} available
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-muted-foreground">
                              {
                                reports?.filter((r) => r.status === "completed")
                                  .length
                              }{" "}
                              completed
                            </span>
                            <span className="text-muted-foreground">
                              {
                                reports?.filter((r) => r.status === "pending")
                                  .length
                              }{" "}
                              pending
                            </span>
                            <span className="text-muted-foreground">
                              {
                                reports?.filter((r) => r.status === "attention")
                                  .length
                              }{" "}
                              need attention
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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

export default BillingReports;
