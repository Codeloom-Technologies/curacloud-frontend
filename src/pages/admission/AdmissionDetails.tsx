import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Bed,
  Building2,
  Stethoscope,
  HeartPulse,
  Thermometer,
  Pill,
  Activity,
  AlertCircle,
  Edit,
  Printer,
  Download,
  Share2,
  CheckCircle,
  XCircle,
  Loader2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Eye,
  Users,
  Brain,
} from "lucide-react";
import {
  fetchAdmissionById,
    dischargePatient,
  fetchAdmissionStats,
} from "@/services/admission";

// Status Colors
const ADMISSION_STATUS_COLORS = {
  admitted: "bg-blue-100 text-blue-700 border-blue-200",
  discharged: "bg-green-100 text-green-700 border-green-200",
  transferred: "bg-purple-100 text-purple-700 border-purple-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  emergency: "bg-red-100 text-red-700 border-red-200",
};

// Priority Colors
const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

export default function AdmissionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDischargeDialogOpen, setIsDischargeDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);

  // Fetch admission details
  const {
    data: admission,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admission", id],
    queryFn: () => fetchAdmissionById(id!),
    enabled: !!id,
  });
    console.log(admission)
    
  // Fetch admission statistics
  const { data: stats } = useQuery({
    queryKey: ["admission-stats"],
    queryFn: fetchAdmissionStats,
  });


  // Discharge mutation
  const dischargeMutation = useMutation({
    mutationFn: (dischargeData: any) => dischargePatient({ admissionId: id!, ...dischargeData }),
    onSuccess: () => {
      toast({
        title: "Patient Discharged",
        description: "Patient has been successfully discharged.",
        variant: "success",
      });
      setIsDischargeDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admission", id] });
      queryClient.invalidateQueries({ queryKey: ["admission-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Discharge Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Calculate days admitted
  const calculateDaysAdmitted = () => {
    if (!admission?.admission?.admissionDate) return 0;
    const admissionDate = new Date(admission.admission.admissionDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - admissionDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleDischarge = (dischargeData: any) => {
    dischargeMutation.mutate(dischargeData);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-8 w-64" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="h-64 rounded-lg" />
                <Skeleton className="h-64 rounded-lg" />
                <Skeleton className="h-64 rounded-lg" />
              </div>
              <Skeleton className="h-96 rounded-lg" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Admission Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                The admission record you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={() => navigate("/dashboard/admissions")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admissions
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!admission) {
    return null;
  }

  const daysAdmitted = calculateDaysAdmitted();
  const admissionDate = new Date(admission.admission?.admissionDate);
  const patient = admission.patient;
  const bed = admission.bed;
  const ward = admission.ward;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/dashboard/hospital/admissions")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    Admission Details
                  </h1>
                  <p className="text-muted-foreground">
                    Admission ID: {admission.admission?.reference || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                {/* <Button
                  onClick={handleEditAdmission}
                  className="bg-gradient-primary hover:shadow-glow transition-all"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button> */}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {daysAdmitted}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Days Admitted
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-warning">
                    {admission.admission?.priority?.toUpperCase() || "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Priority Level
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {ward?.currentOccupancy || 0}/{ward?.capacity || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ward Occupancy
                  </div>
                  <Progress
                    value={(ward?.currentOccupancy / ward?.capacity) * 100 || 0}
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats?.currentAdmissions || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Admitted
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full md:w-auto grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="patient" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Patient Info
                </TabsTrigger>
                <TabsTrigger value="medical" className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4" />
                  Medical
                </TabsTrigger>
                <TabsTrigger value="actions" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Actions
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Patient Card */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Patient Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-8 w-8 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-bold">
                                  {patient?.user?.fullName || "N/A"}
                                </h3>
                                <p className="text-muted-foreground">
                                  MRN: {patient?.patientProvider?.[0]?.medicalRecordNumber || "N/A"}
                                </p>
                              </div>
                              <Badge className={ADMISSION_STATUS_COLORS[admission.admission?.status as keyof typeof ADMISSION_STATUS_COLORS]}>
                                {admission.admission?.status?.toUpperCase() || "N/A"}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Age</Label>
                                <p className="font-medium">{patient?.user?.age || "N/A"}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                                <p className="font-medium">{patient?.user?.gender || "N/A"}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Blood Type</Label>
                                <p className="font-medium">{patient?.bloodGroup || "N/A"}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                                <p className="font-medium">
                                  {patient?.user?.dateOfBirth 
                                    ? new Date(patient.user.dateOfBirth).toLocaleDateString()
                                    : "N/A"
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Emergency Contact</Label>
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{patient?.user?.phoneNumber || "N/A"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{patient?.user?.email || "N/A"}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                            <div className="mt-2">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {patient?.address?.street || "No address provided"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Admission Details Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Admission Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Admission Date</Label>
                            <p className="font-medium">
                              {admissionDate.toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {admissionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <Badge variant="outline">
                            Day {daysAdmitted}
                          </Badge>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                          <Badge className={`mt-1 ${PRIORITY_COLORS[admission.admission?.priority as keyof typeof PRIORITY_COLORS]}`}>
                            {admission.admission?.priority?.toUpperCase() || "N/A"}
                          </Badge>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Admission Type</Label>
                          <p className="font-medium">{admission.admission?.admissionType || "Routine"}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Attending Doctor</Label>
                          <p className="font-medium">{admission.admission?.admittingDoctor || "Not assigned"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bed & Ward Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bed className="h-5 w-5" />
                      Bed & Ward Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Current Bed Assignment</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                              <Bed className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-bold text-lg">{bed?.bedNumber || "N/A"}</div>
                              <div className="text-sm text-muted-foreground">
                                {bed?.bedType || "Regular"} Bed
                              </div>
                            </div>
                          </div>
                          <div className="text-sm">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              <span>Assigned: {new Date(bed?.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Ward Information</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="h-12 w-12 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: ward?.colorCode || '#e5e7eb' }}
                            >
                              <Building2 className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="font-bold text-lg">{ward?.name || "N/A"}</div>
                              <div className="text-sm text-muted-foreground">
                                {ward?.code || "N/A"} • Floor {ward?.floorNumber || "N/A"}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm">
                            <div className="flex items-center justify-between">
                              <span>Occupancy:</span>
                              <span className="font-medium">
                                {ward?.currentOccupancy || 0} / {ward?.capacity || 0}
                              </span>
                            </div>
                            <Progress
                              value={(ward?.currentOccupancy / ward?.capacity) * 100 || 0}
                              className="mt-2 h-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Patient Info Tab */}
              <TabsContent value="patient">
                <PatientInfoTab patient={patient} />
              </TabsContent>

              {/* Medical Tab */}
              <TabsContent value="medical">
                <MedicalInfoTab admission={admission} />
              </TabsContent>

              {/* Actions Tab */}
              <TabsContent value="actions">
                <ActionsTab 
                  admission={admission}
                  onDischarge={() => setIsDischargeDialogOpen(true)}
                  daysAdmitted={daysAdmitted}
                />
              </TabsContent>
            </Tabs>
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

      {/* Discharge Dialog */}
      <DischargeDialog
        isOpen={isDischargeDialogOpen}
        onClose={() => setIsDischargeDialogOpen(false)}
        admission={admission}
        onDischarge={handleDischarge}
        isLoading={dischargeMutation.isPending}
      />
    </div>
  );
}

// Patient Info Tab Component
function PatientInfoTab({ patient }: any) {
  if (!patient) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            No patient information available
          </div>
        </CardContent>
      </Card>
    );
  }

  const user = patient.user;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
            <p className="font-medium">{user?.fullName || "N/A"}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
            <p className="font-medium">
              {user?.dateOfBirth 
                ? new Date(user.dateOfBirth).toLocaleDateString()
                : "N/A"
              }
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Age</Label>
            <p className="font-medium">{user?.age || "N/A"}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
            <p className="font-medium">{user?.gender || "N/A"}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Marital Status</Label>
            <p className="font-medium">{user?.maritalStatus || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
            <p className="font-medium">{user?.phoneNumber || "N/A"}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
            <p className="font-medium">{user?.email || "N/A"}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Address</Label>
            <p className="font-medium">{patient?.address?.street || "N/A"}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Emergency Contact</Label>
            <p className="font-medium">{patient?.emergencyContact|| "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Blood Group</Label>
            <p className="font-medium">{user?.bloodGroup || "N/A"}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Genotype</Label>
            <p className="font-medium">{user?.genotype || "N/A"}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Allergies</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {user?.allergies?.map((allergy: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {allergy}
                </Badge>
              )) || <span className="text-sm text-muted-foreground">No allergies recorded</span>}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Chronic Conditions</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {user?.chronicConditions?.map((condition: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700">
                  {condition}
                </Badge>
              )) || <span className="text-sm text-muted-foreground">No chronic conditions</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Medical Info Tab Component
function MedicalInfoTab({ admission }: any) {
  return (
    <div className="space-y-6">
      {/* Diagnosis and Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5" />
            Primary Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Diagnosis</Label>
              <p className="font-medium text-lg">{admission?.admission?.diagnosis || "Not specified"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Symptoms</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {admission?.admission?.symptoms?.map((symptom: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {symptom}
                  </Badge>
                )) || <span className="text-sm text-muted-foreground">No symptoms recorded</span>}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Medical History</Label>
              <p className="text-sm text-muted-foreground">
                {admission?.admission?.notes || "No additional notes"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Treatment Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Current Medications</Label>
              <div className="mt-2">
                {admission?.admission?.medications?.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {admission?.admission?.medications.map((med: any, index: number) => (
                      <li key={index} className="text-sm">
                        <span className="font-medium">{med.name}</span> - {med.dosage} ({med.frequency})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No medications prescribed</p>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Procedures</Label>
              <div className="mt-2">
                {admission?.admission?.procedures?.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {admission?.admission?.procedures.map((proc: any, index: number) => (
                      <li key={index} className="text-sm">
                        {proc?.name} - {new Date(proc?.date).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No procedures scheduled</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Vital Signs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {admission?.admission?.vitals?.bloodPressure || "--"}
              </div>
              <div className="text-sm text-muted-foreground">Blood Pressure</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {admission?.admission?.vitals?.heartRate || "--"}
              </div>
              <div className="text-sm text-muted-foreground">Heart Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {admission?.admission?.vitals?.temperature || "--"}°C
              </div>
              <div className="text-sm text-muted-foreground">Temperature</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {admission?.admission?.vitals?.oxygenSaturation || "--"}%
              </div>
              <div className="text-sm text-muted-foreground">O₂ Saturation</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Last updated: {new Date(admission?.admission?.vitals?.timestamp).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Actions Tab Component
function ActionsTab({ admission, onDischarge, daysAdmitted }: any) {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Transfer Patient",
      description: "Transfer patient to another bed or ward",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      onClick: () => navigate(`/dashboard/transfers/new?admission=${admission.reference}`),
      disabled: admission.admission?.status !== "admitted",
    },
    {
      title: "Update Medical Records",
      description: "Add diagnosis, medications, or procedures",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
      onClick: () => navigate(`/dashboard/medical-records/${admission.patient?.id}/edit`),
    },
    {
      title: "Schedule Procedure",
      description: "Schedule a medical procedure or surgery",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      onClick: () => navigate(`/dashboard/procedures/new?patient=${admission?.patient?.user?.reference}`),
    },
    {
      title: "View Patient History",
      description: "View complete medical history",
      icon: Brain,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      onClick: () => navigate(`/dashboard/patients/records/${admission.patient?.user?.reference}`),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div 
                className="flex items-start gap-4"
                onClick={!action.disabled ? action.onClick : undefined}
              >
                <div className={`p-3 rounded-full ${action.bgColor}`}>
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{action.title}</h3>
                    {action.disabled && (
                      <Badge variant="outline" className="text-xs">
                        Unavailable
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Discharge Section */}
      <Card className="border-2 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            <CheckCircle className="h-5 w-5" />
            Discharge Patient
          </CardTitle>
          <CardDescription>
            Complete the discharge process for this patient
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Ready for Discharge</h4>
                <p className="text-sm text-muted-foreground">
                  Patient has been admitted for {daysAdmitted} days
                </p>
              </div>
              <Button
                onClick={onDischarge}
                disabled={admission.admission?.status !== "admitted"}
                className="bg-gradient-primary hover:shadow-glow transition-all"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Initiate Discharge
              </Button>
            </div>
            {admission.admission?.status !== "admitted" && (
              <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
                Patient is already {admission.admission?.status}. Discharge is not available.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Discharge Dialog Component
function DischargeDialog({ isOpen, onClose, admission, onDischarge, isLoading }: any) {
  const [formData, setFormData] = useState({
    dischargeReason: "",
    dischargeNotes: "",
    followUpDate: "",
    medicationPrescribed: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    if (admission) {
      // Auto-fill today's date for follow-up (7 days from now)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setFormData(prev => ({
        ...prev,
        follow_up_date: nextWeek.toISOString().split('T')[0],
      }));
    }
  }, [admission]);

  const handleSubmit = () => {
    if (!formData.dischargeReason) {
      toast({
        title: "Missing Information",
        description: "Please specify the discharge reason.",
        variant: "destructive",
      });
      return;
    }

    onDischarge(formData);
  };

  if (!admission) return null;

  const admissionDate = new Date(admission.admission?.admissionDate);
  const daysAdmitted = Math.floor(
    (new Date().getTime() - admissionDate.getTime()) / (1000 * 3600 * 24)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Discharge Patient
          </DialogTitle>
          <DialogDescription>
            Complete the discharge process for {admission.patient?.user?.fullName || "the patient"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">{admission.patient?.user?.fullName}</div>
                      <div className="text-sm text-muted-foreground">
                        MRN: {admission.patient?.patientProvider?.[0]?.medicalRecordNumber}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {daysAdmitted} days admitted
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Admission Date</Label>
                    <p className="font-medium">{admissionDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Bed</Label>
                    <p className="font-medium">{admission.bed?.bedNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Diagnosis</Label>
                    <p className="font-medium">{admission.admission?.diagnosis || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Attending Doctor</Label>
                    <p className="font-medium">{admission.admission?.admittingDoctor}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discharge Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Discharge Reason *</Label>
              <Select
                value={formData.dischargeReason}
                onValueChange={(value) => setFormData({ ...formData, dischargeReason: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recovered">Recovered</SelectItem>
                  <SelectItem value="improved">Condition Improved</SelectItem>
                  <SelectItem value="referred">Referred to Another Facility</SelectItem>
                  <SelectItem value="requested">Patient Request</SelectItem>
                  <SelectItem value="against_advice">Against Medical Advice</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Discharge Notes</Label>
              <Textarea
                placeholder="Summary of treatment, condition at discharge, instructions..."
                value={formData.dischargeNotes}
                onChange={(e) => setFormData({ ...formData, dischargeNotes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Follow-up Date</Label>
                <Input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Medications Prescribed</Label>
                <Input
                  placeholder="e.g., Antibiotics, Painkillers"
                  value={formData.medicationPrescribed}
                  onChange={(e) => setFormData({ ...formData, medicationPrescribed: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="bg-gradient-primary hover:shadow-glow transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Discharge
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Import toast and refresh icon
import { toast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";