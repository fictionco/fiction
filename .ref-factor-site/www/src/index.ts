import path from 'node:path'
import { FactorHighlightCode } from '@factor/plugin-highlight-code'
import { FactorNotify } from '@factor/plugin-notify'
import { FactorStripe } from '@factor/plugin-stripe'
import { FactorUi } from '@factor/ui'
import type {
  CliOptions,
  ServiceConfig,
} from '@factor/api'
import {
  AppRoute,
  FactorApp,
  FactorDb,
  FactorEmail,
  FactorEnv,
  FactorMedia,
  FactorRouter,
  FactorServer,
  FactorTestingApp,
  FactorUser,
  randomBetween,
  safeDirname,
  vars,
} from '@factor/api'
import { FactorDevRestart } from '@factor/api/plugin-env/restart'
import { FactorAws } from '@factor/api/plugin-aws'
import type { CompiledServiceConfig } from '../.factor/config'
import { version } from '../package.json'
import { commands, envVars } from './vars'
import App from './App.vue'

vars.register(envVars)

const cwd = safeDirname(import.meta.url, '..')
const repoRoot = safeDirname(import.meta.url, '../../..')
const envFile = path.join(repoRoot, './@fiction/www/.env')
export const factorEnv = new FactorEnv<CompiledServiceConfig>({
  envFiles: [envFile],
  cwd,
  mainFilePath: path.join(cwd, './src/index.ts'),
  commands,
  appName: 'FactorJS',
  appEmail: 'hi@factorjs.org',
  id: 'www',
  version,
})

export const factorDb = new FactorDb({
  connectionUrl: factorEnv.var('POSTGRES_URL'),
  factorEnv,
})

export const factorServer = new FactorServer({
  serverName: 'FactorMain',
  port: +factorEnv.var('SERVER_PORT', { fallback: 3333 }),
  liveUrl: 'https://server.factorjs.org',
  isLive: factorEnv.isProd,
  factorEnv,
})

export const factorRouter = new FactorRouter<CompiledServiceConfig>({
  factorEnv,
  baseUrl: 'https://www.factorjs.org',
  routes: [
    new AppRoute({ name: 'home', niceName: () => 'Home', path: '/', component: (): Promise<any> => import('./el/ViewHome.vue') }),
    new AppRoute({ name: 'plugins', niceName: () => 'Plugins', path: '/plugins', component: (): Promise<any> => import('./plugins/PageIndex.vue') }),
    new AppRoute({ name: 'showcase', niceName: () => 'Showcase', path: '/showcase', component: (): Promise<any> => import('./showcase/PageIndex.vue') }),
    new AppRoute({ name: 'showcaseSingle', niceName: () => 'Showcase Item', path: '/showcase/:slug', component: (): Promise<any> => import('./showcase/PageSingle.vue') }),
    new AppRoute({ name: 'install', path: '/install', component: (): Promise<any> => import('./el/ViewInstall.vue') }),
    new AppRoute({ name: 'testing', path: '/testing', component: (): Promise<any> => import('@factor/api/plugin-app/test/TestRunVars.vue') }),
  ],
})

export const factorApp = new FactorApp({
  factorEnv,
  srcFolder: path.join(cwd, './src'),
  liveUrl: 'https://www.factorjs.org',
  isLive: factorEnv.isProd,
  factorServer,
  port: +factorEnv.var('APP_PORT', { fallback: 3000 }),
  rootComponent: App,
  ui: { },
  factorRouter,
  uiPaths: [
    path.join(cwd, './src/**/*.{vue,js,ts,html}'),
    path.join(cwd, './blog/**/*.vue'),
    path.join(cwd, './docs/**/*.vue'),
  ],
})

export const factorEmail = new FactorEmail({
  factorEnv,
  smtpHost: factorEnv.var('SMTP_HOST'),
  smtpPassword: factorEnv.var('SMTP_PASSWORD'),
  smtpUser: factorEnv.var('SMTP_USER'),
})

export const factorUser = new FactorUser({
  factorEnv,
  factorServer,
  factorDb,
  factorEmail,
  googleClientId: factorEnv.var('GOOGLE_CLIENT_ID'),
  googleClientSecret: factorEnv.var('GOOGLE_CLIENT_SECRET'),
  tokenSecret: factorEnv.var('TOKEN_SECRET'),
})

export const factorStripe = new FactorStripe({
  factorEnv,
  factorApp,
  factorServer,
  factorUser,
  factorRouter,
  factorDb,
  publicKeyTest:
    'pk_test_51KJ3HNBNi5waADGv8mJnDm8UHJcTvGgRhHmKAZbpklqEANE6niiMYJUQGvinpEt4jdPM85hIsE6Bu5fFhuBx1WWW003Fyaq5cl',
  secretKeyTest: factorEnv.var('STRIPE_SECRET_KEY_TEST'),
  isLive: factorEnv.isProd,
  hooks: [],
  products: [],
  customerPortalUrl: '#',
})

const factorAws = new FactorAws({
  factorEnv,
  awsAccessKey: factorEnv.var('AWS_ACCESS_KEY'),
  awsAccessKeySecret: factorEnv.var('AWS_ACCESS_KEY_SECRET'),
})

const factorMedia = new FactorMedia({
  factorEnv,
  factorDb,
  factorUser,
  factorServer,
  factorAws,
  bucket: 'factor-tests',
})

const factorTestingApp = new FactorTestingApp({
  factorEnv,
  port: +factorEnv.var('TEST_APP_PORT', {
    fallback: randomBetween(1000, 2000),
  }),
  head: '<!-- test app injected -->',
})

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
          watch: [safeDirname(import.meta.url, '../..')],
        },
      })
    }
    else if (command === 'www') {
      await factorApp.serveStaticApp()
    }
    else {
      await initializeBackingServices()
      await factorServer.createServer({ factorUser })

      if (command === 'dev') {
        factorUser.init()
        await factorApp.ssrServerCreate()
        await factorTestingApp.createApp()
      }
      else if (command === 'build' || command === 'render') {
        const { serve } = opts

        await factorApp.buildApp({ serve, render: true })
      }
    }
  },
})

export const service = {
  factorEnv,
  factorApp,
  factorRouter,
  factorServer,
  factorUser,
  factorDb,
  factorStripe,
  factorMedia,
  factorHighlightCode: new FactorHighlightCode({ factorEnv }),
  factorNotify: new FactorNotify({ factorEnv }),
  factorUi: new FactorUi({ apps: [factorApp], factorEnv }),
}

export type ServiceContainer = typeof service

export function setup(): ServiceConfig {
  return {
    factorEnv,
    createService: () => service,
    createMount: args => factorApp.mountApp(args),
  }
}
