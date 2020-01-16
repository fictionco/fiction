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
}

export enum EmailResult {
  success,
  failure
}
