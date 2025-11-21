import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Globe,
  TrendingUp,
  Shield,
  Activity,
  Settings,
  BarChart3,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Crown,
  Eye,
  MoreHorizontal,
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
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Users",
      value: "1,247",
      change: "+12% growth",
      changeType: "positive" as const,
      icon: Users,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Active Countries",
      value: "8",
      change: "Worldwide coverage",
      changeType: "positive" as const,
      icon: Globe,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "System Health",
      value: "99.8%",
      change: "Excellent uptime",
      changeType: "positive" as const,
      icon: Activity,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const quickActions = [
    {
      title: "Manage Providers",
      description: "View, add, or edit healthcare organizations",
      icon: Building2,
      action: () => navigate("/dashboard/admin/healthcare-providers"),
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
    },
    {
      title: "System Settings",
      description: "Configure global system settings",
      icon: Settings,
      action: () => navigate("/dashboard/admin/system-settings"),
      color: "bg-purple-500/10 text-purple-600 border-purple-200",
    },
    {
      title: "User Management",
      description: "Manage all users across providers",
      icon: UserPlus,
      action: () => navigate("/dashboard/admin/users"),
      color: "bg-green-500/10 text-green-600 border-green-200",
    },
    {
      title: "Analytics",
      description: "View system-wide analytics & reports",
      icon: BarChart3,
      action: () => navigate("/dashboard/-admin/analytics"),
      color: "bg-orange-500/10 text-orange-600 border-orange-200",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "provider_registered",
      title: "New Healthcare Provider",
      description: "City General Hospital completed registration",
      icon: Building2,
      iconColor: "text-green-600 bg-green-100",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "user_milestone",
      title: "User Milestone Reached",
      description: "1000+ active users across all providers",
      icon: Users,
      iconColor: "text-blue-600 bg-blue-100",
      time: "5 hours ago",
      status: "completed",
    },
    {
      id: 3,
      type: "system_update",
      title: "System Update",
      description: "Platform upgraded to version 2.1.0",
      icon: Zap,
      iconColor: "text-purple-600 bg-purple-100",
      time: "1 day ago",
      status: "completed",
    },
    {
      id: 4,
      type: "pending_approval",
      title: "Pending Approval",
      description: "3 new healthcare providers awaiting verification",
      icon: Clock,
      iconColor: "text-orange-600 bg-orange-100",
      time: "Just now",
      status: "pending",
    },
  ];

  const systemHealth = [
    { name: "API Server", status: "operational", value: 100 },
    { name: "Database", status: "operational", value: 100 },
    { name: "File Storage", status: "degraded", value: 87 },
    { name: "Email Service", status: "operational", value: 100 },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card/80 backdrop-blur-sm border-r transform transition-transform duration-300 md:relative md:translate-x-0 ${
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
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 shadow-2xl p-8 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20">
                <Crown className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Super Admin Dashboard
                </h1>
                <p className="text-lg opacity-90 mt-1">
                  Oversee and manage the entire healthcare ecosystem
                </p>
              </div>
            </div>

            <div className="relative z-10 flex gap-3 mt-6">
              <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                <Shield className="h-3 w-3 mr-1" />
                System Admin
              </Badge>
              <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                <Activity className="h-3 w-3 mr-1" />
                24/7 Monitoring
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-slate-100 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <MoreHorizontal className="h-5 w-5 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium text-slate-700 mb-2">{stat.title}</p>
                  <p className="text-xs text-green-600 font-medium">{stat.change}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Zap className="h-5 w-5 text-orange-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-md group cursor-pointer ${action.color}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-current/10 group-hover:scale-110 transition-transform">
                          <action.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold mb-1 group-hover:text-current transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Activity className="h-5 w-5 text-green-500" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemHealth.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        service.status === 'operational' ? 'bg-green-500' : 'bg-orange-500'
                      }`}></div>
                      <span className="text-sm font-medium">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            service.status === 'operational' ? 'bg-green-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${service.value}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{service.value}%</span>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Overall Status</span>
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Clock className="h-5 w-5 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-200/60 hover:border-slate-300 transition-all duration-200 hover:bg-slate-50/50 group cursor-pointer"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${activity.iconColor}`}>
                      <activity.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {activity.title}
                        </p>
                        {activity.status === 'pending' && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 truncate">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {activity.time}
                      </span>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}