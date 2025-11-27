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
  WorkflowIcon,
  Crown,
  X,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import heroImage from "@/assets/hms-hero.jpg";
import { useQuery } from "@tanstack/react-query";
import { patientStatsTotalPerProvider } from "@/services/patient";
import { LoadingSpinner } from "@/components/ui/Preloader";
import { getSubscriptionStatus } from "@/services/subscription";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const navigate = useNavigate();

  const {
    data: statsData,
    isLoading: isStatsLoading,
    isFetching: isStatsFetching,
  } = useQuery({
    queryKey: ["patientStatsTotalPerProvider"],
    queryFn: () => patientStatsTotalPerProvider(),
  });

  const { 
    data: subscriptionsStatus, 
    isLoading: isLoadingStatus,
    isFetching: isFetchingStatus,
  } = useQuery({
    queryKey: ["subscription-status"],
    queryFn: () => getSubscriptionStatus(),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    staleTime: 60000,
  });

  // Helper function to determine subscription state
  const getSubscriptionAlert = () => {
    if (!subscriptionsStatus) return null;

    const now = new Date();
    const periodEndsAt = subscriptionsStatus.periodEndsAt ? new Date(subscriptionsStatus.periodEndsAt) : null;
    const daysUntilExpiry = periodEndsAt ? Math.ceil((periodEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    // If subscription is not active
    if (!subscriptionsStatus.isActive) {
      return {
        type: "expired" as const,
        title: "Subscription Expired",
        message: "Your subscription has expired. Renew now to continue using premium features.",
        severity: "critical" as const,
        daysUntilExpiry: 0,
      };
    }

    // If subscription is active but expiring soon
    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      return {
        type: "expiring" as const,
        title: "Subscription Expiring Soon",
        message: `Your subscription will expire in ${daysUntilExpiry} day${daysUntilExpiry > 1 ? 's' : ''}. Renew now to avoid interruption.`,
        severity: daysUntilExpiry <= 3 ? "high" : "medium" as const,
        daysUntilExpiry,
      };
    }

    // If in trial period
    if (subscriptionsStatus.trialDaysRemaining > 0) {
      return {
        type: "trial" as const,
        title: "Trial Period",
        message: `You have ${subscriptionsStatus.trialDaysRemaining} day${subscriptionsStatus.trialDaysRemaining > 1 ? 's' : ''} left in your trial.`,
        severity: "info" as const,
        daysUntilExpiry: subscriptionsStatus.trialDaysRemaining,
      };
    }

    return null;
  };

  const subscriptionAlert = getSubscriptionAlert();

  const stats = [
    {
      title: "Total Patients",
      value: statsData?.totalPatients?.toString() || "0",
      change: `${statsData?.newPatientsGrowth || 0}% growth this month`,
      changeType:
        (statsData?.newPatientsGrowth || 0) >= 0
          ? "positive"
          : ("negative" as const as any),
      icon: Users,
    },
    {
      title: "Active Patients",
      value: statsData?.activePatients?.toString() || "0",
      change: `${
        statsData?.newActivePatientsLastMonth || 0
      }% growth this month`,
      changeType:
        (statsData?.newActivePatientsLastMonth || 0) >= 0
          ? "positive"
          : ("negative" as const),
      icon: Calendar,
    },
    {
      title: "Total Appointments",
      value: statsData?.totalAppointments?.toString() || "0",
      change: `${
        statsData?.totalAppointmentsLastMonth || 0
      }% growth this month`,
      changeType:
        (statsData?.totalAppointments || 0) > 0
          ? "positive"
          : ("negative" as const),
      icon: Clock,
    },
    {
      title: "Today's Appointments",
      value: statsData?.pendingCheckIns?.toString() || "0",
      change: "Require attention",
      changeType:
        (statsData?.pendingCheckIns || 0) > 0
          ? "positive"
          : ("negative" as const),
      icon: Clock,
    },
    {
      title: "Monthly Revenue",
      icon: DollarSign,
      value: statsData?.monthlyRevenue?.toString() || "0",
      change: `${
        statsData?.newmonthlyRevenueLastMonth || 0
      }% growth this month`,
      changeType:
        (statsData?.monthlyRevenue || 0) > 0
          ? "positive"
          : ("negative" as const),
    },
    {
      title: "Male",
      icon: TrendingUp,
      value: statsData?.byGender.Male?.toString() || "0",
      change: `${statsData?.byGenderGrowth.Male || 0}% growth this month`,
      changeType:
        (statsData?.byGenderGrowth.Male || 0) > 0
          ? "positive"
          : ("negative" as const),
    },
    {
      title: "Female",
      icon: TrendingUp,
      value: statsData?.byGender.Female?.toString() || "0",
      change: `${statsData?.byGenderGrowth.Female || 0}% growth this month`,
      changeType:
        (statsData?.byGenderGrowth.Female || 0) > 0
          ? "positive"
          : ("negative" as const),
    },

    {
      title: "Total Staffs",
      icon: WorkflowIcon,
      value: statsData?.totalStaffs?.toString() || "0",
      change: `${statsData?.totalStaffs || 0}% growth this month`,
      changeType:
        (statsData?.totalStaffs || 0) > 0 ? "positive" : ("negative" as const),
    },
  ];

  const departmentMetrics = [
    { name: "Emergency", occupancy: 0, color: "bg-red-500" },
    { name: "ICU", occupancy: 0, color: "bg-orange-500" },
    { name: "General Ward", occupancy: 0, color: "bg-blue-500" },
    { name: "Pediatrics", occupancy: 0, color: "bg-green-500" },
    { name: "Maternity", occupancy: 0, color: "bg-purple-500" },
  ];

  // Auto-show dialog for critical alerts
  useState(() => {
    if (subscriptionAlert && (subscriptionAlert.type === 'expired' || subscriptionAlert.severity === 'critical')) {
      setShowSubscriptionDialog(true);
    }
  });

  if (isStatsLoading || isStatsFetching) {
    return <LoadingSpinner />; 
  }

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
          {/* Subscription Alert Banner */}
          {subscriptionAlert && (
            <div className={`rounded-lg border p-4 animate-in slide-in-from-top duration-500 ${
              subscriptionAlert.severity === 'critical' 
                ? 'bg-destructive/10 border-destructive/20 text-destructive' 
                : subscriptionAlert.severity === 'high'
                ? 'bg-orange-50 border-orange-200 text-orange-800'
                : subscriptionAlert.severity === 'medium'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    subscriptionAlert.severity === 'critical' 
                      ? 'bg-destructive/20' 
                      : subscriptionAlert.severity === 'high'
                      ? 'bg-orange-100'
                      : subscriptionAlert.severity === 'medium'
                      ? 'bg-yellow-100'
                      : 'bg-blue-100'
                  }`}>
                    {subscriptionAlert.type === 'expired' ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : subscriptionAlert.type === 'expiring' ? (
                      <CalendarDays className="h-5 w-5" />
                    ) : (
                      <Crown className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{subscriptionAlert.title}</h3>
                    <p className="text-sm opacity-90">{subscriptionAlert.message}</p>
                    {subscriptionsStatus?.periodEndsAt && (
                      <p className="text-xs mt-1 opacity-75">
                        Expires: {format(new Date(subscriptionsStatus.periodEndsAt), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={subscriptionAlert.severity === 'critical' ? "destructive" : "default"}
                    size="sm"
                    onClick={() => navigate("/dashboard/subscriptions")}
                  >
                    {subscriptionAlert.type === 'expired' ? 'Renew Now' : 'Manage Subscription'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSubscriptionDialog(true)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Current Plan Badge */}
          {subscriptionsStatus?.isActive && subscriptionsStatus.currentPlan && (
            <div className="flex justify-end">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Crown className="h-3 w-3" />
                Current Plan: {subscriptionsStatus.currentPlan.name}
                {subscriptionsStatus.trialDaysRemaining > 0 && (
                  <span className="ml-2 text-xs">
                    ({subscriptionsStatus.trialDaysRemaining} trial days left)
                  </span>
                )}
              </Badge>
            </div>
          )}

          {/* Hero Section */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-hero shadow-strong">
            <img
              src={heroImage}
              alt="Hospital Management System"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome to Curacloud</h1>
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
            {isStatsLoading || isStatsFetching
              ? // Loading skeleton
                Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </div>
                          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              : // Actual stats cards
                stats.map((stat, index) => <StatsCard key={index} {...stat} />)}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {/* Quick Actions */}
            <QuickActions />

            <div>
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>

      {/* Subscription Status Dialog */}
      <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {subscriptionAlert?.type === 'expired' ? (
                <AlertCircle className="h-5 w-5 text-destructive" />
              ) : subscriptionAlert?.type === 'expiring' ? (
                <CalendarDays className="h-5 w-5 text-orange-500" />
              ) : (
                <Crown className="h-5 w-5 text-blue-500" />
              )}
              {subscriptionAlert?.title || "Subscription Status"}
            </DialogTitle>
            <DialogDescription>
              {subscriptionAlert?.message || "Your subscription details"}
            </DialogDescription>
          </DialogHeader>

          {subscriptionsStatus && (
            <div className="space-y-4">
              {/* Current Plan Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{subscriptionsStatus.currentPlan?.name}</span>
                    <Badge variant={subscriptionsStatus.isActive ? "default" : "destructive"}>
                      {subscriptionsStatus.isActive ? 'Active' : 'Expired'}
                    </Badge>
                  </div>
                  {subscriptionsStatus.periodEndsAt && (
                    <div className="flex justify-between text-sm">
                      <span>Expiry Date:</span>
                      <span>{format(new Date(subscriptionsStatus.periodEndsAt), "MMM d, yyyy")}</span>
                    </div>
                  )}
                  {subscriptionsStatus.trialDaysRemaining > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Trial Days Left:</span>
                      <span>{subscriptionsStatus.trialDaysRemaining}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Progress Bar for Expiry */}
              {subscriptionAlert?.daysUntilExpiry !== undefined && subscriptionAlert.daysUntilExpiry > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Time remaining:</span>
                    <span>{subscriptionAlert.daysUntilExpiry} days</span>
                  </div>
                  <Progress 
                    value={Math.max(0, 100 - (subscriptionAlert.daysUntilExpiry / 30) * 100)} 
                    className={`${
                      subscriptionAlert.severity === 'critical' ? 'bg-destructive' :
                      subscriptionAlert.severity === 'high' ? 'bg-orange-500' :
                      subscriptionAlert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowSubscriptionDialog(false)}
            >
              Later
            </Button>
            <Button
              onClick={() => {
                setShowSubscriptionDialog(false);
                navigate("/dashboard/subscriptions");
              }}
              variant={subscriptionAlert?.severity === 'critical' ? "destructive" : "default"}
            >
              {subscriptionAlert?.type === 'expired' ? 'Renew Now' : 'Manage Subscription'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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