import { useState, useEffect, useRef } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Building2,
  Bed,
  Users,
  Edit,
  Trash2,
  Search,
  Filter,
  TrendingUp,
  Eye,
} from "lucide-react";
import {
  fetchWards,
  createWard,
  updateWard,
  deleteWard,
} from "@/services/ward";

export default function WardsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWard, setEditingWard] = useState<any>(null);
  
  const [filters, setFilters] = useState({
    floor: "",
    wing: "",
    wardType: "",
    minCapacity: "",
    maxCapacity: "",
    isIcu: false,
    isIsolation: false,
    occupancyMin: "",
    occupancyMax: "",
  });

  const perPage = 10;

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // React Query for wards data
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["wards", currentPage, debouncedSearch, filters],
    queryFn: () =>
      fetchWards(currentPage, perPage, debouncedSearch, filters),
  });

  // Form data state - lifted up from WardForm
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    floorNumber: "",
    wing: "",
    capacity: "10",
    colorCode: "#3B82F6",
    isIcu: false,
    isIsolation: false,
    chargePerDay: "",
  });

  // Reset form when dialog opens/closes or editing changes
  useEffect(() => {
    if (isDialogOpen) {
      if (editingWard) {
        setFormData({
          name: editingWard.name || "",
          code: editingWard.code || "",
          description: editingWard.description || "",
          floorNumber: editingWard.floorNumber || "",
          wing: editingWard.wing || "",
          capacity: editingWard.capacity?.toString() || "10",
          colorCode: editingWard.colorCode || "#3B82F6",
          isIcu: editingWard.isIcu || false,
          isIsolation: editingWard.isIsolation || false,
          chargePerDay: editingWard.chargePerDay?.toString() || "",
        });
      } else {
        setFormData({
          name: "",
          code: "",
          description: "",
          floorNumber: "",
          wing: "",
          capacity: "10",
          colorCode: "#3B82F6",
          isIcu: false,
          isIsolation: false,
          chargePerDay: "",
        });
      }
    }
  }, [isDialogOpen, editingWard]);

  // Create ward mutation
  const createMutation = useMutation({
    mutationFn: (wardData: any) => createWard(wardData),
    onSuccess: () => {
      toast({
        title: "Ward Created",
        description: "New ward has been successfully created.",
        variant: "success",
      });
      setIsDialogOpen(false);
      setEditingWard(null);
      queryClient.invalidateQueries({ queryKey: ["wards"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create ward. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update ward mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateWard(id, data),
    onSuccess: () => {
      toast({
        title: "Ward Updated",
        description: "Ward has been successfully updated.",
        variant: "success",
      });
      setIsDialogOpen(false);
      setEditingWard(null);
      queryClient.invalidateQueries({ queryKey: ["wards"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update ward. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete ward mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWard(id),
    onSuccess: () => {
      toast({
        title: "Ward Deleted",
        description: "Ward has been successfully deleted.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["wards"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete ward. Please try again.",
        variant: "destructive",
      });
    },
  });

  const wards = data?.wards ?? [];
  const meta = data?.meta ?? {};
  const totalPages = meta.lastPage ?? 1;

  // Pagination handler
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClearFilters = () => {
    setFilters({
      floor: "",
      wing: "",
      wardType: "",
      minCapacity: "",
      maxCapacity: "",
      isIcu: false,
      isIsolation: false,
      occupancyMin: "",
      occupancyMax: "",
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

  const getOccupancyStatusColor = (occupancyRate: number) => {
    if (occupancyRate >= 90) return "bg-destructive/10 text-destructive";
    if (occupancyRate >= 80) return "bg-warning/10 text-warning";
    return "bg-success/10 text-success";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success";
      case "maintenance":
        return "bg-warning/10 text-warning";
      case "closed":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Handle form submission
  const handleFormSubmit = () => {
    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Ward name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.code.trim()) {
      toast({
        title: "Validation Error",
        description: "Ward code is required",
        variant: "destructive",
      });
      return;
    }

    const capacity = parseInt(formData.capacity);
    if (isNaN(capacity) || capacity < 1) {
      toast({
        title: "Validation Error",
        description: "Capacity must be a positive number",
        variant: "destructive",
      });
      return;
    }

    // Prepare data for API - convert to snake_case
    const apiData = {
      name: formData.name,
      code: formData.code,
      description: formData.description,
      floor_number: formData.floorNumber,
      wing: formData.wing,
      capacity: capacity,
      colorCode: formData.colorCode,
      isIcu: formData.isIcu,
      isIsolation: formData.isIsolation,
      chargePerDay: formData.chargePerDay ? parseFloat(formData.chargePerDay) : 0,
    };

    if (editingWard) {
      updateMutation.mutate({ id: editingWard.id, data: apiData });
    } else {
      createMutation.mutate(apiData);
    }
  };

  // Calculate stats
  const totalBeds = wards.reduce((acc, ward) => acc + ward.capacity, 0);
  const occupiedBeds = wards.reduce((acc, ward) => acc + ward.currentOccupancy, 0);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const handleDeleteWard = (wardId: string) => {
    if (window.confirm("Are you sure you want to delete this ward? This action cannot be undone.")) {
      deleteMutation.mutate(wardId);
    }
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
                  Wards Management
                </h1>
                <p className="text-muted-foreground">
                  Manage hospital wards, beds, and occupancy
                </p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setEditingWard(null);
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary hover:shadow-glow transition-all">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Ward
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingWard ? "Edit Ward" : "Create New Ward"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Ward Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Intensive Care Unit"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="code">Ward Code *</Label>
                        <Input
                          id="code"
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                          placeholder="e.g., ICU-001"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="floorNumber">Floor Number</Label>
                        <Input
                          id="floorNumber"
                          value={formData.floorNumber}
                          onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                          placeholder="e.g., 3"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wing">Wing/Section</Label>
                        <Select
                          value={formData.wing}
                          onValueChange={(val) => setFormData({ ...formData, wing: val })}
                        >
                          <SelectTrigger id="wing">
                            <SelectValue placeholder="Select wing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="east">East Wing</SelectItem>
                            <SelectItem value="west">West Wing</SelectItem>
                            <SelectItem value="north">North Wing</SelectItem>
                            <SelectItem value="south">South Wing</SelectItem>
                            <SelectItem value="central">Central Wing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity (Number of Beds) *</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        min="1"
                        max="100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe this ward..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isIcu"
                          checked={formData.isIcu}
                          onCheckedChange={(checked) => setFormData({ ...formData, isIcu: checked })}
                        />
                        <Label htmlFor="isIcu">ICU Ward</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isIsolation"
                          checked={formData.isIsolation}
                          onCheckedChange={(checked) => setFormData({ ...formData, isIsolation: checked })}
                        />
                        <Label htmlFor="isIsolation">Isolation Ward</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="colorCode">Color Code (for UI)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="colorCode"
                          type="color"
                          value={formData.colorCode}
                          onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={formData.colorCode}
                          onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chargePerDay">Charge Per Day (₦)</Label>
                      <Input
                        id="chargePerDay"
                        value={formData.chargePerDay}
                        onChange={(e) => setFormData({ ...formData, chargePerDay: e.target.value })}
                        placeholder="e.g., 500"
                        type="number"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingWard(null);
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
                        : editingWard
                        ? "Update Ward"
                        : "Create Ward"}
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
                      placeholder="Search wards by name, code, or floor..."
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
                        <DialogTitle>Filter Wards</DialogTitle>
                      </DialogHeader>

                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                          <Label>Floor</Label>
                          <Input
                            value={filters.floor}
                            onChange={(e) =>
                              setFilters((f) => ({ ...f, floor: e.target.value }))
                            }
                            placeholder="e.g., 3"
                          />
                        </div>

                        <div>
                          <Label>Wing</Label>
                          <Select
                            value={filters.wing}
                            onValueChange={(val) =>
                              setFilters((f) => ({ ...f, wing: val }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select wing" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="east">East Wing</SelectItem>
                              <SelectItem value="west">West Wing</SelectItem>
                              <SelectItem value="north">North Wing</SelectItem>
                              <SelectItem value="south">South Wing</SelectItem>
                              <SelectItem value="central">Central Wing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Ward Type</Label>
                          <Select
                            value={filters.wardType}
                            onValueChange={(val) =>
                              setFilters((f) => ({ ...f, wardType: val }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="icu">ICU</SelectItem>
                              <SelectItem value="isolation">Isolation</SelectItem>
                              <SelectItem value="maternity">Maternity</SelectItem>
                              <SelectItem value="pediatric">Pediatric</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Min Capacity</Label>
                          <Input
                            type="number"
                            value={filters.minCapacity}
                            onChange={(e) =>
                              setFilters((f) => ({ ...f, minCapacity: e.target.value }))
                            }
                            placeholder="e.g., 10"
                          />
                        </div>

                        <div>
                          <Label>Max Capacity</Label>
                          <Input
                            type="number"
                            value={filters.maxCapacity}
                            onChange={(e) =>
                              setFilters((f) => ({ ...f, maxCapacity: e.target.value }))
                            }
                            placeholder="e.g., 50"
                          />
                        </div>

                        <div>
                          <Label>Min Occupancy %</Label>
                          <Input
                            type="number"
                            value={filters.occupancyMin}
                            onChange={(e) =>
                              setFilters((f) => ({ ...f, occupancyMin: e.target.value }))
                            }
                            placeholder="e.g., 0"
                            min="0"
                            max="100"
                          />
                        </div>

                        <div>
                          <Label>Max Occupancy %</Label>
                          <Input
                            type="number"
                            value={filters.occupancyMax}
                            onChange={(e) =>
                              setFilters((f) => ({ ...f, occupancyMax: e.target.value }))
                            }
                            placeholder="e.g., 100"
                            min="0"
                            max="100"
                          />
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
                          <Label>ICU Wards Only</Label>
                        </div>

                        <div className="flex items-center gap-2 col-span-2">
                          <Checkbox
                            checked={filters.isIsolation}
                            onCheckedChange={(checked) =>
                              setFilters((f: any) => ({
                                ...f,
                                isIsolation: checked,
                              }))
                            }
                          />
                          <Label>Isolation Wards Only</Label>
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

            {/* Ward Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {isLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      wards.length || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Wards
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-success">
                    {isLoading || isFetching ? (
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
                  <div className="text-2xl font-bold text-warning">
                    {isLoading || isFetching ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      occupiedBeds || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Occupied Beds
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {isLoading || isFetching ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      `${occupancyRate}%`
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Occupancy Rate
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Wards Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Hospital Wards (
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
                        <TableHead>Ward Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Floor/Wing</TableHead>
                        <TableHead>Bed Capacity</TableHead>
                        <TableHead>Occupancy Rate</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="transition-all duration-300 ease-in-out">
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-3 w-3 rounded" />
                                <div className="space-y-2">
                                  <Skeleton className="h-4 w-32" />
                                  <Skeleton className="h-3 w-20" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-16 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-16 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-20 rounded-full" />
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
                      ) : wards.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <p className="text-muted-foreground">
                              No wards found
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        wards.map((ward: any) => {
                          const occupancyRate = Math.round((ward.currentOccupancy / ward.capacity) * 100);
                          
                          return (
                            <TableRow key={ward.id} className="hover:bg-muted/50">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="w-3 h-10 rounded" 
                                    style={{ backgroundColor: ward.colorCode }}
                                  />
                                  <div>
                                    <div className="font-medium">{ward.name}</div>
                                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                      {ward.description || "No description"}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{ward.code.toUpperCase()}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>Floor {ward.floorNumber || "-"}</div>
                                  <div className="text-muted-foreground">
                                    {ward.wing || "No wing"}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-2">
                                  <div className="text-sm">
                                    {ward.currentOccupancy} / {ward.capacity} beds
                                  </div>
                                  <Progress 
                                    value={occupancyRate} 
                                    className="h-2"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getOccupancyStatusColor(occupancyRate)}>
                                  {occupancyRate}%
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1 flex-wrap">
                                  {ward.is_icu && (
                                    <Badge className="bg-destructive/10 text-destructive border-none">
                                      ICU
                                    </Badge>
                                  )}
                                  {ward.isIsolation && (
                                    <Badge className="bg-warning/10 text-warning border-none">
                                      Isolation
                                    </Badge>
                                  )}
                                  {!ward.isIcu && !ward.isIsolation && (
                                    <Badge className="bg-muted text-muted-foreground border-none">
                                      General
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(ward.status)}>
                                  {ward.status?.charAt(0).toUpperCase() + ward.status?.slice(1) || "Active"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      navigate(`/dashboard/wards/${ward.reference}/details`)
                                    }
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setEditingWard(ward);
                                      setIsDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive/80"
                                    onClick={() => handleDeleteWard(ward.id)}
                                    disabled={deleteMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
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
                    Loading more wards...
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