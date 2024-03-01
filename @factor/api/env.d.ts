/// <reference types="vite/client" />

import type { Buffer } from 'node:buffer'
import type { User } from './plugin-user/types'

declare module 'express' {
  export interface Request {
    bearer?: User
    bearerToken?: string
    clientId?: string
    channels?: string[]
  }
}

declare module 'http' {
  export interface IncomingMessage {
    rawBody: Buffer | string
    bearer?: User
    bearerToken?: string
    clientId?: string
    channels?: string[]
  }
}

declare module 'figures'
declare module 'prettyoutput'
