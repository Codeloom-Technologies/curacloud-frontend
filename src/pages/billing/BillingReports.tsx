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

const BillingReports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState("month");
  const [loading, setLoading] = useState(false);

  const reports = [
    {
      name: "Daily Revenue Report",
      date: "2024-03-15",
      amount: "$3,456.00",
      type: "revenue",
      status: "completed",
    },
    {
      name: "Weekly Summary",
      date: "2024-03-10 - 2024-03-17",
      amount: "$18,234.00",
      type: "summary",
      status: "completed",
    },
    {
      name: "Monthly Report",
      date: "March 2024",
      amount: "$78,901.00",
      type: "comprehensive",
      status: "completed",
    },
    {
      name: "Outstanding Invoices",
      date: "2024-03-15",
      amount: "$12,234.50",
      type: "outstanding",
      status: "attention",
    },
    {
      name: "Insurance Claims Report",
      date: "2024-03-14",
      amount: "$8,450.00",
      type: "insurance",
      status: "pending",
    },
  ];

  const revenueData = [
    { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
    { month: "Feb", revenue: 52000, expenses: 35000, profit: 17000 },
    { month: "Mar", revenue: 78901, expenses: 41000, profit: 37901 },
    { month: "Apr", revenue: 61000, expenses: 38000, profit: 23000 },
    { month: "May", revenue: 73000, expenses: 42000, profit: 31000 },
    { month: "Jun", revenue: 85000, expenses: 45000, profit: 40000 },
  ];

  const paymentMethodData = [
    {
      name: "Credit Card",
      value: 45,
      color: "hsl(var(--chart-1))",
      amount: 35505,
    },
    {
      name: "Insurance",
      value: 30,
      color: "hsl(var(--chart-2))",
      amount: 23670,
    },
    { name: "Cash", value: 15, color: "hsl(var(--chart-3))", amount: 11835 },
    {
      name: "Payment Plan",
      value: 10,
      color: "hsl(var(--chart-4))",
      amount: 7890,
    },
  ];

  const departmentData = [
    {
      department: "Emergency",
      revenue: 32000,
      growth: 12,
      color: "hsl(var(--chart-1))",
    },
    {
      department: "Surgery",
      revenue: 28000,
      growth: 8,
      color: "hsl(var(--chart-2))",
    },
    {
      department: "Outpatient",
      revenue: 18000,
      growth: 15,
      color: "hsl(var(--chart-3))",
    },
    {
      department: "Lab",
      revenue: 15000,
      growth: 5,
      color: "hsl(var(--chart-4))",
    },
    {
      department: "Pharmacy",
      revenue: 12000,
      growth: -2,
      color: "hsl(var(--chart-5))",
    },
  ];

  const stats = [
    {
      label: "Total Revenue",
      value: "$78,901",
      change: "+12.5%",
      icon: DollarSign,
      description: "This month",
      trend: "up",
    },
    {
      label: "Outstanding",
      value: "$12,234",
      change: "-3.2%",
      icon: TrendingUp,
      description: "Unpaid invoices",
      trend: "down",
    },
    {
      label: "Patients Billed",
      value: "342",
      change: "+8.1%",
      icon: Users,
      description: "This month",
      trend: "up",
    },
    {
      label: "Avg Transaction",
      value: "$230",
      change: "+5.3%",
      icon: CreditCard,
      description: "Per patient",
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
      // In real app, this would trigger download
      console.log(`Exporting ${reportName}`);
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
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
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
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={3}
                          dot={{
                            fill: "hsl(var(--chart-1))",
                            strokeWidth: 2,
                            r: 4,
                          }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="expenses"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          dot={{
                            fill: "hsl(var(--chart-2))",
                            strokeWidth: 2,
                            r: 4,
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="hsl(var(--chart-3))"
                          strokeWidth={2}
                          dot={{
                            fill: "hsl(var(--chart-3))",
                            strokeWidth: 2,
                            r: 4,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
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
                    <div className="space-y-4">
                      {departmentData.map((dept, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: dept.color }}
                              />
                              <span className="font-medium">
                                {dept.department}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge
                                variant={
                                  dept.growth >= 0 ? "default" : "destructive"
                                }
                              >
                                {dept.growth >= 0 ? "+" : ""}
                                {dept.growth}%
                              </Badge>
                              <span className="font-semibold">
                                ${dept.revenue.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <Progress
                            value={(dept.revenue / 105000) * 100}
                            className="h-2"
                            style={{
                              backgroundColor: `${dept.color}20`,
                              ["--progress-background" as string]: dept.color,
                            }}
                          />
                        </div>
                      ))}
                    </div>
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
                          fill="hsl(var(--chart-1))"
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
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ department, percent }) =>
                            `${department} (${(percent * 100).toFixed(0)}%)`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="revenue"
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [
                            `$${value.toLocaleString()}`,
                            "Revenue",
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      Distribution of payment types
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                          {paymentMethodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name, props) => [
                            `$${props.payload.amount.toLocaleString()}`,
                            props.payload.name,
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                    <CardDescription>
                      Detailed breakdown by payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentMethodData.map((method, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg border"
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
                              ${method.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {method.value}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
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
                      disabled={loading}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {loading ? "Exporting..." : "Export All"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.map((report, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-lg ${
                              report.status === "completed"
                                ? "bg-green-100 dark:bg-green-900"
                                : report.status === "attention"
                                ? "bg-red-100 dark:bg-red-900"
                                : "bg-blue-100 dark:bg-blue-900"
                            }`}
                          >
                            <FileText
                              className={`h-6 w-6 ${
                                report.status === "completed"
                                  ? "text-green-600"
                                  : report.status === "attention"
                                  ? "text-red-600"
                                  : "text-blue-600"
                              }`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{report.name}</p>
                              {getStatusBadge(report.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {report.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p
                            className={`font-semibold text-lg ${
                              report.status === "attention"
                                ? "text-destructive"
                                : ""
                            }`}
                          >
                            {report.amount}
                          </p>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExport(report.name)}
                              disabled={loading}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
