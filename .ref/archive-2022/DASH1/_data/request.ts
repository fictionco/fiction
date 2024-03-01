import { clientToken, dLog } from '@factor/api'
import type { AnalyticsEndpoint, AnalyticsFetch } from '@kaption/query'
import { syncProjectId } from '@kaption/engine/active/project'
import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'

export interface PlotLine {
  label: string
  data: (string | number)[]
}

export async function fetchAnalyticsServer<T extends keyof AnalyticsEndpoint>(method: T, data?: AnalyticsEndpoint[T]['request'] & { projectId: string }, meta?: { bearerToken?: string }): Promise<AnalyticsEndpoint[T]['response']> {
  const baseURL
    = process.env.FACTOR_API_ENV === 'server'
      ? 'https://api.kaption.net'
      : 'http://localhost:3300'

  const bearerToken = meta?.bearerToken ?? clientToken({ action: 'get' })
  const options: AxiosRequestConfig = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      from: 'dashboard',
    },
    baseURL,
    url: `/analytics/${method}`,
    data,
  }

  dLog('info', 'analytics http request', options)

  let responseData: AnalyticsEndpoint[T]['response']
  try {
    const response = await axios.request(options)
    responseData = response.data
  }
  catch (error: any) {
    dLog('error', `analytics http request error: ${method}`, error)
    responseData = {
      status: 'error',
      message: 'http request error',
      data: error,
    }
  }

  dLog('info', 'analytics http response', responseData)

  return responseData
}

type EndpointProp<
  T extends keyof AnalyticsEndpoint,
  U extends 'endpoint' | 'request' | 'response' | 'method',
> = AnalyticsFetch<T>[U]

export async function requestAnalyticsEndpoint<
  T extends keyof AnalyticsEndpoint,
>(method: EndpointProp<T, 'method'>, data: EndpointProp<T, 'request'>): Promise<EndpointProp<T, 'response'>> {
  const projectId = await syncProjectId()

  if (!projectId)
    throw new Error('Can\'t run operation: projectId is not set')

  const requestData = { projectId, ...data }

  const r = await fetchAnalyticsServer<T>(method, requestData)

  return r
}
