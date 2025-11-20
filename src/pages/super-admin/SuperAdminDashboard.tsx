import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Globe,
  TrendingUp,
  Shield,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const stats = [
    {
      title: "Healthcare Providers",
      value: "24",
      change: "+3 this month",
      changeType: "positive" as const,
      icon: Building2,
    },
    {
      title: "Total Users",
      value: "1,247",
      change: "+12% growth",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Active Countries",
      value: "8",
      change: "Worldwide coverage",
      changeType: "positive" as const,
      icon: Globe,
    },
    {
      title: "System Health",
      value: "99.8%",
      change: "Uptime",
      changeType: "positive" as const,
      icon: Activity,
    },
  ];

  const quickActions = [
    {
      title: "Manage Healthcare Providers",
      description: "View, add, or edit healthcare provider organizations",
      icon: Building2,
      action: () => navigate("/super-admin/healthcare-providers"),
    },
    {
      title: "System Settings",
      description: "Configure global system settings and preferences",
      icon: Shield,
      action: () => navigate("/super-admin/system-settings"),
    },
    {
      title: "User Management",
      description: "Manage all users across all healthcare providers",
      icon: Users,
      action: () => navigate("/super-admin/users"),
    },
    {
      title: "Analytics & Reports",
      description: "View system-wide analytics and generate reports",
      icon: TrendingUp,
      action: () => navigate("/super-admin/analytics"),
    },
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
          <div className="relative rounded-2xl overflow-hidden bg-gradient-hero shadow-strong p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
                <p className="text-lg opacity-90">
                  Manage and oversee all healthcare providers
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                    onClick={action.action}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <action.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent System Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New Healthcare Provider</p>
                    <p className="text-xs text-muted-foreground">
                      City General Hospital registered
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">2h ago</span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">User Milestone</p>
                    <p className="text-xs text-muted-foreground">
                      1000+ active users reached
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">5h ago</span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">System Update</p>
                    <p className="text-xs text-muted-foreground">
                      Platform upgraded to v2.1.0
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">1d ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
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
