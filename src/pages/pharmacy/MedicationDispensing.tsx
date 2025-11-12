import { useEffect, useState } from "react";
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
import { Package, User, Calendar, Pill } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPrescriptionByRef,
  updateDispensedStatus,
} from "@/services/prescription";

interface MedicationItem {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface FormData {
  prescriptionId: string;
  patientId: string;
  medicationId: string;
  quantityDispensed: string;
  dispensedBy: string;
  instructions: string;
  notes: string;
}

export default function MedicationDispensing() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] =
    useState<MedicationItem | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FormData>({
    prescriptionId: "",
    patientId: "",
    medicationId: "",
    quantityDispensed: "",
    dispensedBy: "",
    instructions: "",
    notes: "",
  });

  // Fetch prescription data
  const {
    data: prescriptionData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["get-prescription-by-ref", id],
    queryFn: () => getPrescriptionByRef(id!),
    enabled: !!id,
  });

  // Initialize form data when prescription data is loaded
  useEffect(() => {
    if (prescriptionData) {
      const user = localStorage.getItem("authUser");
      const parsedUser = user ? JSON.parse(user) : null;

      setFormData((prev) => ({
        ...prev,
        prescriptionId: prescriptionData.reference || prescriptionData.id || "",
        patientId:
          prescriptionData.patient?.medicalRecordNumber ||
          prescriptionData.patientId ||
          "",
        dispensedBy: parsedUser?.fullName || "",
        notes: prescriptionData.notes || "",
      }));
    }
  }, [prescriptionData]);

  // Handle medication selection
  const handleMedicationSelect = (medicationName: string) => {
    const medication = prescriptionData?.items?.find(
      (item: MedicationItem) => item.medicationName === medicationName
    );
    setSelectedMedication(medication || null);
    setFormData((prev) => ({
      ...prev,
      medicationId: medicationName,
      instructions: medication?.instructions || "",
    }));
  };

  const dispenseMedicationMutation = useMutation({
    mutationFn: () => {
      if (!selectedMedication?.id) {
        throw new Error("Prescription ID is required");
      }
      return updateDispensedStatus(
        selectedMedication.id as any,
        "dispensed",
        formData.quantityDispensed
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      queryClient.invalidateQueries({
        queryKey: ["get-prescription-by-ref", id],
      });

      toast({
        title: "Success",
        description: "Medication dispensed successfully",
        variant: "success",
      });

      // Navigate back after successful dispense
      navigate(`/dashboard/pharmacy/dispensing/${id}`);
      setFormData((prev) => ({
        ...prev,
        quantityDispensed: "",
        instructions: "",
      }));
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to dispense medication",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.quantityDispensed || !formData.medicationId) {
      toast({
        title: "Validation Error",
        description: "Please select a medication and enter quantity",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(formData.quantityDispensed) <= 0) {
      toast({
        title: "Validation Error",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    dispenseMedicationMutation.mutate();
  };

  const resetForm = () => {
    setFormData({
      prescriptionId: prescriptionData?.reference || "",
      patientId: prescriptionData?.patient?.medicalRecordNumber || "",
      medicationId: "",
      quantityDispensed: "",
      dispensedBy: formData.dispensedBy, // Keep the dispensedBy name
      instructions: "",
      notes: prescriptionData?.notes || "",
    });
    setSelectedMedication(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
              <Card>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-red-600 mb-4">
                    <Package className="h-16 w-16 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold">
                      Prescription Not Found
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {error?.message ||
                      "The prescription you're looking for doesn't exist or has been removed."}
                  </p>
                  <Button
                    onClick={() =>
                      navigate("/dashboard/pharmacy/prescription-processing")
                    }
                  >
                    Back to Prescriptions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Medication Dispensing</h1>
              <p className="text-muted-foreground">
                Dispense medications from prescription #
                {prescriptionData?.reference}
              </p>
            </div>

            {/* Prescription Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Prescription Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Patient</div>
                      <div className="text-muted-foreground">
                        {prescriptionData?.patient?.user?.firstName}{" "}
                        {prescriptionData?.patient?.user?.lastName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Date</div>
                      <div className="text-muted-foreground">
                        {prescriptionData?.createdAt
                          ? new Date(
                              prescriptionData.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Medications</div>
                      <div className="text-muted-foreground">
                        {prescriptionData?.items?.length || 0} medications
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-muted-foreground"></div>
                    <div>
                      <div className="font-medium">Status</div>
                      <div className="text-muted-foreground capitalize">
                        {prescriptionData?.status || "pending"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dispensing Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Dispense Medication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prescriptionId">Prescription ID</Label>
                      <Input
                        id="prescriptionId"
                        readOnly
                        value={formData.prescriptionId}
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientId">Patient ID</Label>
                      <Input
                        id="patientId"
                        readOnly
                        value={formData.patientId}
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medicationId">Select Medication *</Label>
                      <Select
                        value={formData.medicationId}
                        onValueChange={handleMedicationSelect}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose medication to dispense" />
                        </SelectTrigger>
                        <SelectContent>
                          {prescriptionData?.items
                            ?.filter((val) => val.status !== "dispensed")
                            .map(
                              (medication: MedicationItem, index: number) => (
                                <SelectItem
                                  key={index}
                                  value={medication.medicationName}
                                >
                                  {medication.medicationName} -{" "}
                                  {medication.dosage}
                                </SelectItem>
                              )
                            )}
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
                        min="1"
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
                      <Label htmlFor="dispensedBy">Dispensed By</Label>
                      <Input
                        id="dispensedBy"
                        readOnly
                        value={formData.dispensedBy}
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  {/* Selected Medication Details */}
                  {selectedMedication && (
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">
                          Selected Medication Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Dosage:</span>
                            <p className="text-muted-foreground">
                              {selectedMedication.dosage}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Frequency:</span>
                            <p className="text-muted-foreground">
                              {selectedMedication.frequency}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span>
                            <p className="text-muted-foreground">
                              {selectedMedication.duration}
                            </p>
                          </div>
                          {selectedMedication.instructions && (
                            <div className="col-span-2">
                              <span className="font-medium">Instructions:</span>
                              <p className="text-muted-foreground">
                                {selectedMedication.instructions}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="instructions">
                      Dispensing Instructions
                    </Label>
                    <Textarea
                      id="instructions"
                      value={formData.instructions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instructions: e.target.value,
                        })
                      }
                      placeholder="Additional dispensing instructions..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      readOnly
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Any additional notes for this dispensing..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        navigate("/dashboard/pharmacy/prescriptions")
                      }
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={dispenseMedicationMutation.isPending}
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        dispenseMedicationMutation.isPending ||
                        !formData.medicationId
                      }
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
