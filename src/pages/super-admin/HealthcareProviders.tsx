import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  Globe,
  Phone,
  Mail,
  Users,
  MapPin,
  Calendar,
  Eye,
  MoreVertical,
  Filter,
  Download,
  Shield,
  Activity,
  Crown,
  Loader2,
  RefreshCw,
  UserCheck,
  CreditCard,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  BarChart3,
  Settings,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activateProviderAccount, assignSubscriptionPlan, fetchHealthcareProviders } from "@/services/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSubscriptionPlans } from "@/services/subscription";

export default function HealthcareProviders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { toast } = useToast();

  // React Query to fetch providers
  const {
    data: providersData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['healthcare-providers', page, perPage, searchQuery, statusFilter],
    queryFn: () => fetchHealthcareProviders({
      page,
      perPage,
      search: searchQuery,
      status: statusFilter,
    }),
  });

  const providers = providersData?.providers || [];
  const pagination = providersData?.meta;

  console.log(providers)
  const queryClient = useQueryClient();

  const handleAddProvider = () => {
    toast({
      title: "Provider Added",
      description: "Healthcare provider has been successfully registered.",
      variant: "success",
    });
    setIsDialogOpen(false);
  };

  const handleViewDetails = (provider: any) => {
    setSelectedProvider(provider);
    setIsDetailsOpen(true);
  };

 // Activate Account Mutation
  const activateAccountMutation = useMutation({
    mutationFn: activateProviderAccount,
    onSuccess: () => {
      toast({
        title: "Account Activated",
        description: "Provider account has been successfully activated.",
        variant: "success",
      });
      
      // Invalidate and refetch providers data
      queryClient.invalidateQueries({ 
        queryKey: ['healthcare-providers'] 
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Activation Failed",
        description: error.message || "Failed to activate provider account.",
        variant: "destructive",
      });
    },
  });

    const handleActivateAccount = async (providerId: string) => {
    activateAccountMutation.mutate(providerId);
  };

 // Assign Plan Mutation
  const assignPlanMutation = useMutation({
    mutationFn: assignSubscriptionPlan,
    onSuccess: () => {
      toast({
        title: "Plan Assigned",
        description: "Subscription plan has been successfully assigned.",
        variant: "success",
      });
      
      // Invalidate and refetch providers data
      queryClient.invalidateQueries({ 
        queryKey: ['healthcare-providers'] 
      });
      setIsDetailsOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Assignment Failed",
        description: error.message || "Failed to assign subscription plan.",
        variant: "destructive",
      });
    },
  });

    const handleAssignPlan = async (providerId: string, planId: string) => {
    assignPlanMutation.mutate({ providerId, planId });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Enterprise plan":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Pro Plan":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Basic Plan":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

    const { 
      data: subscriptionPlans, 
      isLoading: isLoadingPlans,
      error: plansError 
    } = useQuery({
      queryKey: ["subscription-plans"],
      queryFn: () => getSubscriptionPlans(),
    });

  const stats = [
    {
      title: "Total Providers",
      value: pagination?.total?.toString() || "0",
      change: "+12% this quarter",
      icon: Building2,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Active Providers",
      value: providers.filter(p => p.status === "active").length.toString(),
      change: "All systems operational",
      icon: Activity,
      color: "text-green-600 bg-green-100",
    },
    {
      title: "Total Users",
      value: providers.reduce((acc, provider) => acc + provider.users, 0).toString(),
      change: "Across all providers",
      icon: Users,
      color: "text-purple-600 bg-purple-100",
    },
  ];

  // Handle search with debounce (optional)
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page when searching
  };

  // Provider Details Dialog
  const ProviderDetailsDialog = () => (
    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {selectedProvider && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{selectedProvider?.healthcareProvider?.name}</span>
                    <Badge variant={getStatusVariant(selectedProvider?.status)}>
                      {selectedProvider?.status}
                    </Badge>
                  </div>
                  <DialogDescription className="text-base mt-1">
                    {selectedProvider?.address}, {selectedProvider?.country?.name}
                  </DialogDescription>
                </div>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="subscription" className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Subscription
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
                <TabsTrigger value="actions" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Quick Actions
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{selectedProvider?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">{selectedProvider?.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-sm text-muted-foreground">{selectedProvider?.healthcareUsers[0]?.healthcareProvider?.address?.streetAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Country</p>
                          <p className="text-sm text-muted-foreground">{selectedProvider?.country?.name}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Statistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-600" />
                        Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Users</span>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {selectedProvider?.healthcareUsers?.length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Member Since</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(selectedProvider?.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Last Active</span>
                        <span className="text-sm text-muted-foreground">2 hours ago</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Current Subscription */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                      Current Subscription
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedProvider?.healthcareUsers[0]?.healthcareProvider?.subscription ? (
                      <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Crown className="h-8 w-8 text-purple-600" />
                          <div>
                            <p className="font-semibold">
                              {selectedProvider?.healthcareUsers[0]?.healthcareProvider?.subscription?.plan?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Active • Renews {new Date(selectedProvider?.healthcareUsers[0]?.healthcareProvider?.subscription.currentPeriodEndsAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </div>
                    ) : (
                      <div className="text-center py-6 space-y-3">
                        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto" />
                        <div>
                          <p className="font-semibold">No Active Subscription</p>
                          <p className="text-sm text-muted-foreground">
                            This provider doesn't have an active subscription plan.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Subscription Tab */}
              <TabsContent value="subscription" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-purple-600" />
                      Assign Subscription Plan
                    </CardTitle>
                    <CardDescription>
                      Select a subscription plan to assign to this healthcare provider
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {subscriptionPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                            <Crown className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{plan.name}</p>
                            <p className="text-sm text-muted-foreground">{plan.price}/month</p>
                            <div className="flex gap-2 mt-1">
                              {plan.features.slice(0, 2).map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {plan.features.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{plan.features.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAssignPlan(selectedProvider.email, plan.id)}
                          disabled={selectedProvider.healthcareProvider?.subscription?.plan?.name === plan.name}
                        >
                          {selectedProvider.healthcareProvider?.subscription?.plan?.name === plan.name ? (
                            <>Current Plan</>
                          ) : (
                            <>Assign Plan</>
                          )}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="account-status" className="font-semibold">
                          Account Status
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Activate or deactivate this provider's account
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={selectedProvider.status === "active" ? "default" : "secondary"}>
                          {selectedProvider.status}
                        </Badge>
                        <Switch
                          checked={selectedProvider.status === "active"}
                          onCheckedChange={(checked) => 
                            handleActivateAccount(selectedProvider.email)
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-semibold">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send important updates and announcements
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-semibold">API Access</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable API access for integrations
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quick Actions Tab */}
              <TabsContent value="actions" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="h-16 flex-col gap-2" variant="outline">
                    <Send className="h-5 w-5" />
                    Send Welcome Email
                  </Button>
                  <Button className="h-16 flex-col gap-2" variant="outline">
                    <CreditCard className="h-5 w-5" />
                    Generate Invoice
                  </Button>
                  <Button className="h-16 flex-col gap-2" variant="outline">
                    <Settings className="h-5 w-5" />
                    Reset Password
                  </Button>
                  <Button className="h-16 flex-col gap-2" variant="outline">
                    <Users className="h-5 w-5" />
                    Manage Users
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-semibold text-destructive">Delete Provider</Label>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete this provider and all associated data
                        </p>
                      </div>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Providers</h2>
          <p className="text-muted-foreground mb-4">{(error as Error)?.message || "Failed to load healthcare providers"}</p>
          <Button onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Healthcare Providers
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Manage and oversee all healthcare provider organizations
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => refetch()}
                disabled={isRefetching}
              >
                {isRefetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg">
                    <Plus className="h-4 w-4" />
                    Add Provider
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Add Healthcare Provider
                    </DialogTitle>
                    <DialogDescription>
                      Register a new healthcare provider organization to the platform
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    {/* Form content remains the same */}
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="h-11"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddProvider}
                      className="h-11 bg-gradient-to-r from-blue-600 to-cyan-600"
                    >
                      Add Provider
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                      <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                      <p className="text-xs text-green-600 font-medium mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search and Filters */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search providers by name or country..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1); }}>
                    <SelectTrigger className="w-[140px] h-11">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Providers Table */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span>Healthcare Providers</span>
                <div className="flex items-center gap-2">
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Badge variant="secondary">
                    {pagination?.total || 0} providers
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-muted-foreground">Loading providers...</span>
                </div>
              ) : (
                <>
                  <div className="rounded-lg border border-slate-200/60 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow>
                          <TableHead className="font-semibold">Organization</TableHead>
                          <TableHead className="font-semibold">Location</TableHead>
                          <TableHead className="font-semibold">Contact</TableHead>
                          <TableHead className="font-semibold">Users</TableHead>
                          <TableHead className="font-semibold">Plan</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {providers.map((provider) => (
                          <TableRow key={provider.id} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                                  <Building2 className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900">{provider?.healthcareUsers[0]?.healthcareProvider.name}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">{provider?.healthcareUsers[0]?.healthcareProvider?.address?.streetAddress}</p>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-blue-600" />
                                <div>
                                  <p className="font-medium">{provider?.country?.name}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">
                                      Joined {new Date(provider?.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-4 w-4 text-blue-600" />
                                  <span className="font-medium">{provider?.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-4 w-4 text-green-600" />
                                  <span className="font-medium">{provider?.phoneNumber}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-purple-600" />
                                <span className="font-semibold">{provider?.healthcareUsers.length}</span>
                                <span className="text-sm text-muted-foreground">users</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getPlanColor(provider?.healthcareUsers[0]?.healthcareProvider?.subscription?.plan?.name)}>
                                {provider?.healthcareUsers[0]?.healthcareProvider?.subscription?.plan?.name}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusVariant(provider?.status)}
                                className={
                                  provider.status === "active" 
                                    ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" 
                                    : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100"
                                }
                              >
                                {provider?.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleViewDetails(provider)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {providers.length === 0 && (
                    <div className="text-center py-12">
                      <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No providers found</h3>
                      <p className="text-muted-foreground mb-4">
                        No healthcare providers match your search criteria.
                      </p>
                      <Button onClick={() => { setSearchQuery(''); setStatusFilter('all'); setPage(1); }}>
                        Clear filters
                      </Button>
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination && pagination.lastPage > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground">
                        Showing {((pagination.currentPage - 1) * pagination.perPage) + 1} to {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} of {pagination.total} results
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={pagination.currentPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(p => Math.min(pagination.lastPage, p + 1))}
                          disabled={pagination.currentPage === pagination.lastPage}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Provider Details Dialog */}
      <ProviderDetailsDialog />

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