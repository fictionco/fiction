import type { Browser } from 'playwright'
import type { MainFileSetup } from '../plugin-env'
import { isCi } from '../utils/vars'
import { createTestBrowser, performActions } from './buildTest'
import { setup as mainFileSetup } from './testMainFile'

export type TestingKit<T extends MainFileSetup = MainFileSetup> = {
  port: number
  browser: Awaited<ReturnType<typeof createTestBrowser>>
  close: () => Promise<void>
  performActions: (_: Omit<Parameters<typeof performActions>[0], 'port' | 'browser'>) => Promise<void>
  testUtils: Awaited<ReturnType<T>>['service']
}

export async function createUiTestingKit<T extends MainFileSetup = MainFileSetup>(args: { headless?: boolean, slowMo?: number, setup?: T, envFiles?: string[] } = {}): Promise<TestingKit<T>> {
  const { headless = true, setup = mainFileSetup, slowMo, envFiles = [] } = args
  const serviceConfig = await setup({ context: 'node', envFiles })

  if (!serviceConfig.service)
    throw new Error('service not found')

  const testUtils = serviceConfig.service

  const headlessActual = isCi() ? true : headless

  if (!testUtils)
    throw new Error('testUtils not found')

  await serviceConfig.service.fictionEnv.crossRunCommand({ context: 'node', serviceConfig })
  const port = testUtils.fictionServer?.port.value

  if (!port)
    throw new Error('port not found')

  const browser = await createTestBrowser({ headless: headlessActual, slowMo })

  const close = async () => {
    await browser?.close()
    await testUtils?.close?.()
  }

  return { testUtils, port, browser, close, performActions: _ => performActions({ port, browser, ..._ }) }
}
