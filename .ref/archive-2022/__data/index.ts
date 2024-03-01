import path from 'node:path'
import type {
  CliOptions,
} from '@factor/api'
import {
  FactorAws,
  FactorDb,
  FactorEmail,
  FactorEnv,
  FactorServer,
  FactorUser,
  isDev,
  safeDirname,
} from '@factor/api'
import {
  KaptionAnalytics,
  KaptionCache,
  KaptionClickHouse,
} from '@kaption/core'
import { KaptionBeacon } from '@kaption/core/plugin-beacon'
import { KaptionTag } from '@kaption/core/plugin-tag'
import { KaptionReplayServer } from '@kaption/core/plugin-replays/replayServer'
import { FactorDevRestart } from '@factor/api/plugin-env/restart'
import { commands } from './vars'

const cwd = safeDirname(import.meta.url)
const repoCwd = safeDirname(import.meta.url, '../..')
const appName = 'Kaption API'
const appEmail = 'hello@kaption.co'

export const factorEnv = new FactorEnv({
  envFiles: [path.join(repoCwd, './.env')],
  envFilesProd: [path.join(repoCwd, './.env.prod')],
  cwd,
  appName,
  appEmail,
  commands,
})

const factorDb = new FactorDb({
  connectionUrl: factorEnv.var('POSTGRES_URL'),
  factorEnv,
})

const factorEmail = new FactorEmail({
  factorEnv,
  smtpHost: factorEnv.var('SMTP_HOST'),
  smtpPassword: factorEnv.var('SMTP_PASSWORD'),
  smtpUser: factorEnv.var('SMTP_USER'),
  appUrl: 'https://app.kaption.co',
})

const factorUser = new FactorUser({
  factorDb,
  tokenSecret: factorEnv.var('TOKEN_SECRET'),
})

const apiServer = new FactorServer({
  serverName: 'kaptionApiServer',
  port: 3333,
})

const kaptionClickHouse = new KaptionClickHouse({
  apiServer,
  connectionUrl: factorEnv.var('CLICKHOUSE_URL'),
})

const factorAws = new FactorAws({
  awsAccessKey: factorEnv.var('AWS_ACCESS_KEY'),
  awsAccessKeySecret: factorEnv.var('AWS_ACCESS_KEY_SECRET'),
})

const kaptionCache = new KaptionCache({
  apiServer,
  factorAws,
  factorDb,
  factorUser,
  redisConnectionUrl: factorEnv.var('REDIS_URL'),
})

const kaptionBeacon = new KaptionBeacon({
  factorEnv,
  factorDb,
  kaptionCache,
  factorAws,
  kaptionClickHouse,
  beaconPort: 2121,
  beaconUrlLive: 'https://events.kaption.net',
  sessionPort: 3232,
  sessionUrlLive: 'https://session.kaption.net',
  sessionExpireAfterMs: isDev() ? 20_000 : 60 * 30 * 1000,
  checkExpiredIntervalMs: isDev() ? 1000 : 5000,
  bufferIntervalMs: isDev() ? 300 : 1000,
})

const kaptionTag = new KaptionTag({
  scriptPort: 2222,
  testAppPort: 1111,
  mode: 'development',
  factorDb,
  kaptionBeacon,
  kaptionCache,
  testHeadless: true,
})

const kaptionReplayServer = new KaptionReplayServer({
  sessionBucket: isDev() ? 'factor-testing' : 'kaption-session',
  replayPort: +(factorEnv.var('REPLAY_PORT') || 7827),
  kaptionTag,
  kaptionBeacon,
  kaptionCache,
  factorAws,
})

const kaptionAnalytics = new KaptionAnalytics({
  factorAws,
  factorDb,
  factorUser,
  kaptionCache,
  kaptionClickHouse,
  factorServer: apiServer,
  factorEmail,
})

factorEnv.addHook({
  hook: 'runCommand',
  callback: async (command: string, _opts: CliOptions) => {
    if (command === 'rdev') {
      await new FactorDevRestart().restartInitializer({
        command: 'dev',
        config: {
          watch: [safeDirname(import.meta.url, '..')],
        },
      })
    }
    else if (command === 'dev') {
      await Promise.all([
        kaptionTag.dev(['example']),
        kaptionReplayServer.createServer(),
      ])
      kaptionTag.generateTraffic().catch(console.error)
    }
    else if (command === 'beacon') {
      await kaptionBeacon.createBeaconServer()
    }
    else if (command === 'session') {
      await kaptionBeacon.runSessionManager()
    }
    else if (command === 'tag') {
      await kaptionTag.tagStaticServer()
    }
    else if (command === 'traffic') {
      await kaptionTag.generateTraffic()
    }
  },
})

export const service = {
  factorEnv,
  factorDb,
  factorUser,
  factorAws,
  apiServer,
  kaptionClickHouse,
  kaptionCache,
  kaptionBeacon,
  kaptionTag,
  kaptionAnalytics,
}

export type ServiceContainer = typeof service

export function setup() {
  return { service }
}
