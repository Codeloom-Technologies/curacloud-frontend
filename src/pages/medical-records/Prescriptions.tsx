import { useState } from "react";
import { Search, Plus, Calendar, User, Pill, AlertTriangle, Eye, Edit, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sidebar } from "@/components/layout/Sidebar";

// Sample prescription data
const prescriptions = [
  {
    id: "RX001",
    patientName: "Sarah Johnson",
    patientId: "P001",
    doctorName: "Dr. Michael Chen",
    date: "2024-01-15",
    status: "Active",
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take with or without food",
        quantity: 30
      },
      {
        name: "Metformin",
        dosage: "500mg", 
        frequency: "Twice daily",
        duration: "90 days",
        instructions: "Take with meals",
        quantity: 180
      }
    ],
    diagnosis: "Hypertension, Type 2 Diabetes",
    notes: "Monitor blood pressure and glucose levels",
    refillsRemaining: 2
  },
  {
    id: "RX002",
    patientName: "Robert Wilson", 
    patientId: "P002",
    doctorName: "Dr. Emily Rodriguez",
    date: "2024-01-14",
    status: "Pending",
    medications: [
      {
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "Every 6 hours as needed",
        duration: "7 days",
        instructions: "Take with food to reduce stomach irritation",
        quantity: 28
      }
    ],
    diagnosis: "Chronic headaches",
    notes: "Pending MRI results before long-term treatment",
    refillsRemaining: 0
  },
  {
    id: "RX003",
    patientName: "Maria Garcia",
    patientId: "P003",
    doctorName: "Dr. James Thompson", 
    date: "2024-01-13",
    status: "Dispensed",
    medications: [
      {
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "Three times daily",
        duration: "10 days", 
        instructions: "Complete full course even if feeling better",
        quantity: 30
      },
      {
        name: "Acetaminophen",
        dosage: "500mg",
        frequency: "Every 4-6 hours as needed",
        duration: "As needed",
        instructions: "Do not exceed 3000mg in 24 hours",
        quantity: 60
      }
    ],
    diagnosis: "Post-operative infection prevention",
    notes: "Post-appendectomy care",
    refillsRemaining: 0
  }
];

export default function Prescriptions() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState<typeof prescriptions[0] | null>(null);

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.medications.some(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || prescription.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "dispensed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "expired": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 overflow-hidden`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </Button>
            <div className="ml-4">
              <h1 className="text-xl font-semibold">Prescriptions</h1>
              <p className="text-sm text-muted-foreground">Manage patient prescriptions and medications</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">+12 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Dispensed Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">Pharmacy fulfilled</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  4 <AlertTriangle className="h-4 w-4 ml-2 text-yellow-600" />
                </div>
                <p className="text-xs text-muted-foreground">Next 7 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search prescriptions or medications..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="dispensed">Dispensed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Button className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              New Prescription
            </Button>
          </div>

          {/* Prescriptions List */}
          <div className="grid gap-4">
            {filteredPrescriptions.map((prescription) => (
              <Card key={prescription.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{prescription.patientName}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {prescription.doctorName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {prescription.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Pill className="h-4 w-4" />
                          {prescription.medications.length} medication{prescription.medications.length > 1 ? 's' : ''}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(prescription.status)}>
                        {prescription.status}
                      </Badge>
                      {prescription.refillsRemaining > 0 && (
                        <Badge variant="outline">
                          {prescription.refillsRemaining} refill{prescription.refillsRemaining > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-sm">Diagnosis: </span>
                      <span className="text-sm text-muted-foreground">{prescription.diagnosis}</span>
                    </div>
                    
                    {/* Medications Preview */}
                    <div>
                      <span className="font-medium text-sm">Medications:</span>
                      <div className="mt-2 space-y-1">
                        {prescription.medications.slice(0, 2).map((med, index) => (
                          <div key={index} className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                            <span className="font-medium">{med.name} {med.dosage}</span> - {med.frequency}
                          </div>
                        ))}
                        {prescription.medications.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{prescription.medications.length - 2} more medication{prescription.medications.length > 3 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-muted-foreground">ID: {prescription.id}</span>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedPrescription(prescription)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Prescription Details - {selectedPrescription?.patientName}</DialogTitle>
                              <DialogDescription>
                                Prescription ID: {selectedPrescription?.id}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedPrescription && (
                              <Tabs defaultValue="medications" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="medications">Medications</TabsTrigger>
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="history">History</TabsTrigger>
                                </TabsList>
                                <TabsContent value="medications">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Medication</TableHead>
                                        <TableHead>Dosage</TableHead>
                                        <TableHead>Frequency</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Quantity</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedPrescription.medications.map((med, index) => (
                                        <TableRow key={index}>
                                          <TableCell className="font-medium">{med.name}</TableCell>
                                          <TableCell>{med.dosage}</TableCell>
                                          <TableCell>{med.frequency}</TableCell>
                                          <TableCell>{med.duration}</TableCell>
                                          <TableCell>{med.quantity}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                  <div className="mt-4">
                                    <h4 className="font-medium mb-2">Instructions:</h4>
                                    {selectedPrescription.medications.map((med, index) => (
                                      <div key={index} className="text-sm text-muted-foreground mb-1">
                                        <span className="font-medium">{med.name}:</span> {med.instructions}
                                      </div>
                                    ))}
                                  </div>
                                </TabsContent>
                                <TabsContent value="details" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Patient</Label>
                                      <p className="text-sm text-muted-foreground">{selectedPrescription.patientName}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Doctor</Label>
                                      <p className="text-sm text-muted-foreground">{selectedPrescription.doctorName}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Date Prescribed</Label>
                                      <p className="text-sm text-muted-foreground">{selectedPrescription.date}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Status</Label>
                                      <Badge className={getStatusColor(selectedPrescription.status)}>
                                        {selectedPrescription.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Diagnosis</Label>
                                    <p className="text-sm text-muted-foreground">{selectedPrescription.diagnosis}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Clinical Notes</Label>
                                    <p className="text-sm text-muted-foreground">{selectedPrescription.notes}</p>
                                  </div>
                                </TabsContent>
                                <TabsContent value="history">
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                      <div>
                                        <p className="font-medium text-sm">Prescription Created</p>
                                        <p className="text-xs text-muted-foreground">{selectedPrescription.date}</p>
                                      </div>
                                      <Check className="h-4 w-4 text-green-600" />
                                    </div>
                                    {selectedPrescription.status === "dispensed" && (
                                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <div>
                                          <p className="font-medium text-sm">Dispensed by Pharmacy</p>
                                          <p className="text-xs text-muted-foreground">Central Pharmacy</p>
                                        </div>
                                        <Check className="h-4 w-4 text-green-600" />
                                      </div>
                                    )}
                                  </div>
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        {prescription.status === "active" && (
                          <Button variant="outline" size="sm">
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}