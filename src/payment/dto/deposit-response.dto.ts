import { DepositStatus, FailureReason } from '../../common/types/payment.types';

export type DepositResponseDto =
  | AcceptedDepositResponseDto
  | RejectedDepositResponseDto;

export class AcceptedDepositResponseDto {
  depositId!: string;
  status!: DepositStatus.ACCEPTED;
  created!: string;
}

export class RejectedDepositResponseDto {
  depositId!: string;
  status!: DepositStatus.REJECTED;
  failureReason!: FailureReason;
}
