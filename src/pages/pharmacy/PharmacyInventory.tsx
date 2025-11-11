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
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Package, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export default function PharmacyInventory() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    medicationName: "",
    genericName: "",
    manufacturer: "",
    batchNumber: "",
    quantity: "",
    unitPrice: "",
    expiryDate: "",
    reorderLevel: "",
    location: "",
    description: "",
  });

  const queryClient = useQueryClient();

  // Mock data - replace with actual API call
  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ["pharmacy-inventory", searchQuery],
    queryFn: async () => {
      // Replace with actual API call
      return [
        {
          id: "1",
          medicationName: "Paracetamol 500mg",
          genericName: "Acetaminophen",
          manufacturer: "PharmaCorp",
          batchNumber: "B12345",
          quantity: 500,
          unitPrice: 2.5,
          expiryDate: "2025-12-31",
          reorderLevel: 100,
          location: "Shelf A1",
          status: "In Stock",
        },
      ];
    },
  });

  const addMedicationMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Replace with actual API call
      console.log("Adding medication:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy-inventory"] });
      toast({
        title: "Success",
        description: "Medication added to inventory successfully",
      });
      setIsAddDialogOpen(false);
      setFormData({
        medicationName: "",
        genericName: "",
        manufacturer: "",
        batchNumber: "",
        quantity: "",
        unitPrice: "",
        expiryDate: "",
        reorderLevel: "",
        location: "",
        description: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add medication",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMedicationMutation.mutate(formData);
  };

  const getStockStatus = (quantity: number, reorderLevel: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" };
    if (quantity <= reorderLevel)
      return { label: "Low Stock", variant: "secondary" };
    return { label: "In Stock", variant: "default" };
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
                        <Label htmlFor="batchNumber">Batch Number</Label>
                        <Input
                          id="batchNumber"
                          value={formData.batchNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              batchNumber: e.target.value,
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
                          value={formData.reorderLevel}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reorderLevel: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Items
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inventory.length}</div>
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
                    {
                      inventory.filter((item) => item.quantity <= item.reorderLevel)
                        .length
                    }
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
                    $
                    {inventory
                      .reduce(
                        (sum, item) => sum + item.quantity * item.unitPrice,
                        0
                      )
                      .toFixed(2)}
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
                    ) : inventory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No medications found
                        </TableCell>
                      </TableRow>
                    ) : (
                      inventory.map((item) => {
                        const status = getStockStatus(
                          item.quantity,
                          item.reorderLevel
                        );
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.medicationName}
                            </TableCell>
                            <TableCell>{item.genericName}</TableCell>
                            <TableCell>{item.batchNumber}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${item.unitPrice}</TableCell>
                            <TableCell>{item.expiryDate}</TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>
                              <Badge variant={status.variant as any}>
                                {status.label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
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
