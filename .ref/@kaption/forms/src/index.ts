import path from 'node:path'
import {
  AppRoute,
  FactorApp,
  FactorAws,
  FactorDb,
  FactorEnv,
  FactorMedia,
  FactorRouter,
  FactorServer,
  safeDirname,
} from '@factor/api'
import { FactorDevRestart } from '@factor/api/plugin-env/restart'
import { FactorUi } from '@factor/ui'
import { KaptionFormLoader } from '@kaption/core/plugin-forms/loader'
import { KaptionCache } from '@kaption/core'
import type { CompiledServiceConfig } from '../.factor/config'

import { version } from '../package.json'
import { commands } from './vars'
import App from './App.vue'

const cwd = safeDirname(import.meta.url, '..')
const repoCwd = safeDirname(import.meta.url, '../../..')

export const factorEnv = new FactorEnv<CompiledServiceConfig>({
  envFiles: [path.join(repoCwd, './.env')],
  envFilesProd: [path.join(repoCwd, './.env.prod')],
  cwd,
  mainFilePath: path.join(cwd, './src/index.ts'),
  commands,
  appName: 'Kaption Forms',
  appEmail: 'hello@kaption.co',
  id: 'forms',
  version,
})

const factorRouter = new FactorRouter<CompiledServiceConfig>({
  factorEnv,
  routes: [
    new AppRoute({
      name: 'form',
      path: '/:formId?',
      component: () => import('./FormEntry.vue'),
    }),
  ],
})

const factorDb = new FactorDb({
  connectionUrl: factorEnv.var('POSTGRES_URL'),
  factorEnv,
})

const factorServer = new FactorServer({
  serverName: 'kaptionEndpointServer',
  port: +factorEnv.var('SERVER_PORT', { fallback: 8888 }),
  liveUrl: 'https://server.kaption.co',
  isLive: factorEnv.isProd,
  factorEnv,
})

export const factorApp = new FactorApp({
  factorEnv,
  factorServer,
  factorRouter,
  port: +factorEnv.var('FORMS_PORT', { fallback: 12_321 }),
  liveUrl: 'https://forms.kaption.co',
  isLive: factorEnv.isProd,
  srcFolder: path.join(cwd, './src'),
  rootComponent: App,
  uiPaths: [path.join(cwd, './src/**/*.vue'), path.join(cwd, './src/*.vue')],
})

const kaptionCache = new KaptionCache({
  factorEnv,
  apiServer: factorServer,
  redisConnectionUrl: factorEnv.var('REDIS_URL'),
  factorDb,
})

const factorUi = new FactorUi({ factorEnv, factorApp })

const factorAws = new FactorAws({
  factorEnv,
  awsAccessKey: factorEnv.var('AWS_ACCESS_KEY'),
  awsAccessKeySecret: factorEnv.var('AWS_ACCESS_KEY_SECRET'),
})

const factorMedia = new FactorMedia({
  factorEnv,
  factorAws,
  factorDb,
  factorServer,
  bucket: 'kaption-media',
  unsplashAccessKey: '',
  cdnUrl: 'https://media.kaption.co',
})

const kaptionFormLoader = new KaptionFormLoader({
  factorEnv,
  factorServer,
  factorDb,
  kaptionCache,
  factorRouter,
  factorApp,
  factorMedia,
})

export const service = {
  factorEnv,
  factorServer,
  factorRouter,
  factorUi,
  kaptionCache,
  kaptionFormLoader,
  factorMedia,
}

async function initializeBackingServices() {
  factorEnv.log.info('backing services [connecting]')

  const s = [
    { name: 'factorDb', service: factorDb },
    { name: 'kaptionCache', service: kaptionCache },
  ]

  for (const backing of s) {
    factorEnv.log.info(`initializing ${backing.name}`)
    await backing.service.init()
  }

  factorEnv.log.info('backing services [initialized]')
}

factorEnv.addHook({
  hook: 'runCommand',
  callback: async (command: string, opts) => {
    command = command as CompiledServiceConfig['commands']

    if (command.startsWith('r-')) {
      const realCommand = command.split('-').pop()
      if (!realCommand)
        throw new Error('No command for restart')
      await new FactorDevRestart({ factorEnv }).restartInitializer({
        command: realCommand,
        config: {
          watch: [safeDirname(import.meta.url, '../..')],
        },
      })
    }
    else if (command === 'build' || command === 'render') {
      const { serve } = opts

      await factorApp.buildApp({ serve, render: true })
    }
    else {
      await initializeBackingServices()
      if (command === 'dev') {
        await Promise.all([factorServer.createServer()])

        await factorApp.serveDevApp()
      }
      else if (command === 'forms') {
        await factorApp.serveStaticApp()
      }
    }
  },
})

export type ServiceContainer = typeof service

export function setup() {
  return { service }
}
