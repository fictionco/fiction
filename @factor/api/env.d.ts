/// <reference types="vite/client" />

import { BearerUser } from "./plugin-user/types"
import { Request } from "express"

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

declare module "figures"
declare module "prettyoutput"
