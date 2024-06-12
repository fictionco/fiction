import { type LogHelper, log } from './plugin-log/index.js'
import type { ErrorConfig } from './utils/error.js'
import { abort } from './utils/error.js'
import type { EndpointResponse } from './types/index.js'
import type { EndpointMeta } from './utils/endpoint.js'

export abstract class Query<T extends object = object> {
  name: string
  settings: T
  stop = abort
  abort = abort
  log: LogHelper
  constructor(settings: T) {
    this.name = this.constructor.name
    this.settings = settings
    this.log = log.contextLogger(this.name)
  }

  allowed(_params: Parameters<this['run']>[0], _meta: Parameters<this['run']>[1]): boolean | Promise<boolean> {
    return true
  }

  /**
   * Base query method
   */
  abstract run(params: unknown, meta?: EndpointMeta,): Promise<EndpointResponse<unknown> | void>

  /**
   * Wrapper to catch errors
   * -- must await the result of run or it wont catch
   */
  async serve(
    params: Parameters<this['run']>[0],
    meta: Parameters<this['run']>[1],
  ): Promise<Awaited<ReturnType<this['run']>>> {
    try {
      const allowed = await this.allowed(params, meta)

      if (!allowed)
        throw this.abort('unauthorized', { code: 'PERMISSION_DENIED' })

      const result = await this.run(params, meta)

      return result as Awaited<ReturnType<this['run']>>
    }
    catch (error: unknown) {
      const e = error as ErrorConfig

      this.log.error(`ServeError: ${e.message}`, { error: e, data: e.data })

      const response = {
        status: 'error',
        httpStatus: e.httpStatus || 200,
        location: e.location,
        message: e.expose ? e.message : '',
        expose: e.expose,
        code: e.code,
        data: e.data,
        context: this.constructor.name,
      }

      return response as Awaited<ReturnType<this['run']>>
    }
  }

  async serveRequest(
    params: Parameters<this['run']>[0],
    meta: Parameters<this['run']>[1],
  ): Promise<Awaited<ReturnType<this['run']>>> {
    return await this.serve(params, meta)
  }
}
