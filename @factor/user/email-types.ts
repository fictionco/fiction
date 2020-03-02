import { CurrentUserState } from "./types"

export interface VerifyAndResetPassword {
  _id: string;
  code: string;
  password: string;
  [key: string]: string;
}

export interface VerifyEmail {
  _id: string;
  code: string;
}

export interface SendVerifyEmail {
  _id: string;
  email: string;
  code?: string;
}

export enum EmailResult {
  success,
  failure
}

export interface VerificationResult {
  user: CurrentUserState;
  result: EmailResult;
}
