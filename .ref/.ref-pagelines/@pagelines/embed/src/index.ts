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
import { FactorCache } from '@factor/api/plugin-cache'
import { FactorDevRestart } from '@factor/api/plugin-env/restart'
import { FactorUi } from '@factor/ui'
import { PageLinesAgent } from '@pagelines/core/plugin-agent'
import AgentEntry from '@pagelines/core/plugin-agent/AgentEntry.vue'
import { PageLinesData } from '@pagelines/core/plugin-data'
import { pageLinesCoreRoot } from '@pagelines/core/util'
import type { CompiledServiceConfig } from '../.factor/config'
import { version } from '../package.json'
import { commands } from './vars'
import App from './App.vue'
import PageHome from './PageHome.vue'

const cwd = safeDirname(import.meta.url, '..')

const baseUrl = 'https://embed.pagelines.com'

export const factorEnv = new FactorEnv<CompiledServiceConfig>({
  envFiles: [path.join(pageLinesCoreRoot, './.env')],
  envFilesProd: [path.join(pageLinesCoreRoot, './.env.prod')],
  cwd,
  mainFilePath: path.join(cwd, './src/index.ts'),
  commands,
  appName: 'PageLines Agent Embed',
  appEmail: 'hello@pagelines.com',
  id: 'agent',
  version,
})

const factorRouter = new FactorRouter<CompiledServiceConfig>({
  factorEnv,
  baseUrl,
  routes: [
    new AppRoute({
      name: 'embedAgent',
      path: '/agent/:agentId?',
      component: AgentEntry,
    }),
    new AppRoute({
      name: 'home',
      path: '/',
      component: PageHome,
    }),
    new AppRoute({
      name: 'notFound404',
      path: '/:pathMatch(.*)*',
      component: PageHome,
      priority: 1000,
    }),
  ],
})

const factorDb = new FactorDb({
  connectionUrl: factorEnv.var('POSTGRES_URL'),
  factorEnv,
})

const factorServer = new FactorServer({
  serverName: 'pageLinesEndpointServer',
  port: +factorEnv.var('SERVER_PORT', { fallback: 9292 }),
  liveUrl: 'https://server.pagelines.com',
  isLive: factorEnv.isProd,
  factorEnv,
})

export const factorApp = new FactorApp({
  factorEnv,
  factorServer,
  factorRouter,
  port: +factorEnv.var('APP_PORT', { fallback: 12_321 }),
  liveUrl: 'https://embed.pagelines.com',
  isLive: factorEnv.isProd,
  srcFolder: path.join(cwd, './src'),
  rootComponent: App,
  uiPaths: [path.join(cwd, './src/**/*.vue'), path.join(cwd, './src/*.vue')],
})

const factorCache = new FactorCache({
  factorEnv,
  factorServer,
  redisConnectionUrl: factorEnv.var('REDIS_URL'),
  factorDb,
})

const factorUi = new FactorUi({ factorEnv, factorApp, factorRouter })

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
  bucket: 'factor-media',
  unsplashAccessKey: '',
  cdnUrl: 'https://media.pagelines.com',
})

const pluginServices = {
  factorEnv,
  factorApp,
  factorServer,
  factorDb,
  factorRouter,
  factorCache,
}

const pageLinesData = new PageLinesData({
  ...pluginServices,
  openAIApiKey: factorEnv.var('OPENAI_API_KEY'),
  pineconeApiKey: factorEnv.var('PINECONE_API_KEY'),
  pineconeEnvironment: factorEnv.var('PINECONE_ENVIRONMENT'),
  pineconeIndex: factorEnv.var('PINECONE_INDEX'),
})

const pageLinesAgent = new PageLinesAgent({
  ...pluginServices,
  pageLinesData,
  liveBaseUrl: baseUrl,
})

export const service = {
  factorEnv,
  factorServer,
  factorRouter,
  factorUi,
  factorCache,
  pageLinesAgent,
  pageLinesData,
  factorMedia,
}

async function initializeBackingServices() {
  factorEnv.log.info('backing services [connecting]')

  const s = [
    { name: 'factorDb', service: factorDb },
    { name: 'factorCache', service: factorCache },
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

        await factorApp.ssrServerCreate()
      }
      else if (command === 'app') {
        await factorApp.serveStaticApp()
      }
    }
  },
})

export type ServiceContainer = typeof service

export function setup() {
  return { service }
}
