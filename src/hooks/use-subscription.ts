import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { PaymentService } from '@/services/payment';
import { cancelSubscription, createSubscription, reactivateSubscription, updateSubscription } from '@/services/subscription';
import { useAuthStore } from '@/store/authStore';

export const useSubscription = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const createSubscriptionMutation = useMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-subscription'] });
      toast({
        title: "Subscription Created",
        description: "Your subscription has been activated successfully.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to create subscription.",
        variant: "destructive",
      });
    },
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: ({ subscriptionId, data }: { subscriptionId: string; data: any }) =>
      updateSubscription(subscriptionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-subscription'] });
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been updated successfully.",
        variant: "success",
      });
    },
  });

  const cancelSubscriptionMutation = useMutation({
mutationFn: (variables: { subscriptionId: string; data: any }) => 
      cancelSubscription(variables.subscriptionId, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-subscription'] });
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled.",
        variant: "success",
      });
    },
  });

    const reactivateSubscriptionMutation = useMutation({
mutationFn: (variables: { subscriptionId: string; }) => 
      reactivateSubscription(variables.subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-subscription'] });
      toast({
        title: "Subscription Reactivated",
        description: "Your subscription has been reactivated.",
        variant: "success",
      });
    },
  });

  const handleUpgrade = async (planId: string, planPrice: number, planName:string, paymentMethod:string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade your subscription.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === 'wallet') {
      return;
    }

    const paymentData = {
      email: user.email,
      amount: planPrice,
      reference: PaymentService.generateReference(),
      planId: planId,
      metadata: {
        plan_name: `Upgrade to ${planId}`,
      }
    };

    try {
      await PaymentService.initializePayment(
        paymentData,
      );
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAutoRenew = async (subscriptionId: string, enabled: boolean) => {
    await updateSubscriptionMutation.mutateAsync({
      subscriptionId,
      data: { autoRenew: enabled }
    });
  };

  const handleCancel = async (subscriptionId: string, data?: { feedback: string; reason: string }) => {
  await cancelSubscriptionMutation.mutateAsync({ subscriptionId, data: data || { feedback: '', reason: '' } });
};
  
  const onReactivate = async (subscriptionId: string) => {
    await reactivateSubscriptionMutation.mutateAsync({ subscriptionId });
};
  
  
  return {
    handleUpgrade,
    handleAutoRenew,
    handleCancel,
    onReactivate,
    isCreating: createSubscriptionMutation.isPending,
    isUpdating: updateSubscriptionMutation.isPending,
    isCancelling: cancelSubscriptionMutation.isPending,
    isReactivating:reactivateSubscriptionMutation.isPending,
  };
};