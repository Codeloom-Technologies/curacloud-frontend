import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { PaymentService } from '@/services/payment';
import { useAuthStore } from '@/store/authStore';

export const useWallet = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const topUpMutation = useMutation({
    mutationFn: async ({ amount, description = 'Wallet top-up' }: { amount: number; description?: string }) => {
      if (!user) {
        throw new Error('Please log in to top up your wallet');
      }

          const paymentData:any = {
        email: user.email,
        amount,
        reference: `wallet_topup_${Date.now()}`,
        metadata: { description }
      };

      return await PaymentService.initializePayment(paymentData);
    },
    onSuccess: () => {
      toast({
        title: "Payment Started",
        description: "Redirecting to payment gateway...",
        variant: "default",
      });
      
      // Refresh wallet balance after successful payment
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
    }
  });

  const handleTopUp = (amount: number, description?: string) => {
    topUpMutation.mutate({ amount, description });
  };

  return {
    handleTopUp,
    isPending: topUpMutation.isPending,
    isSuccess: topUpMutation.isSuccess,
    isError: topUpMutation.isError,
    error: topUpMutation.error,
  };
};