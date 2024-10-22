import type { EndpointResponse } from './types/index.js'
import type { EndpointMeta } from './utils/endpoint.js'
import type { ErrorConfig } from './utils/error.js'
import type { vue } from './utils/libraries.js'
import { log, type LogHelper } from './plugin-log/index.js'
import { abort } from './utils/error.js'

export type QueryConfig = {
  key?: string
  [key: string]: any
}

export abstract class Query<T extends QueryConfig = QueryConfig> {
  name: string
  settings: T
  log: LogHelper
  key?: string
  getParams?: () => Promise<Record<string, any>> | Record<string, any>
  dataRef?: vue.Ref<Record<string, any>>
  dataKeys?: readonly string[]
  constructor(settings: T) {
    this.name = this.constructor.name
    this.settings = settings
    this.log = log.contextLogger(this.name)
    this.key = settings.key || this.name
    this.getParams = settings.getParams
    this.dataRef = settings.dataRef
    this.dataKeys = settings.dataKeys
  }

  permission(_params: Parameters<this['run']>[0], _meta: Parameters<this['run']>[1]): EndpointResponse<boolean> | Promise<EndpointResponse<boolean>> {
    if (_meta?.server) {
      return { status: 'success', reason: 'server request' }
    }

    const bearer = _meta?.bearer

    const { orgId } = _params as Record<string, any>

    if (orgId && !bearer?.orgs?.find(org => org.orgId === orgId)) {
      return { status: 'error', reason: `user ${bearer?.userId} not a member of org with id: ${orgId}` }
    }

    return { status: 'success', reason: 'allowed' }
  }

  /**
   * Base query method
   */
  abstract run(params: unknown, meta?: EndpointMeta,): Promise<EndpointResponse<unknown> | void>

  /**
   * Wrapper to catch errors
   * -- must await the result of run or it wont catch
   */
  async serve(params: Parameters<this['run']>[0], meta: Parameters<this['run']>[1]): Promise<Awaited<ReturnType<this['run']>>> {
    try {
      const permissionResult = await this.permission(params, meta)

      if (permissionResult.status !== 'success')
        throw abort('unauthorized', { code: 'PERMISSION_DENIED', message: 'Permission denied', reason: permissionResult.reason || 'Unknown' })

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
    return this.serve(params, meta)
  }
}
