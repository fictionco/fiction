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
  safeDirname,
} from '@factor/api'
import { FactorDevRestart } from '@factor/api/plugin-env/restart'
import { FactorEngine } from '@factor/engine'
import type { CompiledServiceConfig } from '../.factor/config'
import { version } from '../package.json'
import heroBg from './content/ap.jpg'
import { routes } from './routes'
import App from './App.vue'
import { commands } from './commands'

const cwd = safeDirname(import.meta.url, '..')
export const appName = 'Andrew Powers'
export const appEmail = 'hello@andrewpowers.com'
export const liveUrl = 'https://www.andrewpowers.com'

export const factorEnv = new FactorEnv<CompiledServiceConfig>({
  envFiles: [path.join(cwd, './.env')],
  cwd,
  mainFilePath: path.join(cwd, './src/index.ts'),
  appName,
  appEmail,
  id: 'www',
  version,
  commands,
})

export const factorRouter = new FactorRouter<CompiledServiceConfig>({
  routes,
  factorEnv,
  baseUrl: liveUrl,
})

export const factorDb = new FactorDb({
  connectionUrl: factorEnv.var('POSTGRES_URL'),
  factorEnv,
})

export const factorServer = new FactorServer({
  serverName: 'FactorMain',
  port: +factorEnv.var('SERVER_PORT', { fallback: 3333 }),
  liveUrl,
  isLive: factorEnv.isProd,
  factorEnv,
})

export const factorApp = new FactorApp({
  liveUrl,
  port: +factorEnv.var('SERVER_PORT', { fallback: 3333 }),
  rootComponent: App,
  factorRouter,
  srcFolder: path.join(cwd, './src'),
  uiPaths: [
    path.join(cwd, './src/**/*.{vue,js,ts,html}'),
    path.join(cwd, './src/*.{vue,js,ts,html}'),
  ],
  factorEnv,
})

export const factorEmail = new FactorEmail({
  factorEnv,
  smtpHost: factorEnv.var('SMTP_HOST'),
  smtpPassword: factorEnv.var('SMTP_PASSWORD'),
  smtpUser: factorEnv.var('SMTP_USER'),
})
const _pluginServices = {
  factorEnv,
  factorApp,
  factorServer,
  factorDb,
  factorRouter,
  factorEmail,
}

const factorEngine = new FactorEngine({
  factorEnv,
  factorDb,
  factorRouter,
  staticPosts: [
    () => import('./content/hooks/bias.md'),
    () => import('./content/fake/fake.md'),
    () => import('./content/authority/index.md'),
    () => import('./content/dismaland/index.md'),
    () => import('./content/scarcity/scarcity.md'),
  ],
  ui: {},
  header: [
    {
      id: 'h1',
      layout: [
        {
          id: 's3',
          settings: {
            sectionKey: 'simpleHeader',
            homeText: 'AP',
            nav: [
              { text: 'LinkedIn', url: 'https://www.linkedin.com/in/arpowers' },
            ],
          },
        },
      ],
    },
  ],
  footer: [
    {
      layout: [
        {
          id: 's4',
          settings: {
            sectionKey: 'simpleFooter',
            homeText: 'AP',
            socialLinks: [
              {
                key: 'linkedIn',
                url: 'https://www.linkedin.com/in/arpowers/',
              },
              {
                key: 'x',
                url: 'https://www.x.com/arpowers',
              },
              {
                key: 'facebook',
                url: 'https://www.facebook.com/arpowers',
              },
              {
                key: 'angelList',
                url: 'https://angel.co/arpowers',
              },
              {
                key: 'instagram',
                url: 'https://www.instagram.com/arpowers/',
              },
              {
                key: 'github',
                url: 'https://www.github.com/arpowers',
              },
            ],
          },
        },
      ],
    },
  ],

  page: [
    {
      id: 'p1',
      route: '/old',
      overlayHeader: true,
      layout: [
        {
          id: 'x',
          settings: {
            sectionKey: 'ElBigHero',
            heroBg,
          },
        },
        // {
        //   id: "s1",
        //   settings: {
        //     sectionKey: "magFrontPage",
        //     titlePrimary: `Methods <span class="italic font-serif lowercase">of</span> Influence`,
        //     titleSecondary: "Newsletter",
        //     subTitle: "Win Friends, Close Deals, and Generate Leverage",
        //   },
        // },
      ],
    },
    {
      id: 'p1',
      route: '/posts/*',
      layout: [
        {
          id: 's1',
          settings: {
            sectionKey: 'magPost',
          },
        },
      ],
    },
    {
      id: 'p2',
      route: '/',
      layout: [
        {
          id: 's1',
          settings: {
            sectionKey: 'ElStory',
            linkSuper: { url: 'https://www.x.com/arpowers', text: '@arpowers' },
            linkCta: {
              url: 'mailto:hi@andrewpowers.com',
              text: 'Email Andrew',
            },
            title: 'Let\'s create something beautiful together.',
            subTitle:
              'Andrew Powers is a technology entrepreneur, investor, and mentor. He is dedicated to helping others succeed.',
            subText: 'BASED IN &mdash; LAGUNA BEACH, CA &mdash; USA',
            avatarEmail: 'arpowers@gmail.com',
          },
        },
      ],
    },
  ],
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
          watch: [safeDirname(import.meta.url, '..')],
        },
      })
    }
    else {
      await initializeBackingServices()
      const srv = await factorServer.initServer()

      if (command === 'build' || command === 'render') {
        const { serve } = opts

        await factorApp.buildApp({ serve, render: true })
      }
      else if (command === 'app' || command === 'dev') {
        const { build } = opts
        if (build)
          await factorApp.buildApp()

        await factorApp.ssrServerSetup({
          expressApp: srv?.expressApp,
          isProd: command !== 'dev',
        })

        await srv?.run()

        factorApp.logReady({ serveMode: 'comboSSR' })
      }
      else if (command === 'generate') {
        await factorDb.init()
        await factorEnv.generate()
      }
    }
  },
})

export const service = {
  factorEnv,
  factorApp,
  factorRouter,
  factorEngine,
  factorUi: new FactorUi({ factorEnv, apps: [factorApp] }),
}

export type ServiceContainer = typeof service

export function setup(): ServiceConfig {
  return {
    factorEnv,
    createService: () => service,
    createMount: args => factorApp.mountApp(args),
  }
}
