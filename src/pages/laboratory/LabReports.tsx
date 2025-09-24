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
import { Search, Download, Eye, Calendar, User, FileText, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample data for lab reports
const sampleLabReports = [
  {
    id: "LR001",
    orderId: "LO001",
    patientName: "John Smith",
    patientId: "P001",
    testType: "Complete Blood Count",
    reportDate: "2024-01-16",
    orderDate: "2024-01-15",
    physician: "Dr. Johnson",
    status: "Final",
    priority: "Urgent",
    results: [
      { parameter: "Hemoglobin", value: "12.5", unit: "g/dL", referenceRange: "13.5-17.5", flag: "Low" },
      { parameter: "White Blood Cell Count", value: "8.2", unit: "× 10³/μL", referenceRange: "4.5-11.0", flag: "Normal" },
      { parameter: "Platelet Count", value: "350", unit: "× 10³/μL", referenceRange: "150-450", flag: "Normal" },
    ],
    technician: "John Martinez",
    reviewedBy: "Dr. Patricia Wilson",
    criticalValues: ["Hemoglobin: 12.5 g/dL (Low)"]
  },
  {
    id: "LR002",
    orderId: "LO002",
    patientName: "Sarah Davis",
    patientId: "P002",
    testType: "Lipid Panel",
    reportDate: "2024-01-15",
    orderDate: "2024-01-14",
    physician: "Dr. Williams",
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
    criticalValues: []
  },
  {
    id: "LR003",
    orderId: "LO003",
    patientName: "Michael Brown",
    patientId: "P003",
    testType: "Thyroid Function Test",
    reportDate: "2024-01-14",
    orderDate: "2024-01-13",
    physician: "Dr. Davis",
    status: "Final",
    priority: "Routine",
    results: [
      { parameter: "TSH", value: "2.1", unit: "mIU/L", referenceRange: "0.4-4.0", flag: "Normal" },
      { parameter: "Free T4", value: "1.3", unit: "ng/dL", referenceRange: "0.8-1.8", flag: "Normal" },
      { parameter: "Free T3", value: "3.2", unit: "pg/mL", referenceRange: "2.3-4.2", flag: "Normal" },
    ],
    technician: "Mike Davis",
    reviewedBy: "Dr. Lisa Anderson",
    criticalValues: []
  }
];

export default function LabReports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [testTypeFilter, setTestTypeFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<typeof sampleLabReports[0] | null>(null);
  const [isReportViewOpen, setIsReportViewOpen] = useState(false);
  const { toast } = useToast();

  const filteredReports = sampleLabReports.filter((report) => {
    const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesTestType = testTypeFilter === "all" || report.testType.toLowerCase().includes(testTypeFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesTestType;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'final': return 'bg-green-100 text-green-800';
      case 'preliminary': return 'bg-yellow-100 text-yellow-800';
      case 'pending review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'routine': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
      case 'high': return 'text-red-600';
      case 'low': return 'text-blue-600';
      case 'critical': return 'text-red-700 font-bold';
      default: return 'text-green-600';
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Lab Reports</h1>
            <p className="text-muted-foreground">View and manage completed laboratory reports</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name, test type, or report ID..."
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
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Test Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tests</SelectItem>
              <SelectItem value="blood">Blood Tests</SelectItem>
              <SelectItem value="lipid">Lipid Panel</SelectItem>
              <SelectItem value="thyroid">Thyroid Tests</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lab Reports Grid */}
        <div className="grid gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{report.testType}</CardTitle>
                    <CardDescription>Report ID: {report.id} | Order ID: {report.orderId}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(report.priority)}>
                      {report.priority}
                    </Badge>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    {report.criticalValues.length > 0 && (
                      <Badge className="bg-red-100 text-red-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Critical Values
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{report.patientName}</p>
                      <p className="text-sm text-muted-foreground">ID: {report.patientId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Report Date</p>
                      <p className="text-sm text-muted-foreground">{report.reportDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Physician</p>
                      <p className="text-sm text-muted-foreground">{report.physician}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Reviewed By</p>
                      <p className="text-sm text-muted-foreground">{report.reviewedBy}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Results Preview */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Key Results:</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.results.slice(0, 3).map((result, index) => (
                      <div key={index} className={`text-sm px-2 py-1 rounded ${getFlagColor(result.flag)}`}>
                        {getFlagIcon(result.flag)}
                        <span className="ml-1">
                          {result.parameter}: {result.value} {result.unit}
                          {result.flag !== "Normal" && ` (${result.flag})`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {report.criticalValues.length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800">Critical Values Alert</span>
                    </div>
                    <ul className="text-sm text-red-700">
                      {report.criticalValues.map((value, index) => (
                        <li key={index}>• {value}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => viewReport(report)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View Report
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadReport(report.id)}>
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </Button>
                  <Button size="sm">Send to Physician</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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

        {/* Report View Dialog */}
        <Dialog open={isReportViewOpen} onOpenChange={setIsReportViewOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Lab Report - {selectedReport?.testType}</DialogTitle>
              <div className="text-sm text-muted-foreground">
                Report ID: {selectedReport?.id} | Patient: {selectedReport?.patientName}
              </div>
            </DialogHeader>
            
            {selectedReport && (
              <div className="space-y-6">
                {/* Report Header */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Patient Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedReport.patientName}</p>
                      <p><span className="font-medium">Patient ID:</span> {selectedReport.patientId}</p>
                      <p><span className="font-medium">Ordering Physician:</span> {selectedReport.physician}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Report Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Order Date:</span> {selectedReport.orderDate}</p>
                      <p><span className="font-medium">Report Date:</span> {selectedReport.reportDate}</p>
                      <p><span className="font-medium">Status:</span> 
                        <Badge className={`ml-2 ${getStatusColor(selectedReport.status)}`}>
                          {selectedReport.status}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Test Results */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Test Results</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parameter</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Reference Range</TableHead>
                        <TableHead>Flag</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedReport.results.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{result.parameter}</TableCell>
                          <TableCell className={getFlagColor(result.flag)}>
                            {result.value}
                          </TableCell>
                          <TableCell>{result.unit}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {result.referenceRange}
                          </TableCell>
                          <TableCell>
                            <div className={`flex items-center gap-1 ${getFlagColor(result.flag)}`}>
                              {getFlagIcon(result.flag)}
                              <span>{result.flag}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Lab Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Laboratory Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><span className="font-medium">Technician:</span> {selectedReport.technician}</p>
                    <p><span className="font-medium">Reviewed By:</span> {selectedReport.reviewedBy}</p>
                  </div>
                </div>

                {/* Critical Values Alert */}
                {selectedReport.criticalValues.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-semibold text-red-800">Critical Values Alert</span>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {selectedReport.criticalValues.map((value, index) => (
                        <li key={index}>• {value}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsReportViewOpen(false)}>
                    Close
                  </Button>
                  <Button variant="outline" onClick={() => downloadReport(selectedReport.id)}>
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </Button>
                  <Button>Send to Physician</Button>
                 </div>
               </div>
             )}
           </DialogContent>
         </Dialog>
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