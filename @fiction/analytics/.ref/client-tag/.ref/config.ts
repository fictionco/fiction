import type { ClientConfig, TrackingResponseData } from '@kaption/types'
import {
  createObjectId,
  getAppBuildVersion,
  getExperimentDataTag,
  getLocal,
  getProjectIdFromTracker,
  getTrackingMode,
  getTrackingStage,
  isReturningSession,
  onServerNotify,
  setLocal,
} from '@kaption/browser-utils'
import { logger } from '@factor/api/logger'

const CONFIG_KEY = '__kConfig'
const CONFIG_ACTIVE_KEY = '__kConfigActive'

/**
 * Creates a hash if standard tracking
 * otherwise an empty clientId will get one assigned on server
 */
function getNewClientId(): string {
  const mode = getTrackingMode()
  if (mode === 'basic')
    return ''
  else
    return createObjectId()
}
/**
 * Get configuration that is returned from server
 */
export function getActiveConfig(): Partial<TrackingResponseData> {
  return (
    getLocal<Partial<TrackingResponseData>>({
      key: CONFIG_ACTIVE_KEY,
    }) ?? {}
  )
}

export async function createConfig(): Promise<string> {
  const savedConfig = getLocal<Partial<ClientConfig>>({ key: CONFIG_KEY }) ?? {}

  const clientId = savedConfig.clientId
    ? savedConfig.clientId
    : getNewClientId()

  const experiments = await getExperimentDataTag()
  const config: ClientConfig = {
    clientId,
    projectId: getProjectIdFromTracker(),
    experiments,
    width: window.innerWidth,
    height: window.innerHeight,
    referrer: document.referrer.slice(0, 500),
    url: location.href.slice(0, 500),
    language: navigator.language.toLowerCase(),
    stage: getTrackingStage(),
    v: getAppBuildVersion(),
    returning: isReturningSession(),
  }

  const configToSave = JSON.stringify(config)

  window.__kaptionConfig = configToSave

  logger.log({
    level: 'info',
    description: `config set (${configToSave.length} chars)`,
    data: config,
  })

  setLocal<ClientConfig>({
    key: CONFIG_KEY,
    value: config,
    scope: 'tracking',
    type: 'persistent',
  })

  return configToSave
}

export function savedConfig(): string | undefined {
  if (window.__kaptionConfig)
    return window.__kaptionConfig
  else
    getLocal({ key: CONFIG_KEY, raw: true })
}

export async function getRawConfig(): Promise<string> {
  return savedConfig() ?? (await createConfig())
}

export async function getConfig(): Promise<ClientConfig> {
  const raw = await getRawConfig()
  return JSON.parse(raw) as ClientConfig
}

export function getConfigSync(): ClientConfig | undefined {
  const saved = savedConfig()
  return saved ? (JSON.parse(saved) as ClientConfig) : undefined
}
/**
 * Gets a unique client ID associated with this user client
 * Creates and stores if it doesn't exist
 */
export async function initializeConfig(): Promise<void> {
  createConfig().catch(error =>
    logger.log({
      level: 'error',
      description: 'initialize config',
      data: error,
    }),
  )

  onServerNotify('beginConnection', ({ data }): void => {
    setLocal({
      key: CONFIG_ACTIVE_KEY,
      value: data,
      scope: 'tracking',
      type: 'session',
    })
  })
}
