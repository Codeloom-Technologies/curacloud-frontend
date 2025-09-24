import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Calendar,
  Bed,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import heroImage from "@/assets/hms-hero.jpg";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      title: "Total Patients",
      value: "2,847",
      change: "+12% from last month",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Today's Appointments",
      value: "156",
      change: "8 pending check-ins",
      changeType: "neutral" as const,
      icon: Calendar,
    },
    {
      title: "Bed Occupancy",
      value: "85%",
      change: "12 beds available",
      changeType: "neutral" as const,
      icon: Bed,
    },
    {
      title: "Monthly Revenue",
      value: "₦284,500",
      change: "+8.2% from last month",
      changeType: "positive" as const,
      icon: DollarSign,
    },
  ];

  const departmentMetrics = [
    { name: "Emergency", occupancy: 92, color: "bg-red-500" },
    { name: "ICU", occupancy: 78, color: "bg-orange-500" },
    { name: "General Ward", occupancy: 65, color: "bg-blue-500" },
    { name: "Pediatrics", occupancy: 45, color: "bg-green-500" },
    { name: "Maternity", occupancy: 88, color: "bg-purple-500" },
  ];

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

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Hero Section */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-hero shadow-strong">
            <img
              src={heroImage}
              alt="Hospital Management System"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome to CuraCloud</h1>
              <p className="text-lg opacity-90 max-w-2xl">
                Streamline your hospital operations with our comprehensive
                management system. Monitor patient care, schedule appointments,
                and track key metrics in one place.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Real-time monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Advanced analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* Department Occupancy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bed className="h-5 w-5" />
                  Department Occupancy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departmentMetrics.map((dept) => (
                  <div key={dept.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{dept.name}</span>
                      <span className="font-medium">{dept.occupancy}%</span>
                    </div>
                    <Progress value={dept.occupancy} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Alerts & Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Critical Patient Alert
                    </p>
                    <p className="text-xs text-red-600">
                      Room 302 - Patient requires immediate attention
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">
                      Equipment Maintenance
                    </p>
                    <p className="text-xs text-orange-600">
                      MRI Machine #2 scheduled for maintenance
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Inventory Low
                    </p>
                    <p className="text-xs text-blue-600">
                      Surgical gloves running low - reorder needed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentActivity />
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
}
