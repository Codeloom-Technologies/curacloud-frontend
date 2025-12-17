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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Clock,
  Pill,
  Syringe,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  History,
  Edit,
  Trash2,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Shield,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Heart,
  Thermometer,
  Activity,
  Droplets,
  Weight,
  Ruler,
  Brain,
  Moon,
  Sun,
  Cloud,
  Wind,
  Waves,
  Stethoscope,
  LineChart,
  TrendingUp,
  TrendingDown,
  Minus,
  Maximize2,
  ActivitySquare,
  HeartPulse,
  Menu,
  X,
} from "lucide-react";
import {
  fetchAdmissionById,
} from "@/services/admission";
import {
  recordVitalSigns,
  getVitalSignsHistory,
  getVitalTrends,
  getLatestVitals,
  getAbnormalVitals,
  type VitalSigns,
  type VitalSignsInput,
} from "@/services/vital-signs";

// Vital Signs Type Definitions
type VitalCategory = 'normal' | 'warning' | 'critical' | any;

interface VitalStatus {
  category: VitalCategory;
  message: string;
}

interface VitalChartData {
  timestamp: string;
  [key: string]: number | string;
}

// Vital Signs Ranges (can be adjusted based on patient age, condition, etc.)
const VITAL_RANGES = {
  temperature: {
    normal: { min: 36.1, max: 37.2 }, // Celsius
    warning: { min: 35, max: 38.5 },
    unit: "°C"
  },
  heartRate: {
    normal: { min: 60, max: 100 }, // BPM
    warning: { min: 50, max: 120 },
    unit: "bpm"
  },
  respiratoryRate: {
    normal: { min: 12, max: 20 }, // breaths/min
    warning: { min: 8, max: 25 },
    unit: "breaths/min"
  },
  bloodPressure: {
    systolic: {
      normal: { min: 90, max: 120 }, // mmHg
      warning: { min: 70, max: 140 }
    },
    diastolic: {
      normal: { min: 60, max: 80 }, // mmHg
      warning: { min: 40, max: 90 }
    },
    unit: "mmHg"
  },
  oxygenSaturation: {
    normal: { min: 95, max: 100 }, // %
    warning: { min: 90, max: 100 },
    unit: "%"
  },
  painLevel: {
    normal: { min: 0, max: 3 }, // Scale 0-10
    warning: { min: 4, max: 6 },
    unit: "/10"
  }
};

// Assessment Levels
const ASSESSMENT_LEVELS = [
  { value: "routine", label: "Routine Check", color: "bg-green-100 text-green-800" },
  { value: "urgent", label: "Urgent", color: "bg-yellow-100 text-yellow-800" },
  { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
];

// Vital Signs Badge Component
const VitalStatusBadge = ({ status }: { status: VitalCategory }) => {
  const variants = {
    normal: "bg-green-100 text-green-700 hover:bg-green-100",
    warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    critical: "bg-red-100 text-red-700 hover:bg-red-100",
  };

  const labels = {
    normal: "Normal",
    warning: "Warning",
    critical: "Critical",
  };

  return (
    <Badge variant="outline" className={variants[status]}>
      {labels[status]}
    </Badge>
  );
};

// Vital Card Component for Dashboard - RESPONSIVE
interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  status: VitalCategory;
  trend?: 'up' | 'down' | 'stable';
  lastReading?: string;
}

function VitalCard({ title, value, unit, icon, status, trend, lastReading }: VitalCardProps) {
  const trendIcons = {
    up: <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />,
    down: <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />,
    stable: <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />,
  };

  const statusColors = {
    normal: "border-green-200 bg-green-50",
    warning: "border-yellow-200 bg-yellow-50",
    critical: "border-red-200 bg-red-50",
  };

  return (
    <Card className={`border ${statusColors[status]} transition-all hover:shadow-md`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`p-1.5 sm:p-2 rounded-full ${
              status === 'normal' ? 'bg-green-100 text-green-600' :
              status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              <div className="h-4 w-4 sm:h-5 sm:w-5">
                {icon}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</div>
              <div className="flex items-baseline gap-1">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{unit}</div>
                {trend && trendIcons[trend]}
              </div>
            </div>
          </div>
          <div className="hidden xs:block">
            <VitalStatusBadge status={status} />
          </div>
        </div>
        {lastReading && (
          <div className="mt-2 text-xs text-muted-foreground truncate">
            Last: {lastReading}
          </div>
        )}
        <div className="xs:hidden mt-2">
          <VitalStatusBadge status={status} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function PatientAdmissionVitals() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isTrendsDialogOpen, setIsTrendsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVital, setSelectedVital] = useState<VitalSigns | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [selectedChart, setSelectedChart] = useState<string>('all');
  
  // Form state
  const [formData, setFormData] = useState<VitalSignsInput>({
    admissionId: parseInt(id || '0'),
    temperature: undefined,
    heartRate: undefined,
    respiratoryRate: undefined,
    bloodPressureSystolic: undefined,
    bloodPressureDiastolic: undefined,
    oxygenSaturation: undefined,
    painLevel: undefined,
    notes: "",
    assessmentLevel: "routine",
    isManualEntry: true,
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      admissionId: parseInt(id || '0'),
      temperature: undefined,
      heartRate: undefined,
      respiratoryRate: undefined,
      bloodPressureSystolic: undefined,
      bloodPressureDiastolic: undefined,
      oxygenSaturation: undefined,
      painLevel: undefined,
      notes: "",
      assessmentLevel: "routine",
      isManualEntry: true,
    });
  };

  // Fetch admission details
  const { 
    data: admission, 
    isLoading: isLoadingAdmission,
    error: admissionError 
  } = useQuery({
    queryKey: ["admission", id],
    queryFn: () => fetchAdmissionById(id!),
    enabled: !!id,
  });

  // Fetch vital signs history
  const {
    data: vitalHistoryData,
    isLoading: isLoadingHistory,
    error: historyError,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["vital-history", admission?.id, timeRange],
    queryFn: () => getVitalSignsHistory(admission?.id!, timeRange as any),
    enabled: !!admission?.id,
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true,
  });
    
    const vitalHistory = vitalHistoryData?.vitals
  // Fetch latest vitals
  const { 
    data: latestVitals,
    isLoading: isLoadingLatestVitals 
  } = useQuery({
    queryKey: ["latest-vitals", admission?.id],
    queryFn: () => getLatestVitals(admission?.id!),
    enabled: !!admission?.id,
    refetchInterval: 10000, // Refresh every 10 seconds for real-time updates
  });

  // Fetch abnormal vitals
  const { 
    data: abnormalVitalsData,
    isLoading: isLoadingAbnormalVitals 
  } = useQuery({
    queryKey: ["abnormal-vitals", admission?.id],
    queryFn: () => getAbnormalVitals(admission?.id!),
    enabled: !!admission?.id,
  });
    const abnormalVitals = abnormalVitalsData?.vitals

  // Fetch vital trends
  const { 
    data: vitalTrends,
    isLoading: isLoadingTrends 
  } = useQuery({
    queryKey: ["vital-trends", admission?.id, timeRange],
    queryFn: () => getVitalTrends(admission?.id!, timeRange as any),
    enabled: !!admission?.id,
  });

  // Mutations
  const recordVitalsMutation = useMutation({
    mutationFn: recordVitalSigns,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Vital signs recorded successfully",
        variant: "success",
      });
      setIsAddDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["vital-history", admission?.id] });
      queryClient.invalidateQueries({ queryKey: ["latest-vitals", admission?.id] });
      queryClient.invalidateQueries({ queryKey: ["abnormal-vitals", admission?.id] });
      queryClient.invalidateQueries({ queryKey: ["vital-trends", admission?.id] });
    },
    onError: (error: Error) => {
      toast({
        title: "Recording Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleRecordVitals = () => {
    if (!admission?.id) return;

    // Validate required fields
    const requiredFields = [
      'temperature',
      'heartRate',
      'respiratoryRate',
      'bloodPressureSystolic',
      'bloodPressureDiastolic',
      'oxygenSaturation',
      'painLevel'
    ];

    const missingFields = requiredFields.filter(field => 
      formData[field as keyof VitalSignsInput] === undefined || 
      formData[field as keyof VitalSignsInput] === null
    );

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in all vital sign fields`,
        variant: "destructive",
      });
      return;
    }

    // Validate blood pressure values
    if (formData.bloodPressureSystolic! <= formData.bloodPressureDiastolic!) {
      toast({
        title: "Validation Error",
        description: "Systolic pressure must be higher than diastolic pressure",
        variant: "destructive",
      });
      return;
    }

    // Validate value ranges
    const validations = [
      { field: 'temperature', value: formData.temperature!, min: 30, max: 45, message: 'Temperature must be between 30°C and 45°C' },
      { field: 'heartRate', value: formData.heartRate!, min: 30, max: 250, message: 'Heart rate must be between 30 and 250 bpm' },
      { field: 'respiratoryRate', value: formData.respiratoryRate!, min: 5, max: 60, message: 'Respiratory rate must be between 5 and 60 breaths/min' },
      { field: 'bloodPressureSystolic', value: formData.bloodPressureSystolic!, min: 50, max: 250, message: 'Systolic pressure must be between 50 and 250 mmHg' },
      { field: 'bloodPressureDiastolic', value: formData.bloodPressureDiastolic!, min: 30, max: 150, message: 'Diastolic pressure must be between 30 and 150 mmHg' },
      { field: 'oxygenSaturation', value: formData.oxygenSaturation!, min: 70, max: 100, message: 'Oxygen saturation must be between 70% and 100%' },
      { field: 'painLevel', value: formData.painLevel!, min: 0, max: 10, message: 'Pain level must be between 0 and 10' },
    ];

    const invalidField = validations.find(v => v.value < v.min || v.value > v.max);
    if (invalidField) {
      toast({
        title: "Validation Error",
        description: invalidField.message,
        variant: "destructive",
      });
      return;
    }

    recordVitalsMutation.mutate({
      ...formData,
      admissionId: admission.id,
    });
  };

  const handleViewTrends = (vitalType?: string) => {
    if (vitalType) {
      setSelectedChart(vitalType);
    }
    setIsTrendsDialogOpen(true);
  };

  const handleFormChange = (field: keyof VitalSignsInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate vital status
  const calculateVitalStatus = (type: string, value: number): VitalStatus => {
    const ranges = VITAL_RANGES[type as keyof typeof VITAL_RANGES];
    
    if (!ranges) {
      return { category: 'normal', message: 'No range defined' };
    }

    if (type === 'bloodPressure') {
      const systolic = formData.bloodPressureSystolic!;
      const diastolic = formData.bloodPressureDiastolic!;
      
      if (systolic < 90 || diastolic < 60) {
        return { category: 'critical', message: 'Low blood pressure' };
      } else if (systolic > 180 || diastolic > 120) {
        return { category: 'critical', message: 'High blood pressure - Hypertensive Crisis' };
      } else if (systolic > 140 || diastolic > 90) {
        return { category: 'warning', message: 'Elevated blood pressure' };
      } else if (systolic > 120 || diastolic > 80) {
        return { category: 'warning', message: 'Pre-hypertensive' };
      }
      return { category: 'normal', message: 'Normal blood pressure' };
    }

    if ('normal' in ranges) {
      const { normal, warning } = ranges as any;
      
      if (value < normal.min || value > normal.max) {
        if (value < warning.min || value > warning.max) {
          return { 
            category: 'critical', 
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} is critically ${value < warning.min ? 'low' : 'high'}` 
          };
        }
        return { 
          category: 'warning', 
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} is ${value < normal.min ? 'low' : 'high'}` 
        };
      }
    }

    return { category: 'normal', message: 'Within normal range' };
  };

  // Get overall patient status
  const getOverallStatus = (): VitalCategory => {
    if (!latestVitals) return 'normal';
    
    const vitals = [
      calculateVitalStatus('temperature', latestVitals.temperature),
      calculateVitalStatus('heartRate', latestVitals.heartRate),
      calculateVitalStatus('respiratoryRate', latestVitals.respiratoryRate),
      calculateVitalStatus('bloodPressure', latestVitals.bloodPressureSystolic),
      calculateVitalStatus('oxygenSaturation', latestVitals.oxygenSaturation),
    ];

    if (vitals.some(v => v.category === 'critical')) return 'critical';
    if (vitals.some(v => v.category === 'warning')) return 'warning';
    return 'normal';
  };

  // Filter vital history based on search
  const filteredHistory = vitalHistory?.filter((vital: any) =>
    vital.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vital.recordedBy?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vital.assessmentLevel?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  
  // Always return both date and time
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

  // Calculate stats
  const stats = {
    totalReadings: vitalHistory?.length || 0,
    abnormalReadings: abnormalVitals?.length || 0,
    criticalReadings: abnormalVitals?.filter((v: VitalSigns) => 
      calculateVitalStatus('temperature', v.temperature).category === 'critical' ||
      calculateVitalStatus('heartRate', v.heartRate).category === 'critical' ||
      calculateVitalStatus('respiratoryRate', v.respiratoryRate).category === 'critical' ||
      calculateVitalStatus('bloodPressure', v.bloodPressureSystolic).category === 'critical' ||
      calculateVitalStatus('oxygenSaturation', v.oxygenSaturation).category === 'critical'
    ).length || 0,
    todayReadings: vitalHistory?.filter((v: VitalSigns) => 
      new Date(v.recordedAt).toDateString() === new Date().toDateString()
    ).length || 0,
  };

  // Error handling
  if (admissionError) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Error Loading Admission
              </h1>
              <p className="text-muted-foreground mb-6">
                {admissionError.message}
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

  // Loading state
  if (isLoadingAdmission) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded" />
                <Skeleton className="h-6 w-48 sm:h-8 sm:w-64" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 sm:h-32 rounded-lg" />
                ))}
              </div>
              <Skeleton className="h-64 sm:h-96 rounded-lg" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!admission) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Admission Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                The admission record you're looking for doesn't exist.
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

  const patient = admission.patient;
  const overallStatus = getOverallStatus();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-8 w-8"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-300 md:relative md:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/dashboard/admissions/${id}/details`)}
                  className="h-8 w-8 sm:h-10 sm:w-10"
                >
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    Vital Signs
                  </h1>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="font-medium truncate">{patient?.user?.fullName}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <span className="truncate">Adm: {admission.reference?.substring(0,5)}</span>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      <div className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
                        overallStatus === 'normal' ? 'bg-green-500' :
                        overallStatus === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <span className="capitalize truncate">{overallStatus} Status</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => refetchHistory()}
                    disabled={isLoadingHistory}
                    className="h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isLoadingHistory ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/dashboard/admissions/${id}/details`)}
                    className="flex-1 sm:flex-none h-8 px-2 sm:h-10 sm:px-4"
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">View Admission</span>
                  </Button>
                </div>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  disabled={recordVitalsMutation.isPending}
                  className="bg-gradient-primary hover:shadow-glow transition-all h-8 px-2 sm:h-10 sm:px-4"
                >
                  {recordVitalsMutation.isPending ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  )}
                  <span className="text-xs sm:text-sm">Record Vitals</span>
                </Button>
              </div>
            </div>

            {/* Overall Status Card */}
            <Card className={`border-2 ${
              overallStatus === 'normal' ? 'border-green-200 bg-green-50' :
              overallStatus === 'warning' ? 'border-yellow-200 bg-yellow-50' :
              'border-red-200 bg-red-50'
            }`}>
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <div className={`p-2 sm:p-3 rounded-full ${
                      overallStatus === 'normal' ? 'bg-green-100 text-green-600' :
                      overallStatus === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {overallStatus === 'normal' ? (
                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                      ) : overallStatus === 'warning' ? (
                        <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                      ) : (
                        <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base md:text-xl font-semibold">Patient Status</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        Last updated: {latestVitals ? formatDateTime(latestVitals.recordedAt) : 'No readings'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-4 w-full sm:w-auto">
                    <div className="text-center p-2 bg-white/50 rounded">
                      <div className="text-base sm:text-lg md:text-2xl font-bold">{stats.todayReadings}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Today</div>
                    </div>
                    <div className="text-center p-2 bg-white/50 rounded">
                      <div className={`text-base sm:text-lg md:text-2xl font-bold ${
                        stats.abnormalReadings > 0 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {stats.abnormalReadings}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Abnormal</div>
                    </div>
                    <div className="text-center p-2 bg-white/50 rounded">
                      <div className="text-base sm:text-lg md:text-2xl font-bold text-red-600">
                        {stats.criticalReadings}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Critical</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Vitals Dashboard - RESPONSIVE GRID */}
            <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {latestVitals && (
                <>
                  <div className="col-span-2 xs:col-span-2 sm:col-span-3 lg:col-span-1">
                    <VitalCard
                      title="Temperature"
                      value={latestVitals.temperature}
                      unit="°C"
                      icon={<Thermometer />}
                      status={calculateVitalStatus('temperature', latestVitals.temperature).category}
                      trend={vitalTrends?.temperature?.trend}
                      lastReading={formatDateTime(latestVitals.recordedAt)}
                    />
                  </div>
                  <div className="col-span-2 xs:col-span-2 sm:col-span-3 lg:col-span-1">
                    <VitalCard
                      title="Heart Rate"
                      value={latestVitals.heartRate}
                      unit="bpm"
                      icon={<Heart />}
                      status={calculateVitalStatus('heartRate', latestVitals.heartRate).category}
                      trend={vitalTrends?.heartRate?.trend}
                      lastReading={formatDateTime(latestVitals.recordedAt)}
                    />
                  </div>
                  <div className="col-span-2 xs:col-span-2 sm:col-span-3 lg:col-span-1">
                    <VitalCard
                      title="Blood Pressure"
                      value={`${latestVitals.bloodPressureSystolic}/${latestVitals.bloodPressureDiastolic}`}
                      unit="mmHg"
                      icon={<Activity />}
                      status={calculateVitalStatus('bloodPressure', latestVitals.bloodPressureSystolic).category}
                      lastReading={formatDateTime(latestVitals.recordedAt)}
                    />
                  </div>
                  <div className="col-span-2 xs:col-span-2 sm:col-span-3 lg:col-span-1">
                    <VitalCard
                      title="O₂ Sat"
                      value={latestVitals.oxygenSaturation}
                      unit="%"
                      icon={<Droplets />}
                      status={calculateVitalStatus('oxygenSaturation', latestVitals.oxygenSaturation).category}
                      trend={vitalTrends?.oxygenSaturation?.trend}
                      lastReading={formatDateTime(latestVitals.recordedAt)}
                    />
                  </div>
                  <div className="col-span-2 xs:col-span-2 sm:col-span-3 lg:col-span-1">
                    <VitalCard
                      title="Resp Rate"
                      value={latestVitals.respiratoryRate}
                      unit="/min"
                      icon={<Wind />}
                      status={calculateVitalStatus('respiratoryRate', latestVitals.respiratoryRate).category}
                      trend={vitalTrends?.respiratoryRate?.trend}
                      lastReading={formatDateTime(latestVitals.recordedAt)}
                    />
                  </div>
                  <div className="col-span-2 xs:col-span-2 sm:col-span-3 lg:col-span-1">
                    <VitalCard
                      title="Pain Level"
                      value={latestVitals.painLevel || 0}
                      unit="/10"
                      icon={<Brain />}
                      status={latestVitals.painLevel! > 6 ? 'critical' : latestVitals.painLevel! > 3 ? 'warning' : 'normal'}
                      lastReading={formatDateTime(latestVitals.recordedAt)}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="history" className="space-y-4 sm:space-y-6">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <TabsList className="flex w-full sm:w-auto overflow-x-auto">
                    <TabsTrigger value="history" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <History className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span >History</span>
                    </TabsTrigger>
                    <TabsTrigger value="trends" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <LineChart className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span >Trends</span>
                    </TabsTrigger>
                    <TabsTrigger value="abnormal" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span >Abnormal</span>
                      {stats.abnormalReadings > 0 && (
                        <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-[10px]">
                          {stats.abnormalReadings}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-48">
                      <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 h-8 text-sm"
                      />
                    </div>
                    <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                      <SelectTrigger className="h-8 text-sm w-full sm:w-32">
                        <SelectValue placeholder="Time Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">Last 24 Hours</SelectItem>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Vital History Tab */}
              <TabsContent value="history">
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <CardTitle className="text-lg sm:text-xl">Vital History</CardTitle>
                        <CardDescription className="text-sm">
                          Complete history of vital sign readings
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {stats.totalReadings} readings
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewTrends()}
                          className="h-8 text-xs"
                        >
                          <LineChart className="h-3 w-3 mr-1" />
                          Trends
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    {isLoadingHistory ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-20 sm:h-16 w-full" />
                        ))}
                      </div>
                    ) : historyError ? (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          Failed to load vital signs history. Please try again.
                        </AlertDescription>
                      </Alert>
                    ) : filteredHistory?.length === 0 ? (
                      <div className="text-center py-8 sm:py-12">
                        <Activity className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-medium mb-2">No Vital Signs Recorded</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {searchQuery ? "No vital signs match your search." : "No vital signs have been recorded for this patient."}
                        </p>
                        {!searchQuery && (
                          <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            Record First Vital Signs
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredHistory?.map((vital: VitalSigns) => (
                          <VitalHistoryCard
                            key={vital.id}
                            vital={vital}
                            formatDateTime={formatDateTime}
                            calculateVitalStatus={calculateVitalStatus}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Trends Tab */}
              <TabsContent value="trends">
                <VitalTrendsTab
                  vitalTrends={vitalTrends}
                  isLoading={isLoadingTrends}
                  onViewDetails={handleViewTrends}
                />
              </TabsContent>

              {/* Abnormal Readings Tab */}
              <TabsContent value="abnormal">
                <AbnormalVitalsTab
                  abnormalVitals={abnormalVitals}
                  isLoading={isLoadingAbnormalVitals}
                  calculateVitalStatus={calculateVitalStatus}
                  formatDateTime={formatDateTime}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Record Vitals Dialog - RESPONSIVE */}
      <RecordVitalsDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          resetForm();
        }}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleRecordVitals}
        isLoading={recordVitalsMutation.isPending}
        calculateVitalStatus={calculateVitalStatus}
      />

      {/* Trends Dialog - RESPONSIVE */}
      <VitalTrendsDialog
        isOpen={isTrendsDialogOpen}
        onClose={() => setIsTrendsDialogOpen(false)}
        vitalTrends={vitalTrends}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        selectedChart={selectedChart}
        onChartChange={setSelectedChart}
      />
    </div>
  );
}

// Vital History Card Component - RESPONSIVE
function VitalHistoryCard({ 
  vital, 
  formatDateTime, 
  calculateVitalStatus 
}: { 
  vital: VitalSigns; 
  formatDateTime: (date: string) => string;
  calculateVitalStatus: (type: string, value: number) => VitalStatus;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate if any vital is abnormal
  const hasAbnormalVitals = () => {
    const vitals = [
      calculateVitalStatus('temperature', vital.temperature),
      calculateVitalStatus('heartRate', vital.heartRate),
      calculateVitalStatus('respiratoryRate', vital.respiratoryRate),
      calculateVitalStatus('bloodPressure', vital.bloodPressureSystolic),
      calculateVitalStatus('oxygenSaturation', vital.oxygenSaturation),
    ];
    return vitals.some(v => v.category !== 'normal');
  };

  return (
    <div className={`border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md ${
      hasAbnormalVitals() ? 'border-yellow-200' : ''
    }`}>
      <div className="p-3 sm:p-4 bg-card">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${
                  vital.assessmentLevel === 'critical' ? 'bg-red-100 text-red-600' :
                  vital.assessmentLevel === 'urgent' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                <span className="text-sm font-medium capitalize truncate">{vital.assessmentLevel} Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  {formatDateTime(vital.recordedAt)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-6 w-6 sm:h-8 sm:w-8"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 xs:grid-cols-6 gap-2">
              <VitalMiniCard
                label="Temp"
                value={vital.temperature}
                unit="°C"
                status={calculateVitalStatus('temperature', vital.temperature)}
              />
              <VitalMiniCard
                label="HR"
                value={vital.heartRate}
                unit="bpm"
                status={calculateVitalStatus('heartRate', vital.heartRate)}
              />
              <VitalMiniCard
                label="BP"
                value={`${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic}`}
                unit="mmHg"
                status={calculateVitalStatus('bloodPressure', vital.bloodPressureSystolic)}
              />
              <VitalMiniCard
                label="O₂"
                value={vital.oxygenSaturation}
                unit="%"
                status={calculateVitalStatus('oxygenSaturation', vital.oxygenSaturation)}
              />
              <VitalMiniCard
                label="RR"
                value={vital.respiratoryRate}
                unit="/min"
                status={calculateVitalStatus('respiratoryRate', vital.respiratoryRate)}
              />
              <VitalMiniCard
                label="Pain"
                value={vital.painLevel || 0}
                unit="/10"
                status={{
                  category: vital.painLevel! > 6 ? 'critical' : vital.painLevel! > 3 ? 'warning' : 'normal',
                  message: `Pain level ${vital.painLevel}`
                }}
              />
            </div>

            {vital.recordedBy && (
              <div className="mt-2 text-xs text-muted-foreground truncate">
                Recorded by {vital.recordedByUser?.fullName}
                {vital.isManualEntry && (
                  <span className="ml-2 text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">Manual</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t p-3 sm:p-4 bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">Detailed Readings</Label>
                <div className="space-y-1.5 text-xs sm:text-sm">
                  {[
                    { label: 'Temperature', value: `${vital.temperature} °C`, status: calculateVitalStatus('temperature', vital.temperature) },
                    { label: 'Heart Rate', value: `${vital.heartRate} bpm`, status: calculateVitalStatus('heartRate', vital.heartRate) },
                    { label: 'Respiratory Rate', value: `${vital.respiratoryRate} breaths/min`, status: calculateVitalStatus('respiratoryRate', vital.respiratoryRate) },
                    { label: 'Blood Pressure', value: `${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic} mmHg`, status: calculateVitalStatus('bloodPressure', vital.bloodPressureSystolic) },
                    { label: 'Oxygen Saturation', value: `${vital.oxygenSaturation}%`, status: calculateVitalStatus('oxygenSaturation', vital.oxygenSaturation) },
                    { label: 'Pain Level', value: `${vital.painLevel || 0}/10`, status: { category: vital.painLevel! > 6 ? 'critical' : vital.painLevel! > 3 ? 'warning' : 'normal', message: '' } },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-muted-foreground truncate pr-2">{item.label}:</span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="font-medium truncate">{item.value}</span>
                        <VitalStatusBadge status={item.status.category} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {vital.notes && (
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">Notes</Label>
                  <p className="text-xs sm:text-sm bg-white p-2 sm:p-3 rounded border max-h-32 overflow-y-auto">{vital.notes}</p>
                </div>
              )}
              
              <div>
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">Assessment</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`text-xs ${ASSESSMENT_LEVELS.find(l => l.value === vital.assessmentLevel)?.color}`}>
                    {ASSESSMENT_LEVELS.find(l => l.value === vital.assessmentLevel)?.label}
                  </Badge>
                  {hasAbnormalVitals() && (
                    <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                      <AlertTriangle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                      Abnormal
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Vital Mini Card Component - RESPONSIVE
function VitalMiniCard({ 
  label, 
  value, 
  unit, 
  status 
}: { 
  label: string; 
  value: number | string; 
  unit: string; 
  status: VitalStatus 
}) {
  return (
    <div className="flex flex-col items-center p-1.5 sm:p-2 rounded border bg-white min-w-0">
      <span className="text-[10px] xs:text-xs text-muted-foreground mb-0.5 truncate w-full text-center">{label}</span>
      <div className="flex items-baseline gap-0.5">
        <span className="text-sm sm:text-lg font-bold truncate">{value}</span>
        <span className="text-[10px] xs:text-xs text-muted-foreground">{unit}</span>
      </div>
      <div className="mt-0.5">
        <VitalStatusBadge status={status.category} />
      </div>
    </div>
  );
}

// Trends Tab Component - RESPONSIVE
function VitalTrendsTab({ 
  vitalTrends, 
  isLoading, 
  onViewDetails 
}: { 
  vitalTrends: any; 
  isLoading: boolean; 
  onViewDetails: (vitalType: string) => void;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 sm:h-32 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!vitalTrends) {
    return (
      <Card>
        <CardContent className="py-8 sm:py-12">
          <div className="text-center">
            <LineChart className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium mb-2">No Trend Data Available</h3>
            <p className="text-sm text-muted-foreground">
              Not enough data points to analyze trends. Record more vital signs.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const trendCards = [
    {
      key: 'temperature',
      title: 'Temperature',
      icon: <Thermometer className="h-4 w-4 sm:h-5 sm:w-5" />,
      current: vitalTrends.temperature?.current,
      unit: '°C',
      trend: vitalTrends.temperature?.trend,
      change: vitalTrends.temperature?.change,
    },
    {
      key: 'heartRate',
      title: 'Heart Rate',
      icon: <Heart className="h-4 w-4 sm:h-5 sm:w-5" />,
      current: vitalTrends.heartRate?.current,
      unit: 'bpm',
      trend: vitalTrends.heartRate?.trend,
      change: vitalTrends.heartRate?.change,
    },
    {
      key: 'bloodPressure',
      title: 'Blood Pressure',
      icon: <Activity className="h-4 w-4 sm:h-5 sm:w-5" />,
      current: `${vitalTrends.bloodPressure?.systolic?.current}/${vitalTrends.bloodPressure?.diastolic?.current}`,
      unit: 'mmHg',
      trend: vitalTrends.bloodPressure?.trend,
      change: vitalTrends.bloodPressure?.change,
    },
    {
      key: 'oxygenSaturation',
      title: 'O₂ Saturation',
      icon: <Droplets className="h-4 w-4 sm:h-5 sm:w-5" />,
      current: vitalTrends.oxygenSaturation?.current,
      unit: '%',
      trend: vitalTrends.oxygenSaturation?.trend,
      change: vitalTrends.oxygenSaturation?.change,
    },
  ];

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Vital Trends</CardTitle>
        <CardDescription className="text-sm">
          Analysis of vital sign changes over time
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {trendCards.map((card) => (
            <Card key={card.key}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {card.icon}
                    <h4 className="text-sm sm:text-base font-semibold">{card.title}</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(card.key)}
                    className="h-6 w-6 sm:h-8 sm:w-8"
                  >
                    <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xl sm:text-2xl font-bold truncate">{card.current || '--'}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{card.unit}</div>
                  </div>
                  {card.trend && (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className={`flex items-center gap-1 ${
                        card.trend === 'up' ? 'text-red-500' :
                        card.trend === 'down' ? 'text-green-500' :
                        'text-gray-500'
                      }`}>
                        {card.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : card.trend === 'down' ? (
                          <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                        <span className="text-xs sm:text-sm font-medium capitalize">{card.trend}</span>
                      </div>
                      {card.change && (
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {card.change > 0 ? '+' : ''}{card.change.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  )}
                  <Progress 
                    value={
                      card.trend === 'up' ? 75 :
                      card.trend === 'down' ? 25 :
                      50
                    } 
                    className={`h-1.5 sm:h-2 ${
                      card.trend === 'up' ? 'bg-red-100' :
                      card.trend === 'down' ? 'bg-green-100' :
                      'bg-gray-100'
                    }`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Abnormal Vitals Tab Component - RESPONSIVE
function AbnormalVitalsTab({ 
  abnormalVitals, 
  isLoading, 
  calculateVitalStatus, 
  formatDateTime 
}: { 
  abnormalVitals: VitalSigns[]; 
  isLoading: boolean; 
  calculateVitalStatus: (type: string, value: number) => VitalStatus;
  formatDateTime: (date: string) => string;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-20 sm:h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!abnormalVitals || abnormalVitals.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 sm:py-12">
          <div className="text-center">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium mb-2">No Abnormal Readings</h3>
            <p className="text-sm text-muted-foreground">
              All vital signs are within normal range. Good job!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group abnormal vitals by type and severity
  const groupedVitals = abnormalVitals.reduce((acc, vital) => {
    const vitalsToCheck = [
      { type: 'temperature', value: vital.temperature },
      { type: 'heartRate', value: vital.heartRate },
      { type: 'respiratoryRate', value: vital.respiratoryRate },
      { type: 'bloodPressure', value: vital.bloodPressureSystolic },
      { type: 'oxygenSaturation', value: vital.oxygenSaturation },
    ];

    vitalsToCheck.forEach(({ type, value }) => {
      const status = calculateVitalStatus(type, value);
      if (status.category !== 'normal') {
        if (!acc[type]) {
          acc[type] = { critical: [], warning: [] };
        }
        acc[type][status.category].push({
          vital,
          status,
          value,
          timestamp: vital.recordedAt,
        });
      }
    });

    return acc;
  }, {} as any);

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="text-lg sm:text-xl">Abnormal Readings</CardTitle>
            <CardDescription className="text-sm">
              Readings that require attention ({abnormalVitals.length} total)
            </CardDescription>
          </div>
          <Badge variant="destructive" className="text-xs">
            <AlertTriangle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
            Requires Review
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-4">
          {Object.entries(groupedVitals).map(([type, data]: [string, any]) => (
            <div key={type} className="border rounded-lg overflow-hidden">
              <div className="bg-muted/50 p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 sm:p-2 rounded-full ${
                      type === 'temperature' ? 'bg-orange-100 text-orange-600' :
                      type === 'heartRate' ? 'bg-red-100 text-red-600' :
                      type === 'bloodPressure' ? 'bg-purple-100 text-purple-600' :
                      type === 'oxygenSaturation' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {type === 'temperature' ? <Thermometer className="h-3 w-3 sm:h-4 sm:w-4" /> :
                       type === 'heartRate' ? <Heart className="h-3 w-3 sm:h-4 sm:w-4" /> :
                       type === 'bloodPressure' ? <Activity className="h-3 w-3 sm:h-4 sm:w-4" /> :
                       type === 'oxygenSaturation' ? <Droplets className="h-3 w-3 sm:h-4 sm:w-4" /> :
                       <Wind className="h-3 w-3 sm:h-4 sm:w-4" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold capitalize truncate">
                        {type === 'bloodPressure' ? 'BP' : 
                         type === 'oxygenSaturation' ? 'O₂ Sat' :
                         type === 'respiratoryRate' ? 'Resp Rate' :
                         type === 'heartRate' ? 'HR' :
                         type === 'temperature' ? 'Temp' : type}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {data.critical.length} critical, {data.warning.length} warning
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs w-fit">
                    {data.critical.length + data.warning.length} events
                  </Badge>
                </div>
              </div>
              
              <div className="p-3 sm:p-4">
                <div className="space-y-2">
                  {[...data.critical, ...data.warning]
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, 3)
                    .map((item: any, index: number) => (
                      <div key={index} className={`p-2 sm:p-3 rounded border ${
                        item.status.category === 'critical' ? 'bg-red-50 border-red-200' :
                        'bg-yellow-50 border-yellow-200'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-medium truncate">
                                {type === 'bloodPressure' ? 
                                  `${item.vital.bloodPressureSystolic}/${item.vital.bloodPressureDiastolic} mmHg` :
                                  `${item.value} ${VITAL_RANGES[type as keyof typeof VITAL_RANGES]?.unit || ''}`
                                }
                              </span>
                              <VitalStatusBadge status={item.status.category} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {item.status.message}
                            </p>
                          </div>
                          <div className="text-right min-w-0">
                            <div className="text-xs sm:text-sm font-medium truncate">
                              {formatDateTime(item.timestamp)}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              by {item.vital.recordedByUser?.fullName || 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Record Vitals Dialog Component - RESPONSIVE
function RecordVitalsDialog({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSubmit,
  isLoading,
  calculateVitalStatus,
}: any) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  // Calculate current status for each vital
  const getCurrentStatus = (type: string, value?: number): VitalStatus => {
    if (value === undefined || value === null) {
      return { category: 'normal', message: 'No value entered' };
    }
    return calculateVitalStatus(type, value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            Record Vital Signs
          </DialogTitle>
          <DialogDescription className="text-sm">
            Enter the patient's current vital signs. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 sm:space-y-6 py-4">
            {/* Vital Signs Grid - RESPONSIVE */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {/* Temperature */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="temperature" className="flex items-center gap-1 text-xs sm:text-sm">
                  <Thermometer className="h-3 w-3 sm:h-4 sm:w-4" />
                  Temperature <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    min="30"
                    max="45"
                    placeholder="36.5"
                    value={formData.temperature || ''}
                    onChange={(e) => onFormChange('temperature', parseFloat(e.target.value))}
                    required
                    disabled={isLoading}
                    className="pr-12 h-8 sm:h-10 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs sm:text-sm text-muted-foreground">
                    °C
                  </div>
                </div>
                {formData.temperature !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <VitalStatusBadge status={getCurrentStatus('temperature', formData.temperature).category} />
                    <span className="text-xs text-muted-foreground truncate">
                      {getCurrentStatus('temperature', formData.temperature).message}
                    </span>
                  </div>
                )}
              </div>

              {/* Heart Rate */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="heartRate" className="flex items-center gap-1 text-xs sm:text-sm">
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                  Heart Rate <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="heartRate"
                    type="number"
                    min="30"
                    max="250"
                    placeholder="72"
                    value={formData.heartRate || ''}
                    onChange={(e) => onFormChange('heartRate', parseInt(e.target.value))}
                    required
                    disabled={isLoading}
                    className="pr-12 h-8 sm:h-10 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs sm:text-sm text-muted-foreground">
                    bpm
                  </div>
                </div>
                {formData.heartRate !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <VitalStatusBadge status={getCurrentStatus('heartRate', formData.heartRate).category} />
                    <span className="text-xs text-muted-foreground truncate">
                      {getCurrentStatus('heartRate', formData.heartRate).message}
                    </span>
                  </div>
                )}
              </div>

              {/* Blood Pressure */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="flex items-center gap-1 text-xs sm:text-sm">
                  <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
                  Blood Pressure <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="flex-1 relative">
                    <Input
                      type="number"
                      placeholder="120"
                      value={formData.bloodPressureSystolic || ''}
                      onChange={(e) => onFormChange('bloodPressureSystolic', parseInt(e.target.value))}
                      required
                      disabled={isLoading}
                      className="pr-10 h-8 sm:h-10 text-sm"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[10px] xs:text-xs text-muted-foreground">
                      Systolic
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground">/</div>
                  <div className="flex-1 relative">
                    <Input
                      type="number"
                      placeholder="80"
                      value={formData.bloodPressureDiastolic || ''}
                      onChange={(e) => onFormChange('bloodPressureDiastolic', parseInt(e.target.value))}
                      required
                      disabled={isLoading}
                      className="pr-10 h-8 sm:h-10 text-sm"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[10px] xs:text-xs text-muted-foreground">
                      Diastolic
                    </div>
                  </div>
                </div>
                {formData.bloodPressureSystolic !== undefined && formData.bloodPressureDiastolic !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <VitalStatusBadge status={getCurrentStatus('bloodPressure', formData.bloodPressureSystolic).category} />
                    <span className="text-xs text-muted-foreground truncate">
                      {getCurrentStatus('bloodPressure', formData.bloodPressureSystolic).message}
                    </span>
                  </div>
                )}
              </div>

              {/* Oxygen Saturation */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="oxygenSaturation" className="flex items-center gap-1 text-xs sm:text-sm">
                  <Droplets className="h-3 w-3 sm:h-4 sm:w-4" />
                  O₂ Saturation <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="oxygenSaturation"
                    type="number"
                    min="70"
                    max="100"
                    placeholder="98"
                    value={formData.oxygenSaturation || ''}
                    onChange={(e) => onFormChange('oxygenSaturation', parseInt(e.target.value))}
                    required
                    disabled={isLoading}
                    className="pr-10 h-8 sm:h-10 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs sm:text-sm text-muted-foreground">
                    %
                  </div>
                </div>
                {formData.oxygenSaturation !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <VitalStatusBadge status={getCurrentStatus('oxygenSaturation', formData.oxygenSaturation).category} />
                    <span className="text-xs text-muted-foreground truncate">
                      {getCurrentStatus('oxygenSaturation', formData.oxygenSaturation).message}
                    </span>
                  </div>
                )}
              </div>

              {/* Respiratory Rate */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="respiratoryRate" className="flex items-center gap-1 text-xs sm:text-sm">
                  <Wind className="h-3 w-3 sm:h-4 sm:w-4" />
                  Respiratory Rate <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="respiratoryRate"
                    type="number"
                    min="5"
                    max="60"
                    placeholder="16"
                    value={formData.respiratoryRate || ''}
                    onChange={(e) => onFormChange('respiratoryRate', parseInt(e.target.value))}
                    required
                    disabled={isLoading}
                    className="pr-20 h-8 sm:h-10 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                    breaths/min
                  </div>
                </div>
                {formData.respiratoryRate !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <VitalStatusBadge status={getCurrentStatus('respiratoryRate', formData.respiratoryRate).category} />
                    <span className="text-xs text-muted-foreground truncate">
                      {getCurrentStatus('respiratoryRate', formData.respiratoryRate).message}
                    </span>
                  </div>
                )}
              </div>

              {/* Pain Level */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="painLevel" className="flex items-center gap-1 text-xs sm:text-sm">
                  <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
                  Pain Level <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-1.5">
                  <Input
                    id="painLevel"
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={formData.painLevel || 0}
                    onChange={(e) => onFormChange('painLevel', parseInt(e.target.value))}
                    required
                    disabled={isLoading}
                    className="w-full h-2"
                  />
                  <div className="flex items-center justify-between text-[10px] xs:text-xs text-muted-foreground">
                    <span>0 (No Pain)</span>
                    <span className="font-medium">{formData.painLevel || 0}/10</span>
                    <span>10 (Worst)</span>
                  </div>
                </div>
                {formData.painLevel !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <VitalStatusBadge status={formData.painLevel > 6 ? 'critical' : formData.painLevel > 3 ? 'warning' : 'normal'} />
                    <span className="text-xs text-muted-foreground">
                      {formData.painLevel === 0 ? 'No pain' :
                       formData.painLevel <= 3 ? 'Mild pain' :
                       formData.painLevel <= 6 ? 'Moderate pain' : 'Severe pain'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information - RESPONSIVE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="assessmentLevel" className="text-xs sm:text-sm">Assessment Level</Label>
                <Select
                  value={formData.assessmentLevel}
                  onValueChange={(value) => onFormChange('assessmentLevel', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-8 sm:h-10 text-sm">
                    <SelectValue placeholder="Select assessment level" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSESSMENT_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value} className="text-sm">
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="isManualEntry" className="text-xs sm:text-sm">Recording Method</Label>
                <Select
                  value={formData.isManualEntry ? "manual" : "device"}
                  onValueChange={(value) => onFormChange('isManualEntry', value === "manual")}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-8 sm:h-10 text-sm">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual" className="text-sm">Manual Entry</SelectItem>
                    <SelectItem value="device" className="text-sm">Device Reading</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="notes" className="text-xs sm:text-sm">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Patient condition, observations, or special notes..."
                value={formData.notes}
                onChange={(e) => onFormChange('notes', e.target.value)}
                rows={2}
                disabled={isLoading}
                className="text-sm"
              />
            </div>

            {/* Summary - RESPONSIVE */}
            <Card>
              <CardContent className="p-3 sm:p-4">
                <h4 className="font-semibold text-sm sm:text-base mb-2">Summary</h4>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <VitalStatusBadge status={
                        Object.values(formData).some((v: any) => 
                          typeof v === 'number' && 
                          getCurrentStatus('temperature', v).category === 'critical' ||
                          getCurrentStatus('heartRate', v).category === 'critical'
                        ) ? 'critical' : 
                        Object.values(formData).some((v: any) => 
                          typeof v === 'number' && 
                          getCurrentStatus('temperature', v).category === 'warning' ||
                          getCurrentStatus('heartRate', v).category === 'warning'
                        ) ? 'warning' : 'normal'
                      } />
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time:</span>
                    <div className="font-medium mt-1 truncate">{new Date().toLocaleString()}</div>
                  </div>
                  <div className="xs:col-span-2 sm:col-span-1">
                    <span className="text-muted-foreground">Assessment:</span>
                    <Badge className={`mt-1 text-xs ${ASSESSMENT_LEVELS.find(l => l.value === formData.assessmentLevel)?.color}`}>
                      {ASSESSMENT_LEVELS.find(l => l.value === formData.assessmentLevel)?.label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={onClose} 
              type="button"
              disabled={isLoading}
              className="w-full sm:w-auto h-8 sm:h-10 text-sm"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full sm:w-auto h-8 sm:h-10 text-sm bg-gradient-primary hover:shadow-glow transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                  <span>Recording...</span>
                </>
              ) : (
                <>
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span>Record Vital Signs</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Vital Trends Dialog Component - RESPONSIVE
function VitalTrendsDialog({
  isOpen,
  onClose,
  vitalTrends,
  timeRange,
  onTimeRangeChange,
  selectedChart,
  onChartChange,
}: any) {
  if (!vitalTrends) return null;

  const charts = [
    { key: 'temperature', label: 'Temperature', color: '#f97316', unit: '°C' },
    { key: 'heartRate', label: 'Heart Rate', color: '#ef4444', unit: 'bpm' },
    { key: 'bloodPressure', label: 'Blood Pressure', color: '#8b5cf6', unit: 'mmHg' },
    { key: 'oxygenSaturation', label: 'O₂ Saturation', color: '#3b82f6', unit: '%' },
    { key: 'respiratoryRate', label: 'Respiratory Rate', color: '#10b981', unit: 'breaths/min' },
  ];

  const selectedChartData = vitalTrends[selectedChart] || vitalTrends.temperature;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl lg:max-w-6xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <LineChart className="h-4 w-4 sm:h-5 sm:w-5" />
            Vital Signs Trends Analysis
          </DialogTitle>
          <DialogDescription className="text-sm">
            Detailed analysis of vital sign trends over time
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 py-4">
          {/* Time Range Selector */}
          <div className="flex items-center justify-between">
            <Tabs value={timeRange} onValueChange={onTimeRangeChange} className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="24h" className="text-xs sm:text-sm">24H</TabsTrigger>
                <TabsTrigger value="7d" className="text-xs sm:text-sm">7D</TabsTrigger>
                <TabsTrigger value="30d" className="text-xs sm:text-sm">30D</TabsTrigger>
                <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Chart Selector - RESPONSIVE */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {charts.map((chart) => (
              <Button
                key={chart.key}
                variant={selectedChart === chart.key ? "default" : "outline"}
                onClick={() => onChartChange(chart.key)}
                className="justify-start h-8 sm:h-10 text-xs sm:text-sm"
              >
                <div 
                  className="h-2 w-2 sm:h-3 sm:w-3 rounded-full mr-1.5 sm:mr-2" 
                  style={{ backgroundColor: chart.color }}
                />
                <span className="truncate">{chart.label}</span>
              </Button>
            ))}
          </div>

          {/* Main Chart Area */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                {charts.find(c => c.key === selectedChart)?.label} Trend
              </CardTitle>
              <CardDescription className="text-sm">
                {selectedChartData?.current} {charts.find(c => c.key === selectedChart)?.unit} • 
                Trend: <span className={`font-medium ${
                  selectedChartData?.trend === 'up' ? 'text-red-500' :
                  selectedChartData?.trend === 'down' ? 'text-green-500' :
                  'text-gray-500'
                }`}>
                  {selectedChartData?.trend || 'stable'}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {/* Placeholder for actual chart component */}
              <div className="h-48 sm:h-64 md:h-80 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center p-4">
                  <LineChart className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm text-muted-foreground">Chart visualization would appear here</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Connecting to charting library...
                  </p>
                </div>
              </div>

              {/* Statistics - RESPONSIVE */}
              {selectedChartData?.stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <div className="p-3 bg-white border rounded-lg">
                    <div className="text-xs sm:text-sm text-muted-foreground">Average</div>
                    <div className="text-lg sm:text-xl font-bold">
                      {selectedChartData.stats.average?.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-3 bg-white border rounded-lg">
                    <div className="text-xs sm:text-sm text-muted-foreground">Minimum</div>
                    <div className="text-lg sm:text-xl font-bold">
                      {selectedChartData.stats.min?.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-3 bg-white border rounded-lg">
                    <div className="text-xs sm:text-sm text-muted-foreground">Maximum</div>
                    <div className="text-lg sm:text-xl font-bold">
                      {selectedChartData.stats.max?.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-3 bg-white border rounded-lg">
                    <div className="text-xs sm:text-sm text-muted-foreground">Variability</div>
                    <div className="text-lg sm:text-xl font-bold">
                      {selectedChartData.stats.variability?.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Data Table - RESPONSIVE */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Historical Data</CardTitle>
              <CardDescription className="text-sm">
                Last 10 readings for {charts.find(c => c.key === selectedChart)?.label}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Date & Time</TableHead>
                      <TableHead className="text-xs sm:text-sm">Value</TableHead>
                      <TableHead className="text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="text-xs sm:text-sm">Recorded By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vitalTrends.history?.[selectedChart]?.slice(0, 10).map((record: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="text-xs sm:text-sm">
                          {new Date(record.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm font-medium">
                          {record.value} {charts.find(c => c.key === selectedChart)?.unit}
                        </TableCell>
                        <TableCell>
                          <VitalStatusBadge status={record.status} />
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          {record.recordedBy || 'System'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="h-8 sm:h-10 text-sm">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}