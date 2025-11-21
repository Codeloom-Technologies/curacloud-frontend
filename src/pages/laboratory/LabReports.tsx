import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Printer, Send, Calendar, User, AlertTriangle, TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - replace with actual API call
const labReports = [
  {
    id: "L0002",
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
    ],
    technician: "John Martinez",
    reviewedBy: "Dr. Patricia Wilson",
    criticalValues: ["Hemoglobin: 12.5 g/dL (Low)"],
    notes: "Patient shows signs of anemia. Recommend iron studies and follow-up.",
    attachments: ["cbc_report_001.pdf", "blood_smear_001.jpg"]
  },
  {
    id: "L0001",
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
      { parameter: "HDL Cholesterol", value: "45", unit: "mg/dL", referenceRange: ">40", flag: "Low" },
      { parameter: "LDL Cholesterol", value: "165", unit: "mg/dL", referenceRange: "<100", flag: "High" },
    ],
    technician: "Sarah Johnson",
    reviewedBy: "Dr. Michael Chen",
    criticalValues: [],
    notes: "Elevated lipid levels observed. Consider lifestyle modifications.",
    attachments: ["lipid_panel_002.pdf"]
  }
];

export default function LabReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  console.log('id', id)

  useEffect(() => {
    // Simulate API call
    const fetchReport = async () => {
      setLoading(true);
      try {
        // In real app, this would be: await api.getLabReport(id);
        setTimeout(() => {
        const foundReport = labReports.find((report) => report.id == id);
          console.log({fetchReport})
          if (!foundReport) {
            toast({
              title: "Report Not Found",
              description: "The requested lab report could not be found.",
              variant: "destructive",
            });
            // navigate("/dashboard/lab/orders");
            return;
          }
          setReport(foundReport);
          setLoading(false);
        }, 500);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load lab report.",
          variant: "destructive",
        });
        // navigate("/lab/orders");
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id, navigate, toast]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'final': return 'bg-green-100 text-green-800 border-green-200';
      case 'preliminary': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'routine': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFlagIcon = (flag) => {
    switch (flag?.toLowerCase()) {
      case 'high': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'low': return <TrendingDown className="h-4 w-4 text-blue-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getFlagColor = (flag) => {
    switch (flag?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      case 'critical': return 'text-red-700 bg-red-100 font-bold';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Downloading ${report?.testType} report...`,
      variant: "success",
    });
    // Implement actual download logic
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendToPhysician = () => {
    toast({
      title: "Report Sent",
      description: `Lab report sent to ${report?.physician}`,
      variant: "success",
    });
  };

  const handleBack = () => {
    navigate("/dashboard/lab/orders");
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading lab report...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
              <p className="text-muted-foreground mb-4">The requested lab report could not be found.</p>
              <Button onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lab Orders
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 print:p-0">
          <div className="max-w-6xl mx-auto space-y-6 print:max-w-none">
            {/* Header Actions */}
            <div className="flex justify-between items-center print:hidden">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Lab Report</h1>
                  <p className="text-muted-foreground mt-1">
                    Detailed laboratory test results and analysis
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={handleSendToPhysician}>
                  <Send className="h-4 w-4 mr-2" />
                  Send to Physician
                </Button>
              </div>
            </div>

            {/* Report Header */}
            <Card className="print:shadow-none print:border-0">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patient Information */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Patient Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-muted-foreground">Name:</span>
                        <span className="font-semibold">{report.patientName}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-muted-foreground">Patient ID:</span>
                        <span>{report.patientId}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-muted-foreground">Age/Gender:</span>
                        <span>{report.age} years, {report.gender}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-muted-foreground">Ordering Physician:</span>
                        <span>{report.physician}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-muted-foreground">Department:</span>
                        <span>{report.department}</span>
                      </div>
                    </div>
                  </div>

                  {/* Report Information */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Report Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-muted-foreground">Report ID:</span>
                        <span className="font-semibold">{report.id}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-muted-foreground">Order ID:</span>
                        <span>{report.orderId}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-muted-foreground">Order Date:</span>
                        <span>{report.orderDate}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-muted-foreground">Report Date:</span>
                        <span>{report.reportDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-muted-foreground">Status/Priority:</span>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          <Badge className={getPriorityColor(report.priority)}>
                            {report.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            <Card className="print:shadow-none print:border-0">
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>
                  Laboratory findings and analysis for {report.testType}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Test Parameter</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Reference Range</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.results.map((result, index) => (
                      <TableRow key={index} className={result.flag !== 'Normal' ? 'bg-muted/30' : ''}>
                        <TableCell className="font-medium">{result.parameter}</TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getFlagColor(result.flag)}`}>
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
              </CardContent>
            </Card>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
              {/* Laboratory Information */}
              <Card className="print:shadow-none print:border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Laboratory Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-muted-foreground">Technician:</span>
                      <span>{report.technician}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Reviewed By:</span>
                      <span>{report.reviewedBy}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Attachments */}
              {report.attachments.length > 0 && (
                <Card className="print:shadow-none print:border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {report.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <span className="text-sm">{file}</span>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Clinical Notes */}
            {report.notes && (
              <Card className="print:shadow-none print:border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Clinical Interpretation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm">{report.notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Critical Values Alert */}
            {report.criticalValues.length > 0 && (
              <Card className="bg-red-50 border-red-200 print:shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    <span className="font-semibold text-red-800 text-lg">Critical Values Alert</span>
                  </div>
                  <ul className="text-sm text-red-700 space-y-2">
                    {report.criticalValues.map((value, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        {value}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Print Footer */}
            <div className="hidden print:block mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
              <p>Generated on {report.reportDate} by {report.technician}</p>
              <p>Hospital Laboratory Management System</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}