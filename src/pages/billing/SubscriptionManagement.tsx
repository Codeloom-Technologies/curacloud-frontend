import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Check,
  Crown,
  Star,
  Shield,
  Heart,
  FileText,
  CreditCard,
  Calendar,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getActiveSubscriptionPlan, getSubscriptionPlans } from "@/services/subscription";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { formatNaira } from "@/lib/formatters";

const SubscriptionManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);
  const { toast } = useToast();

  const { 
    data: subscriptionPlans, 
    isLoading: isLoadingPlans,
    error: plansError 
  } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: () => getSubscriptionPlans(),
  });

  console.log(subscriptionPlans)

  const { 
    data: currentSubscription, 
    isLoading: isLoadingSubscription,
    error: subscriptionError,
    refetch: refetchSubscription 
  } = useQuery({
    queryKey: ["active-subscription"],
    queryFn: () => getActiveSubscriptionPlan(),
  });

  const handleUpgrade = (planId: string, planName: string) => {
    toast({
      title: "Upgrade Requested",
      description: `Upgrading to ${planName} plan...`,
      variant: "default",
    });
    // Handle upgrade logic
  };

  const handleCancel = () => {
    toast({
      title: "Subscription Cancelled",
      description: "Your subscription will end at the current billing period.",
      variant: "default",
    });
  };

  const handleAutoRenew = (enabled: boolean) => {
    setAutoRenew(enabled);
    toast({
      title: enabled ? "Auto-renew enabled" : "Auto-renew disabled",
      description: `Auto-renew has been ${enabled ? "enabled" : "disabled"} for your subscription.`,
      variant: "default",
    });
  };

  const getBillingPeriod = (subscription: any) => {
    if (!subscription?.currentPeriodStartsAt || !subscription?.currentPeriodEndsAt) 
      return "monthly";
    
    const start = new Date(subscription.currentPeriodStartsAt);
    const end = new Date(subscription.currentPeriodEndsAt);
    const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
    return diffMonths >= 12 ? "yearly" : diffMonths >= 6 ? "half-yearly" : diffMonths >= 3 ? "quarterly" : "monthly";
  };

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan?.id === planId;
  };

  // Loading state
  if (isLoadingPlans || isLoadingSubscription) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-8">
              <Skeleton className="h-12 w-64" />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-24 mx-auto mb-4" />
                      <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map(j => (
                          <Skeleton key={j} className="h-4 w-full" />
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (plansError || subscriptionError) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto text-center py-16">
              <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-destructive mb-2">
                Failed to Load Subscription Data
              </h1>
              <p className="text-muted-foreground mb-6">
                There was an error loading your subscription information.
              </p>
              <Button onClick={() => { refetchSubscription(); }}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
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

        <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto space-y-16">
            {/* Header */}
            <div className="text-center animate-fade-in">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Flexible Pricing
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Choose Your Plan
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Scalable pricing options designed to grow with your healthcare facility.
              </p>
            </div>

            {/* Current Subscription */}
            {currentSubscription && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Current Subscription</CardTitle>
                  <CardDescription>
                    Overview of your current plan and usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Current Plan
                      </Label>
                      <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-purple-500" />
                        <span className="text-lg font-semibold">
                          {currentSubscription.plan?.name || "No active plan"}
                        </span>
                        <Badge variant={currentSubscription.status === 'active' ? "default" : "secondary"}>
                          {currentSubscription.status?.charAt(0).toUpperCase() + currentSubscription.status?.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Next Billing
                      </Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="text-lg font-semibold">
                          {currentSubscription.currentPeriodEndsAt 
                            ? format(new Date(currentSubscription.currentPeriodEndsAt), "MMM d, yyyy")
                            : "No date set"
                          }
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Price
                      </Label>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <span className="text-lg font-semibold">
                          {formatNaira(currentSubscription.plan?.price?.toLocaleString())}
                          <span className="text-sm text-muted-foreground ml-1">
                            /{getBillingPeriod(currentSubscription)}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Auto-renew
                      </Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={autoRenew}
                          onCheckedChange={handleAutoRenew}
                          disabled={currentSubscription.status !== 'active'}
                        />
                        <span className="text-sm">
                          {autoRenew ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Usage Stats */}
                  <div className="grid gap-6 md:grid-cols-2">
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Actions</h4>
                      <div className="flex gap-3 flex-wrap">
                        <Button 
                          variant="outline" 
                          onClick={handleCancel}
                          disabled={currentSubscription.status !== 'active'}
                        >
                          Cancel Subscription
                        </Button>
                        <Button variant="outline">Update Payment Method</Button>
                        <Button variant="outline">View Invoices</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Plans */}
            <div className="space-y-8 animate-fade-in">
              <div className="grid md:grid-cols-3 gap-8">
                {subscriptionPlans?.map((plan) => {
                  const isCurrent = isCurrentPlan(plan.id);
                  const isPopular = plan.name?.toLowerCase().includes('standard') || plan.name?.toLowerCase().includes('recommended');
                  
                  return (
                    <Card
                      key={plan.id}
                      className={`relative hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                        isPopular ? "border-primary shadow-lg" : ""
                      } ${isCurrent ? "border-primary bg-primary/5" : ""}`}
                    >
                      {isPopular && (
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Most Popular
                        </Badge>
                      )}

                      <CardHeader className="pb-4">
                        <CardTitle className="text-2xl flex items-center justify-between">
                          {plan.name}
                          {isCurrent && (
                            <Badge variant="secondary" className="ml-2">
                              Current
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="mb-2">
                          <span className="text-4xl font-bold">
                            {formatNaira(plan.price)}
                          </span>
                          <span className="text-muted-foreground">
                            /month
                          </span>
                        </div>
                        <CardDescription>
                          Perfect for {plan.name?.toLowerCase().includes('basic') ? 'small clinics' : plan.name?.toLowerCase().includes('standard') ? 'growing practices' : 'large healthcare facilities'}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <ul className="space-y-3">
                          {plan.features && Array.isArray(plan.features) ? (
                            plan.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-3 text-sm"
                              >
                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))
                          ) : plan.features && typeof plan.features === 'object' ? (
                            Object.entries(plan.features).slice(0, 6).map(([key, value], index) => (
                              <li
                                key={index}
                                className="flex items-center gap-3 text-sm"
                              >
                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="capitalize">
                                 {key.replace(/_/g, ' ')}: {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                                </span>
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-muted-foreground text-center">
                              No features listed
                            </li>
                          )}
                        </ul>

                        <Button
                          className={`w-full ${
                            isPopular ? "bg-primary hover:bg-primary/90" : ""
                          }`}
                          variant={isCurrent ? "outline" : isPopular ? "default" : "outline"}
                          disabled={isCurrent}
                          onClick={() => handleUpgrade(plan.id, plan.name)}
                        >
                          {isCurrent ? (
                            "Current Plan"
                          ) : (
                            <>
                              {currentSubscription ? "Upgrade Plan" : "Start Free Trial"}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

       
            </div>

            {/* Billing History */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  Recent invoices and payment history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No billing history available
                  </p>
                  <Button variant="outline" className="mt-4">
                    View All Invoices
                  </Button>
                </div>
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

export default SubscriptionManagement;