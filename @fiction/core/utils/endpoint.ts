import path from 'node:path'
import type { FormData } from 'formdata-node'
import type express from 'express'
import type { User } from '../plugin-user/types'
import type { EndpointResponse } from '../types'
import type { FictionUser } from '../plugin-user'
import type { FictionRouter } from '../plugin-router'
import type { Query } from '../query'
import type { LogHelper } from '../plugin-log'
import { log } from '../plugin-log'
import type { FictionEnv } from '../plugin-env'
import { axios, vue } from './libraries'
import { waitFor } from './utils'
import { deepMergeAll } from './obj'

type EndpointServerUrl = (() => string | undefined) | string | vue.ComputedRef<string> | undefined

export interface EndpointOptions {
  serverUrl: EndpointServerUrl
  basePath: string
  middleware?: () => express.RequestHandler[]
  fictionEnv: FictionEnv
  fictionUser?: FictionUser
  fictionRouter?: FictionRouter
  unauthorized?: boolean
  useNaked?: boolean
}

type RequestHandler = (req: express.Request, res: express.Response) => Promise<EndpointResponse | void>
export interface EndpointMethodOptions<T extends Query> {
  queryHandler?: T
  requestHandler?: RequestHandler
  key: string
  basePath?: string
  serverUrl: EndpointServerUrl
}

export type EndpointMeta = {
  bearer?: Partial<User> & { iat?: number }
  server?: boolean
  returnAuthority?: string[]
  request?: express.Request
  response?: express.Response
} & RequestMeta

export interface RequestMeta {
  caller?: string
  isTest?: boolean
  expectError?: boolean
  debug?: boolean
  emailMode?: 'send' | 'sendInCI' | 'standard'
}

// https://stackoverflow.com/a/57103940/1858322
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

export type EndpointManageAction =
  | 'create'
  | 'retrieve'
  | 'update'
  | 'delete'
  | 'list'
  | 'cancel'
  | 'restore'
  | 'setDefault'
  | 'attach'
  | 'transfer'

export type EndpointMap<T extends Record<string, Query>> = {
  [P in keyof T]: Endpoint<T[P]>
}

export type EndpointSettings<T extends Query = Query> = EndpointOptions &
  EndpointMethodOptions<T>

export class Endpoint<T extends Query = Query, U extends string = string> {
  readonly serverUrl: EndpointServerUrl
  readonly basePath: string
  readonly key: string
  fictionEnv: FictionEnv
  fictionUser?: FictionUser
  fictionRouter?: FictionRouter
  queryHandler?: T
  requestHandler?: RequestHandler
  middleware: () => express.RequestHandler[]
  useNaked?: boolean
  log: LogHelper
  urlPrefix = '/api'
  constructor(settings: EndpointSettings<T>) {
    const { serverUrl, basePath, queryHandler, requestHandler, key, unauthorized, middleware, useNaked } = settings
    this.basePath = basePath
    this.useNaked = useNaked
    this.serverUrl = serverUrl
    this.key = key as U
    this.log = log.contextLogger(`endpoint(${this.key})`)

    this.queryHandler = queryHandler
    this.requestHandler = requestHandler

    this.middleware = middleware || (() => [])

    this.fictionEnv = settings.fictionEnv
    this.fictionRouter = settings.fictionRouter
    if (!unauthorized && settings.fictionUser)
      this.fictionUser = settings.fictionUser
  }

  public pathname(): string {
    const paths = [this.urlPrefix, this.basePath]

    if (!this.useNaked)
      paths.push(this.key)

    return path.join(...paths)
  }

  get requestUrl(): string {
    return new URL(this.pathname(), this.getBaseUrl()).href
  }

  public async request(
    params: Parameters<T['run']>[0],
    options: {
      axiosRequestConfig?: axios.AxiosRequestConfig
      debug?: boolean
      minTime?: number
      disableNotify?: boolean
      disableUserUpdate?: boolean
    } & RequestMeta = {},
  ): Promise<Awaited<ReturnType<T['run']>>> {
    const { disableNotify, disableUserUpdate, minTime } = options

    const rp = this.http(params as Record<string, any>, options)

    let r: EndpointResponse
    if (minTime) {
      ;[r] = await Promise.all([rp, waitFor(minTime)])
    }
    else { r = await rp }

    if (r.message && !disableNotify && r.expose !== false)
      this.fictionEnv.events.emit('notify', { type: r.status as 'success' | 'error', message: r.message })

    const user = r.user as User | undefined

    if (user && !disableUserUpdate) {
      if (!user.orgs)
        throw new Error('incomplete user returned')

      await this.fictionUser?.updateUser(() => r.user as User, { reason: `request:${this.key}` })
    }

    if (r.token)
      this.fictionUser?.manageUserToken({ _action: 'set', token: r.token as string })

    return r as Awaited<ReturnType<T['run']>>
  }

  public async serveRequest(request: express.Request, response: express.Response): Promise<EndpointResponse | void> {
    if (this.requestHandler) {
      return await this.requestHandler(request, response)
    }
    else if (this.queryHandler) {
      const params = request.body as Record<string, any>
      const { caller, debug, expectError, isTest } = (params.meta || {}) as RequestMeta
      // explicitly define each as this is security basis backend calls
      const meta: EndpointMeta = { bearer: request.bearer, request, response, caller, debug, expectError, isTest }

      return await this.queryHandler.serveRequest(params, meta)
    }
    else {
      return { status: 'error', more: 'no query or request handler' }
    }
  }

  getBaseUrl(): string {
    let baseUrl: string | undefined

    if (vue.isRef(this.serverUrl))
      baseUrl = this.serverUrl.value

    else if (typeof this.serverUrl === 'function')
      baseUrl = this.serverUrl()

    else if (typeof this.serverUrl === 'string')
      baseUrl = this.serverUrl

    if (!baseUrl)
      throw new Error('serverUrl is missing')

    return baseUrl
  }

  get bearerHeader() {
    const bearerToken = this.fictionUser?.manageUserToken({ _action: 'get' })
    return `Bearer ${bearerToken ?? ''}`
  }

  public async http<U>(
    data: Record<string, any> = {},
    options: {
      axiosRequestConfig?: axios.AxiosRequestConfig

    } & RequestMeta = {},
  ): Promise<EndpointResponse<U>> {
    const { debug, axiosRequestConfig } = options
    const url = this.pathname()

    const dataWithMeta = { ...data, meta: options }

    // @ts-expect-error - axios types are wrong at current version
    const headers: axios.AxiosRequestHeaders = { Authorization: this.bearerHeader }
    const fullUrl = `${this.getBaseUrl()}${url}`

    let conf: axios.AxiosRequestConfig = { method: 'POST', headers, baseURL: this.getBaseUrl(), url, data: dataWithMeta, timeout: 120000 }

    if (axiosRequestConfig)
      conf = deepMergeAll([conf, axiosRequestConfig])

    if (debug)
      this.log.info(`request at ${fullUrl}`, { data: options })

    let responseData: EndpointResponse<U>
    try {
      const response = await axios.default.request<EndpointResponse<U>>(conf)
      responseData = response.data
    }
    catch (error: unknown) {
      const e = error as Error
      this.log.error(`HTTP -> ${fullUrl} -> ${e.message}`, { error, data: { fullUrl, ...data } })

      responseData = { status: 'error', error }
    }

    if (debug)
      this.log.debug(`response from ${fullUrl}`, { data: responseData })

    return responseData
  }

  getUserInfo(args?: { userOptional?: boolean }) {
    const { userOptional = false } = args || {}
    if (!this.fictionUser)
      throw new Error(`fictionUser is required for getUserInfo`)

    const { orgId, orgName } = this.fictionUser.activeOrganization.value ?? {}

    const { userId, fullName } = this.fictionUser.activeUser.value ?? {}

    if (!userOptional) {
      if (!orgId)
        this.log.error(`getUserInfo: no active organization ${this.key}`)

      if (!userId)
        this.log.error(`getUserInfo: no active user ${this.key}`)

      if (!orgId || !userId)
        return
    }

    return { orgId, orgName, userId, fullName }
  }

  async upload(args: {
    data: FormData
    progress?: (progress: number) => void
  }): Promise<ReturnType<T['run']> > {
    const { data } = args

    const headers = { Authorization: this.bearerHeader }

    const userInfo = this.getUserInfo()

    const url = this.requestUrl

    if (!userInfo)
      return { status: 'error', context: 'projectReguest: no active organization or user' } as ReturnType<T['run']>

    const { orgId, userId } = userInfo

    data.append('orgId', orgId)
    data.append('userId', userId)

    const resp = await fetch(url, { method: 'POST', body: data, headers })

    const response = await resp.json() as ReturnType<T['run']>

    return response
  }

  /**
   * Browser request with projectId and orgId added automatically
   */
  public projectRequest(
    params: DistributiveOmit<
      Parameters<this['request']>[0],
      'orgId' | 'userId' | 'projectId'
    >,
    opts?: { useRouteParams?: boolean, debug?: boolean, minTime?: number, userOptional?: boolean },
  ): ReturnType<this['request']> {
    const { userOptional, useRouteParams, minTime, debug } = opts || {}

    if (!this.fictionUser)
      throw new Error(`fictionUser is required for projectRequest`)

    let requestParams = params
    if (useRouteParams) {
      const { offset, limit, order, orderBy, userId } = this.fictionRouter?.vars.value || {}

      requestParams = { offset, limit, order, orderBy, userId, ...requestParams }
    }

    const userInfo = this.getUserInfo({ userOptional })

    if (!userOptional && !userInfo)
      return { status: 'error', context: 'projectReguest: no active organization or user' } as ReturnType<this['request']>

    requestParams = { ...userInfo, ...requestParams }

    return this.request(requestParams, { debug, minTime }) as ReturnType<this['request']>
  }
}
