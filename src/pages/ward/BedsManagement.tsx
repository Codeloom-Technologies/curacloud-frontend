import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Bed,
  Edit,
  Trash2,
  User,
  Search,
  Filter,
  Download,
  Clock,
  Eye,
  Building2,
  Users,
  AlertCircle,
  Stethoscope,
  Shield,
} from "lucide-react";
import {
  fetchBeds,
  createBed,
  updateBed,
  updateBedStatus,
  deleteBed,
} from "@/services/bed";
import { fetchWards } from "@/services/ward";
import { useUserRole } from "@/hooks/useUserRole";

export default function BedsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBed, setEditingBed] = useState<any>(null);
   const { isHealthcare, isAdmin ,isReceptionist} = useUserRole();
      
    const showCreateBedButton = isAdmin || isHealthcare || isReceptionist;
  const [filters, setFilters] = useState({
    ward: "",
    status: "",
    bedType: "",
    minRate: "",
    maxRate: "",
    hasEquipment: false,
    isIcu: false,
    isVentilator: false,
  });

  const perPage = 10;

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch wards for filters
  const { data: wardsData } = useQuery({
    queryKey: ["wards-for-beds"],
    queryFn: () => fetchWards(1, 100, "", {}),
  });

  // React Query for beds data
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["beds", currentPage, debouncedSearch, filters],
    queryFn: () =>
      fetchBeds(currentPage, perPage, debouncedSearch, filters),
  });

  // Form data state
  const [formData, setFormData] = useState({
    bedNumber: "",
    wardId: "",
    bedType: "regular",
    ratePerDay: "",
    description: "",
    equipment: [] as string[],
    isIcuCompatible: false,
    isVentilatorSupported: false,
    notes: "",
  });

  // Reset form when dialog opens/closes or editing changes
  useEffect(() => {
    if (isDialogOpen) {
      if (editingBed) {
        setFormData({
          bedNumber: editingBed.bedNumber || "",
          wardId: editingBed.wardId?.toString() || "",
          bedType: editingBed.bedType || "regular",
          ratePerDay: editingBed.ratePerDay?.toString() || "",
          description: editingBed.description || "",
          equipment: editingBed.equipment || [],
          isIcuCompatible: editingBed.isIcuCompatible || false,
          isVentilatorSupported: editingBed.isVentilatorSupported || false,
          notes: editingBed.notes || "",
        });
      } else {
        setFormData({
          bedNumber: "",
          wardId: "",
          bedType: "regular",
          ratePerDay: "",
          description: "",
          equipment: [],
          isIcuCompatible: false,
          isVentilatorSupported: false,
          notes: "",
        });
      }
    }
  }, [isDialogOpen, editingBed]);

  // Create bed mutation
  const createMutation = useMutation({
    mutationFn: (bedData: any) => createBed(bedData),
    onSuccess: () => {
      toast({
        title: "Bed Created",
        description: "New bed has been successfully created.",
        variant: "success",
      });
      setIsDialogOpen(false);
      setEditingBed(null);
      queryClient.invalidateQueries({ queryKey: ["beds"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create bed. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update bed mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateBed(id, data),
    onSuccess: () => {
      toast({
        title: "Bed Updated",
        description: "Bed has been successfully updated.",
        variant: "success",
      });
      setIsDialogOpen(false);
      setEditingBed(null);
      queryClient.invalidateQueries({ queryKey: ["beds"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update bed. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update bed status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      updateBedStatus(id, status),
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Bed status has been updated.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["beds"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update bed status.",
        variant: "destructive",
      });
    },
  });

  // Delete bed mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBed(id),
    onSuccess: () => {
      toast({
        title: "Bed Deleted",
        description: "Bed has been successfully deleted.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["beds"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete bed. Please try again.",
        variant: "destructive",
      });
    },
  });

  const beds = data?.beds ?? [];
  const meta = data?.meta ?? {};
  const totalPages = meta.lastPage ?? 1;
  const wards = wardsData?.wards ?? [];

  // Pagination handler
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClearFilters = () => {
    setFilters({
      ward: "",
      status: "",
      bedType: "",
      minRate: "",
      maxRate: "",
      hasEquipment: false,
      isIcu: false,
      isVentilator: false,
    });
    setCurrentPage(1);
    refetch();
    setIsFilterOpen(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (
        (typeof value === "string" && value.trim() !== "") ||
        (typeof value === "boolean" && value === true)
      ) {
        count++;
      }
    });
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-success/10 text-success";
      case "occupied":
        return "bg-destructive/10 text-destructive";
      case "reserved":
        return "bg-warning/10 text-warning";
      case "maintenance":
        return "bg-gray-100 text-gray-700";
      case "cleaning":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getBedTypeColor = (type: string) => {
    switch (type) {
      case "icu":
        return "bg-destructive/10 text-destructive";
      case "ventilator":
        return "bg-purple-100 text-purple-700";
      case "isolation":
        return "bg-warning/10 text-warning";
      case "maternity":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Handle form submission
  const handleFormSubmit = () => {
    // Validate required fields
    if (!formData.bedNumber.trim()) {
      toast({
        title: "Validation Error",
        description: "Bed number is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.wardId) {
      toast({
        title: "Validation Error",
        description: "Ward selection is required",
        variant: "destructive",
      });
      return;
    }

    // Prepare data for API - convert to snake_case
    const apiData = {
      bedNumber: formData.bedNumber,
      wardId: parseInt(formData.wardId),
      bedType: formData.bedType,
      ratePerDay: formData.ratePerDay ? parseFloat(formData.ratePerDay) : 0,
      description: formData.description,
      equipment: formData.equipment,
      isIcuCompatible: formData.isIcuCompatible,
      isVentilatorSupported: formData.isVentilatorSupported,
      notes: formData.notes,
    };

    if (editingBed) {
      updateMutation.mutate({ id: editingBed.id, data: apiData });
    } else {
      createMutation.mutate(apiData);
    }
  };

  // Calculate stats
  const availableBeds = beds.filter(b => b.status === 'available').length;
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
  const reservedBeds = beds.filter(b => b.status === 'reserved').length;
  const maintenanceBeds = beds.filter(b => b.status === 'maintenance').length;
  const totalBeds = beds.length;

  const handleDeleteBed = (bedId: string) => {
    if (window.confirm("Are you sure you want to delete this bed? This action cannot be undone.")) {
      deleteMutation.mutate(bedId);
    }
  };

  const handleStatusChange = (bedId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: bedId, status: newStatus });
  };

  const equipmentOptions = [
    "Oxygen Supply",
    "Suction",
    "Monitor",
    "IV Pole",
    "Bedside Table",
    "Call Bell",
    "Privacy Screen",
  ];

  const toggleEquipment = (item: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter(e => e !== item)
        : [...prev.equipment, item]
    }));
  };

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
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Beds Management
                </h1>
                <p className="text-muted-foreground">
                  Manage hospital beds, occupancy, and status
                </p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setEditingBed(null);
                }
              }}>
                <DialogTrigger asChild>
                  {
                    showCreateBedButton && (
<Button className="bg-gradient-primary hover:shadow-glow transition-all">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Bed
                  </Button>
                    )
                  }
                  
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingBed ? "Edit Bed" : "Add New Bed"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bedNumber">Bed Number *</Label>
                        <Input
                          id="bedNumber"
                          value={formData.bedNumber}
                          onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                          placeholder="e.g., B-101"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wardId">Ward *</Label>
                        <Select
                          value={formData.wardId}
                          onValueChange={(val) => setFormData({ ...formData, wardId: val })}
                        >
                          <SelectTrigger id="wardId">
                            <SelectValue placeholder="Select ward" />
                          </SelectTrigger>
                          <SelectContent>
                            {wards.map((ward: any) => (
                              <SelectItem key={ward.id} value={ward.id.toString()}>
                                {ward.name} ({ward.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bedType">Bed Type</Label>
                        <Select
                          value={formData.bedType}
                          onValueChange={(val) => setFormData({ ...formData, bedType: val })}
                        >
                          <SelectTrigger id="bedType">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="icu">ICU</SelectItem>
                            <SelectItem value="ventilator">Ventilator</SelectItem>
                            <SelectItem value="isolation">Isolation</SelectItem>
                            <SelectItem value="maternity">Maternity</SelectItem>
                            <SelectItem value="pediatric">Pediatric</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ratePerDay">Rate Per Day (₦)</Label>
                        <Input
                          id="ratePerDay"
                          value={formData.ratePerDay}
                          onChange={(e) => setFormData({ ...formData, ratePerDay: e.target.value })}
                          placeholder="e.g., 150"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Bed description..."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Equipment</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {equipmentOptions.map((item) => (
                          <div key={item} className="flex items-center space-x-2">
                            <Checkbox
                              id={`equipment-${item}`}
                              checked={formData.equipment.includes(item)}
                              onCheckedChange={() => toggleEquipment(item)}
                            />
                            <Label htmlFor={`equipment-${item}`} className="text-sm">
                              {item}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isIcuCompatible"
                          checked={formData.isIcuCompatible}
                          onCheckedChange={(checked) => setFormData({ ...formData, isIcuCompatible: checked })}
                        />
                        <Label htmlFor="isIcuCompatible">ICU Compatible</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isVentilatorSupported"
                          checked={formData.isVentilatorSupported}
                          onCheckedChange={(checked) => setFormData({ ...formData, isVentilatorSupported: checked })}
                        />
                        <Label htmlFor="isVentilatorSupported">Ventilator Support</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any additional notes..."
                        rows={2}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingBed(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleFormSubmit}
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? "Saving..."
                        : editingBed
                        ? "Update Bed"
                        : "Create Bed"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search beds by number, ward, or patient..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2 relative">
                        <Filter className="h-4 w-4" />
                        Filters
                        {activeFilterCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full px-1.5 py-0.5">
                            {activeFilterCount}
                          </span>
                        )}
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Filter Beds</DialogTitle>
                      </DialogHeader>

                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                          <Label>Ward</Label>
                          <Select
                            value={filters.ward}
                            onValueChange={(val) =>
                              setFilters((f) => ({ ...f, ward: val }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select ward" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Wards</SelectItem>
                              {wards.map((ward: any) => (
                                <SelectItem key={ward.id} value={ward.id.toString()}>
                                  {ward.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Status</Label>
                          <Select
                            value={filters.status}
                            onValueChange={(val) =>
                              setFilters((f) => ({ ...f, status: val }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Status</SelectItem>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="occupied">Occupied</SelectItem>
                              <SelectItem value="reserved">Reserved</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="cleaning">Cleaning</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Bed Type</Label>
                          <Select
                            value={filters.bedType}
                            onValueChange={(val) =>
                              setFilters((f) => ({ ...f, bedType: val }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Types</SelectItem>
                              <SelectItem value="regular">Regular</SelectItem>
                              <SelectItem value="icu">ICU</SelectItem>
                              <SelectItem value="ventilator">Ventilator</SelectItem>
                              <SelectItem value="isolation">Isolation</SelectItem>
                              <SelectItem value="maternity">Maternity</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Min Rate (₦)</Label>
                          <Input
                            type="number"
                            value={filters.minRate}
                            onChange={(e) =>
                              setFilters((f) => ({ ...f, minRate: e.target.value }))
                            }
                            placeholder="e.g., 0"
                          />
                        </div>

                        <div>
                          <Label>Max Rate (₦)</Label>
                          <Input
                            type="number"
                            value={filters.maxRate}
                            onChange={(e) =>
                              setFilters((f) => ({ ...f, maxRate: e.target.value }))
                            }
                            placeholder="e.g., 1000"
                          />
                        </div>

                        <div className="flex items-center gap-2 col-span-2">
                          <Checkbox
                            checked={filters.hasEquipment}
                            onCheckedChange={(checked) =>
                              setFilters((f: any) => ({
                                ...f,
                                hasEquipment: checked,
                              }))
                            }
                          />
                          <Label>Has Equipment</Label>
                        </div>

                        <div className="flex items-center gap-2 col-span-2">
                          <Checkbox
                            checked={filters.isIcu}
                            onCheckedChange={(checked) =>
                              setFilters((f: any) => ({
                                ...f,
                                isIcu: checked,
                              }))
                            }
                          />
                          <Label>ICU Beds Only</Label>
                        </div>

                        <div className="flex items-center gap-2 col-span-2">
                          <Checkbox
                            checked={filters.isVentilator}
                            onCheckedChange={(checked) =>
                              setFilters((f: any) => ({
                                ...f,
                                isVentilator: checked,
                              }))
                            }
                          />
                          <Label>Ventilator Beds Only</Label>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={handleClearFilters}>
                          Clear Filters
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentPage(1);
                            refetch();
                            setIsFilterOpen(false);
                          }}
                        >
                          Apply Filters
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Bed Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {isLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      totalBeds || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Beds
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-success">
                    {isLoading || isFetching ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      availableBeds || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Available
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-destructive">
                    {isLoading || isFetching ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      occupiedBeds || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Occupied
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-warning">
                    {isLoading || isFetching ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      reservedBeds || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Reserved
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-gray-600">
                    {isLoading || isFetching ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      maintenanceBeds || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Maintenance
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Beds Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Hospital Beds (
                  {isLoading || isFetching ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    data?.["meta"]?.total || 0
                  )}
                  )
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bed Number</TableHead>
                        <TableHead>Ward</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Rate/Day</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="transition-all duration-300 ease-in-out">
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-20 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-20 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-8 w-8 rounded" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : beds.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <p className="text-muted-foreground">
                              No beds found
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        beds.map((bed: any) => (
                          <TableRow key={bed.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Bed className="h-4 w-4 text-muted-foreground" />
                                <div className="font-medium">{bed.bedNumber}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{bed.ward?.name || "-"}</div>
                                <div className="text-xs text-muted-foreground">
                                  {bed.ward?.code || ""}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getBedTypeColor(bed.bedType)}>
                                {bed.bedType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Badge className={getStatusColor(bed.status)}>
                                  {bed.status}
                                </Badge>
                                <Select
                                  value={bed.status}
                                  onValueChange={(value) => handleStatusChange(bed.id, value)}
                                >
                                  <SelectTrigger className="h-6 text-xs px-2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="occupied">Occupied</SelectItem>
                                    <SelectItem value="reserved">Reserved</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="cleaning">Cleaning</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                            <TableCell>
                              {bed.current_patient ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <User className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm font-medium">
                                      {bed.currentPatient.patient?.user?.fullName || "Unknown"}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Since: {new Date(bed.currentPatient?.assignedAt).toLocaleDateString()}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">No patient</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                ₦{bed.ratePerDay || "0"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {new Date(bed.updatedAt).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    navigate(`/dashboard/beds/${bed.reference}/details`)
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {
                                  showCreateBedButton && (
  <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingBed(bed);
                                    setIsDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                  )
                                }
                              
                                {
                                  showCreateBedButton && (
    <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive/80"
                                  onClick={() => handleDeleteBed(bed.id)}
                                  disabled={deleteMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                  )
                                }
                            
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
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
                            onClick={() => handlePageChange(currentPage + 1)}
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
                {isFetching && !isLoading && (
                  <div className="text-center text-sm text-muted-foreground mt-2">
                    Loading more beds...
                  </div>
                )}
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