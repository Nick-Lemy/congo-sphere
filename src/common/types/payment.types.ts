export enum PaymentProvider {
  MTN = 'MTN_MOMO_COG',
  AIRTEL = 'AIRTEL_COG',
}

export enum DepositFailureCode {
  ACCEPTED,
  DUPLICATE_IGNORED,
  PROVIDER_TEMPORARILY_UNAVAILABLE,
  INVALID_PHONE_NUMBER,
  INVALID_CURRENCY,
  INVALID_AMOUNT,
  AMOUNT_OUT_OF_BOUNDS,
}

export enum InitiateDepositStatus {
  ACCEPTED,
  REJECTED,
  DUPLICATE_IGNORED,
}

export enum CheckDepositStatus {
  COMPLETED,
  ACCEPTED,
  PROCESSING,
  IN_RECONCILIATION,
  FAILED,
  NOT_FOUND,
}

export interface FailureReason {
  failureCode: DepositFailureCode;
  failureMessage: string;
}
