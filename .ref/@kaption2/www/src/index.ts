import path from 'node:path'
import { FactorHighlightCode } from '@factor/plugin-highlight-code'
import { FactorNotify } from '@factor/plugin-notify'
import { FactorUi } from '@factor/ui'
import type {
  CliOptions,
} from '@factor/api'
import {
  FactorApp,
  FactorDb,
  FactorEmail,
  FactorEnv,
  FactorRouter,
  FactorServer,
  FactorUser,
  safeDirname,
} from '@factor/api'
import { FactorBlog } from '@factor/plugin-blog-engine'
import { FactorDocsEngine } from '@factor/plugin-docs-engine'
import { FactorDevRestart } from '@factor/api/plugin-env/restart'
import { KaptionUi } from '@kaption/core/ui'
import type { CompiledServiceConfig } from '../.factor/config'
import { version } from '../package.json'
import { featureList } from './featureMap'
import { trackInteractions } from './util'
import { docs, groups } from './docs/map'
import App from './App.vue'
import routes from './routes'
import { commands } from './vars'

const cwd = safeDirname(import.meta.url, '..')
const repoCwd = safeDirname(import.meta.url, '../../..')

export const factorEnv = new FactorEnv({
  envFiles: [path.join(repoCwd, './.env')],
  envFilesProd: [path.join(repoCwd, './.env.prod')],
  cwd,
  mainFilePath: path.join(cwd, './src/index.ts'),
  appName: 'Kaption',
  appEmail: 'hello@kaption.co',
  commands,
  id: 'www',
  version,
})

export const factorDb = new FactorDb({
  factorEnv,
  connectionUrl: factorEnv.var('POSTGRES_URL'),
})

export const factorServer = new FactorServer({
  factorEnv,
  serverName: 'SiteServer',
  port: +factorEnv.var('SERVER_PORT', { fallback: 3333 }),
  liveUrl: 'https://server.kaption.co',
  isLive: factorEnv.isProd,
})

const factorRouter = new FactorRouter<CompiledServiceConfig>({
  factorEnv,
  routes,
  replacers: [],
  baseUrl: 'https://www.kaption.co',
})

export const factorApp = new FactorApp({
  factorEnv,
  srcFolder: path.join(cwd, './src'),
  liveUrl: 'https://www.kaption.co',
  isLive: factorEnv.isProd,
  factorServer,
  factorRouter,
  port: +factorEnv.var('WWW_PORT', { fallback: 3000 }),
  rootComponent: App,
  uiPaths: [path.join(cwd, './src/**/*.{vue,js,ts,html}')],

  sitemaps: [
    () => ({
      topic: 'feature',
      paths: featureList.map(_ => `/features/${_.path}`),
    }),
  ],
})

export const factorEmail = new FactorEmail({
  factorEnv,
  smtpHost: factorEnv.var('SMTP_HOST'),
  smtpPassword: factorEnv.var('SMTP_PASSWORD'),
  smtpUser: factorEnv.var('SMTP_USER'),
  appUrl: factorApp.appUrl,
})

export const factorUser = new FactorUser({
  factorEnv,
  factorServer,
  factorDb,
  factorEmail,
  googleClientId:
    '985105007162-9ku5a8ds7t3dq7br0hr2t74mapm4eqc0.apps.googleusercontent.com',
  googleClientSecret: factorEnv.var('GOOGLE_CLIENT_SECRET'),
  tokenSecret: factorEnv.var('TOKEN_SECRET'),
})

export const factorDocs = new FactorDocsEngine({
  factorEnv,
  docs,
  groups,
  baseRoute: '/docs',
  factorApp,
})
export const factorBlog = new FactorBlog({
  factorEnv,
  baseRoute: '/blog',
  ghostContentKey: 'c0f4c32c8881056ba188f8d5e8',
  ghostUrl: 'https://supereon.ghost.io',
  ghostPostFilter: 'tag:kaption',
})

const kaptionCoreUi = new KaptionUi({
  factorEnv,
  factorApp,
  factorRouter,
  factorUser,
})

trackInteractions()

async function initializeBackingServices() {
  const promises = [factorDb.init(), factorEmail.init()]

  return await Promise.all(promises)
}

factorEnv.addHook({
  hook: 'runCommand',
  callback: async (command: string, opts: CliOptions) => {
    const { serve } = opts

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
    else {
      await initializeBackingServices()
      await factorServer.createServer({ factorUser })

      if (command === 'dev') {
        factorUser.init()

        await factorApp.ssrServerCreate()
      }
      else if (command === 'www') {
        await factorApp.serveStaticApp()
      }
      else if (command === 'render') {
        await factorApp.buildApp({ serve, render: true })
      }
    }
  },
})

const service = {
  factorDocs,
  factorBlog,
  factorUser,
  factorDb,
  factorEmail,
  factorRouter,
  kaptionCoreUi,
  factorHighlightCode: new FactorHighlightCode({ factorEnv }),
  factorNotify: new FactorNotify({ factorEnv }),
  factorUi: new FactorUi({ factorApp, factorEnv, factorRouter }),
}

export type ServiceContainer = typeof service

export function setup() {
  return { service }
}
