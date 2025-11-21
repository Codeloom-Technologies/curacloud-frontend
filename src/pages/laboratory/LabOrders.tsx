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
import { Search, Plus, Calendar, User, FileText, Clock, Download, Upload, Eye, Edit, TestTube, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Enhanced sample data for lab orders
const sampleLabOrders = [
  {
    id: "LO001",
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
    results: null
  },
  {
    id: "LO002",
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
    results: null
  },
  {
    id: "LO003",
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
      findings: "Normal thyroid function levels"
    }
  }
];

export default function LabOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isUploadResultsOpen, setIsUploadResultsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

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

  const handleFileUpload = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Results Uploaded",
      description: "Lab results have been successfully uploaded.",
      variant: "success",
    });
    setIsUploadResultsOpen(false);
  };

  const handleUploadResults = (order: any) => {
    setSelectedOrder(order);
    setIsUploadResultsOpen(true);
  };

  const handleViewResults = (order: any) => {
    // Simulate viewing/downloading results
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
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {order.status !== 'Completed' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUploadResults(order)}
                              >
                                <Upload className="h-4 w-4" />
                              </Button>
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

      {/* Upload Results Dialog */}
      <Dialog open={isUploadResultsOpen} onOpenChange={setIsUploadResultsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Lab Results</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Order Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Patient:</span>
                    <p>{selectedOrder.patientName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Test Type:</span>
                    <p>{selectedOrder.testType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Order ID:</span>
                    <p>{selectedOrder.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Priority:</span>
                    <p>{selectedOrder.priority}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="results-file">Upload Results File</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your lab results file here, or click to browse
                    </p>
                    <Button variant="outline" type="button">
                      Browse Files
                    </Button>
                    <Input 
                      id="results-file"
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max: 10MB)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="findings">Findings Summary</Label>
                  <Textarea 
                    id="findings"
                    placeholder="Enter a brief summary of the lab findings..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technician">Lab Technician</Label>
                  <Input 
                    id="technician"
                    placeholder="Enter technician name"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsUploadResultsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Upload Results</Button>
              </div>
            </form>
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