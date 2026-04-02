import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaymentProvider } from '../common/types/payment.types';
import { DepositResponseDto } from './dto/deposit-response.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class PaymentService {
  private readonly PAWAPAY_URL = process.env.PAWAPAY_URL;
  private readonly API_TOKEN = process.env.PAWAPAY_API_TOKEN;
  private readonly PAYER_TYPE = 'MMO';
  private readonly CURRENCY = 'XAF';
  private readonly ticketPaymentMessaage =
    'Procedez au paiement de votre ticket pour Congo Sphere';

  private async initiateDeposit(
    clientReferenceId: string,
    amount: string,
    phoneNumber: string,
    customerMessage: string,
  ) {
    const paymentProvider = this.predictProvider(phoneNumber);
    const depositId = randomUUID();
    try {
      const response = await fetch(`${this.PAWAPAY_URL}/deposits`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          depositId,
          payer: {
            type: this.PAYER_TYPE,
            accountDetails: {
              phoneNumber: phoneNumber,
              provider: paymentProvider,
            },
          },
          amount,
          currency: this.CURRENCY,
          clientReferenceId: `${clientReferenceId}`,
          customerMessage,
        }),
      });
      const data = (await response.json()) as DepositResponseDto;
      return data;
    } catch (error) {
      console.warn('Error while initiating deposit', error);
      throw new InternalServerErrorException('Deposit failed');
    }
  }

  private predictProvider(phoneNumber: string): PaymentProvider {
    return phoneNumber.substring(0, 5).endsWith('06')
      ? PaymentProvider.MTN
      : PaymentProvider.AIRTEL;
  }

  async processTicketPayment(
    eventUserId: string,
    amount: string,
    phoneNumber: string,
  ) {
    const depositResponse = await this.initiateDeposit(
      eventUserId,
      amount,
      phoneNumber,
      this.ticketPaymentMessaage,
    );
    return depositResponse;
  }
}
