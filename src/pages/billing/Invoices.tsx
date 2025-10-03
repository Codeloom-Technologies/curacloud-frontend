import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Eye, Plus } from "lucide-react";

const Invoices = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const invoices = [
    { id: "INV-2024001", patient: "John Doe", date: "2024-03-15", amount: "$450.00", status: "Paid" },
    { id: "INV-2024002", patient: "Jane Smith", date: "2024-03-14", amount: "$780.00", status: "Pending" },
    { id: "INV-2024003", patient: "Bob Johnson", date: "2024-03-13", amount: "$320.00", status: "Paid" },
    { id: "INV-2024004", patient: "Alice Williams", date: "2024-03-12", amount: "$1,250.00", status: "Overdue" },
    { id: "INV-2024005", patient: "Charlie Brown", date: "2024-03-11", amount: "$590.00", status: "Paid" },
  ];

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
              <p className="text-muted-foreground">Manage patient billing and invoices</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Invoices</CardTitle>
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.patient}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            invoice.status === "Paid" ? "default" : 
                            invoice.status === "Pending" ? "secondary" : 
                            "destructive"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

export default Invoices;
