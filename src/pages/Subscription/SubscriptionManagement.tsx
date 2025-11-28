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
  FileText,
  CreditCard,
  Calendar,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Wallet,
  Mail,
  X,
  Loader2,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getActiveSubscriptionPlan, getSubscriptionPlans, getSubscriptionsHistory } from "@/services/subscription";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { formatNaira } from "@/lib/formatters";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuthStore } from "@/store/authStore";
import { getBalance } from "@/services/wallet";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type PaymentMethod = 'card' | 'wallet';

type PlanSelection = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
} | null;

const SubscriptionManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  const [selectedPlan, setSelectedPlan] = useState<PlanSelection>(null);
  const [showBalance, setShowBalance] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { toast } = useToast();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const perPage = 10;

  const { 
    handleUpgrade, 
    handleAutoRenew, 
    handleCancel, 
    onReactivate,
    isCreating, 
    isUpdating, 
    isCancelling, 
    isReactivating
  } = useSubscription();

  const { 
    data: subscriptionPlans, 
    isLoading: isLoadingPlans,
    error: plansError 
  } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: () => getSubscriptionPlans(),
  });

  const { 
    data: currentSubscription, 
    isLoading: isLoadingSubscription,
    error: subscriptionError,
    refetch: refetchSubscription 
  } = useQuery({
    queryKey: ["active-subscription"],
    queryFn: () => getActiveSubscriptionPlan(),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    staleTime: 60000,
  });

  // Wallet balance query
  const { 
    data: wallet, 
    isLoading: isLoadingWallet,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: () => getBalance(),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    staleTime: 60000,
  });

  const walletBalance = wallet?.balance;

  const { 
    data: subscriptionsHistory, 
    isLoading: isLoadingHistory,
    isFetching: isFetchingHistory,
    refetch
  } = useQuery({
    queryKey: ["subscription-history"],
    queryFn: () => getSubscriptionsHistory(1,perPage),
    // refetchInterval: 30000,
    refetchOnWindowFocus: true,
    // staleTime: 60000,
  });
  
  const histories = subscriptionsHistory?.histories || [];
  const meta = subscriptionsHistory?.meta ?? {};
  const totalPages = meta.lastPage ?? 1;

  // Helper functions for subscription status
  const getSubscriptionStatus = (subscription: any) => {
    if (!subscription) return 'none';
    
    const now = new Date();
    const endsAt = subscription.currentPeriodEndsAt ? new Date(subscription.currentPeriodEndsAt) : null;
    
    // Check if subscription is expired by date
    const isExpiredByDate = endsAt && endsAt < now;
    
    // Status-based checks
    if (subscription.status === 'active' && isExpiredByDate) {
      return 'expired';
    }
    
    if (['expired', 'canceled', 'past_due', 'inactive'].includes(subscription.status)) {
      return subscription.status;
    }
    
    return subscription.status;
  };

  const isActiveSubscription = (planId: string) => {
    const status = getSubscriptionStatus(currentSubscription);
    return status === 'active' && currentSubscription?.plan?.id === planId;
  };

  const isExpiredSubscription = () => {
    const status = getSubscriptionStatus(currentSubscription);
    return ['expired', 'canceled', 'past_due', 'inactive'].includes(status);
  };

  const canSelectNewPlan = !currentSubscription || isExpiredSubscription();

  const getBillingPeriod = (subscription: any) => {
    if (!subscription?.currentPeriodStartsAt || !subscription?.currentPeriodEndsAt) 
      return "monthly";
    
    const start = new Date(subscription.currentPeriodStartsAt);
    const end = new Date(subscription.currentPeriodEndsAt);
    const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
    return diffMonths >= 12 ? "yearly" : diffMonths >= 6 ? "half-yearly" : diffMonths >= 3 ? "quarterly" : "monthly";
  };

  const handleContactSupport = () => {
    toast({
      title: "Soon",
      description: "Coming soon",
      variant: "default",
    });
  };

  const handlePlanSelection = (plan: any) => {
    if (plan.name === 'Enterprise') {
      handleContactSupport();
      return;
    }

    // Convert features to array if it's an object
    const features = Array.isArray(plan.features) 
      ? plan.features 
      : typeof plan.features === 'object' 
        ? Object.entries(plan.features).map(([key, value]) => 
            `${key.replace(/_/g, ' ')}: ${typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}`
          )
        : [];

    setSelectedPlan({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      description: plan.description || `Perfect for ${plan.name?.toLowerCase()} healthcare facilities`,
      features: features.slice(0, 6) // Show first 6 features
    });
    setShowPaymentModal(true);
  };

  const handlePaymentConfirmation = async () => {
    if (!selectedPlan || !user) {
      toast({
        title: "Error",
        description: "Please select a plan and ensure you're logged in.",
        variant: "destructive",
      });
      return;
    }
    
    const handleTopUp = () => {
      return navigate("/dashboard/wallet");
    };

    // Enhanced balance validation for wallet payments
    if (selectedPaymentMethod === 'wallet') {
      if (walletBalance < selectedPlan.price) {
        const shortage = selectedPlan.price - walletBalance;
        toast({
          title: "Insufficient Wallet Balance",
          description: (
            <div className="space-y-1">
              <p>Your wallet balance is insufficient for this transaction.</p>
              <p className="font-semibold">
                Needed: {formatNaira(Math.abs(selectedPlan.price))} | Available: {formatNaira(Math.abs(walletBalance))}
              </p>
              <p>Shortage: {formatNaira(Math.abs(shortage))}</p>
            </div>
          ),
          variant: "destructive",
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleTopUp}
            >
              Add Funds
            </Button>
          ),
        });
        return;
      }
    }

    try {
      // Show processing toast
      toast({
        title: "Processing Payment",
        description: "Please wait while we process your payment...",
        variant: "default",
      });

      // Process the payment
      await handleUpgrade(
        selectedPlan.id, 
        selectedPlan.price, 
        selectedPlan?.name, 
        selectedPaymentMethod
      );

      // Refresh wallet balance after successful payment if wallet was used
      if (selectedPaymentMethod === 'wallet') {
        await refetchWallet();
      }

      // Show success message
      toast({
        title: "Payment Successful!",
        description: `You have successfully subscribed to the ${selectedPlan.name} plan.`,
        variant: "success",
      });

      // Reset state
      setShowPaymentModal(false);
      setSelectedPlan(null);
      
    } catch (error: any) {
      console.error('Payment error:', error);
      
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetchWallet()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        ),
      });
    }
  };

  const onAutoRenew = async (enabled: boolean) => {
    if (!currentSubscription?.id) {
      toast({
        title: "No Active Subscription",
        description: "You don't have an active subscription to manage.",
        variant: "destructive",
      });
      return;
    }
    await handleAutoRenew(currentSubscription.id, enabled);
  };

  const onCancelSubscription = async () => {
    if (!currentSubscription?.id) {
      toast({
        title: "No Active Subscription",
        description: "You don't have an active subscription to cancel.",
        variant: "destructive",
      });
      return;
    }
    await handleCancel(currentSubscription.id, {feedback: '', reason:''});
  };
  
  const handleReactivate = async () => {
    if (!currentSubscription?.id) {
      toast({
        title: "No Active Subscription",
        description: "You don't have an active subscription to manage.",
        variant: "destructive",
      });
      return;
    }
    await onReactivate(currentSubscription.id);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      refetch();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Payment Method Modal
  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in-90 zoom-in-90">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Complete Your Subscription</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowPaymentModal(false);
              setSelectedPlan(null);
            }}
            disabled={isCreating}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Plan Summary */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Crown className="h-5 w-5 text-purple-500" />
                {selectedPlan?.name}
              </CardTitle>
              <CardDescription>{selectedPlan?.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{formatNaira(Math.abs(selectedPlan?.price) || 0)}</span>
                <Badge variant="secondary">per month</Badge>
              </div>
              
              {/* Plan Features Preview */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Includes:</Label>
                <ul className="space-y-1">
                  {selectedPlan?.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span className="truncate">{feature}</span>
                    </li>
                  ))}
                  {selectedPlan && selectedPlan.features.length > 3 && (
                    <li className="text-xs text-muted-foreground pl-5">
                      +{selectedPlan.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Select Payment Method</Label>
            
            {/* Card Option */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedPaymentMethod === 'card' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedPaymentMethod('card')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    selectedPaymentMethod === 'card' ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <Label className="text-base font-semibold cursor-pointer">
                      Credit/Debit Card
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Pay securely with your card
                    </p>
                  </div>
                </div>
                {selectedPaymentMethod === 'card' && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>

            {/* Wallet Option */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedPaymentMethod === 'wallet' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedPaymentMethod('wallet')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    selectedPaymentMethod === 'wallet' ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-base font-semibold cursor-pointer">
                        Wallet Balance
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowBalance(!showBalance);
                        }}
                      >
                        {showBalance ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                    
                    {isLoadingWallet ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <p className="text-sm text-muted-foreground">Loading balance...</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {showBalance ? formatNaira(walletBalance) : '••••••'}
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowWalletDetails(true);
                          }}
                        >
                          View wallet details
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {selectedPaymentMethod === 'wallet' && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>

              {/* Wallet balance validation */}
              {selectedPaymentMethod === 'wallet' && selectedPlan && (
                <div className={`mt-3 p-3 rounded-md border ${
                  walletBalance >= selectedPlan.price
                    ? 'bg-green-50 border-green-200'
                    : 'bg-destructive/10 border-destructive/20'
                }`}>
                  <div className="flex items-center gap-2">
                    {walletBalance >= selectedPlan.price ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                    <span className={`text-sm font-medium ${
                      walletBalance >= selectedPlan.price ? 'text-green-700' : 'text-destructive'
                    }`}>
                      {walletBalance >= selectedPlan.price 
                        ? 'Sufficient balance available'
                        : 'Insufficient balance'
                      }
                    </span>
                  </div>
                  
                  {walletBalance < selectedPlan.price && (
                    <div className="mt-2 space-y-1 text-xs text-destructive">
                      <p>Required: {formatNaira(selectedPlan.price)}</p>
                      <p>Shortage: {formatNaira(selectedPlan.price - walletBalance)}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          {selectedPlan && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Plan</span>
                    <span className="text-sm font-medium">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="text-sm font-medium">{formatNaira(Math.abs(selectedPlan.price))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payment Method</span>
                    <span className="text-sm font-medium capitalize">{selectedPaymentMethod}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">{formatNaira(Math.abs(selectedPlan.price))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowPaymentModal(false);
                setSelectedPlan(null);
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handlePaymentConfirmation}
              disabled={
                isCreating || 
                (selectedPaymentMethod === 'wallet' && 
                 (isLoadingWallet || walletBalance < (selectedPlan?.price || 0)))
              }
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                `Pay ${formatNaira(Math.abs(selectedPlan?.price) || 0)}`
              )}
            </Button>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              🔒 Your payment is secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Wallet Details Modal
  const WalletDetailsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Wallet Details</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowWalletDetails(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Current Balance */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
            <p className="text-3xl font-bold">{formatNaira(Math.abs(walletBalance))}</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm">
              <Wallet className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

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
            {/* Header with Wallet Balance */}
            <div className="text-center animate-fade-in">
              <div className="flex justify-center gap-4 mb-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  Flexible Pricing
                </Badge>
                {!isLoadingWallet && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Wallet className="h-3 w-3" />
                    Wallet: {formatNaira(Math.abs(walletBalance))}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
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
                  <CardTitle>
                    {isExpiredSubscription() ? "Expired Subscription" : "Current Subscription"}
                  </CardTitle>
                  <CardDescription>
                    {isExpiredSubscription() 
                      ? "Your subscription has expired. Renew to continue using premium features."
                      : "Overview of your current plan and usage"
                    }
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
                        <Badge variant={
                          getSubscriptionStatus(currentSubscription) === 'active' 
                            ? "default" 
                            : "secondary"
                        }>
                          {getSubscriptionStatus(currentSubscription).charAt(0).toUpperCase() + getSubscriptionStatus(currentSubscription).slice(1)}
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
                          {formatNaira(Math.abs(currentSubscription.plan?.price?.toLocaleString()))}
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
                          checked={currentSubscription.autoRenew || false}
                          onCheckedChange={onAutoRenew}
                          disabled={getSubscriptionStatus(currentSubscription) !== 'active' || isUpdating}
                        />
                        <span className="text-sm">
                          {isUpdating ? "Updating..." : (currentSubscription.autoRenew ? "Enabled" : "Disabled")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Actions */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Actions</h4>
                    <div className="flex gap-3 flex-wrap">
                      {/* Show Renew button for expired subscriptions */}
                      {isExpiredSubscription() && (
                        <Button 
                          className="h-11 bg-gradient-primary transition-all"
                          onClick={() => {
                            // Auto-select the previous plan for renewal
                            const previousPlan = subscriptionPlans?.find(
                              plan => plan.id === currentSubscription.plan?.id
                            );
                            if (previousPlan) {
                              handlePlanSelection(previousPlan);
                            }
                          }}
                        >
                          Renew Subscription
                        </Button>
                      )}
                      
                      {/* Show Reactivate for canceled subscriptions */}
                      {getSubscriptionStatus(currentSubscription) === "canceled" && (
                        <Button 
                          className="h-11 bg-gradient-primary transition-all"
                          disabled={isReactivating}
                          onClick={handleReactivate}
                        >
                          {isReactivating ? "Reactivating..." : "Reactivate Subscription"}                             
                        </Button>
                      )}
                      
                      {/* Show Cancel only for active subscriptions */}
                      {getSubscriptionStatus(currentSubscription) === "active" && (
                        <Button 
                          variant="destructive" 
                          onClick={onCancelSubscription}
                          disabled={isCancelling}
                        >
                          {isCancelling ? "Cancelling..." : "Cancel Subscription"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Plans */}
            <div className="space-y-8 animate-fade-in">
              <div className="grid md:grid-cols-4 gap-4">
                {subscriptionPlans?.map((plan) => {
                  const isCurrent = isActiveSubscription(plan.id);
                  const isPopular = plan.name?.includes('Growth Plan');
                  const isEnterprise = plan.name === 'Enterprise Plan';
                  
                  return (
                    <Card
                      key={plan.id}
                      className={`relative hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                        isPopular ? "border-primary shadow-lg" : ""
                      } ${isCurrent ? "border-primary bg-primary/5" : ""}`}
                    >
                      {isPopular && (
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground">
                          Most Popular
                        </Badge>
                      )}

                      {isEnterprise && (
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
                          Enterprise
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
                            {isEnterprise ? 'Custom' : formatNaira(Math.abs(plan.price))}
                          </span> 
                          <span className="text-muted-foreground">
                            {isEnterprise ? '' : '/month'}
                          </span>
                        </div>
                        <CardDescription>
                          {isEnterprise 
                            ? 'For large healthcare facilities with custom needs'
                            : `Perfect for ${plan.name?.toLowerCase()} healthcare facilities`
                          }
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <ul className="space-y-3">
                          {plan.features && Array.isArray(plan.features) ? (
                            plan.features.map((feature: string, index: number) => (
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
                            isPopular ? "bg-primary hover:bg-primary/90" : "bg-primary hover:bg-primary/90"
                          } ${isEnterprise ? "bg-primary hover:bg-primary/90" : "bg-primary hover:bg-primary/90"}`}
                          variant={isCurrent ? "outline" : isPopular || isEnterprise ? "default" : "default"}
                          disabled={isCurrent || isCreating} // Only disable for ACTIVE current plans
                          onClick={() => handlePlanSelection(plan)}
                        >
                          {isCurrent ? (
                            "Current Plan"
                          ) : isCreating ? (
                            "Processing..."
                          ) : isEnterprise ? (
                            <>
                              Contact Sales
                              <Mail className="ml-2 h-4 w-4" />
                            </>
                          ) : (
                            <>
                              {!currentSubscription 
                                ? "Start Free Trial" 
                                : isExpiredSubscription() 
                                  ? "Renew Now" 
                                  : "Upgrade Plan"
                              } 
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
                {isLoadingHistory || isFetchingHistory ? (
                  // Loading state
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading billing history...</p>
                  </div>
                ) : histories && histories?.length > 0 ? (
                  // Data available state
                  <div className="space-y-4">
                    {histories.map((subscription) => (
                      <div
                        key={subscription?.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${
                            subscription.status === 'successful' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{subscription?.plan?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Reference: {subscription?.reference}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(subscription?.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {(formatNaira(Math.abs(subscription?.plan?.price)))}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            subscription.status === 'successful'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Empty state
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No billing history available
                    </p>
                    <Button variant="outline" className="mt-4">
                      View All Invoices
                    </Button>
                  </div>
                )}
              </CardContent>

              {!isLoadingHistory && histories.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            currentPage > 1 && handlePageChange(currentPage - 1)
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
    
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => handlePageChange(i + 1)}
                            isActive={currentPage === i + 1}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
    
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            currentPage < totalPages &&
                            handlePageChange(currentPage + 1)
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && <PaymentModal />}

      {/* Wallet Details Modal */}
      {showWalletDetails && <WalletDetailsModal />}

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