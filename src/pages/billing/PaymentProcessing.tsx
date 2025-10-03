import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Banknote, Smartphone } from "lucide-react";

const PaymentProcessing = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Payment Processing</h1>
            <p className="text-muted-foreground">Process patient payments and transactions</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader className="text-center">
                <CreditCard className="h-12 w-12 mx-auto mb-2 text-primary" />
                <CardTitle>Card Payment</CardTitle>
                <CardDescription>Credit or Debit card</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader className="text-center">
                <Banknote className="h-12 w-12 mx-auto mb-2 text-primary" />
                <CardTitle>Cash Payment</CardTitle>
                <CardDescription>Cash transaction</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader className="text-center">
                <Smartphone className="h-12 w-12 mx-auto mb-2 text-primary" />
                <CardTitle>Mobile Payment</CardTitle>
                <CardDescription>Digital wallets</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Process Payment</CardTitle>
              <CardDescription>Enter payment details below</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Patient</Label>
                    <Select>
                      <SelectTrigger id="patient">
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">John Doe</SelectItem>
                        <SelectItem value="2">Jane Smith</SelectItem>
                        <SelectItem value="3">Bob Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoice">Invoice</Label>
                    <Select>
                      <SelectTrigger id="invoice">
                        <SelectValue placeholder="Select invoice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">INV-2024001</SelectItem>
                        <SelectItem value="2">INV-2024002</SelectItem>
                        <SelectItem value="3">INV-2024003</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" placeholder="0.00" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="method">Payment Method</Label>
                    <Select>
                      <SelectTrigger id="method">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="mobile">Mobile Payment</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="reference">Reference Number</Label>
                    <Input id="reference" placeholder="Transaction reference" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input id="notes" placeholder="Additional notes" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">Process Payment</Button>
                  <Button type="button" variant="outline">Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default PaymentProcessing;
