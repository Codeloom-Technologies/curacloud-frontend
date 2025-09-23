import { useState } from "react";
import { Search, Plus, Calendar, Clock, User, FileText, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sidebar } from "@/components/layout/Sidebar";

// Sample consultation data
const consultations = [
  {
    id: "CON001",
    patientName: "Sarah Johnson",
    patientId: "P001",
    doctorName: "Dr. Michael Chen",
    date: "2024-01-15",
    time: "10:30 AM",
    type: "Follow-up",
    status: "Completed",
    chief_complaint: "Chest pain and shortness of breath",
    diagnosis: "Mild hypertension, anxiety disorder",
    treatment: "Prescribed lisinopril 10mg, recommended stress management",
    notes: "Patient reports improvement since last visit. Blood pressure stable.",
    duration: "45 minutes"
  },
  {
    id: "CON002", 
    patientName: "Robert Wilson",
    patientId: "P002",
    doctorName: "Dr. Emily Rodriguez",
    date: "2024-01-15",
    time: "2:15 PM", 
    type: "Initial",
    status: "In Progress",
    chief_complaint: "Persistent headaches for 2 weeks",
    diagnosis: "Pending further tests",
    treatment: "Ordered MRI, prescribed ibuprofen",
    notes: "Neurological examination normal. Awaiting imaging results.",
    duration: "30 minutes"
  },
  {
    id: "CON003",
    patientName: "Maria Garcia",
    patientId: "P003", 
    doctorName: "Dr. James Thompson",
    date: "2024-01-14",
    time: "9:00 AM",
    type: "Emergency",
    status: "Completed",
    chief_complaint: "Severe abdominal pain",
    diagnosis: "Acute appendicitis",
    treatment: "Emergency appendectomy scheduled",
    notes: "Patient stable post-surgery. Recovery progressing well.",
    duration: "60 minutes"
  }
];

export default function Consultations() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedConsultation, setSelectedConsultation] = useState<typeof consultations[0] | null>(null);

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || consultation.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === "all" || consultation.type.toLowerCase() === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "in progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "emergency": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "follow-up": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "initial": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
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
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Medical Consultations</h1>
                <p className="text-muted-foreground">
                  Manage patient consultations and medical visits
                </p>
              </div>
            </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Today's Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9</div>
                <p className="text-xs text-muted-foreground">Average 45 min</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Emergency Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search consultations..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="initial">Initial</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
            <Button className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              New Consultation
            </Button>
          </div>

          {/* Consultations List */}
          <div className="grid gap-4">
            {filteredConsultations.map((consultation) => (
              <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{consultation.patientName}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {consultation.doctorName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {consultation.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {consultation.time}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(consultation.status)}>
                        {consultation.status}
                      </Badge>
                      <Badge className={getTypeColor(consultation.type)}>
                        {consultation.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-sm">Chief Complaint: </span>
                      <span className="text-sm text-muted-foreground">{consultation.chief_complaint}</span>
                    </div>
                    <div>
                      <span className="font-medium text-sm">Diagnosis: </span>
                      <span className="text-sm text-muted-foreground">{consultation.diagnosis}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-muted-foreground">ID: {consultation.id}</span>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedConsultation(consultation)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Consultation Details - {selectedConsultation?.patientName}</DialogTitle>
                              <DialogDescription>
                                Consultation ID: {selectedConsultation?.id}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedConsultation && (
                              <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="overview">Overview</TabsTrigger>
                                  <TabsTrigger value="notes">Notes</TabsTrigger>
                                  <TabsTrigger value="treatment">Treatment</TabsTrigger>
                                </TabsList>
                                <TabsContent value="overview" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Patient</Label>
                                      <p className="text-sm text-muted-foreground">{selectedConsultation.patientName}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Doctor</Label>
                                      <p className="text-sm text-muted-foreground">{selectedConsultation.doctorName}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Date & Time</Label>
                                      <p className="text-sm text-muted-foreground">{selectedConsultation.date} at {selectedConsultation.time}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Duration</Label>
                                      <p className="text-sm text-muted-foreground">{selectedConsultation.duration}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Chief Complaint</Label>
                                    <p className="text-sm text-muted-foreground">{selectedConsultation.chief_complaint}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Diagnosis</Label>
                                    <p className="text-sm text-muted-foreground">{selectedConsultation.diagnosis}</p>
                                  </div>
                                </TabsContent>
                                <TabsContent value="notes">
                                  <div>
                                    <Label className="text-sm font-medium">Clinical Notes</Label>
                                    <p className="text-sm text-muted-foreground mt-2">{selectedConsultation.notes}</p>
                                  </div>
                                </TabsContent>
                                <TabsContent value="treatment">
                                  <div>
                                    <Label className="text-sm font-medium">Treatment Plan</Label>
                                    <p className="text-sm text-muted-foreground mt-2">{selectedConsultation.treatment}</p>
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
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
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