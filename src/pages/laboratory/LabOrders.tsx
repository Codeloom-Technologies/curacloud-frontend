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
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Calendar, User, FileText, Clock, Download, Upload, Eye, Edit, TestTube, AlertTriangle, FileUp, Type, X, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Enhanced sample data for lab orders
const sampleLabOrders = [
  {
    id: "L0001",
    patientName: "John Smith",
    patientId: "P001",
    orderDate: "2024-01-15",
    testType: "Complete Blood Count",
    priority: "Urgent",
    status: "Pending",
    orderingPhysician: "Dr. Johnson",
    notes: "Patient experiencing fatigue and weakness",
    requiredSamples: ["Blood"],
    estimatedCompletion: "2024-01-16",
    results: null,
    parameters: [
      { name: "Hemoglobin", unit: "g/dL", range: "13.5-17.5" },
      { name: "White Blood Cell Count", unit: "× 10³/μL", range: "4.5-11.0" },
      { name: "Platelet Count", unit: "× 10³/μL", range: "150-450" },
    ]
  },
  {
    id: "L0002",
    patientName: "Sarah Davis",
    patientId: "P002",
    orderDate: "2024-01-14",
    testType: "Lipid Panel",
    priority: "Routine",
    status: "In Progress",
    orderingPhysician: "Dr. Williams",
    notes: "Annual checkup - cholesterol monitoring",
    requiredSamples: ["Blood"],
    estimatedCompletion: "2024-01-17",
    results: null,
    parameters: [
      { name: "Total Cholesterol", unit: "mg/dL", range: "<200" },
      { name: "HDL Cholesterol", unit: "mg/dL", range: ">40" },
      { name: "LDL Cholesterol", unit: "mg/dL", range: "<100" },
      { name: "Triglycerides", unit: "mg/dL", range: "<150" },
    ]
  },
  {
    id: "L0003",
    patientName: "Michael Brown",
    patientId: "P003",
    orderDate: "2024-01-13",
    testType: "Thyroid Function Test",
    priority: "Routine",
    status: "Completed",
    orderingPhysician: "Dr. Davis",
    notes: "Follow-up for thyroid medication adjustment",
    requiredSamples: ["Blood"],
    estimatedCompletion: "2024-01-15",
    results: {
      fileUrl: "/lab-results/thyroid-001.pdf",
      fileName: "thyroid_results_001.pdf",
      uploadedAt: "2024-01-15 14:30",
      uploadedBy: "Lab Technician",
      findings: "Normal thyroid function levels",
      method: "file" // or "manual"
    }
  }
];

export default function LabOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("file");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredOrders = sampleLabOrders.filter((order) => {
    const matchesSearch = order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === "all" || order.priority.toLowerCase() === priorityFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
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

  const handleNewOrder = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Lab Order Created",
      description: "New lab order has been successfully created.",
      variant: "success",
    });
    setIsNewOrderOpen(false);
  };

  const openResultsDialog = (order: any, method: 'file' | 'manual' = 'file') => {
    setSelectedOrder(order);
    setActiveTab(method);
    setIsResultsDialogOpen(true);
    
    if (method === 'manual') {
      // Pre-populate results based on test parameters
      const initialResults = order.parameters.map((param: any) => ({
        parameter: param.name,
        value: "",
        unit: param.unit,
        referenceRange: param.range,
        flag: "Normal"
      }));
      setTestResults(initialResults);
    } else {
      setUploadedFiles([]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleViewReport = (order:any) => navigate(`/dashboard/lab/reports/${order.id}`)

  const updateResult = (index: number, field: string, value: string) => {
    const updatedResults = [...testResults];
    updatedResults[index] = { ...updatedResults[index], [field]: value };
    
    // Auto-detect flag based on value and reference range
    if (field === 'value' && value) {
      const range = updatedResults[index].referenceRange;
      const numValue = parseFloat(value);
      
      if (range.includes('-')) {
        const [min, max] = range.split('-').map(parseFloat);
        if (numValue < min) updatedResults[index].flag = 'Low';
        else if (numValue > max) updatedResults[index].flag = 'High';
        else updatedResults[index].flag = 'Normal';
      } else if (range.startsWith('<')) {
        const max = parseFloat(range.slice(1));
        updatedResults[index].flag = numValue > max ? 'High' : 'Normal';
      } else if (range.startsWith('>')) {
        const min = parseFloat(range.slice(1));
        updatedResults[index].flag = numValue < min ? 'Low' : 'Normal';
      }
    }
    
    setTestResults(updatedResults);
  };

  const addCustomParameter = () => {
    setTestResults(prev => [...prev, {
      parameter: "",
      value: "",
      unit: "",
      referenceRange: "",
      flag: "Normal"
    }]);
  };

  const removeParameter = (index: number) => {
    setTestResults(prev => prev.filter((_, i) => i !== index));
  };

  const submitFileResults = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Results Uploaded",
      description: `Lab results for ${selectedOrder?.patientName} have been uploaded successfully.`,
      variant: "success",
    });
    setIsResultsDialogOpen(false);
  };

  const submitManualResults = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Results Submitted",
      description: `Manual lab results for ${selectedOrder?.patientName} have been saved successfully.`,
      variant: "success",
    });
    setIsResultsDialogOpen(false);
  };

  const handleViewResults = (order: any) => {
    toast({
      title: "Downloading Results",
      description: `Downloading ${order.results.fileName}`,
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
                <h1 className="text-3xl font-bold tracking-tight">Lab Orders</h1>
                <p className="text-muted-foreground mt-1">Manage laboratory test orders and results</p>
              </div>
              
              <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Lab Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Lab Order</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleNewOrder} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patient">Patient</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="P001">John Smith - P001</SelectItem>
                            <SelectItem value="P002">Sarah Davis - P002</SelectItem>
                            <SelectItem value="P003">Michael Brown - P003</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="physician">Ordering Physician</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select physician" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                            <SelectItem value="dr-williams">Dr. Williams</SelectItem>
                            <SelectItem value="dr-davis">Dr. Davis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="test-type">Test Type</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select test type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cbc">Complete Blood Count</SelectItem>
                            <SelectItem value="lipid">Lipid Panel</SelectItem>
                            <SelectItem value="thyroid">Thyroid Function Test</SelectItem>
                            <SelectItem value="glucose">Glucose Test</SelectItem>
                            <SelectItem value="liver">Liver Function Test</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="routine">Routine</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="stat">STAT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="samples">Required Samples</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select samples required" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blood">Blood</SelectItem>
                          <SelectItem value="urine">Urine</SelectItem>
                          <SelectItem value="tissue">Tissue</SelectItem>
                          <SelectItem value="saliva">Saliva</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Clinical Notes</Label>
                      <Textarea 
                        id="notes"
                        placeholder="Enter any relevant clinical information or special instructions..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsNewOrderOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Order</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold">{sampleLabOrders.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold">{sampleLabOrders.filter(o => o.status === 'Pending').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TestTube className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-bold">{sampleLabOrders.filter(o => o.status === 'In Progress').length}</p>
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
                      <p className="text-sm font-medium text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">{sampleLabOrders.filter(o => o.status === 'Completed').length}</p>
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
                      placeholder="Search by patient name, test type, or order ID..."
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lab Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lab Orders</CardTitle>
                <CardDescription>
                  Manage and track all laboratory test orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Results</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.patientName}</p>
                            <p className="text-sm text-muted-foreground">ID: {order.patientId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{order.testType}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getPriorityColor(order.priority)}>
                            {order.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell>
                          {order.results ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                           <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewReport(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {order.status !== 'Completed' && (
                              <div className="flex gap-1">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openResultsDialog(order, 'file')}
                                >
                                  <FileUp className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openResultsDialog(order, 'manual')}
                                >
                                  <Type className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            {order.results && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewResults(order)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No lab orders found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                        ? "Try adjusting your search criteria"
                        : "Create your first lab order to get started"
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Results Dialog with Tabs */}
      <Dialog open={isResultsDialogOpen} onOpenChange={setIsResultsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Add Lab Results - {selectedOrder?.patientName}
            </DialogTitle>
            <CardDescription>
              {selectedOrder?.testType} | Order ID: {selectedOrder?.id}
            </CardDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <FileUp className="h-4 w-4" />
                    Upload File
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Enter Manually
                  </TabsTrigger>
                </TabsList>
                
                {/* File Upload Tab */}
                <TabsContent value="file" className="space-y-4">
                  <form onSubmit={submitFileResults}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Upload Result Files</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop your lab result files here, or click to browse
                          </p>
                          <Input 
                            type="file" 
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.csv"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <Button 
                            variant="outline" 
                            type="button" 
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            Browse Files
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, XLSX, CSV (Max: 25MB per file)
                        </p>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          <Label>Selected Files</Label>
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="technician">Lab Technician</Label>
                          <Input id="technician" placeholder="Enter technician name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="report-date">Report Date</Label>
                          <Input id="report-date" type="date" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="findings">Clinical Interpretation</Label>
                        <Textarea 
                          id="findings"
                          placeholder="Enter clinical interpretation and notes..."
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="critical-values" />
                        <Label htmlFor="critical-values">Mark as containing critical values</Label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsResultsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={uploadedFiles.length === 0}>
                        <Upload className="h-4 w-4 mr-1" />
                        Upload Results
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Manual Entry Tab */}
                <TabsContent value="manual" className="space-y-4">
                  <form onSubmit={submitManualResults}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Test Parameters and Results</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addCustomParameter}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Parameter
                        </Button>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parameter</TableHead>
                            <TableHead>Result</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Reference Range</TableHead>
                            <TableHead>Flag</TableHead>
                            <TableHead className="w-[80px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {testResults.map((result, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Input
                                  value={result.parameter}
                                  onChange={(e) => updateResult(index, 'parameter', e.target.value)}
                                  placeholder="Parameter name"
                                  required
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={result.value}
                                  onChange={(e) => updateResult(index, 'value', e.target.value)}
                                  placeholder="Value"
                                  required
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={result.unit}
                                  onChange={(e) => updateResult(index, 'unit', e.target.value)}
                                  placeholder="Unit"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={result.referenceRange}
                                  onChange={(e) => updateResult(index, 'referenceRange', e.target.value)}
                                  placeholder="Reference range"
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={result.flag}
                                  onValueChange={(value) => updateResult(index, 'flag', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Normal">Normal</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeParameter(index)}
                                  disabled={testResults.length <= 1}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="manual-technician">Lab Technician</Label>
                          <Input id="manual-technician" placeholder="Enter technician name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="manual-report-date">Report Date</Label>
                          <Input id="manual-report-date" type="date" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="manual-interpretation">Clinical Interpretation</Label>
                        <Textarea 
                          id="manual-interpretation"
                          placeholder="Enter clinical interpretation, notes, and recommendations..."
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="manual-critical" />
                        <Label htmlFor="manual-critical">Mark report as containing critical values</Label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsResultsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Send className="h-4 w-4 mr-1" />
                        Submit Results
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
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