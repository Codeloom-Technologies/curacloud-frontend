import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Phone, 
  Mail,
  Calendar,
  Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Sample patient data
const patients = [
  {
    id: "P001",
    name: "John Smith",
    age: 45,
    gender: "Male",
    phone: "+1 (555) 123-4567",
    email: "john.smith@email.com",
    lastVisit: "2024-01-15",
    status: "Active",
    primaryDoctor: "Dr. Sarah Johnson",
    condition: "Hypertension"
  },
  {
    id: "P002",
    name: "Emma Wilson",
    age: 32,
    gender: "Female",
    phone: "+1 (555) 234-5678",
    email: "emma.wilson@email.com",
    lastVisit: "2024-01-18",
    status: "Active",
    primaryDoctor: "Dr. Michael Brown",
    condition: "Diabetes Type 2"
  },
  {
    id: "P003",
    name: "Robert Davis",
    age: 67,
    gender: "Male",
    phone: "+1 (555) 345-6789",
    email: "robert.davis@email.com",
    lastVisit: "2024-01-10",
    status: "Inactive",
    primaryDoctor: "Dr. Lisa Chen",
    condition: "Cardiac Arrhythmia"
  },
  {
    id: "P004",
    name: "Sarah Johnson",
    age: 28,
    gender: "Female",
    phone: "+1 (555) 456-7890",
    email: "sarah.johnson@email.com",
    lastVisit: "2024-01-20",
    status: "Active",
    primaryDoctor: "Dr. James Wilson",
    condition: "Pregnancy - 2nd Trimester"
  },
  {
    id: "P005",
    name: "Michael Brown",
    age: 54,
    gender: "Male",
    phone: "+1 (555) 567-8901",
    email: "michael.brown@email.com",
    lastVisit: "2024-01-12",
    status: "Active",
    primaryDoctor: "Dr. Sarah Johnson",
    condition: "Chronic Back Pain"
  }
];

export default function PatientDirectory() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success";
      case "Inactive":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
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
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Patient Directory</h1>
                <p className="text-muted-foreground">
                  Manage and search through all registered patients
                </p>
              </div>
              
              <Button 
                className="bg-gradient-primary hover:shadow-glow transition-all"
                onClick={() => navigate("/patients/register")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Register New Patient
              </Button>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients by name, ID, phone, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Patient Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">{patients.length}</div>
                  <div className="text-sm text-muted-foreground">Total Patients</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-success">
                    {patients.filter(p => p.status === "Active").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Patients</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-warning">3</div>
                  <div className="text-sm text-muted-foreground">Pending Appointments</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">New This Month</div>
                </CardContent>
              </Card>
            </div>

            {/* Patients Table */}
            <Card>
              <CardHeader>
                <CardTitle>Patients ({filteredPatients.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Age/Gender</TableHead>
                        <TableHead>Primary Doctor</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.map((patient) => (
                        <TableRow key={patient.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {patient.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{patient.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  ID: {patient.id}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3" />
                                {patient.phone}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {patient.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{patient.age} years</div>
                              <div className="text-muted-foreground">{patient.gender}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{patient.primaryDoctor}</div>
                            <div className="text-xs text-muted-foreground">{patient.condition}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3 w-3" />
                              {new Date(patient.lastVisit).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(patient.status)}>
                              {patient.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => navigate(`/patients/records/${patient.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
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