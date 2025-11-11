import { useState } from "react";
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
import { Search, TrendingUp, TrendingDown, Package } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export default function StockManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [adjustmentData, setAdjustmentData] = useState({
    type: "add",
    quantity: "",
    reason: "",
  });

  const queryClient = useQueryClient();

  // Mock data - replace with actual API call
  const { data: stockMovements = [], isLoading } = useQuery({
    queryKey: ["stock-movements", searchQuery],
    queryFn: async () => {
      // Replace with actual API call
      return [
        {
          id: "1",
          medicationName: "Paracetamol 500mg",
          type: "in",
          quantity: 500,
          previousStock: 200,
          newStock: 700,
          reason: "New stock received",
          date: "2024-01-15",
          performedBy: "John Doe",
        },
        {
          id: "2",
          medicationName: "Amoxicillin 250mg",
          type: "out",
          quantity: 50,
          previousStock: 300,
          newStock: 250,
          reason: "Prescription dispensing",
          date: "2024-01-15",
          performedBy: "Jane Smith",
        },
      ];
    },
  });

  const adjustStockMutation = useMutation({
    mutationFn: async (data: any) => {
      // Replace with actual API call
      console.log("Adjusting stock:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      queryClient.invalidateQueries({ queryKey: ["pharmacy-inventory"] });
      toast({
        title: "Success",
        description: "Stock adjusted successfully",
      });
      setIsAdjustDialogOpen(false);
      setAdjustmentData({ type: "add", quantity: "", reason: "" });
      setSelectedMedication(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to adjust stock",
        variant: "destructive",
      });
    },
  });

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMedication) {
      adjustStockMutation.mutate({
        medicationId: selectedMedication.id,
        ...adjustmentData,
      });
    }
  };

  const getMovementBadge = (type: string) => {
    if (type === "in") {
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
      <Sidebar
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:static z-30 h-screen`}
      />
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
                        value={selectedMedication?.id}
                        onValueChange={(value) =>
                          setSelectedMedication({ id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select medication" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Paracetamol 500mg</SelectItem>
                          <SelectItem value="2">Amoxicillin 250mg</SelectItem>
                          <SelectItem value="3">Ibuprofen 400mg</SelectItem>
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
                          <SelectItem value="add">Add Stock</SelectItem>
                          <SelectItem value="remove">Remove Stock</SelectItem>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Movements
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stockMovements.length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Stock In</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stockMovements.filter((m: any) => m.type === "in").length}
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
                    {stockMovements.filter((m: any) => m.type === "out").length}
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
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : stockMovements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No stock movements found
                        </TableCell>
                      </TableRow>
                    ) : (
                      stockMovements.map((movement: any) => (
                        <TableRow key={movement.id}>
                          <TableCell>{movement.date}</TableCell>
                          <TableCell className="font-medium">
                            {movement.medicationName}
                          </TableCell>
                          <TableCell>{getMovementBadge(movement.type)}</TableCell>
                          <TableCell>{movement.quantity}</TableCell>
                          <TableCell>{movement.previousStock}</TableCell>
                          <TableCell>{movement.newStock}</TableCell>
                          <TableCell>{movement.reason}</TableCell>
                          <TableCell>{movement.performedBy}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
