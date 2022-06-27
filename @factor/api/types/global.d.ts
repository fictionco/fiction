import { BearerUser } from "../plugin-user/types"
import { Request } from "express"
// https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul
export {}

declare module "express" {
  export interface Request {
    bearer?: BearerUser
    bearerToken?: string
  }
}

declare module "http" {
  export interface IncomingMessage {
    rawBody: Buffer | string
    bearer?: BearerUser
    bearerToken?: string
  }
}
