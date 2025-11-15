import { loadScript } from '@/lib/utils';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export interface PaymentData {
  email: string;
  amount: number;
  reference: string;
  planId: string;
  metadata?: any;
}

export class PaymentService {
  private static async loadPaystack(): Promise<void> {
    if (typeof window.PaystackPop !== 'undefined') return;
    
    await loadScript('https://js.paystack.co/v1/inline.js');
  }

  static async initializePayment(
    data: PaymentData,
  ): Promise<void> {
      await this.loadPaystack();
      
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
      console.log({ data })
      
    const handler = window.PaystackPop.setup({
      key: paystackKey,
      email: data.email,
      amount: data.amount * 100, // Convert to kobo
      currency: 'NGN',
      ref: data.reference,
      metadata: {
        custom_fields: [
          {
            display_name: "Plan ID",
            variable_name: "plan_id",
            value: data.planId
          },
          ...(data.metadata?.custom_fields || [])
        ]
      },
    //   callback: onSuccess,
    //   onClose: onClose,
    });

    handler.openIframe();
  }

  static generateReference(): string {
    return `PSK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}