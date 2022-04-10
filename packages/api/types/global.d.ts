import { PrivateUser } from "./user"
import { Request } from "express"
// https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul
export {}

declare module "express" {
  export interface Request {
    bearer?: Partial<PrivateUser> & { userId: string }
    bearerToken?: string
  }
}

declare module "http" {
  export interface IncomingMessage {
    rawBody: Buffer | string
    bearer?: Partial<PrivateUser> & { userId: string }
    bearerToken?: string
  }
}
