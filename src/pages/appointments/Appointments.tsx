import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Plus, Search, Filter, User, Stethoscope } from "lucide-react";

// Sample appointment data
const appointments = [
  {
    id: "APT001",
    patientName: "John Smith",
    patientId: "P001",
    doctorName: "Dr. Sarah Johnson",
    department: "Cardiology",
    date: "2024-01-15",
    time: "09:00",
    type: "Consultation",
    status: "Scheduled",
    reason: "Regular checkup"
  },
  {
    id: "APT002",
    patientName: "Emily Davis",
    patientId: "P002",
    doctorName: "Dr. Michael Brown",
    department: "Neurology",
    date: "2024-01-15",
    time: "10:30",
    type: "Follow-up",
    status: "Confirmed",
    reason: "Headache follow-up"
  },
  {
    id: "APT003",
    patientName: "Robert Wilson",
    patientId: "P003",
    doctorName: "Dr. Lisa Chen",
    department: "Orthopedics",
    date: "2024-01-15",
    time: "14:00",
    type: "Consultation",
    status: "Checked-in",
    reason: "Knee pain assessment"
  }
];

const doctors = [
  { id: "D001", name: "Dr. Sarah Johnson", department: "Cardiology" },
  { id: "D002", name: "Dr. Michael Brown", department: "Neurology" },
  { id: "D003", name: "Dr. Lisa Chen", department: "Orthopedics" },
  { id: "D004", name: "Dr. James Wilson", department: "Internal Medicine" }
];

export default function Appointments() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowBookingForm(false);
      toast({
        title: "Appointment Scheduled",
        description: "The appointment has been successfully scheduled",
      });
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "Checked-in": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Completed": return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredAppointments = appointments.filter(apt =>
    apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <h1 className="text-3xl font-bold">Appointment Scheduling</h1>
                <p className="text-muted-foreground">
                  Manage and schedule patient appointments
                </p>
              </div>
              <Button 
                onClick={() => setShowBookingForm(true)}
                className="bg-gradient-primary hover:shadow-glow transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search appointments by patient, doctor, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Appointments List */}
            <div className="grid gap-4">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{appointment.patientName}</span>
                            <span className="text-sm text-muted-foreground">({appointment.patientId})</span>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.doctorName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">
                            <strong>Department:</strong> {appointment.department} | 
                            <strong> Type:</strong> {appointment.type} | 
                            <strong> Reason:</strong> {appointment.reason}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        {appointment.status === "Scheduled" && (
                          <Button size="sm" className="bg-gradient-primary">
                            Check-in
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Booking Form Modal */}
            {showBookingForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>Schedule New Appointment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleBookAppointment} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="patientId">Patient ID *</Label>
                          <Input id="patientId" placeholder="P001" required />
                        </div>
                        <div>
                          <Label htmlFor="patientName">Patient Name *</Label>
                          <Input id="patientName" placeholder="John Smith" required />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="doctor">Doctor *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Doctor" />
                            </SelectTrigger>
                            <SelectContent>
                              {doctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id}>
                                  {doctor.name} - {doctor.department}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="appointmentType">Appointment Type *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="consultation">Consultation</SelectItem>
                              <SelectItem value="follow-up">Follow-up</SelectItem>
                              <SelectItem value="telemedicine">Telemedicine</SelectItem>
                              <SelectItem value="emergency">Emergency</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="appointmentDate">Date *</Label>
                          <Input id="appointmentDate" type="date" required />
                        </div>
                        <div>
                          <Label htmlFor="appointmentTime">Time *</Label>
                          <Input id="appointmentTime" type="time" required />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="reason">Reason for Visit *</Label>
                        <Textarea 
                          id="reason" 
                          placeholder="Describe the reason for the appointment..."
                          required 
                        />
                      </div>

                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="routine">Routine</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-end gap-4 pt-4">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setShowBookingForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-gradient-primary hover:shadow-glow transition-all"
                          disabled={isLoading}
                        >
                          {isLoading ? "Scheduling..." : "Schedule Appointment"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
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