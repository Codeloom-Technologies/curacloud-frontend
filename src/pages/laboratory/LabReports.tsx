import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Printer, Send, Calendar, User, AlertTriangle, TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getLabOrderReport } from "@/services/lab";
import { useQuery } from "@tanstack/react-query";

export default function LabReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    data: labReport,
    isFetching,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lab-order-view", id],
    queryFn: () => getLabOrderReport(id!),
    enabled: !!id,
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'final': return 'bg-green-100 text-green-800 border-green-200';
      case 'preliminary': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending review': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'final': return 'Final';
      case 'preliminary': return 'Preliminary';
      case 'pending review': return 'Pending Review';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'stat': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'routine': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'routine': return 'Routine';
      case 'urgent': return 'Urgent';
      case 'stat': return 'STAT';
      default: return priority;
    }
  };

  const getFlagIcon = (flag: string) => {
    switch (flag?.toLowerCase()) {
      case 'high': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'low': return <TrendingDown className="h-4 w-4 text-blue-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getFlagColor = (flag: string) => {
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
      description: `Downloading ${labReport?.testType} report...`,
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
      description: `Lab report sent to ${labReport?.physician}`,
      variant: "success",
    });
  };

  const handleBack = () => {
    navigate("/dashboard/lab/orders");
  };

  if (isLoading || isFetching) {
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

  if (error || !labReport) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
              <p className="text-muted-foreground mb-4">
                {error ? "Error loading lab report" : "The requested lab report could not be found."}
              </p>
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

  const report = labReport;

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
                        <span className="font-semibold">{report?.patient?.user?.fullName}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-muted-foreground">Patient ID:</span>
                        <span>{report.patient?.medicalRecordNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-muted-foreground">Gender:</span>
                        <span>{report.patient?.user?.gender || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-muted-foreground">Ordering Physician:</span>
                        <span>{report.physician || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-muted-foreground">Department:</span>
                        <span>{report.department || 'N/A'}</span>
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
                        <span className="font-semibold">{report?.report?.reportId || report.id}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-muted-foreground">Order ID:</span>
                        <span>{report.orderId}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-muted-foreground">Test Type:</span>
                        <span>{report.testType}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-muted-foreground">Report Date:</span>
                        <span>{new Date(report.reportDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-muted-foreground">Status/Priority:</span>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(report.status)}>
                            {getStatusText(report.status)}
                          </Badge>
                          <Badge className={getPriorityColor(report.priority)}>
                            {getPriorityText(report.priority)}
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
                    {report?.report?.results?.map((result, index) => (
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
                          <Badge variant="outline" className={getFlagColor(result.flag).replace('text-', '').replace('bg-', '')}>
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
                      <span>{report?.report?.technician?.fullName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Reviewed By:</span>
                      <span>{report.reviewedBy || 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Attachments */}
              {report.attachments && report.attachments.length > 0 && (
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

            {/* Clinical Notes & Interpretation */}
            {(report.clinicalNotes || report.interpretation) && (
              <Card className="print:shadow-none print:border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Clinical Interpretation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    {report.interpretation && (
                      <p className="text-sm mb-3">{report.interpretation}</p>
                    )}
                    {report.clinicalNotes && (
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        <p className="text-xs text-muted-foreground font-medium">Clinical Notes:</p>
                        <p className="text-sm mt-1">{report.clinicalNotes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Critical Values Alert */}
            {report.criticalValues && report.criticalValues.length > 0 && (
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
              <p>Generated on {new Date(report.reportDate).toLocaleDateString()} by {report.technician}</p>
              <p>Hospital Laboratory Management System</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}