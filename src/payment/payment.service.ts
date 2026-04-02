import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaymentProvider } from '../common/types/payment.types';

@Injectable()
export class PaymentService {
  private PAWAPAY_URL = process.env.PAWAPAY_URL;
  private API_TOKEN = process.env.PAWAPAY_API_TOKEN;
  private PAYER_TYPE = 'MMO';
  private CURRENCY = 'XAF';

  async initiateDeposit(
    ticketTypeId: string,
    amount: string,
    phoneNumber: string,
    userId: string,
  ) {
    const paymentProvider = this.predictProvider(phoneNumber);
    try {
      const response = await fetch(`${this.PAWAPAY_URL}/deposits`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          depositId: '2ed74e66-4635-4f25-9d8a-776cd041e336',
          payer: {
            type: this.PAYER_TYPE,
            accountDetails: {
              phoneNumber: phoneNumber,
              provider: paymentProvider,
            },
          },
          amount,
          currency: this.CURRENCY,
          clientReferenceId: `INV-${userId.toUpperCase()}`,
          customerMessage: 'Payment for the event - Congo Sphere',
          metadata: [
            { orderId: `ORD-${ticketTypeId}` },
            { customerId: 'customer@email.com', isPII: true },
          ],
        }),
      });
      return response;
    } catch (error) {
      console.warn('Error while initiating deposit', error);
      throw new InternalServerErrorException('Deposit failed');
    }
  }

  predictProvider(phoneNumber: string): PaymentProvider {
    return phoneNumber.substring(0, 5).endsWith('06')
      ? PaymentProvider.MTN
      : PaymentProvider.AIRTEL;
  }
}
