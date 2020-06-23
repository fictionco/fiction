import { Request, Response, NextFunction } from "express"

export interface RendererComponents {
  bundle: string
  template: string
  clientManifest: Record<string, any>
}

declare module "fs" {
  export function join(): any
}

export interface MiddlewareHandler {
  (request: Request, response: Response, next: NextFunction): void
}

export interface MiddlewarePathConfig {
  path: string
  middleware: MiddlewareHandler[]
}
