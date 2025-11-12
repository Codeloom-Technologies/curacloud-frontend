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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Package,
  PercentCircle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
  adjustStock,
  getStockHistory,
  getStockMedications,
  getStockSummary,
} from "@/services/pharmacy";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function StockManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);

  const [adjustmentData, setAdjustmentData] = useState({
    type: "Stock In",
    quantity: "",
    reason: "",
  });

  const {
    data: medicationResponse,
    isLoading: isLoadingMedication,
    isFetching: isFetchingMedication,
  } = useQuery({
    queryKey: ["pharmacy-inventory-medications"],
    queryFn: () => getStockMedications(),
  });

  const queryClient = useQueryClient();
  const perPage = 10;

  const {
    data: statsData,
    isLoading: isLoadingStats,
    isFetching: isFetchingStats,
  } = useQuery({
    queryKey: ["pharmacy-summary-stats"],
    queryFn: () => getStockSummary(),
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

  const {
    data: responseData,
    isLoading: isLoadingStocks,
    isFetching: isFetchingStock,
    refetch,
  } = useQuery({
    queryKey: ["pharmacy-inventory-stocks", currentPage, debouncedSearch],
    queryFn: () => getStockHistory(currentPage, perPage, debouncedSearch),
  });

  // Extract data from response
  const inventories = responseData?.inventories || [];
  const meta = responseData?.meta || {};
  const totalPages = meta?.lastPage ?? 1;

  const adjustStockMutation = useMutation({
    mutationFn: adjustStock,
    onSuccess: () => {
      refetch();
      // queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      queryClient.invalidateQueries({
        queryKey: [
          "pharmacy-summary-stats",
          "pharmacy-inventory-stats",
          "pharmacy-inventory-stocks",
          "stock-movements",
        ],
      });
      toast({
        title: "Success",
        description: "Stock adjusted successfully",
        variant: "success",
      });
      setIsAdjustDialogOpen(false);
      setAdjustmentData({ type: "Stock In", quantity: "", reason: "" });
      setSelectedMedication(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to adjust stock",
        variant: "destructive",
      });
    },
  });

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMedication) {
      adjustStockMutation.mutate({
        inventoryId: selectedMedication.id,
        ...adjustmentData,
      } as any);
    }
  };

  const getMovementBadge = (type: string) => {
    if (type === "Stock In") {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <TrendingUp className="h-3 w-3 mr-1" />
          Stock In
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="bg-red-100 text-red-800">
        <TrendingDown className="h-3 w-3 mr-1" />
        Stock Out
      </Badge>
    );
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* <Sidebar
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:static z-30 h-screen`}
      /> */}
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
                <h1 className="text-3xl font-bold">Stock Management</h1>
                <p className="text-muted-foreground">
                  Track and manage medication stock movements
                </p>
              </div>
              <Dialog
                open={isAdjustDialogOpen}
                onOpenChange={setIsAdjustDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Package className="h-4 w-4 mr-2" />
                    Adjust Stock
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Stock Adjustment</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAdjustStock} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="medication">Medication *</Label>
                      <Select
                        required={true}
                        value={selectedMedication?.id || ""}
                        onValueChange={(value) => {
                          const selectedMed = medicationResponse?.find(
                            (med) => med?.id === value
                          );
                          if (selectedMed) {
                            setSelectedMedication({
                              id: selectedMed?.id,
                              medicationName: selectedMed?.medicationName,
                            });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingMedication || isFetchingMedication
                                ? "Loading..."
                                : "Select Medication"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {medicationResponse?.map((value) => (
                            <SelectItem key={value?.id} value={value?.id}>
                              {value?.medicationName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Adjustment Type *</Label>
                      <Select
                        value={adjustmentData.type}
                        onValueChange={(value) =>
                          setAdjustmentData({ ...adjustmentData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Stock In">Add Stock</SelectItem>
                          <SelectItem value="Stock Out">
                            Remove Stock
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        required
                        value={adjustmentData.quantity}
                        onChange={(e) =>
                          setAdjustmentData({
                            ...adjustmentData,
                            quantity: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason *</Label>
                      <Input
                        id="reason"
                        required
                        value={adjustmentData.reason}
                        onChange={(e) =>
                          setAdjustmentData({
                            ...adjustmentData,
                            reason: e.target.value,
                          })
                        }
                        placeholder="Enter reason for adjustment"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAdjustDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={adjustStockMutation.isPending}
                      >
                        {adjustStockMutation.isPending
                          ? "Adjusting..."
                          : "Adjust Stock"}
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
                    Total Movements
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats || isFetchingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData?.totalAdjustments || 0
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Stock In
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats || isFetchingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData?.totalStockIns || 0
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Stock Out
                  </CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <div className="text-2xl font-bold">
                      {isLoadingStats || isFetchingStats ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        statsData?.totalStockOuts || 0
                      )}
                    </div>{" "}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Net Movement
                  </CardTitle>
                  <PercentCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <div className="text-2xl font-bold">
                      {isLoadingStats || isFetchingStats ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        statsData?.netMovement || 0
                      )}
                    </div>{" "}
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
                      placeholder="Search movements..."
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
                      <TableHead>Date</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Previous</TableHead>
                      <TableHead>New Stock</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Performed By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingStocks || isFetchingStock ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : inventories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No stock movements found
                        </TableCell>
                      </TableRow>
                    ) : (
                      inventories.map((movement: any) => (
                        <TableRow key={movement.id}>
                          <TableCell>
                            {new Date(movement.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            {movement?.inventory.medicationName}
                          </TableCell>
                          <TableCell>
                            {getMovementBadge(movement.type)}
                          </TableCell>
                          <TableCell>{movement.quantity}</TableCell>
                          <TableCell>{movement.previousQuantity}</TableCell>
                          <TableCell>{movement.newStock}</TableCell>
                          <TableCell>{movement.reason}</TableCell>
                          <TableCell>
                            {movement.performedByUser.fullName}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {!isLoadingStocks && inventories.length > 0 && (
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
