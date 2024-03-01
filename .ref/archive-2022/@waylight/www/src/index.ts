import path from 'node:path'
import { FactorUi } from '@factor/ui'
import type {
  CliOptions,
  ServiceConfig,
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
import { FactorDevRestart } from '@factor/api/plugin-env/restart'
import { FactorStripe } from '@factor/plugin-stripe'
import { KaptionCoreUi } from '@kaption/core'
import type { CompiledServiceConfig } from '../.factor/config'
import { version } from '../package.json'
import { routes } from './routes'
import { commands } from './vars'
import AppEntry from './AppEntry.vue'

const cwd = safeDirname(import.meta.url, '..')
const _repoRoot = safeDirname(import.meta.url, '../../..')
export const appName = 'Waylight'
export const appEmail = 'support@waylight.ai'
export const liveUrl = 'https://www.waylight.ai'

export const factorEnv = new FactorEnv<CompiledServiceConfig>({
  envFiles: [path.join(cwd, './.env')],
  cwd,
  mainFilePath: path.join(cwd, './src/index.ts'),
  appName,
  appEmail,
  id: 'waylight',
  version,
  commands,
})

export const factorRouter = new FactorRouter<CompiledServiceConfig>({
  routes,
  factorEnv,
})

export const factorApp = new FactorApp({
  liveUrl,
  port: +factorEnv.var('WWW_PORT', { fallback: 9234 }),
  rootComponent: AppEntry,
  factorRouter,
  uiPaths: [
    path.join(cwd, './src/**/*.{vue,js,ts,html}'),
    path.join(cwd, './src/*.{vue,js,ts,html}'),
  ],
  factorEnv,
  srcFolder: path.join(cwd, './src'),
})

export const factorDb = new FactorDb({
  connectionUrl: factorEnv.var('POSTGRES_URL'),
  factorEnv,
})

export const factorServer = new FactorServer({
  serverName: 'WayLightServer',
  port: +factorEnv.var('SERVER_PORT', { fallback: 1300 }),
  liveUrl: 'https://server.waylight.com',
  isLive: factorEnv.isProd,
  factorEnv,
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

const factorStripe = new FactorStripe({
  factorEnv,
  factorApp,
  factorServer,
  factorUser,
  publicKeyTest:
    'pk_test_51KJ3HNBNi5waADGv8mJnDm8UHJcTvGgRhHmKAZbpklqEANE6niiMYJUQGvinpEt4jdPM85hIsE6Bu5fFhuBx1WWW003Fyaq5cl',
  secretKeyTest: factorEnv.var('STRIPE_SECRET_KEY_TEST'),
  publicKeyLive:
    'pk_live_51LxJ3eFofsEYcKEPc18lsuYoVxuuk5ztDLOGxcKNCS7nSKkx3dolKeNBg26QdQrV0SRta2H5JdwCtP2eMHYjSsgw00pn4pt9q5',
  secretKeyLive: factorEnv.var('STRIPE_SECRET_KEY_PROD'),
  isLive: factorEnv.isProd,
  hooks: [],
  checkoutCancelPathname: '/',
  checkoutSuccessPathname: '/checkout/success',
  productsTest: [
    {
      pricing: [
        { priceKey: 'month', priceId: 'price_1LxcxnFofsEYcKEPxRk1RG6t' },
        { priceKey: 'year', priceId: 'price_1LxcxnFofsEYcKEPT16djnTs' },
      ],
      productId: 'prod_MGQEFRdVgcAMDo',
      productKey: 'proTeams',
    },
    {
      pricing: [
        { priceKey: 'month', priceId: 'price_1LxcxNFofsEYcKEPoyzWMjY7' },
        { priceKey: 'year', priceId: 'price_1LxcxNFofsEYcKEPaxKyAKsP' },
      ],
      productId: 'prod_Mh0zODXHc5iRt2',
      productKey: 'pro',
    },
  ],
  productsLive: [
    {
      pricing: [
        { priceKey: 'month', priceId: 'price_1LxctkFofsEYcKEPizKZIRuO' },
        { priceKey: 'year', priceId: 'price_1LxcwhFofsEYcKEPFFHnzll6' },
      ],
      productId: 'prod_Mh0vATEn8lwABD',
      productKey: 'proTeams',
    },
    {
      pricing: [
        { priceKey: 'month', priceId: 'price_1LxcseFofsEYcKEP41U3BlMG' },
        { priceKey: 'year', priceId: 'price_1Lxcv6FofsEYcKEPa5KKbXID' },
      ],
      productId: 'prod_Mh0uJvllkk8hyO',
      productKey: 'pro',
    },
  ],
})

export const pluginServices = {
  factorApp,
  factorDb,
  factorEnv,
  factorServer,
  factorEmail,
  factorUser,
  factorStripe,
  factorRouter,
}

const kaptionCoreUi = new KaptionCoreUi(pluginServices)

async function initializeBackingServices() {
  await factorDb.init()
  factorEmail.init()
}

factorEnv.addHook({
  hook: 'runCommand',
  callback: async (command: string, opts: CliOptions) => {
    if (command.startsWith('r-')) {
      const realCommand = command.split('-').pop()
      if (!realCommand)
        throw new Error('No command for restart')
      await new FactorDevRestart({ factorEnv }).restartInitializer({
        command: realCommand,
        config: {
          watch: [safeDirname(import.meta.url, '..')],
        },
      })
    }
    else {
      await initializeBackingServices()
      await factorServer.createServer()

      if (command === 'dev') {
        await factorApp.serveDevApp()
      }
      else if (command === 'build' || command === 'render') {
        const { serve } = opts

        await factorApp.buildApp({ serve, render: true })
      }
      else if (command === 'www') {
        await factorApp.serveStaticApp()
      }
    }
  },
})

export const service = {
  factorEnv,
  factorApp,
  factorRouter,
  factorUser,
  factorStripe,
  kaptionCoreUi,
  factorUi: new FactorUi({ factorEnv, factorApp }),
}

export type ServiceContainer = typeof service

export function setup(): ServiceConfig {
  return { service }
}
