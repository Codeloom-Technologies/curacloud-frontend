import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wallet,
  CreditCard,
  Download,
  Upload,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Plus,
  Eye,
  EyeOff,
  Filter,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { formatNaira } from "@/lib/formatters";
import { getBalance, getStats, getTransactionHistory } from "@/services/wallet";
import { useWallet } from "@/hooks/use-wallet";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import React from "react";


 const WalletManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const { toast } = useToast();
  const { handleTopUp, isPending } = useWallet();

  // Wallet balance query
  const { 
    data: walletBalance, 
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
    isRefetching
  } = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: () => getBalance(),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
      staleTime: 60000, // Consider data fresh for 1 minute
  });
   
   
  const { 
    data: walletStats, 
    isLoading: isLoadingStats,
  } = useQuery({
    queryKey: ["wallet-stats"],
    queryFn: () => getStats(),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    staleTime: 60000,
  });
   
     const {   data: transactionsData = [],
    isLoading: isLoadingTransactions,
     } = useQuery({
       queryKey: ["wallet-transactions", currentPage],
       queryFn: () =>
         getTransactionHistory(currentPage, perPage,),
        refetchInterval: 30000,
    refetchOnWindowFocus: true,
    staleTime: 60000,
     });

   let transactions: any = transactionsData?.transactions
   
  const meta = transactionsData?.meta ?? {};
  const totalPages = meta.lastPage ?? 1;

   // Pagination handler
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

   const handlePayment = async () => {
         
try {
      if (!selectedAmount && !customAmount) {
      toast({
        title: "Amount Required",
        description: "Please select or enter an amount to top up.",
        variant: "destructive",
      });
      return;
    }
     

     
     const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
     
      if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    await handleTopUp(amount, `Wallet top-up of ${formatNaira(amount)}`);
      //   setSelectedAmount(0);
      // setCustomAmount('');
} catch (error) {
   toast({
        title: "Top-up Failed",
        description: "There was an error processing your top-up. Please try again.",
        variant: "destructive",
      });
}
  };

  const quickAmounts = [1000, 5000, 10000, 20000];

  const TopUpModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-md w-full animate-in fade-in-90 zoom-in-90">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Top Up Wallet</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTopUpModal(false)}
            disabled={isPending}
          >
            <span className="sr-only">Close</span>
            <span aria-hidden="true">×</span>
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Amount Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Select Amount</Label>
            
            {/* Quick Amounts */}
            <div className="grid grid-cols-2 gap-3">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  disabled={isPending}
                >
                  {formatNaira(amount)}
                </Button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="custom-amount">Custom Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  ₦
                </span>
                <input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(0);
                  }}
                  className="w-full pl-8 pr-4 py-2 border border-input rounded-md bg-background"
                  disabled={isPending}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowTopUpModal(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handlePayment}
                disabled={isPending || (!selectedAmount && !customAmount)}

            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Initializing...
                </>
              ) : (
                `Top Up ${formatNaira(customAmount ? parseFloat(customAmount) : selectedAmount)}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (isLoadingBalance) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto space-y-8">
              <Skeleton className="h-12 w-64" />
              <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
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
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
               Wallet Management
              </h1>
                <p className="text-muted-foreground">
                  Manage your wallet balance and view transaction history
                </p>
              </div>
              
              <Button onClick={() => setShowTopUpModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Top Up Wallet
              </Button>
            </div>

            {/* Balance Card */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Balance</CardTitle>
                <CardDescription>
                  Your current available balance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Wallet className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-4xl font-bold">
                          {showBalance ? formatNaira(Math.abs(walletBalance?.balance)) : '••••••'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowBalance(!showBalance)}
                        >
                          {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
 Last updated: {format(
    new Date(walletBalance?.updatedAt || Date.now()), 
    "MMM d, yyyy 'at' h:mm a"
  )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowTopUpModal(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Top Up
                    </Button>
                    <Button variant="outline" onClick={() => refetchBalance()}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {
                        isRefetching ? 'Refreshing' :'Refresh'
                      }
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <div className="border-b">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', name: 'Overview', count: null },
                  { id: 'transactions', name: 'Transactions', count: transactions?.total },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    {tab.name}
                    {tab.count !== null && (
                      <Badge variant="secondary" className="ml-2">
                        {tab.count}
                      </Badge>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Credits</span>
                      <span className="font-semibold text-green-600">
                        {
                          isLoadingStats ? <RefreshCw/> :
                          formatNaira(walletStats?.totalCredits)
                        
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Debits</span>
                      <span className="font-semibold text-destructive">
                        {
                          isLoadingStats ? <RefreshCw/> :
                          formatNaira(walletStats?.totalDebits)
                        
                        }
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Transactions This Month</span>
                      <span className="font-semibold">
                        {
                          isLoadingStats ? <RefreshCw/> :
                          (walletStats?.transactionsThisMonth)
                        
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest wallet transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions?.slice(0, 3).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              transaction.type === 'credit' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {transaction.type === 'credit' ? 
                                <ArrowDownLeft className="h-4 w-4" /> : 
                                <ArrowUpRight className="h-4 w-4" />
                              }
                            </div>
                            <div>
                              <p className="font-medium text-sm">{transaction.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(transaction.createdAt, "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                          <span className={`font-semibold ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-destructive'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}{formatNaira(Math.abs(transaction.amount))}
                          </span>
                        </div>
                      ))}
                      
                      {transactions?.length === 0 && (
                        <div className="text-center py-8">
                          <Wallet className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                          <p className="text-muted-foreground">No transactions yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'transactions' && (
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Complete history of all wallet transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Date Range
                        </Button>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>

                    {/* Transactions List */}
                    <div className="border rounded-lg">
                      {isLoadingTransactions ? (
                        <div className="p-8 text-center">
                          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                          <p>Loading transactions...</p>
                        </div>
                      ) : transactions?.length > 0 ? (
                        <div className="divide-y">
                          {transactions?.map((transaction) => (
                            <div key={transaction?.id} className="p-4 hover:bg-muted/50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                  <div className={`p-2 rounded-full ${
                                    transaction?.type === 'credit' 
                                      ? 'bg-green-100 text-green-600' 
                                      : 'bg-red-100 text-red-600'
                                  }`}>
                                    {transaction?.type === 'credit' ? 
                                      <ArrowDownLeft className="h-4 w-4" /> : 
                                      <ArrowUpRight className="h-4 w-4" />
                                    }
                                  </div>
                                  
                                  <div className="flex-1">
                                    <p className="font-medium">{transaction?.description}</p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                      <span>{format(transaction?.createdAt, "MMM d, yyyy 'at' h:mm a")}</span>
                                      <span>Ref: {transaction?.reference}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <p className={`font-semibold ${
                                    transaction?.type === 'credit' ? 'text-green-600' : 'text-destructive'
                                  }`}>
                                    {transaction?.type === 'credit' ? '+' : '-'}{formatNaira(Math.abs(transaction?.amount))}
                                  </p>
                                  <Badge variant="secondary" className="mt-1">
                                    {transaction?.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <Wallet className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">No transactions yet</h3>
                          <p className="text-muted-foreground mb-6">
                            Your transaction history will appear here once you start using your wallet.
                          </p>
                          <Button onClick={() => setShowTopUpModal(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Make Your First Top-up
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>                                  
                </CardContent>
              </Card>
              
            )}
                {/* Pagination */}
                                  {!isLoadingTransactions && (
                                    <div className="mt-4">
                                      <Pagination>
                                        <PaginationContent>
                                          <PaginationItem>
                                            <PaginationPrevious
                                              onClick={() => handlePageChange(currentPage - 1)}
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
                                              onClick={() => handlePageChange(currentPage + 1)}
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
          </div>
        </main>
      </div>

      {/* Top-up Modal */}
      {showTopUpModal && <TopUpModal />}

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

export default React.memo(WalletManagement);