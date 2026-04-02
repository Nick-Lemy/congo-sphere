import { CheckDepositStatus } from '../../common/types/payment.types';

export type CheckDepositStatusResponseDto =
  | FoundCheckDepositStatusResponseDto
  | NotFoundCheckDepositStatusResponseDto;

export interface FoundCheckDepositStatusResponseDto {
  status: 'FOUND';
  data: DataCheckDepositStatus;
}

export interface NotFoundCheckDepositStatusResponseDto {
  status: 'NOT_FOUND';
}

interface DataCheckDepositStatus {
  depositId: string;
  status: CheckDepositStatus;
  amount: string;
  currency: string;
  country: string;
  payer: {
    type: string;
    accountDetails: {
      phoneNUmber: string;
      provider: string;
    };
  };
  customerMessage: string;
  clientReferenceId: string;
  created: string;
  metadata: {
    orderId: string;
    customerId: string;
  };
}
