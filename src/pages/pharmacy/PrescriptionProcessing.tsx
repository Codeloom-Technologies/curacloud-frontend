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
import { Search, FileText, CheckCircle, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { getPrescriptions } from "@/services/prescription";

export default function PrescriptionProcessing() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["prescriptions", currentPage, searchQuery],
    queryFn: () => getPrescriptions(currentPage, 10, searchQuery),
  });

  const prescriptions = data?.prescriptions || [];
  const meta = data?.meta;

  const processPrescriptionMutation = useMutation({
    mutationFn: async (prescriptionId: string) => {
      // Replace with actual API call
      console.log("Processing prescription:", prescriptionId);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      toast({
        title: "Success",
        description: "Prescription processed successfully",
      });
      setSelectedPrescription(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process prescription",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "processed":
        return <Badge variant="default">Processed</Badge>;
      case "dispensed":
        return <Badge variant="default">Dispensed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
            <div>
              <h1 className="text-3xl font-bold">Prescription Processing</h1>
              <p className="text-muted-foreground">
                Review and process patient prescriptions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Prescriptions
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {meta?.total || prescriptions.length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      prescriptions.filter((p: any) => p.status === "pending")
                        .length
                    }
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Processed Today
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      prescriptions.filter(
                        (p: any) => p.status === "processed"
                      ).length
                    }
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
                      placeholder="Search by patient name or prescription..."
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
                      <TableHead>Patient</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Prescribed By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : prescriptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No prescriptions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      prescriptions.map((prescription: any) => (
                        <TableRow key={prescription.id}>
                          <TableCell className="font-medium">
                            {prescription.patient?.firstName}{" "}
                            {prescription.patient?.lastName}
                          </TableCell>
                          <TableCell>{prescription.medicationName}</TableCell>
                          <TableCell>{prescription.dosage}</TableCell>
                          <TableCell>{prescription.frequency}</TableCell>
                          <TableCell>
                            {prescription.prescribedBy?.firstName}{" "}
                            {prescription.prescribedBy?.lastName}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              prescription.createdAt
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(prescription.status || "pending")}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setSelectedPrescription(prescription)
                                  }
                                >
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Prescription Details
                                  </DialogTitle>
                                </DialogHeader>
                                {selectedPrescription && (
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium">Patient</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedPrescription.patient?.firstName}{" "}
                                        {selectedPrescription.patient?.lastName}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium">Medication</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedPrescription.medicationName}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium">Dosage</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedPrescription.dosage}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium">Frequency</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedPrescription.frequency}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium">
                                        Instructions
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedPrescription.instructions}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium">Notes</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedPrescription.notes || "N/A"}
                                      </p>
                                    </div>
                                    <Button
                                      className="w-full"
                                      onClick={() =>
                                        processPrescriptionMutation.mutate(
                                          selectedPrescription.id
                                        )
                                      }
                                      disabled={
                                        processPrescriptionMutation.isPending
                                      }
                                    >
                                      {processPrescriptionMutation.isPending
                                        ? "Processing..."
                                        : "Process Prescription"}
                                    </Button>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
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
