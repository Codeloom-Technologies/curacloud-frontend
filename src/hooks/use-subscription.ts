import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { PaymentService } from '@/services/payment';
import { cancelSubscription, createSubscription, updateSubscription } from '@/services/subscription';
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
        variant: "default",
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
        variant: "default",
      });
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-subscription'] });
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled.",
        variant: "default",
      });
    },
  });

  const handleUpgrade = async (planId: string, planPrice: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade your subscription.",
        variant: "destructive",
      });
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
        // async (response: any) => {
        //   // Payment successful
        //   await createSubscriptionMutation.mutateAsync({
        //     planId,
        //     paymentReference: response.reference,
        //     autoRenew: true,
        //   });
        // },
        // () => {
        //   // Payment closed
        //   toast({
        //     title: "Payment Cancelled",
        //     description: "Payment was cancelled by user.",
        //     variant: "default",
        //   });
        // }
      );
    } catch (error) {
        console.log({error})
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

  const handleCancel = async (subscriptionId: string) => {
    await cancelSubscriptionMutation.mutateAsync(subscriptionId);
  };

  return {
    handleUpgrade,
    handleAutoRenew,
    handleCancel,
    isCreating: createSubscriptionMutation.isPending,
    isUpdating: updateSubscriptionMutation.isPending,
    isCancelling: cancelSubscriptionMutation.isPending,
  };
};