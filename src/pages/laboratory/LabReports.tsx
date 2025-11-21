import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Eye, Calendar, User, FileText, TrendingUp, TrendingDown, AlertTriangle, Filter, BarChart3, Send, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Enhanced sample data for lab reports
const sampleLabReports = [
  {
    id: "LR001",
    orderId: "LO001",
    patientName: "John Smith",
    patientId: "P001",
    age: 45,
    gender: "Male",
    testType: "Complete Blood Count",
    reportDate: "2024-01-16",
    orderDate: "2024-01-15",
    physician: "Dr. Johnson",
    department: "Internal Medicine",
    status: "Final",
    priority: "Urgent",
    results: [
      { parameter: "Hemoglobin", value: "12.5", unit: "g/dL", referenceRange: "13.5-17.5", flag: "Low" },
      { parameter: "White Blood Cell Count", value: "8.2", unit: "× 10³/μL", referenceRange: "4.5-11.0", flag: "Normal" },
      { parameter: "Platelet Count", value: "350", unit: "× 10³/μL", referenceRange: "150-450", flag: "Normal" },
      { parameter: "Hematocrit", value: "38.5", unit: "%", referenceRange: "40-52", flag: "Low" },
    ],
    technician: "John Martinez",
    reviewedBy: "Dr. Patricia Wilson",
    criticalValues: ["Hemoglobin: 12.5 g/dL (Low)", "Hematocrit: 38.5% (Low)"],
    notes: "Patient shows signs of anemia. Recommend iron studies and follow-up.",
    attachments: ["cbc_report_001.pdf", "blood_smear_001.jpg"]
  },
  {
    id: "LR002",
    orderId: "LO002",
    patientName: "Sarah Davis",
    patientId: "P002",
    age: 52,
    gender: "Female",
    testType: "Lipid Panel",
    reportDate: "2024-01-15",
    orderDate: "2024-01-14",
    physician: "Dr. Williams",
    department: "Cardiology",
    status: "Final",
    priority: "Routine",
    results: [
      { parameter: "Total Cholesterol", value: "245", unit: "mg/dL", referenceRange: "<200", flag: "High" },
      { parameter: "HDL Cholesterol", value: "45", unit: "mg/dL", referenceRange: ">40 (M), >50 (F)", flag: "Low" },
      { parameter: "LDL Cholesterol", value: "165", unit: "mg/dL", referenceRange: "<100", flag: "High" },
      { parameter: "Triglycerides", value: "175", unit: "mg/dL", referenceRange: "<150", flag: "High" },
    ],
    technician: "Sarah Johnson",
    reviewedBy: "Dr. Michael Chen",
    criticalValues: [],
    notes: "Elevated lipid levels observed. Consider lifestyle modifications and possible statin therapy.",
    attachments: ["lipid_panel_002.pdf"]
  },
  {
    id: "LR003",
    orderId: "LO003",
    patientName: "Michael Brown",
    patientId: "P003",
    age: 38,
    gender: "Male",
    testType: "Thyroid Function Test",
    reportDate: "2024-01-14",
    orderDate: "2024-01-13",
    physician: "Dr. Davis",
    department: "Endocrinology",
    status: "Final",
    priority: "Routine",
    results: [
      { parameter: "TSH", value: "2.1", unit: "mIU/L", referenceRange: "0.4-4.0", flag: "Normal" },
      { parameter: "Free T4", value: "1.3", unit: "ng/dL", referenceRange: "0.8-1.8", flag: "Normal" },
      { parameter: "Free T3", value: "3.2", unit: "pg/mL", referenceRange: "2.3-4.2", flag: "Normal" },
    ],
    technician: "Mike Davis",
    reviewedBy: "Dr. Lisa Anderson",
    criticalValues: [],
    notes: "Thyroid function within normal limits. No intervention required at this time.",
    attachments: ["thyroid_test_003.pdf"]
  }
];

export default function LabReports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [testTypeFilter, setTestTypeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<typeof sampleLabReports[0] | null>(null);
  const [isReportViewOpen, setIsReportViewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const filteredReports = sampleLabReports.filter((report) => {
    const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.physician.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesTestType = testTypeFilter === "all" || report.testType.toLowerCase().includes(testTypeFilter.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || report.department.toLowerCase() === departmentFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesTestType && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'final': return 'bg-green-100 text-green-800 border-green-200';
      case 'preliminary': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending review': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'routine': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFlagIcon = (flag: string) => {
    switch (flag.toLowerCase()) {
      case 'high': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'low': return <TrendingDown className="h-4 w-4 text-blue-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getFlagColor = (flag: string) => {
    switch (flag.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      case 'critical': return 'text-red-700 bg-red-100 font-bold';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const viewReport = (report: typeof sampleLabReports[0]) => {
    setSelectedReport(report);
    setIsReportViewOpen(true);
  };

  const downloadReport = (reportId: string) => {
    toast({
      title: "Report Downloaded",
      description: `Lab report ${reportId} has been downloaded successfully.`,
      variant: "success",
    });
  };

  const sendToPhysician = (report: typeof sampleLabReports[0]) => {
    toast({
      title: "Report Sent",
      description: `Lab report has been sent to ${report.physician}.`,
      variant: "success",
    });
  };

  const printReport = (report: typeof sampleLabReports[0]) => {
    toast({
      title: "Printing Report",
      description: `Preparing ${report.id} for printing...`,
    });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform md:relative md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Lab Reports</h1>
                <p className="text-muted-foreground mt-1">View and manage completed laboratory reports and results</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Button>
                <Button variant="outline" className="gap-2">
                  <Printer className="h-4 w-4" />
                  Bulk Print
                </Button>
              </div>
            </div>

            {/* Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                      <p className="text-2xl font-bold">{sampleLabReports.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Final Reports</p>
                      <p className="text-2xl font-bold">{sampleLabReports.filter(r => r.status === 'Final').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Critical Values</p>
                      <p className="text-2xl font-bold">{sampleLabReports.filter(r => r.criticalValues.length > 0).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Abnormal Results</p>
                      <p className="text-2xl font-bold">{sampleLabReports.filter(r => r.results.some(res => res.flag !== 'Normal')).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by patient name, test type, physician, or report ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                      <SelectItem value="preliminary">Preliminary</SelectItem>
                      <SelectItem value="pending review">Pending Review</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={testTypeFilter} onValueChange={setTestTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Test Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tests</SelectItem>
                      <SelectItem value="blood">Blood Tests</SelectItem>
                      <SelectItem value="lipid">Lipid Panel</SelectItem>
                      <SelectItem value="thyroid">Thyroid Tests</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="internal medicine">Internal Medicine</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="endocrinology">Endocrinology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle>Laboratory Reports</CardTitle>
                <CardDescription>
                  All completed laboratory test reports and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test Type</TableHead>
                      <TableHead>Physician</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Report Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{report.patientName}</p>
                            <p className="text-sm text-muted-foreground">{report.patientId} • {report.age} {report.gender}</p>
                          </div>
                        </TableCell>
                        <TableCell>{report.testType}</TableCell>
                        <TableCell>{report.physician}</TableCell>
                        <TableCell>{report.department}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant="outline" className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                            {report.criticalValues.length > 0 && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                                Critical
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{report.reportDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => viewReport(report)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => downloadReport(report.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => sendToPhysician(report)}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredReports.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No lab reports found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== "all" || testTypeFilter !== "all"
                        ? "Try adjusting your search criteria"
                        : "No completed lab reports available"
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Report View Dialog */}
      <Dialog open={isReportViewOpen} onOpenChange={setIsReportViewOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Laboratory Report - {selectedReport?.testType}
            </DialogTitle>
            <div className="text-sm text-muted-foreground">
              Report ID: {selectedReport?.id} • Order ID: {selectedReport?.orderId}
            </div>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Patient Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{selectedReport.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Patient ID:</span>
                      <span>{selectedReport.patientId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Age/Gender:</span>
                      <span>{selectedReport.age} years, {selectedReport.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Ordering Physician:</span>
                      <span>{selectedReport.physician}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Department:</span>
                      <span>{selectedReport.department}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Report Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Order Date:</span>
                      <span>{selectedReport.orderDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Report Date:</span>
                      <span>{selectedReport.reportDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge className={getStatusColor(selectedReport.status)}>
                        {selectedReport.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Priority:</span>
                      <Badge className={getPriorityColor(selectedReport.priority)}>
                        {selectedReport.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Results */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Test Results</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Parameter</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Reference Range</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedReport.results.map((result, index) => (
                      <TableRow key={index} className={result.flag !== 'Normal' ? 'bg-muted/30' : ''}>
                        <TableCell className="font-medium">{result.parameter}</TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-2 px-2 py-1 rounded ${getFlagColor(result.flag)}`}>
                            {getFlagIcon(result.flag)}
                            <span className="font-semibold">{result.value}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{result.unit}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {result.referenceRange}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getFlagColor(result.flag).replace('bg-', '')}>
                            {result.flag}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Laboratory Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Laboratory Information</h3>
                  <div className="space-y-2 text-sm p-3 bg-muted/30 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">Technician:</span>
                      <span>{selectedReport.technician}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Reviewed By:</span>
                      <span>{selectedReport.reviewedBy}</span>
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                {selectedReport.attachments.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Attachments</h3>
                    <div className="space-y-2">
                      {selectedReport.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <span className="text-sm">{file}</span>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Clinical Notes */}
              {selectedReport.notes && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Clinical Notes</h3>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm">{selectedReport.notes}</p>
                  </div>
                </div>
              )}

              {/* Critical Values Alert */}
              {selectedReport.criticalValues.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-800 text-lg">Critical Values Alert</span>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    {selectedReport.criticalValues.map((value, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Generated on {selectedReport.reportDate} by {selectedReport.technician}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsReportViewOpen(false)}>
                    Close
                  </Button>
                  <Button variant="outline" onClick={() => printReport(selectedReport)}>
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button variant="outline" onClick={() => downloadReport(selectedReport.id)}>
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </Button>
                  <Button onClick={() => sendToPhysician(selectedReport)}>
                    <Send className="h-4 w-4 mr-1" />
                    Send to Physician
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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