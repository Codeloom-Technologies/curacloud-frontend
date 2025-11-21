import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  FileText,
  Download,
  Filter,
  Calendar,
  BarChart3,
  Users,
  Building2,
  Globe,
  TrendingUp,
  Eye,
  MoreVertical,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function SuperAdminReports() {
  const [dateRange, setDateRange] = useState("last-30-days");
  const [reportType, setReportType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
      const [sidebarOpen, setSidebarOpen] = useState(false);
    

  // Mock data for reports
  const reports = [
    {
      id: 1,
      name: "System Usage Analytics",
      type: "analytics",
      generatedBy: "System Auto",
      date: "2024-03-15",
      status: "completed",
      size: "2.4 MB",
      downloads: 45,
      description: "Comprehensive system usage and performance metrics",
    },
    {
      id: 2,
      name: "Healthcare Provider Growth",
      type: "growth",
      generatedBy: "Admin User",
      date: "2024-03-14",
      status: "completed",
      size: "1.8 MB",
      downloads: 32,
      description: "New provider registrations and growth trends",
    },
    {
      id: 3,
      name: "User Activity Summary",
      type: "users",
      generatedBy: "System Auto",
      date: "2024-03-13",
      status: "completed",
      size: "3.1 MB",
      downloads: 28,
      description: "Detailed user activity and engagement metrics",
    },
    {
      id: 4,
      name: "Revenue Analytics Q1 2024",
      type: "revenue",
      generatedBy: "Finance Team",
      date: "2024-03-12",
      status: "processing",
      size: "4.2 MB",
      downloads: 15,
      description: "Quarterly revenue and financial performance",
    },
    {
      id: 5,
      name: "System Health Monitor",
      type: "system",
      generatedBy: "System Auto",
      date: "2024-03-11",
      status: "failed",
      size: "0 MB",
      downloads: 0,
      description: "System performance and health indicators",
    },
  ];

  const reportStats = [
    {
      title: "Total Reports",
      value: "1,247",
      change: "+12% this month",
      icon: FileText,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Completed",
      value: "1,189",
      change: "94% success rate",
      icon: CheckCircle2,
      color: "text-green-600 bg-green-100",
    },
    {
      title: "Active Users",
      value: "892",
      change: "Report downloads",
      icon: Users,
      color: "text-purple-600 bg-purple-100",
    },
    {
      title: "Storage Used",
      value: "4.2 GB",
      change: "Across all reports",
      icon: BarChart3,
      color: "text-orange-600 bg-orange-100",
    },
  ];

  const reportTypes = [
    { value: "all", label: "All Reports" },
    { value: "analytics", label: "Analytics" },
    { value: "growth", label: "Growth" },
    { value: "users", label: "User Activity" },
    { value: "revenue", label: "Revenue" },
    { value: "system", label: "System Health" },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = reportType === "all" || report.type === reportType;
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "analytics":
        return BarChart3;
      case "growth":
        return TrendingUp;
      case "users":
        return Users;
      case "revenue":
        return TrendingUp;
      case "system":
        return Building2;
      default:
        return FileText;
    }
  };

  const handleGenerateReport = () => {
    // Implementation for generating new report
    console.log("Generating new report...");
  };

  const handleDownloadReport = (reportId: number) => {
    // Implementation for downloading report
    console.log(`Downloading report ${reportId}...`);
  };

  return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
           {/* Sidebar */}
                <div
                  className={`fixed inset-y-0 left-0 z-50 w-64 bg-card/80 backdrop-blur-sm border-r transform transition-transform duration-300 md:relative md:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                  }`}
                >
                  <Sidebar />
                </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Reports & Analytics
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Generate and manage system-wide reports
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button 
                onClick={handleGenerateReport}
                className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg"
              >
                <FileText className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportStats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                      <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                      <p className="text-xs text-green-600 font-medium mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports by name or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>
                <div>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="h-11">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Quick Report Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                  onClick={handleGenerateReport}
                >
                  <Users className="h-6 w-6 text-blue-600" />
                  <span className="font-medium">User Activity</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2 hover:border-green-300 hover:bg-green-50/50 transition-all"
                  onClick={handleGenerateReport}
                >
                  <Building2 className="h-6 w-6 text-green-600" />
                  <span className="font-medium">Provider Growth</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2 hover:border-purple-300 hover:bg-purple-50/50 transition-all"
                  onClick={handleGenerateReport}
                >
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <span className="font-medium">Revenue Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span>Generated Reports</span>
                <Badge variant="secondary" className="ml-2">
                  {filteredReports.length} reports
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-200/60 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="font-semibold">Report</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Generated By</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Size</TableHead>
                      <TableHead className="font-semibold">Downloads</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => {
                      const TypeIcon = getTypeIcon(report.type);
                      return (
                        <TableRow key={report.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                <TypeIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{report.name}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {report.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {report.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{report.generatedBy}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{new Date(report.date).toLocaleDateString()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">{report.size}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Download className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{report.downloads}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={getStatusVariant(report.status)}
                              className={getStatusColor(report.status)}
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleDownloadReport(report.id)}
                                disabled={report.status !== "completed"}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              {filteredReports.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No reports found</h3>
                  <p className="text-muted-foreground mb-4">
                    No reports match your search criteria.
                  </p>
                  <Button onClick={() => { setSearchQuery(''); setReportType('all'); setStatusFilter('all'); }}>
                    Clear filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Recent Report Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">System Usage Report Generated</p>
                      <p className="text-xs text-muted-foreground">Completed successfully</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <RefreshCw className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Revenue Analytics Processing</p>
                      <p className="text-xs text-muted-foreground">Estimated completion: 5 min</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">30 minutes ago</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">System Health Report Failed</p>
                      <p className="text-xs text-muted-foreground">Database connection timeout</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
          </div>
          
              {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}