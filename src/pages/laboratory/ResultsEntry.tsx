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
import { Search, Plus, Calendar, User, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample data for pending results
const samplePendingResults = [
  {
    id: "LO001",
    patientName: "John Smith",
    patientId: "P001",
    orderDate: "2024-01-15",
    testType: "Complete Blood Count",
    priority: "Urgent",
    orderingPhysician: "Dr. Johnson",
    sampleCollected: true,
    collectionDate: "2024-01-15",
    expectedResults: [
      { parameter: "Hemoglobin", referenceRange: "13.5-17.5 g/dL", unit: "g/dL" },
      { parameter: "White Blood Cell Count", referenceRange: "4.5-11.0 × 10³/μL", unit: "× 10³/μL" },
      { parameter: "Platelet Count", referenceRange: "150-450 × 10³/μL", unit: "× 10³/μL" },
    ]
  },
  {
    id: "LO002",
    patientName: "Sarah Davis",
    patientId: "P002",
    orderDate: "2024-01-14",
    testType: "Lipid Panel",
    priority: "Routine",
    orderingPhysician: "Dr. Williams",
    sampleCollected: true,
    collectionDate: "2024-01-14",
    expectedResults: [
      { parameter: "Total Cholesterol", referenceRange: "<200 mg/dL", unit: "mg/dL" },
      { parameter: "HDL Cholesterol", referenceRange: ">40 mg/dL (M), >50 mg/dL (F)", unit: "mg/dL" },
      { parameter: "LDL Cholesterol", referenceRange: "<100 mg/dL", unit: "mg/dL" },
      { parameter: "Triglycerides", referenceRange: "<150 mg/dL", unit: "mg/dL" },
    ]
  }
];

export default function ResultsEntry() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isResultsEntryOpen, setIsResultsEntryOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<typeof samplePendingResults[0] | null>(null);
  const [resultValues, setResultValues] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const filteredOrders = samplePendingResults.filter((order) => {
    const matchesSearch = order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "all" || order.priority.toLowerCase() === priorityFilter.toLowerCase();
    
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'routine': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResultsEntry = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Results Entered",
      description: "Lab results have been successfully entered and are ready for review.",
    });
    setIsResultsEntryOpen(false);
    setSelectedOrder(null);
    setResultValues({});
  };

  const openResultsEntry = (order: typeof samplePendingResults[0]) => {
    setSelectedOrder(order);
    setIsResultsEntryOpen(true);
  };

  const updateResultValue = (parameter: string, value: string) => {
    setResultValues(prev => ({
      ...prev,
      [parameter]: value
    }));
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
            <h1 className="text-3xl font-bold">Results Entry</h1>
            <p className="text-muted-foreground">Enter and validate laboratory test results</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name, test type, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
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

        {/* Pending Results Grid */}
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{order.testType}</CardTitle>
                    <CardDescription>Order ID: {order.id}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority}
                    </Badge>
                    {order.sampleCollected ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Sample Collected
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Awaiting Sample
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{order.patientName}</p>
                      <p className="text-sm text-muted-foreground">ID: {order.patientId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Order Date</p>
                      <p className="text-sm text-muted-foreground">{order.orderDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Physician</p>
                      <p className="text-sm text-muted-foreground">{order.orderingPhysician}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">View Order Details</Button>
                  <Button 
                    size="sm" 
                    onClick={() => openResultsEntry(order)}
                    disabled={!order.sampleCollected}
                  >
                    Enter Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No pending results found</h3>
            <p className="text-muted-foreground">
              {searchTerm || priorityFilter !== "all"
                ? "Try adjusting your search criteria"
                : "All lab results have been entered"
              }
            </p>
          </div>
        )}

        {/* Results Entry Dialog */}
        <Dialog open={isResultsEntryOpen} onOpenChange={setIsResultsEntryOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Enter Lab Results - {selectedOrder?.testType}</DialogTitle>
              <div className="text-sm text-muted-foreground">
                Patient: {selectedOrder?.patientName} | Order ID: {selectedOrder?.id}
              </div>
            </DialogHeader>
            
            {selectedOrder && (
              <form onSubmit={handleResultsEntry} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Collection Date</Label>
                    <Input type="date" defaultValue={selectedOrder.collectionDate} />
                  </div>
                  <div className="space-y-2">
                    <Label>Technician</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select technician" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech1">John Martinez - Lab Tech</SelectItem>
                        <SelectItem value="tech2">Sarah Johnson - Lab Tech</SelectItem>
                        <SelectItem value="tech3">Mike Davis - Senior Tech</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Test Results</h3>
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
                      {selectedOrder.expectedResults.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{result.parameter}</TableCell>
                          <TableCell>
                            <Input
                              placeholder="Enter result"
                              value={resultValues[result.parameter] || ""}
                              onChange={(e) => updateResultValue(result.parameter, e.target.value)}
                              required
                            />
                          </TableCell>
                          <TableCell>{result.unit}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {result.referenceRange}
                          </TableCell>
                          <TableCell>
                            <Select>
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="Flag" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments">Additional Comments</Label>
                  <Textarea 
                    id="comments"
                    placeholder="Enter any additional observations or comments..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality-control">Quality Control Status</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select QC status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passed">QC Passed</SelectItem>
                      <SelectItem value="failed">QC Failed - Rerun Required</SelectItem>
                      <SelectItem value="pending">QC Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsResultsEntryOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="button" variant="outline">Save Draft</Button>
                  <Button type="submit">Submit Results</Button>
                </div>
              </form>
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