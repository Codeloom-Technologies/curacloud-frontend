import { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Calendar, User, FileText, Clock, Download, Upload, Eye, Edit, TestTube, AlertTriangle, FileUp, Type, X, Send, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPatients } from "@/services/patient";
import { getAllDoctors } from "@/services/staff";
import { createLabOrder, getLabOrders, getLabStats, uploadLabResults } from "@/services/lab";

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { createLabReport, CreateLabReportData, createLabReportWithFiles, getLabReportsByOrder, LabResult } from "@/services/lab-reports";

// Types
interface LabOrder {
  id: string;
  orderId: string;
  patientId: number;
  patientName: string;
  testType: string;
  priority: "routine" | "urgent" | "stat";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  orderDate: string;
  clinicalNotes?: string;
  requiredSamples?: string[];
  estimatedCompletion?: string;
  results?: any;
  orderingPhysician?: string;
}

interface LabReport {
  id: string;
  reportId: string;
  labOrderId: number;
  patientId: number;
  status: 'draft' | 'preliminary' | 'final' | 'corrected' | 'cancelled';
  results: LabResult[];
  clinicalNotes?: string;
  interpretation?: string;
  attachments?: any[];
  createdAt: string;
  updatedAt: string;
}

export default function LabOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [activeTab, setActiveTab] = useState("file");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [debouncedPatientSearch, setDebouncedPatientSearch] = useState("");
  const [doctorSearchQuery, setDoctorSearchQuery] = useState("");
  const [debouncedDoctorSearch, setDebouncedDoctorSearch] = useState("");
  const [technicianName, setTechnicianName] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [testingDate, setTestingDate] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [hasCriticalValues, setHasCriticalValues] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    testType: "",
    priority: "routine",
    clinicalNotes: "",
    requiredSamples: [] as string[],
    estimatedCompletion: "",
  });

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter, priorityFilter]);

  // Debounce patient search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPatientSearch(patientSearchQuery.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [patientSearchQuery]);

  // Debounce doctor search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDoctorSearch(doctorSearchQuery.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [doctorSearchQuery]);

  // Set default dates when dialog opens
  useEffect(() => {
    if (isResultsDialogOpen) {
      const today = new Date().toISOString().split('T')[0];
      setReportDate(today);
      setTestingDate(today);
    }
  }, [isResultsDialogOpen]);

  // Build filters object
  const buildFilters = () => {
    const filters: Record<string, any> = {};
    
    if (statusFilter !== "all") {
      filters.status = statusFilter;
    }
    
    if (priorityFilter !== "all") {
      filters.priority = priorityFilter;
    }
    
    return filters;
  };

  // Fetch lab orders with pagination
  const { 
    data: labOrdersData, 
    isLoading: isLoadingOrders,
    isError,
    error,
    refetch
  } = useQuery<any>({
    queryKey: ["lab-orders", currentPage, debouncedSearchTerm, statusFilter, priorityFilter],
    queryFn: () => getLabOrders(currentPage, perPage, debouncedSearchTerm, buildFilters()),
  });

  const labOrders = labOrdersData?.labOrders || [];
  const meta = labOrdersData?.meta;
  const totalPages = meta?.lastPage ?? 1;

  // Fetch patients for the form dropdown
  const { 
    data: patientData, 
    isLoading: isLoadingPatient, 
    isFetching: isFetchingPatient 
  } = useQuery({
    queryKey: ["patients-search", debouncedPatientSearch],
    queryFn: () => fetchPatients(1, 50, debouncedPatientSearch),
    enabled: isNewOrderOpen,
  });

  // Fetch doctors for the form dropdown
  const {
    data: doctorsData,
    isFetching: isFetchingDoctor,
    isLoading: isLoadingDoctor,
  } = useQuery({
    queryKey: ["getAllDoctors", debouncedDoctorSearch],
    queryFn: () => getAllDoctors(1, 50, debouncedDoctorSearch),
    enabled: isNewOrderOpen,
  });

  // Fetch lab reports for selected order
  const { 
    data: labReportsData,
  } = useQuery({
    queryKey: ["lab-reports", selectedOrder?.id],
    queryFn: () => selectedOrder ? getLabReportsByOrder(selectedOrder.id) : null,
    enabled: !!selectedOrder,
  });

  const labReports = labReportsData?.data || [];
  const doctors = doctorsData?.doctors || [];

  // Create lab order mutation
  const createLabOrderMutation = useMutation({
    mutationFn: createLabOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-orders"] });
      toast({
        title: "Lab Order Created",
        description: "New lab order has been successfully created.",
        variant: "success",
      });
      setIsNewOrderOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Lab Order",
        description: error.message || "Failed to create lab order",
        variant: "destructive",
      });
    },
  });

  // Create lab report mutation (for manual entry)
  const createLabReportMutation = useMutation({
    mutationFn: createLabReport,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lab-orders"] });
      queryClient.invalidateQueries({ queryKey: ["lab-reports", selectedOrder?.id] });
      toast({
        title: "Lab Report Created",
        description: `Lab report for ${selectedOrder?.patientName} has been created successfully.`,
        variant: "success",
      });
      setIsResultsDialogOpen(false);
      resetResultsForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Lab Report",
        description: error.message || "Failed to create lab report",
        variant: "destructive",
      });
    },
  });

  // Create lab report with files mutation
  const createLabReportWithFilesMutation = useMutation({
    mutationFn: createLabReportWithFiles,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lab-orders"] });
      queryClient.invalidateQueries({ queryKey: ["lab-reports", selectedOrder?.id] });
      toast({
        title: "Lab Report Created",
        description: `Lab report with files for ${selectedOrder?.patientName} has been created successfully.`,
        variant: "success",
      });
      setIsResultsDialogOpen(false);
      resetResultsForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Lab Report",
        description: error.message || "Failed to create lab report with files",
        variant: "destructive",
      });
    },
  });

  const { 
    data: labOrdersStats, 
    isLoading: isLoadingStats,
  } = useQuery<any>({
    queryKey: ["lab-orders-stats"],
    queryFn: () => getLabStats(),
  });

  const handlePatientSelect = (patientId: string) => {
    const patient = patientData?.patients?.find((p: any) => p.id.toString() === patientId);
    
    if (patient) {
      setSelectedPatient(patient);
      setFormData(prev => ({
        ...prev,
        patientId: patient.id.toString(),
      }));
    }
  };

  const handleDoctorSelect = (doctorId: string) => {
    const doctor = doctors.find((d: any) => 
      (d.user?.id?.toString() === doctorId) || (d.id.toString() === doctorId)
    );
    
    if (doctor) {
      setSelectedDoctor(doctor);
      setFormData(prev => ({
        ...prev,
        doctorId: doctor.user?.id?.toString() || doctor.id.toString(),
      }));
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      patientId: "",
      doctorId: "",
      testType: "",
      priority: "routine",
      clinicalNotes: "",
      requiredSamples: [],
      estimatedCompletion: "",
    });
    setSelectedPatient(null);
    setSelectedDoctor(null);
    setPatientSearchQuery("");
    setDoctorSearchQuery("");
  };

  const resetResultsForm = () => {
    setUploadedFiles([]);
    setTestResults([]);
    setSelectedOrder(null);
    setTechnicianName("");
    setReportDate("");
    setTestingDate("");
    setInterpretation("");
    setHasCriticalValues(false);
    setActiveTab("file");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'stat': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'routine': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'routine': return 'Routine';
      case 'urgent': return 'Urgent';
      case 'stat': return 'STAT';
      default: return priority;
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      refetch();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNewOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.patientId || !formData.doctorId || !formData.testType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const orderData: any = {
      patientId: parseInt(formData.patientId),
      doctorId: parseInt(formData.doctorId),
      testType: formData.testType,
      priority: formData.priority as "routine" | "urgent" | "stat",
      clinicalNotes: formData.clinicalNotes || undefined,
      requiredSamples: formData.requiredSamples.length > 0 ? formData.requiredSamples : undefined,
      estimatedCompletion: formData.estimatedCompletion ? new Date(formData.estimatedCompletion) : undefined,
    };

    createLabOrderMutation.mutate(orderData);
  };

  const openResultsDialog = (order: any, method: 'file' | 'manual' = 'file') => {
    setSelectedOrder(order);
    setActiveTab(method);
    setIsResultsDialogOpen(true);
    
    if (method === 'manual') {
      const initialResults = getTestParameters(order.testType).map((param) => ({
        parameter: param.name,
        value: "",
        unit: param.unit,
        referenceRange: param.range,
        flag: "normal" as const
      }));
      setTestResults(initialResults);
    } else {
      setUploadedFiles([]);
    }
  };

  const getTestParameters = (testType: string) => {
    const parameterMap: { [key: string]: any[] } = {
      "Complete Blood Count": [
        { name: "Hemoglobin", unit: "g/dL", range: "13.5-17.5" },
        { name: "White Blood Cell Count", unit: "× 10³/μL", range: "4.5-11.0" },
        { name: "Platelet Count", unit: "× 10³/μL", range: "150-450" },
      ],
      "Lipid Panel": [
        { name: "Total Cholesterol", unit: "mg/dL", range: "<200" },
        { name: "HDL Cholesterol", unit: "mg/dL", range: ">40" },
        { name: "LDL Cholesterol", unit: "mg/dL", range: "<100" },
        { name: "Triglycerides", unit: "mg/dL", range: "<150" },
      ],
      "Thyroid Function Test": [
        { name: "TSH", unit: "mIU/L", range: "0.4-4.0" },
        { name: "Free T4", unit: "ng/dL", range: "0.8-1.8" },
        { name: "T3", unit: "ng/dL", range: "80-200" },
      ],
    };

    return parameterMap[testType] || [{ name: "Result", unit: "", range: "" }];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleViewReport = (order: any) => {
    navigate(`/dashboard/lab/reports/${order.orderId}`);
  };

  const handleViewExistingReports = (order: any) => {
    navigate(`/dashboard/lab/orders/${order.id}/reports`);
  };

  const updateResult = (index: number, field: string, value: string) => {
    const updatedResults = [...testResults];
    updatedResults[index] = { ...updatedResults[index], [field]: value };
    
    if (field === 'value' && value) {
      const range = updatedResults[index].referenceRange;
      const numValue = parseFloat(value);
      
      let flag: 'normal' | 'low' | 'high' | 'critical' = 'normal';
      
      if (range.includes('-')) {
        const [min, max] = range.split('-').map(parseFloat);
        if (numValue < min) flag = 'low';
        else if (numValue > max) flag = 'high';
        else flag = 'normal';
      } else if (range.startsWith('<')) {
        const max = parseFloat(range.slice(1));
        flag = numValue > max ? 'high' : 'normal';
      } else if (range.startsWith('>')) {
        const min = parseFloat(range.slice(1));
        flag = numValue < min ? 'low' : 'normal';
      }
      
      // Mark as critical if values are extremely out of range
      if (flag === 'high' || flag === 'low') {
        const rangeNumbers = range.match(/\d+/g)?.map(Number) || [];
        if (rangeNumbers.length === 2) {
          const [min, max] = rangeNumbers;
          const rangeMid = (min + max) / 2;
          const deviation = Math.abs(numValue - rangeMid) / rangeMid;
          if (deviation > 0.5) {
            flag = 'critical';
          }
        }
      }
      
      updatedResults[index].flag = flag;
    }
    
    setTestResults(updatedResults);
    
    // Update hasCriticalValues based on results
    const hasCritical = updatedResults.some(result => result.flag === 'critical');
    setHasCriticalValues(hasCritical);
  };

  const addCustomParameter = () => {
    setTestResults(prev => [...prev, {
      parameter: "",
      value: "",
      unit: "",
      referenceRange: "",
      flag: "normal" as const
    }]);
  };

  const removeParameter = (index: number) => {
    setTestResults(prev => prev.filter((_, i) => i !== index));
  };

  const submitFileResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || uploadedFiles.length === 0 || !technicianName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload at least one file",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    
    // Append files
    uploadedFiles.forEach(file => {
      formData.append('files', file);
    });
    
    // Append report data
    formData.append('labOrderId', selectedOrder.id);
    formData.append('uploadMethod', 'file');
    formData.append('reportDate', reportDate);
    formData.append('testingDate', testingDate);
    formData.append('clinicalNotes', interpretation);
    formData.append('hasCriticalValues', hasCriticalValues.toString());
    createLabReportWithFilesMutation.mutate(formData as any);
  };

  const submitManualResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !technicianName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if all required fields are filled
    const hasEmptyResults = testResults.some(result => 
      !result.parameter.trim() || !result.value.toString().trim()
    );
    
    if (hasEmptyResults) {
      toast({
        title: "Missing Information",
        description: "Please fill in all test parameters and values",
        variant: "destructive",
      });
      return;
    }

    const reportData: CreateLabReportData = {
      labOrderId: parseInt(selectedOrder.id),
      uploadMethod: 'manual',
      results: testResults,
      clinicalNotes: interpretation,
      reportDate: reportDate,
      testingDate: testingDate,
      criticalValues: testResults.filter(result => result.flag === 'critical').map(result => ({
        parameter: result.parameter,
        value: result.value,
        unit: result.unit,
        referenceRange: result.referenceRange
      }))
    };

    createLabReportMutation.mutate(reportData);
  };

  const stats = {
    total: labOrdersStats?.total || 0,
    pending: labOrdersStats?.pending || 0,
    inProgress: labOrdersStats?.inProgress || 0,
    completed: labOrdersStats?.completed || 0,
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
                      {/* Patient Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="patient">Patient *</Label>
                        {selectedPatient && (
                          <div className="p-3 rounded-md bg-green-50 border border-green-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-green-800">
                                  {selectedPatient.user?.fullName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  MRN: {selectedPatient.medicalRecordNumber}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPatient(null);
                                  setFormData(prev => ({ ...prev, patientId: "" }));
                                }}
                              >
                                Change
                              </Button>
                            </div>
                          </div>
                        )}

                        {!selectedPatient && (
                          <>
                            <div className="relative">
                              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search patients by name or MRN..."
                                className="pl-10"
                                value={patientSearchQuery}
                                onChange={(e) => setPatientSearchQuery(e.target.value)}
                              />
                            </div>

                            <div className="max-h-48 overflow-y-auto border rounded-md">
                              {(isLoadingPatient || isFetchingPatient) && (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                  Loading patients...
                                </div>
                              )}

                              {!isLoadingPatient && 
                               !isFetchingPatient && 
                               patientData?.patients?.length === 0 && (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                  No patients found
                                </div>
                              )}

                              {patientData?.patients?.map((patient: any) => (
                                <div
                                  key={patient.id}
                                  className="p-3 border-b last:border-b-0 hover:bg-muted cursor-pointer"
                                  onClick={() => handlePatientSelect(patient.id.toString())}
                                >
                                  <div className="flex justify-between items-start">
                                    <span className="font-medium">
                                      {patient.user?.fullName}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <span>MRN: {patient.medicalRecordNumber}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Doctor Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="doctor">Ordering Physician *</Label>
                        {selectedDoctor && (
                          <div className="p-3 rounded-md bg-blue-50 border border-blue-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-blue-800">
                                  {selectedDoctor.user?.fullName || selectedDoctor.fullName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedDoctor.user?.email || selectedDoctor.email}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedDoctor(null);
                                  setFormData(prev => ({ ...prev, doctorId: "" }));
                                }}
                              >
                                Change
                              </Button>
                            </div>
                          </div>
                        )}

                        {!selectedDoctor && (
                          <Select
                            value={formData.doctorId}
                            onValueChange={handleDoctorSelect}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  isFetchingDoctor || isLoadingDoctor
                                    ? "Loading doctors..."
                                    : "Select Doctor"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <div className="p-2 border-b">
                                <div className="relative">
                                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="Search doctors..."
                                    className="pl-8"
                                    value={doctorSearchQuery}
                                    onChange={(e) => setDoctorSearchQuery(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </div>

                              {(isFetchingDoctor || isLoadingDoctor) && (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                  Loading doctors...
                                </div>
                              )}

                              {!isFetchingDoctor && 
                               !isLoadingDoctor && 
                               doctors.length === 0 && (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                  No doctors found
                                </div>
                              )}

                              {doctors.map((doctor: any) => (
                                <SelectItem
                                  key={doctor.user?.id || doctor.id}
                                  value={doctor.user?.id?.toString() || doctor.id.toString()}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {doctor.user?.fullName || doctor.fullName}
                                    </span>
                                    {doctor.user?.email && (
                                      <span className="text-xs text-muted-foreground">
                                        {doctor.user.email}
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="test-type">Test Type *</Label>
                        <Select 
                          value={formData.testType}
                          onValueChange={(value) => handleInputChange("testType", value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select test type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Complete Blood Count">Complete Blood Count</SelectItem>
                            <SelectItem value="Lipid Panel">Lipid Panel</SelectItem>
                            <SelectItem value="Thyroid Function Test">Thyroid Function Test</SelectItem>
                            <SelectItem value="Glucose Test">Glucose Test</SelectItem>
                            <SelectItem value="Liver Function Test">Liver Function Test</SelectItem>
                            <SelectItem value="Renal Function Test">Renal Function Test</SelectItem>
                            <SelectItem value="Electrolyte Panel">Electrolyte Panel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority *</Label>
                        <Select 
                          value={formData.priority}
                          onValueChange={(value) => handleInputChange("priority", value)}
                          required
                        >
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
                      <Select
                        onValueChange={(value) => handleInputChange("requiredSamples", [value])}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select samples required" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blood">Blood</SelectItem>
                          <SelectItem value="urine">Urine</SelectItem>
                          <SelectItem value="tissue">Tissue</SelectItem>
                          <SelectItem value="saliva">Saliva</SelectItem>
                          <SelectItem value="csf">CSF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estimatedCompletion">Estimated Completion</Label>
                      <Input
                        id="estimatedCompletion"
                        type="datetime-local"
                        value={formData.estimatedCompletion}
                        onChange={(e) => handleInputChange("estimatedCompletion", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Clinical Notes</Label>
                      <Textarea 
                        id="notes"
                        placeholder="Enter any relevant clinical information or special instructions..."
                        rows={3}
                        value={formData.clinicalNotes}
                        onChange={(e) => handleInputChange("clinicalNotes", e.target.value)}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsNewOrderOpen(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={createLabOrderMutation.isPending}
                      >
                        {createLabOrderMutation.isPending ? "Creating..." : "Create Order"}
                      </Button>
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
                      <p className="text-2xl font-bold">{isLoadingStats ? <Skeleton/> : stats.total}</p>
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
                      <p className="text-2xl font-bold">{isLoadingStats ? <Skeleton/> : stats.pending}</p>
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
                      <p className="text-2xl font-bold">{isLoadingStats ? <Skeleton /> : stats.inProgress}</p>
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
                      <p className="text-2xl font-bold">{isLoadingStats ? <Skeleton/> : stats.completed}</p>
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
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
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
                      <SelectItem value="stat">STAT</SelectItem>
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
                  {meta && (
                    <span>
                      Showing {meta.from} to {meta.to} of {meta.total} results
                      {debouncedSearchTerm && (
                        <span> for "{debouncedSearchTerm}"</span>
                      )}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading lab orders...</p>
                  </div>
                ) : (
                  <>
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
                        {labOrders.map((order: any) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.orderId}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{order?.patient?.user?.fullName}</p>
                                <p className="text-sm text-muted-foreground">ID: {order?.patient?.medicalRecordNumber}</p>
                              </div>
                            </TableCell>
                            <TableCell>{order.testType}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getPriorityColor(order.priority)}>
                                {getPriorityText(order.priority)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(order.status)}>
                                {getStatusText(order.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(order.orderDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {order.status === 'completed' || labReports.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    {labReports.length > 0 ? `${labReports.length} Report(s)` : 'Available'}
                                  </Badge>
                                  {labReports.some((report: LabReport) => report.status === 'final') && (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                      Finalized
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleViewReport(order)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                
                                {/* Show existing reports button if reports exist */}
                                {labReports.length > 0 && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewExistingReports(order)}
                                  >
                                    <FileText className="h-4 w-4" />
                                    <span className="ml-1">{labReports.length}</span>
                                  </Button>
                                )}
                                
                                {order.status !== 'completed' && order.status !== 'cancelled' && (
                                  <div className="flex gap-1">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => openResultsDialog(order, 'file')}
                                    >
                                      <FileUp className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => openResultsDialog(order, 'manual')}
                                    >
                                      <Type className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                                {order.status === 'completed' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewReport(order)}
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

                    {labOrders.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No lab orders found</h3>
                        <p className="text-muted-foreground">
                          {debouncedSearchTerm || statusFilter !== "all" || priorityFilter !== "all"
                            ? "Try adjusting your search criteria"
                            : "Create your first lab order to get started"
                          }
                        </p>
                      </div>
                    )}

                    {/* Pagination */}
                    {!isLoadingOrders && labOrders.length > 0 && (
                      <div className="mt-6 flex justify-center">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() =>
                                  currentPage > 1 && handlePageChange(currentPage - 1)
                                }
                                className={
                                  currentPage === 1
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                                }
                              />
                            </PaginationItem>

                            {Array.from({ length: totalPages }).map((_, i) => (
                              <PaginationItem key={i}>
                                <PaginationLink
                                  onClick={() => handlePageChange(i + 1)}
                                  isActive={currentPage === i + 1}
                                  className="cursor-pointer"
                                >
                                  {i + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}

                            <PaginationItem>
                              <PaginationNext
                                onClick={() =>
                                  currentPage < totalPages &&
                                  handlePageChange(currentPage + 1)
                                }
                                className={
                                  currentPage === totalPages
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                                }
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Results Dialog */}
      <Dialog open={isResultsDialogOpen} onOpenChange={setIsResultsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Add Lab Results - {selectedOrder?.patientName}
            </DialogTitle>
            <CardDescription>
              {selectedOrder?.testType} | Order ID: {selectedOrder?.orderId}
            </CardDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <FileUp className="h-4 w-4" />
                    Upload File
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Enter Manually
                  </TabsTrigger>
                </TabsList>
                
                {/* File Upload Tab */}
                <TabsContent value="file" className="space-y-4">
                  <form onSubmit={submitFileResults}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Upload Result Files</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop your lab result files here, or click to browse
                          </p>
                          <Input 
                            type="file" 
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.csv"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <Button 
                            variant="outline" 
                            type="button" 
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            Browse Files
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, XLSX, CSV (Max: 25MB per file)
                        </p>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          <Label>Selected Files</Label>
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="file-technician">Lab Technician *</Label>
                          <Input 
                            id="file-technician" 
                            placeholder="Enter technician name" 
                            value={technicianName}
                            onChange={(e) => setTechnicianName(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="file-report-date">Report Date *</Label>
                          <Input 
                            id="file-report-date" 
                            type="date" 
                            value={reportDate}
                            onChange={(e) => setReportDate(e.target.value)}
                            required 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="file-testing-date">Testing Date *</Label>
                          <Input 
                            id="file-testing-date" 
                            type="date" 
                            value={testingDate}
                            onChange={(e) => setTestingDate(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="space-y-2 flex items-end">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="file-critical-values" 
                              checked={hasCriticalValues}
                              onCheckedChange={setHasCriticalValues}
                            />
                            <Label htmlFor="file-critical-values">Mark as containing critical values</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="file-interpretation">Clinical Interpretation</Label>
                        <Textarea 
                          id="file-interpretation"
                          placeholder="Enter clinical interpretation and notes..."
                          rows={3}
                          value={interpretation}
                          onChange={(e) => setInterpretation(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsResultsDialogOpen(false);
                          resetResultsForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={uploadedFiles.length === 0 || createLabReportWithFilesMutation.isPending || !technicianName}
                      >
                        {createLabReportWithFilesMutation.isPending ? (
                          "Creating Report..."
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-1" />
                            Create Lab Report
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Manual Entry Tab */}
                <TabsContent value="manual" className="space-y-4">
                  <form onSubmit={submitManualResults}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Test Parameters and Results</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addCustomParameter}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Parameter
                        </Button>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parameter</TableHead>
                            <TableHead>Result</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Reference Range</TableHead>
                            <TableHead>Flag</TableHead>
                            <TableHead className="w-[80px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {testResults.map((result, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Input
                                  value={result.parameter}
                                  onChange={(e) => updateResult(index, 'parameter', e.target.value)}
                                  placeholder="Parameter name"
                                  required
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={result.value}
                                  onChange={(e) => updateResult(index, 'value', e.target.value)}
                                  placeholder="Value"
                                  required
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={result.unit}
                                  onChange={(e) => updateResult(index, 'unit', e.target.value)}
                                  placeholder="Unit"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={result.referenceRange}
                                  onChange={(e) => updateResult(index, 'referenceRange', e.target.value)}
                                  placeholder="Reference range"
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={result.flag}
                                  onValueChange={(value) => updateResult(index, 'flag', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeParameter(index)}
                                  disabled={testResults.length <= 1}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="manual-technician">Lab Technician *</Label>
                          <Input 
                            id="manual-technician" 
                            placeholder="Enter technician name" 
                            value={technicianName}
                            onChange={(e) => setTechnicianName(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="manual-report-date">Report Date *</Label>
                          <Input 
                            id="manual-report-date" 
                            type="date" 
                            value={reportDate}
                            onChange={(e) => setReportDate(e.target.value)}
                            required 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="manual-testing-date">Testing Date *</Label>
                          <Input 
                            id="manual-testing-date" 
                            type="date" 
                            value={testingDate}
                            onChange={(e) => setTestingDate(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="space-y-2 flex items-end">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="manual-critical" 
                              checked={hasCriticalValues}
                              onCheckedChange={setHasCriticalValues}
                            />
                            <Label htmlFor="manual-critical">Contains critical values</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="manual-interpretation">Clinical Interpretation</Label>
                        <Textarea 
                          id="manual-interpretation"
                          placeholder="Enter clinical interpretation, notes, and recommendations..."
                          rows={3}
                          value={interpretation}
                          onChange={(e) => setInterpretation(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsResultsDialogOpen(false);
                          resetResultsForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={createLabReportMutation.isPending || testResults.some(r => !r.parameter || !r.value) || !technicianName}
                      >
                        {createLabReportMutation.isPending ? (
                          "Creating Report..."
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-1" />
                            Create Lab Report
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
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