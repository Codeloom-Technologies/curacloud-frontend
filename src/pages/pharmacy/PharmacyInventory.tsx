import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Package, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
  createPharmacyInventory,
  fetchPharmacyInventories,
  fetchInventorySummary,
} from "@/services/pharmacy";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNaira } from "@/lib/formatters";

export default function PharmacyInventory() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    medicationName: "",
    genericName: "",
    manufacturer: "",
    // batchNumber: "",
    quantity: "",
    unitPrice: "",
    expiryDate: "",
    reorderLevel: "",
    location: "",
    description: "",
  });
  const perPage = 10;

  const queryClient = useQueryClient();

  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["pharmacy-inventory", currentPage, debouncedSearch],
    queryFn: () =>
      fetchPharmacyInventories(currentPage, perPage, debouncedSearch),
  });

  // Extract data from response
  const inventories = responseData?.inventories || [];
  const meta = responseData?.meta || {};
  const totalPages = meta?.lastPage ?? 1;

  const {
    data: statsData,
    isLoading: isLoadingStats,
    isFetching: isFetchingStats,
  } = useQuery({
    queryKey: ["pharmacy-inventory-stats"],
    queryFn: () => fetchInventorySummary(),
  });

  const addMedicationMutation = useMutation({
    mutationFn: createPharmacyInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy-inventory"] });
      toast({
        title: "Success",
        description: "Medication added to inventory successfully",
        variant: "success",
      });
      setIsAddDialogOpen(false);
      setFormData({
        medicationName: "",
        genericName: "",
        manufacturer: "",
        // batchNumber: "",
        quantity: "",
        unitPrice: "",
        expiryDate: "",
        reorderLevel: "",
        location: "",
        description: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to add medication",
        variant: "destructive",
      });
    },
  });

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page when searching
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert string values to numbers
    const payload = {
      ...formData,
      quantity: parseInt(formData.quantity),
      unitPrice: parseFloat(formData.unitPrice),
      reorderLevel: formData.reorderLevel
        ? parseInt(formData.reorderLevel)
        : undefined,
    };

    addMedicationMutation.mutate(payload);
  };

  const getStockStatus = (quantity: number, reorderLevel: number) => {
    if (quantity === 0)
      return { label: "Out of Stock", variant: "destructive" as const };
    if (quantity <= reorderLevel)
      return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Pharmacy Inventory</h1>
                <p className="text-muted-foreground">
                  Manage medication stock and inventory
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Medication</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="medicationName">
                          Medication Name *
                        </Label>
                        <Input
                          id="medicationName"
                          required
                          value={formData.medicationName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              medicationName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="genericName">Generic Name</Label>
                        <Input
                          id="genericName"
                          value={formData.genericName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              genericName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="manufacturer">Manufacturer</Label>
                        <Input
                          id="manufacturer"
                          value={formData.manufacturer}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              manufacturer: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Storage Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity *</Label>
                        <Input
                          id="quantity"
                          type="number"
                          required
                          min="0"
                          value={formData.quantity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              quantity: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unitPrice">Unit Price *</Label>
                        <Input
                          id="unitPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={formData.unitPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              unitPrice: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          required
                          value={formData.expiryDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              expiryDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reorderLevel">Reorder Level</Label>
                        <Input
                          id="reorderLevel"
                          type="number"
                          min="0"
                          value={formData.reorderLevel}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reorderLevel: e.target.value,
                            })
                          }
                        />
                      </div>
                      {/* <div className="space-y-2 col-span-2">
                        <Label htmlFor="location">Storage Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                        />
                      </div> */}
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={addMedicationMutation.isPending}
                      >
                        {addMedicationMutation.isPending
                          ? "Adding..."
                          : "Add Medication"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Items
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats || isFetchingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData?.totalItems || 0
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Low Stock Alerts
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats || isFetchingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData?.lowStockCount || 0
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Value
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats || isFetchingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      formatNaira(statsData?.totalValue)
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Expiring Stock Alerts
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats || isFetchingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      `${statsData.expiringCount} ` || 0
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search medications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Generic Name</TableHead>
                      <TableHead>Batch #</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : inventories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No medications found
                        </TableCell>
                      </TableRow>
                    ) : (
                      inventories.map((item) => {
                        const status = getStockStatus(
                          item.quantity,
                          item.reorderLevel || 10
                        );
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.medication_name || item.medicationName}
                            </TableCell>
                            <TableCell>
                              {item.generic_name || item.genericName}
                            </TableCell>
                            <TableCell>
                              {item.batch_number || item.batchNumber}
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              {item.unit_price || formatNaira(item.unitPrice)}
                            </TableCell>
                            <TableCell>
                              {item.total_price || formatNaira(item.totalPrice)}
                            </TableCell>
                            <TableCell>
                              {new Date(
                                item.expiry_date || item.expiryDate
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {item.storage_location || item.location}
                            </TableCell>
                            <TableCell>
                              <Badge variant={status.variant}>
                                {status.label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {!isLoading && inventories.length > 0 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              currentPage > 1 &&
                              handlePageChange(currentPage - 1)
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
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
