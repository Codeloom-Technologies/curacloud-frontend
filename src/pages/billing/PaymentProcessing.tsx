import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PaymentProcessing = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedInvoice, setSelectedInvoice] = useState<string>("");

  // Mock data - replace with API calls
  const patients = [
    { id: "1", name: "John Doe", mrn: "MRN001" },
    { id: "2", name: "Jane Smith", mrn: "MRN002" },
    { id: "3", name: "Bob Johnson", mrn: "MRN003" },
  ];

  const invoices = [
    { id: "1", number: "INV-2024001", amount: 5000, status: "unpaid" },
    { id: "2", number: "INV-2024002", amount: 7500, status: "unpaid" },
    { id: "3", number: "INV-2024003", amount: 12000, status: "paid" },
  ];

  // const getInvoiceBadge = (status: string) => {
  //   switch (status) {
  //     case "paid":
  //       return <Badge variant="success">Paid</Badge>;
  //     case "unpaid":
  //       return <Badge variant="destructive">Unpaid</Badge>;
  //     default:
  //       return <Badge variant="secondary">{status}</Badge>;
  //   }
  // };

  const getSelectedInvoiceAmount = () => {
    const invoice = invoices.find((inv) => inv.id === selectedInvoice);
    return invoice ? invoice.amount : 0;
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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Payment Processing
              </h1>
              <p className="text-muted-foreground mt-2">
                Process patient payments and transactions securely
              </p>
            </div>

            {/* Payment Method Selection */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card
                className={`cursor-pointer transition-all ${
                  selectedPaymentMethod === "card"
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedPaymentMethod("card")}
              >
                <CardHeader className="text-center p-4">
                  <div
                    className={`p-3 rounded-full w-fit mx-auto ${
                      selectedPaymentMethod === "card"
                        ? "bg-primary/10"
                        : "bg-muted"
                    }`}
                  >
                    <CreditCard
                      className={`h-6 w-6 ${
                        selectedPaymentMethod === "card"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <CardTitle className="text-sm">Card Payment</CardTitle>
                  <CardDescription className="text-xs">
                    Credit/Debit
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${
                  selectedPaymentMethod === "cash"
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedPaymentMethod("cash")}
              >
                <CardHeader className="text-center p-4">
                  <div
                    className={`p-3 rounded-full w-fit mx-auto ${
                      selectedPaymentMethod === "cash"
                        ? "bg-primary/10"
                        : "bg-muted"
                    }`}
                  >
                    <Banknote
                      className={`h-6 w-6 ${
                        selectedPaymentMethod === "cash"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <CardTitle className="text-sm">Cash Payment</CardTitle>
                  <CardDescription className="text-xs">
                    Cash transaction
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${
                  selectedPaymentMethod === "mobile"
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedPaymentMethod("mobile")}
              >
                <CardHeader className="text-center p-4">
                  <div
                    className={`p-3 rounded-full w-fit mx-auto ${
                      selectedPaymentMethod === "mobile"
                        ? "bg-primary/10"
                        : "bg-muted"
                    }`}
                  >
                    <Smartphone
                      className={`h-6 w-6 ${
                        selectedPaymentMethod === "mobile"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <CardTitle className="text-sm">Mobile Payment</CardTitle>
                  <CardDescription className="text-xs">
                    Digital wallets
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${
                  selectedPaymentMethod === "insurance"
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedPaymentMethod("insurance")}
              >
                <CardHeader className="text-center p-4">
                  <div
                    className={`p-3 rounded-full w-fit mx-auto ${
                      selectedPaymentMethod === "insurance"
                        ? "bg-primary/10"
                        : "bg-muted"
                    }`}
                  >
                    <Building
                      className={`h-6 w-6 ${
                        selectedPaymentMethod === "insurance"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <CardTitle className="text-sm">Insurance</CardTitle>
                  <CardDescription className="text-xs">
                    Insurance claim
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedPaymentMethod ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Process{" "}
                      {selectedPaymentMethod.charAt(0).toUpperCase() +
                        selectedPaymentMethod.slice(1)}{" "}
                      Payment
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      Select Payment Method
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedPaymentMethod
                    ? `Enter ${selectedPaymentMethod} payment details below`
                    : "Choose a payment method to continue"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Patient Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="patient">Patient *</Label>
                      <Select
                        value={selectedPatient}
                        onValueChange={setSelectedPatient}
                      >
                        <SelectTrigger id="patient">
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              <div className="flex flex-col">
                                <span>{patient.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {patient.mrn}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Invoice Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="invoice">Invoice *</Label>
                      <Select
                        value={selectedInvoice}
                        onValueChange={setSelectedInvoice}
                      >
                        <SelectTrigger id="invoice">
                          <SelectValue placeholder="Select invoice" />
                        </SelectTrigger>
                        <SelectContent>
                          {invoices
                            .filter((inv) => inv.status === "unpaid")
                            .map((invoice) => (
                              <SelectItem key={invoice.id} value={invoice.id}>
                                <div className="flex justify-between items-center w-full">
                                  <span>{invoice.number}</span>
                                  <span className="text-sm font-medium">
                                    ₦{invoice.amount.toLocaleString()}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Amount (Auto-filled from invoice) */}
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={getSelectedInvoiceAmount()}
                        readOnly
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Amount auto-filled from selected invoice
                      </p>
                    </div>

                    {/* Payment Method (Auto-filled from selection) */}
                    <div className="space-y-2">
                      <Label htmlFor="method">Payment Method *</Label>
                      <Input
                        id="method"
                        value={
                          selectedPaymentMethod
                            ? selectedPaymentMethod.charAt(0).toUpperCase() +
                              selectedPaymentMethod.slice(1)
                            : ""
                        }
                        readOnly
                        className="bg-muted"
                      />
                    </div>

                    {/* Dynamic Fields based on Payment Method */}
                    {selectedPaymentMethod === "card" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date *</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input id="cvv" placeholder="123" />
                          </div>
                        </div>
                      </>
                    )}

                    {selectedPaymentMethod === "mobile" && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="phoneNumber">Phone Number *</Label>
                        <Input
                          id="phoneNumber"
                          placeholder="+234 800 000 0000"
                        />
                      </div>
                    )}

                    {selectedPaymentMethod === "insurance" && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="insuranceId">Insurance ID *</Label>
                        <Input
                          id="insuranceId"
                          placeholder="Insurance policy number"
                        />
                      </div>
                    )}

                    {/* Common Fields */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="reference">
                        Reference Number{" "}
                        {selectedPaymentMethod !== "cash" && "*"}
                      </Label>
                      <Input
                        id="reference"
                        placeholder="Transaction reference number"
                        required={selectedPaymentMethod !== "cash"}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional payment notes..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={
                        !selectedPaymentMethod ||
                        !selectedPatient ||
                        !selectedInvoice
                      }
                    >
                      Process{" "}
                      {selectedPaymentMethod
                        ? selectedPaymentMethod.charAt(0).toUpperCase() +
                          selectedPaymentMethod.slice(1)
                        : ""}{" "}
                      Payment
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedPaymentMethod("");
                        setSelectedPatient("");
                        setSelectedInvoice("");
                      }}
                    >
                      Clear All
                    </Button>
                  </div>
                </form>
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
};

export default PaymentProcessing;
