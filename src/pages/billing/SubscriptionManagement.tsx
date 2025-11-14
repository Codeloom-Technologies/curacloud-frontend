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
import {
  Check,
  Crown,
  Star,
  Zap,
  Shield,
  Users,
  FileText,
  CreditCard,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SubscriptionManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("recommended");
  const [autoRenew, setAutoRenew] = useState(true);
  const { toast } = useToast();

  const subscriptionPlans = [
    {
      id: "basic",
      name: "Basic",
      description: "Essential features for getting started",
      price: "₦5,000",
      period: "month",
      popular: false,
      features: [
        "Up to 50 patients",
        "Basic analytics",
        "Email support",
        "5GB storage",
        "Standard security",
      ],
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      id: "recommended",
      name: "Recommended",
      description: "Perfect for growing practices",
      price: "₦15,000",
      period: "month",
      popular: true,
      features: [
        "Up to 200 patients",
        "Advanced analytics",
        "Priority support",
        "50GB storage",
        "Enhanced security",
        "Billing automation",
        "Multi-user access",
      ],
      icon: Crown,
      color: "bg-purple-500",
    },
    {
      id: "custom",
      name: "Custom",
      description: "Tailored for large organizations",
      price: "Custom",
      period: "quote",
      popular: false,
      features: [
        "Unlimited patients",
        "Custom analytics",
        "24/7 dedicated support",
        "Unlimited storage",
        "Enterprise security",
        "Custom integrations",
        "API access",
        "White-label options",
      ],
      icon: Zap,
      color: "bg-orange-500",
    },
  ];

  const currentSubscription = {
    plan: "Recommended",
    status: "active",
    nextBilling: "2024-04-15",
    price: "₦15,000",
    period: "monthly",
    featuresUsed: {
      patients: "45/200",
      storage: "12.5/50 GB",
    },
  };

  const handleUpgrade = (planId: string) => {
    toast({
      title: "Upgrade Requested",
      description: `Upgrading to ${planId} plan...`,
      variant: "success",
    });
    // Handle upgrade logic
  };

  const handleCancel = () => {
    toast({
      title: "Subscription Cancelled",
      description: "Your subscription will end at the current billing period.",
      variant: "success",
    });
  };

  const handleAutoRenew = (enabled: boolean) => {
    setAutoRenew(enabled);
    toast({
      title: enabled ? "Auto-renew enabled" : "Auto-renew disabled",
      description: `Auto-renew has been ${
        enabled ? "enabled" : "disabled"
      } for your subscription.`,
      variant: "success",
    });
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
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Subscription Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your practice's subscription plan and billing
              </p>
            </div>

            {/* Current Subscription */}
            <Card>
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
                        {currentSubscription.plan}
                      </span>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Next Billing
                    </Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-semibold">
                        {new Date(
                          currentSubscription.nextBilling
                        ).toLocaleDateString()}
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
                        {currentSubscription.price}/{currentSubscription.period}
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
                    <h4 className="font-semibold">Usage Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Patients</span>
                        <span className="font-medium">
                          {currentSubscription.featuresUsed.patients}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Storage</span>
                        <span className="font-medium">
                          {currentSubscription.featuresUsed.storage}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Actions</h4>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel Subscription
                      </Button>
                      <Button variant="outline">Update Payment Method</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Plans */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Available Plans</h2>
                <p className="text-muted-foreground mt-2">
                  Choose the perfect plan for your practice
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {subscriptionPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative transition-all duration-300 hover:shadow-lg ${
                      plan.popular
                        ? "ring-2 border-primary shadow-lg scale-105"
                        : ""
                    } ${currentPlan === plan.id ? "border-primary" : ""}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-primary text-primary-foreground text-white px-3 py-1">
                          {/* <Star className="h-3 w-3 mr-1 fill-current" /> */}
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4">
                      {/* <div
                        className={`inline-flex p-3 rounded-full ${plan.color} text-white mb-4`}
                      >
                        <plan.icon className="h-6 w-6" />
                      </div> */}
                      <CardTitle className="flex items-center justify-center gap-2">
                        {plan.name}
                        {currentPlan === plan.id && (
                          <Badge variant="default">Current</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        {plan.period !== "quote" && (
                          <span className="text-muted-foreground">
                            /{plan.period}
                          </span>
                        )}
                      </div>

                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-3 text-sm"
                          >
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter>
                      <Button
                        className="w-full"
                        variant={
                          currentPlan === plan.id ? "outline" : "default"
                        }
                        disabled={currentPlan === plan.id}
                        onClick={() => handleUpgrade(plan.id)}
                      >
                        {currentPlan === plan.id ? (
                          "Current Plan"
                        ) : (
                          <>
                            Upgrade Plan
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            {/* Billing History */}
            <Card>
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
