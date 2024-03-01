import deepMerge from 'deepmerge'
import type { ServiceConfig, TrackerConfig } from '../plugin-admin/types'
import { getTrackingScriptUrl } from './utils'

export function serviceConfig(options: {
  stage?: 'local' | 'prod' | 'pre'
  NODE_ENV?: 'development' | 'production'
} = {}): ServiceConfig {
  const { NODE_ENV = process.env.NODE_ENV as 'development' | 'production' }
    = options

  const defaultConfig = {
    sessionBufferSeconds: 5,
    eventBufferSeconds: 5,
  }
  const serviceConfig
    = NODE_ENV === 'development'
      ? {
          sessionSeconds: 10,
          sessionBufferItemLimit: 5,
          eventBufferItemLimit: 5,
          replayMinSeconds: 5,
        }
      : {
          sessionSeconds: 60 * 30,
          sessionBufferItemLimit: 500,
          eventBufferItemLimit: 1000,
          replayMinSeconds: 15,
        }

  return deepMerge.all<ServiceConfig>([defaultConfig, serviceConfig])
}

export function trackerConfig(options: { stage?: 'local' | 'prod' | 'pre' } = {}): TrackerConfig {
  const { stage = 'local' } = options

  const urlTrackerScript: string = getTrackingScriptUrl(stage, stage)

  const scriptTag = `<script type="module" src="${urlTrackerScript}"></script>`

  return { projectId: stage, urlTrackerScript, scriptTag }
}
