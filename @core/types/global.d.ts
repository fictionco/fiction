import { PrivateUser } from "./user"
import { Request } from "express"
// https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul
export {}
declare global {
  interface Window {
    __factor?: { endpointUrl?: string; api?: string; [key: string]: any }
  }

  namespace NodeJS {
    interface Global {
      __factor?: { endpointUrl?: string; [key: string]: any }
    }
  }
}

declare module "express" {
  export interface Request {
    bearer?: PrivateUser
    bearerToken?: string
  }
}

declare module "http" {
  export interface IncomingMessage {
    rawBody: Buffer | string
  }
}
