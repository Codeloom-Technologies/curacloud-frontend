import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Package } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export default function MedicationDispensing() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    prescriptionId: "",
    patientId: "",
    medicationId: "",
    quantityDispensed: "",
    dispensedBy: "",
    instructions: "",
    notes: "",
  });

  const queryClient = useQueryClient();

  const dispenseMedicationMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Replace with actual API call
      console.log("Dispensing medication:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispensing-records"] });
      toast({
        title: "Success",
        description: "Medication dispensed successfully",
      });
      setFormData({
        prescriptionId: "",
        patientId: "",
        medicationId: "",
        quantityDispensed: "",
        dispensedBy: "",
        instructions: "",
        notes: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to dispense medication",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispenseMedicationMutation.mutate(formData);
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
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Medication Dispensing</h1>
              <p className="text-muted-foreground">
                Dispense medications to patients
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Search Prescription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by prescription ID or patient name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Dispense Medication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prescriptionId">Prescription ID *</Label>
                      <Input
                        id="prescriptionId"
                        required
                        value={formData.prescriptionId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            prescriptionId: e.target.value,
                          })
                        }
                        placeholder="Enter prescription ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientId">Patient ID *</Label>
                      <Input
                        id="patientId"
                        required
                        value={formData.patientId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            patientId: e.target.value,
                          })
                        }
                        placeholder="Enter patient ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medicationId">Medication *</Label>
                      <Select
                        value={formData.medicationId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, medicationId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select medication" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="med1">
                            Paracetamol 500mg
                          </SelectItem>
                          <SelectItem value="med2">Amoxicillin 250mg</SelectItem>
                          <SelectItem value="med3">Ibuprofen 400mg</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantityDispensed">
                        Quantity Dispensed *
                      </Label>
                      <Input
                        id="quantityDispensed"
                        type="number"
                        required
                        value={formData.quantityDispensed}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            quantityDispensed: e.target.value,
                          })
                        }
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dispensedBy">Dispensed By *</Label>
                      <Input
                        id="dispensedBy"
                        required
                        value={formData.dispensedBy}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dispensedBy: e.target.value,
                          })
                        }
                        placeholder="Pharmacist name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions</Label>
                      <Textarea
                        id="instructions"
                        value={formData.instructions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instructions: e.target.value,
                          })
                        }
                        placeholder="Dispensing instructions"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        placeholder="Any additional notes"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setFormData({
                          prescriptionId: "",
                          patientId: "",
                          medicationId: "",
                          quantityDispensed: "",
                          dispensedBy: "",
                          instructions: "",
                          notes: "",
                        })
                      }
                    >
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      disabled={dispenseMedicationMutation.isPending}
                    >
                      {dispenseMedicationMutation.isPending
                        ? "Dispensing..."
                        : "Dispense Medication"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
