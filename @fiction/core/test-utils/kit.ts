import type { MainFileSetup, ServiceList } from '../plugin-env/index.js'
import { isCi } from '../utils/vars.js'
import { log } from '../plugin-log/index.js'
import { createTestBrowser, performActions } from './buildTest.js'
import { setup as mainFileSetup } from './testMainFile.js'
import type { InitializedTestUtils, TestUtils } from './init.js'

export type TestingKit<T extends MainFileSetup = MainFileSetup> = {
  port: number
  browser: Awaited<ReturnType<typeof createTestBrowser>>
  close: () => Promise<void>
  performActions: (_: Omit<Parameters<typeof performActions>[0], 'port' | 'browser'>) => Promise<void>
  testUtils: Awaited<ReturnType<T>>['service']
  initialized?: InitializedTestUtils
}

function parseBrowserLog(input: string) {
  const regex = /\b\w+(?:-\w*)?: [^;]+;/g
  return input.replace(regex, '').trim().replaceAll('%c', '')
}

export async function createUiTestingKit<T extends MainFileSetup = MainFileSetup>(args: { initUser?: boolean, headless?: boolean, slowMo?: number, setup?: T, envFiles?: string[] } = {}): Promise<TestingKit<T>> {
  const { headless = true, setup = mainFileSetup, slowMo, envFiles = [], initUser } = args
  const serviceConfig = await setup({ context: 'node', envFiles })

  if (!serviceConfig.service)
    throw new Error('service not found')

  const testUtils = serviceConfig.service as ServiceList & TestUtils

  const headlessActual = isCi() ? true : headless

  if (!testUtils)
    throw new Error('testUtils not found')

  await serviceConfig.service.fictionEnv.crossRunCommand({ context: 'node', serviceConfig })
  const port = testUtils.fictionServer?.port.value

  if (!port)
    throw new Error('port not found')

  const browser = await createTestBrowser({ headless: headlessActual, slowMo })

  // Add event listener for console messages
  browser.page.on('console', msg => log.info(`PAGE`, parseBrowserLog(msg.text())))

  let initialized: InitializedTestUtils | undefined
  if (initUser) {
    initialized = await testUtils?.initUser()
    const token = initialized?.token || ''
    const url = `http://localhost:${port}`
    await browser.context.addCookies([{ name: 'fictionUser', value: initialized.token, url }])
    await browser.context.addCookies([{ name: 'hidePreLaunch', value: 'true', url }])
    await browser.context.addInitScript((args) => {
      window.localStorage.setItem('fictionUser', args.token)
      window.localStorage.setItem('hidePreLaunch', JSON.stringify(true))
    }, { token })

    browser.page = await browser.context.newPage()
  }

  const close = async () => {
    await browser?.close()
    await testUtils?.close?.()
  }

  return { initialized, testUtils, port, browser, close, performActions: _ => performActions({ port, browser, ..._ }) }
}
