import type { Browser } from 'playwright'
import type { MainFileSetup } from '../plugin-env'
import { isCi } from '../utils/vars'
import { createTestBrowser, performActions } from './buildTest'
import { setup as mainFileSetup } from './testMainFile'
import type { createTestUtils } from './init'

export async function createUiTestingKit(args: { headless?: boolean, slowMo?: number, setup?: MainFileSetup, envFiles?: string[] } = {}): Promise<{
  port: number
  browser: { browser: Browser }
  close: () => Promise<void>
  performActions: (_: Omit<Parameters<typeof performActions>[0], 'port' | 'browser'>) => Promise<void>
  testUtils: ReturnType<typeof createTestUtils>
}> {
  const { headless = true, setup = mainFileSetup, slowMo, envFiles = [] } = args
  const serviceConfig = await setup({ context: 'node', envFiles })
  const testUtils = serviceConfig.service as ReturnType<typeof createTestUtils>

  const headlessActual = isCi() ? true : headless

  if (!testUtils)
    throw new Error('testUtils not found')

  await serviceConfig.fictionEnv.crossRunCommand({ context: 'node', serviceConfig })
  const port = testUtils.fictionServer?.port.value


  if (!port)
    throw new Error('port not found')

  const browser = await createTestBrowser({ headless: headlessActual, slowMo })

  const close = async () => {
    await browser?.close()
    await testUtils?.close()
  }

  return { testUtils, port, browser, close, performActions: _ => performActions({ port, browser, ..._ }) }
}
