import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Clock, User, CheckCircle, XCircle, AlertCircle, Stethoscope } from "lucide-react";

// Sample queue data
const queueData = [
  {
    id: "APT001",
    patientName: "John Smith",
    patientId: "P001",
    appointmentTime: "09:00",
    doctorName: "Dr. Sarah Johnson",
    department: "Cardiology",
    checkinTime: "08:45",
    status: "waiting",
    priority: "routine",
    estimatedWait: 15
  },
  {
    id: "APT002",
    patientName: "Emily Davis",
    patientId: "P002",
    appointmentTime: "09:30",
    doctorName: "Dr. Michael Brown",
    department: "Neurology",
    checkinTime: "09:15",
    status: "in-consultation",
    priority: "urgent",
    estimatedWait: 0
  },
  {
    id: "APT003",
    patientName: "Robert Wilson",
    patientId: "P003",
    appointmentTime: "10:00",
    doctorName: "Dr. Lisa Chen",
    department: "Orthopedics",
    checkinTime: null,
    status: "scheduled",
    priority: "routine",
    estimatedWait: 45
  },
  {
    id: "APT004",
    patientName: "Maria Garcia",
    patientId: "P004",
    appointmentTime: "10:30",
    doctorName: "Dr. James Wilson",
    department: "Internal Medicine",
    checkinTime: "10:20",
    status: "waiting",
    priority: "urgent",
    estimatedWait: 25
  },
  {
    id: "APT005",
    patientName: "David Johnson",
    patientId: "P005",
    appointmentTime: "11:00",
    doctorName: "Dr. Sarah Johnson",
    department: "Cardiology",
    checkinTime: "10:50",
    status: "ready",
    priority: "routine",
    estimatedWait: 5
  }
];

export default function CheckinQueue() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [queue, setQueue] = useState(queueData);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-gray-100 text-gray-800 border-gray-200";
      case "waiting": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ready": return "bg-green-100 text-green-800 border-green-200";
      case "in-consultation": return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed": return "bg-purple-100 text-purple-800 border-purple-200";
      case "no-show": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency": return "bg-red-100 text-red-800 border-red-200";
      case "urgent": return "bg-orange-100 text-orange-800 border-orange-200";
      case "routine": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "waiting": return <Clock className="h-4 w-4" />;
      case "ready": return <CheckCircle className="h-4 w-4" />;
      case "in-consultation": return <Stethoscope className="h-4 w-4" />;
      case "no-show": return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (appointmentId: string, newStatus: string) => {
    setQueue(prev => prev.map(item => 
      item.id === appointmentId 
        ? { ...item, status: newStatus, checkinTime: newStatus === 'waiting' ? new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : item.checkinTime }
        : item
    ));
    
    toast({
      title: "Status Updated",
      description: `Appointment status changed to ${newStatus}`,
    });
  };

  const filteredQueue = queue.filter(item =>
    item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const queueStats = {
    total: queue.length,
    waiting: queue.filter(q => q.status === 'waiting').length,
    inConsultation: queue.filter(q => q.status === 'in-consultation').length,
    ready: queue.filter(q => q.status === 'ready').length,
    avgWaitTime: Math.round(queue.reduce((acc, q) => acc + q.estimatedWait, 0) / queue.length)
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
            <div>
              <h1 className="text-3xl font-bold">Check-in Queue</h1>
              <p className="text-muted-foreground">
                Manage patient check-ins and appointment flow
              </p>
            </div>

            {/* Queue Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Appointments</p>
                      <p className="text-2xl font-bold">{queueStats.total}</p>
                    </div>
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Waiting</p>
                      <p className="text-2xl font-bold text-yellow-600">{queueStats.waiting}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">In Consultation</p>
                      <p className="text-2xl font-bold text-blue-600">{queueStats.inConsultation}</p>
                    </div>
                    <Stethoscope className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Ready</p>
                      <p className="text-2xl font-bold text-green-600">{queueStats.ready}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Wait</p>
                      <p className="text-2xl font-bold">{queueStats.avgWaitTime}m</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by patient name, ID, or doctor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Queue List */}
            <div className="space-y-4">
              {filteredQueue.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold text-lg">{item.patientName}</span>
                            <span className="text-sm text-muted-foreground">({item.patientId})</span>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(item.status)}
                              <span className="capitalize">{item.status.replace('-', ' ')}</span>
                            </div>
                          </Badge>
                          <Badge className={getPriorityColor(item.priority)}>
                            <span className="capitalize">{item.priority}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Appointment:</span>
                            <div className="font-medium">{item.appointmentTime}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Doctor:</span>
                            <div className="font-medium">{item.doctorName}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Department:</span>
                            <div className="font-medium">{item.department}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Check-in:</span>
                            <div className="font-medium">{item.checkinTime || 'Not checked in'}</div>
                          </div>
                        </div>
                        
                        {item.status === 'waiting' && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 inline mr-1" />
                            Estimated wait time: {item.estimatedWait} minutes
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {item.status === 'scheduled' && (
                          <Button 
                            size="sm" 
                            className="bg-gradient-primary"
                            onClick={() => handleStatusUpdate(item.id, 'waiting')}
                          >
                            Check In
                          </Button>
                        )}
                        {item.status === 'waiting' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusUpdate(item.id, 'ready')}
                            >
                              Mark Ready
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusUpdate(item.id, 'no-show')}
                            >
                              No Show
                            </Button>
                          </>
                        )}
                        {item.status === 'ready' && (
                          <Button 
                            size="sm" 
                            className="bg-gradient-primary"
                            onClick={() => handleStatusUpdate(item.id, 'in-consultation')}
                          >
                            Start Consultation
                          </Button>
                        )}
                        {item.status === 'in-consultation' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusUpdate(item.id, 'completed')}
                          >
                            Complete
                          </Button>
                        )}
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