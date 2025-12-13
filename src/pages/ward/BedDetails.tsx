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
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Bed,
  User,
  Users,
  Building2,
  Search,
  Filter,
  Activity,
  AlertCircle,
  Calendar,
  Clock,
  Eye,
  BarChart3,
  MapPin,
  DollarSign,
  UserCheck,
  Stethoscope,
  Hospital,
  Users2,
  Thermometer,
  HeartPulse,
  Edit,
  Save,
  Trash2,
  Check,
  X,
  Clock3,
  CalendarDays,
  FileText,
  Bell,
  Settings,
  RefreshCw,
} from "lucide-react";
import { fetchBedById, updateBedStatus, updateBed } from "@/services/bed";
import { fetchWardById } from "@/services/ward";

// Bed Status Colors
const BED_STATUS_COLORS = {
  available: "bg-green-100 text-green-700 border-green-200",
  occupied: "bg-red-100 text-red-700 border-red-200",
  reserved: "bg-yellow-100 text-yellow-700 border-yellow-200",
  maintenance: "bg-gray-100 text-gray-700 border-gray-200",
  cleaning: "bg-blue-100 text-blue-700 border-blue-200",
};

// Bed Type Colors
const BED_TYPE_COLORS = {
  regular: "bg-gray-100 text-gray-700",
  icu: "bg-red-100 text-red-700",
  ventilator: "bg-purple-100 text-purple-700",
  isolation: "bg-yellow-100 text-yellow-700",
  maternity: "bg-pink-100 text-pink-700",
  pediatric: "bg-blue-100 text-blue-700",
};

// Bed type icons
const BED_TYPE_ICONS = {
  regular: Bed,
  icu: Activity,
  ventilator: Stethoscope,
  isolation: AlertCircle,
  maternity: HeartPulse,
  pediatric: Users2,
};

export default function BedDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [bedData, setBedData] = useState<any>(null);
  const [editedData, setEditedData] = useState<any>({});

  // Fetch bed details
  const {
    data: bed,
    isLoading: isLoadingBed,
    isError: isBedError,
    error: bedError,
    refetch: refetchBed,
  } = useQuery({
    queryKey: ["bed", id],
    queryFn: () => fetchBedById(id),
    enabled: !!id,
    // onSuccess: (data) => {
    //   setBedData(data);
    //   setEditedData(data);
    // },
  });
console.log(bed)
  // Fetch ward details if bed has ward
 const  ward = bed?.ward

  // Update bed status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => updateBedStatus(id!, status),
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Bed status has been updated successfully.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["bed", id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update bed status.",
        variant: "destructive",
      });
    },
  });

  // Update bed mutation
  const updateBedMutation = useMutation({
    mutationFn: (data: any) => updateBed(id!, data),
    onSuccess: () => {
      toast({
        title: "Bed Updated",
        description: "Bed information has been updated successfully.",
        variant: "success",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["bed", id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update bed.",
        variant: "destructive",
      });
    },
  });

  // Handle status change
  const handleStatusChange = (newStatus: string) => {
    updateStatusMutation.mutate(newStatus);
  };

  // Handle save edits
  const handleSaveEdits = () => {
    const dataToUpdate = {
      description: editedData.description,
      notes: editedData.notes,
      is_icu_compatible: editedData.is_icu_compatible,
      is_ventilator_supported: editedData.is_ventilator_supported,
      equipment: editedData.equipment || [],
    };
    updateBedMutation.mutate(dataToUpdate);
  };

  // Handle equipment toggle
  const handleEquipmentToggle = (item: string) => {
    setEditedData((prev: any) => ({
      ...prev,
      equipment: prev.equipment?.includes(item)
        ? prev.equipment.filter((e: string) => e !== item)
        : [...(prev.equipment || []), item],
    }));
  };

  // Equipment options
  const equipmentOptions = [
    "Oxygen Supply",
    "Suction",
    "Monitor",
    "IV Pole",
    "Bedside Table",
    "Call Bell",
    "Privacy Screen",
    "Nurse Call System",
    "Ventilator",
    "Defibrillator",
  ];

  // Loading state
  if (isLoadingBed) {
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
              <div className="flex items-center gap-4 mb-8">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-10 w-64" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="h-96 rounded-xl" />
                <div className="lg:col-span-2 space-y-6">
                  <Skeleton className="h-48 rounded-xl" />
                  <Skeleton className="h-48 rounded-xl" />
                </div>
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

  // Error state
  if (isBedError) {
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
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Bed Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                {bedError?.message || "The bed you're looking for doesn't exist."}
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => navigate(-1)} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button onClick={() => refetchBed()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
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

  if (!bed) {
    return null;
  }

  const BedTypeIcon = BED_TYPE_ICONS[bed.bedType as keyof typeof BED_TYPE_ICONS] || Bed;

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/dashboard/hospital/beds")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <BedTypeIcon className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold text-gray-900">
                      Bed {bed.bedNumber}
                    </h1>
                    <Badge className={BED_TYPE_COLORS[bed.bedType as keyof typeof BED_TYPE_COLORS]}>
                      {bed.bedType.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm">{ward?.name || "Unknown Ward"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">
                        Floor {ward?.floorNumber || "N/A"}, {ward?.wing || "N/A"}
                      </span>
                    </div>
                    {bed.ratePerDay && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm">₦{bed.ratePerDay}/day</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedData(bedData);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEdits}
                      disabled={updateBedMutation.isPending}
                    >
                      {updateBedMutation.isPending ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <Select
                      value={bed.status}
                      onValueChange={handleStatusChange}
                      disabled={updateStatusMutation.isPending}
                    >
                      <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            bed.status === 'available' ? 'bg-green-500' :
                            bed.status === 'occupied' ? 'bg-red-500' :
                            bed.status === 'reserved' ? 'bg-yellow-500' :
                            bed.status === 'maintenance' ? 'bg-gray-500' : 'bg-blue-500'
                          }`} />
                          <span>{bed.status}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full md:w-auto grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="patient" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Patient Info
                </TabsTrigger>
                <TabsTrigger value="equipment" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Equipment
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  History
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Bed Information Card */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Bed Information</CardTitle>
                      <CardDescription>
                        Complete details about this hospital bed
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="bed-number">Bed Number</Label>
                              <Input
                                id="bed-number"
                                value={bed.bed_number}
                                disabled
                              />
                            </div>
                            <div>
                              <Label htmlFor="bed-type">Bed Type</Label>
                              <Select value={bed.bedType} disabled>
                                <SelectTrigger id="bed-type">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="regular">Regular</SelectItem>
                                  <SelectItem value="icu">ICU</SelectItem>
                                  <SelectItem value="ventilator">Ventilator</SelectItem>
                                  <SelectItem value="isolation">Isolation</SelectItem>
                                  <SelectItem value="maternity">Maternity</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={editedData.description || ""}
                              onChange={(e) => setEditedData({...editedData, description: e.target.value})}
                              placeholder="Enter bed description..."
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                              id="notes"
                              value={editedData.notes || ""}
                              onChange={(e) => setEditedData({...editedData, notes: e.target.value})}
                              placeholder="Enter any additional notes..."
                              rows={2}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="icu-compatible"
                                checked={editedData.is_icu_compatible || false}
                                onCheckedChange={(checked) => 
                                  setEditedData({...editedData, is_icu_compatible: checked})
                                }
                              />
                              <Label htmlFor="icu-compatible">ICU Compatible</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="ventilator-supported"
                                checked={editedData.is_ventilator_supported || false}
                                onCheckedChange={(checked) => 
                                  setEditedData({...editedData, is_ventilator_supported: checked})
                                }
                              />
                              <Label htmlFor="ventilator-supported">Ventilator Supported</Label>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Bed Number</Label>
                              <p className="font-medium">{bed.bedNumber}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Bed Type</Label>
                              <Badge className={BED_TYPE_COLORS[bed.bedType as keyof typeof BED_TYPE_COLORS]}>
                                {bed.bedType.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Status</Label>
                              <Badge className={BED_STATUS_COLORS[bed.status as keyof typeof BED_STATUS_COLORS]}>
                                {bed.status.toUpperCase()}
                              </Badge>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Daily Rate</Label>
                              <p className="font-medium">₦{bed.ratePerDay || "0"}/day</p>
                            </div>
                          </div>
                          {bed.description && (
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Description</Label>
                              <p className="text-gray-700 mt-1">{bed.description}</p>
                            </div>
                          )}
                          <Separator />
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Created On</Label>
                              <p className="font-medium">
                                {new Date(bed.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                              <p className="font-medium">
                                {new Date(bed.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Ward Information Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Ward Information</CardTitle>
                      {ward && (
                        <CardDescription>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded" 
                              style={{ backgroundColor: ward.colorCode }}
                            />
                            {ward.name}
                          </div>
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      {isLoadingBed ? (
                        <div className="space-y-3">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      ) : ward ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Ward Code</Label>
                              <p className="font-medium">{ward.code}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Floor</Label>
                              <p className="font-medium">{ward.floorNumber || "N/A"}</p>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Wing/Section</Label>
                            <p className="font-medium">{ward.wing || "Not specified"}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Capacity</Label>
                            <p className="font-medium">{ward.capacity} beds</p>
                          </div>
                          {ward.charge_per_day && (
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Daily Charge</Label>
                              <p className="font-medium">₦{ward.chargePerDay}/day</p>
                            </div>
                          )}
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => navigate(`/dashboard/wards/${ward.reference}/details`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Ward Details
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No ward information available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Patient Info Tab */}
              <TabsContent value="patient">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Patient Information</CardTitle>
                    <CardDescription>
                      {bed.current_patient 
                        ? "Patient currently assigned to this bed"
                        : "No patient currently assigned to this bed"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bed.current_patient ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Patient Name</Label>
                            <p className="font-medium text-lg">
                              {bed.current_patient.patient?.full_name || "Unknown"}
                            </p>
                            <div className="mt-2 text-sm text-gray-500">
                              Medical Record #: {bed.currentPatient.patient?.medicalRecordNumber || "N/A"}
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Assigned Since</Label>
                            <p className="font-medium">
                              {new Date(bed.current_patient.assignedAt).toLocaleDateString()}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                {Math.floor((new Date().getTime() - new Date(bed.currentPatient.assignedAt).getTime()) / (1000 * 3600 * 24))} days
                              </span>
                            </div>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <Label className="text-sm font-medium text-gray-500 mb-3 block">Patient Details</Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-xs text-gray-500">Age</div>
                              <div className="font-medium">{bed.current_patient.patient?.age || "N/A"}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Gender</div>
                              <div className="font-medium">{bed.currentPatient.patient?.user?.gender || "N/A"}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Blood Group</div>
                              <div className="font-medium">{bed.currentPatient.patient?.bloodGroup || "N/A"}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Condition</div>
                              <div className="font-medium">{bed.currentPatient.patient?.condition || "N/A"}</div>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/dashboard/patients/records/${bed.currentPatient.patient?.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Complete Patient Profile
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Patient Assigned
                        </h3>
                        <p className="text-gray-600 mb-4">
                          This bed is currently available for new patient assignment.
                        </p>
                        <Button
                          onClick={() => navigate("/dashboard/admissions/create")}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Assign Patient to Bed
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Equipment Tab */}
              <TabsContent value="equipment">
                <Card>
                  <CardHeader>
                    <CardTitle>Bed Equipment</CardTitle>
                    <CardDescription>
                      Medical equipment and accessories associated with this bed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label className="mb-3 block">Select Equipment</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {equipmentOptions.map((item) => (
                              <div
                                key={item}
                                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                                  editedData.equipment?.includes(item)
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => handleEquipmentToggle(item)}
                              >
                                <div className={`h-4 w-4 rounded border flex items-center justify-center ${
                                  editedData.equipment?.includes(item)
                                    ? "border-primary bg-primary"
                                    : "border-gray-300"
                                }`}>
                                  {editedData.equipment?.includes(item) && (
                                    <Check className="h-3 w-3 text-white" />
                                  )}
                                </div>
                                <Label className="cursor-pointer">{item}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="custom-equipment">Custom Equipment</Label>
                          <Textarea
                            id="custom-equipment"
                            placeholder="Enter any custom equipment not listed above..."
                            rows={2}
                            value={editedData.custom_equipment || ""}
                            onChange={(e) => setEditedData({...editedData, custom_equipment: e.target.value})}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bed.equipment && bed.equipment.length > 0 ? (
                          <>
                            <div className="flex flex-wrap gap-2">
                              {bed.equipment.map((item: string, index: number) => (
                                <Badge key={index} variant="secondary">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                            {bed.custom_equipment && (
                              <>
                                <Separator />
                                <div>
                                  <Label className="text-sm font-medium text-gray-500">Custom Equipment Notes</Label>
                                  <p className="text-gray-700 mt-1">{bed.custom_equipment}</p>
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              No Equipment Configured
                            </h3>
                            <p className="text-gray-600">
                              This bed has no specific medical equipment assigned.
                            </p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <div className={`h-3 w-3 rounded ${
                              bed.isIcuCompatible ? 'bg-green-500' : 'bg-gray-300'
                            }`} />
                            <span className="text-sm">ICU Compatible</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`h-3 w-3 rounded ${
                              bed.isVentilatorSupported ? 'bg-green-500' : 'bg-gray-300'
                            }`} />
                            <span className="text-sm">Ventilator Supported</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Bed History</CardTitle>
                    <CardDescription>
                      Historical data and logs for this bed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Status History */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Status History</h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className="h-3 w-3 rounded-full bg-green-500"></div>
                              <div className="h-12 w-px bg-gray-200 mt-1"></div>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">Available</div>
                              <div className="text-sm text-gray-500">
                                {new Date().toLocaleDateString()} - Present
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className="h-3 w-3 rounded-full bg-red-500"></div>
                              <div className="h-12 w-px bg-gray-200 mt-1"></div>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">Occupied by John Doe</div>
                              <div className="text-sm text-gray-500">
                                Jan 15, 2024 - {new Date().toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                              <div className="h-12 w-px bg-gray-200 mt-1"></div>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">Maintenance</div>
                              <div className="text-sm text-gray-500">
                                Jan 10, 2024 - Jan 14, 2024
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Cleaning History */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Cleaning History</h3>
                        {bed.last_cleaned_at ? (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Clock className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">Last Cleaned</div>
                                <div className="text-sm text-gray-600">
                                  {new Date(bed.last_cleaned_at).toLocaleDateString()} at{" "}
                                  {new Date(bed.last_cleaned_at).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500">No cleaning records available</p>
                        )}
                      </div>

                      <Separator />

                      {/* Maintenance History */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Maintenance Records</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>{new Date().toLocaleDateString()}</TableCell>
                              <TableCell>Routine</TableCell>
                              <TableCell>Equipment calibration</TableCell>
                              <TableCell><Badge variant="outline">Completed</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Jan 10, 2024</TableCell>
                              <TableCell>Repair</TableCell>
                              <TableCell>Bed frame adjustment</TableCell>
                              <TableCell><Badge variant="outline">Completed</Badge></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
    </div>
  );
}