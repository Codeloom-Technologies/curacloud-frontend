import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Calendar } from "lucide-react";

const BillingReports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const reports = [
    { name: "Daily Revenue Report", date: "2024-03-15", amount: "$3,456.00" },
    { name: "Weekly Summary", date: "2024-03-10 - 2024-03-17", amount: "$18,234.00" },
    { name: "Monthly Report", date: "March 2024", amount: "$78,901.00" },
    { name: "Outstanding Invoices", date: "2024-03-15", amount: "$12,234.50" },
  ];

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Billing Reports</h1>
              <p className="text-muted-foreground">View and export financial reports</p>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>

          <Tabs defaultValue="revenue" className="space-y-6">
            <TabsList>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="outstanding">Outstanding</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Reports</CardTitle>
                  <CardDescription>Track revenue and income trends</CardDescription>
                  <div className="flex gap-4 mt-4">
                    <Select defaultValue="month">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Daily</SelectItem>
                        <SelectItem value="week">Weekly</SelectItem>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Select Date Range
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.slice(0, 3).map((report, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{report.name}</p>
                            <p className="text-sm text-muted-foreground">{report.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-lg">{report.amount}</p>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Reports</CardTitle>
                  <CardDescription>Analyze payment methods and transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Payment reports content will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="outstanding">
              <Card>
                <CardHeader>
                  <CardTitle>Outstanding Reports</CardTitle>
                  <CardDescription>Track unpaid invoices and overdue payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{reports[3].name}</p>
                          <p className="text-sm text-muted-foreground">{reports[3].date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-lg text-destructive">{reports[3].amount}</p>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="custom">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Reports</CardTitle>
                  <CardDescription>Create custom financial reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Custom report builder will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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

export default BillingReports;
