import path from 'node:path'
import process from 'node:process'
import type { Buffer } from 'node:buffer'
import { describe, expect, it } from 'vitest'
import type { ExecaChildProcess } from 'execa'
import { execaCommand } from 'execa'
import fs from 'fs-extra'
import type { Browser, Page } from 'playwright'
import { executeCommand } from '../utils/nodeUtils'
import { camelToKebab, randomBetween, waitFor } from '../utils'
import { log } from '../plugin-log'
import type { PackageJson } from '../types'
import type { CliCommand } from '../plugin-env'
import type { TestUtilSettings } from './init'

const logger = log.contextLogger('BUILD TESTS')

async function getModuleName(cwd: string): Promise<string> {
  const pkg = await import(/* @vite-ignore */`${cwd}/package.json`) as PackageJson
  return pkg.name
}

export interface TestServerConfig {
  childProcess: ExecaChildProcess
  commands: CliCommand[]
  destroy: () => Promise<void>
  browser: Browser
  page: Page
}

export type TestBrowser = Awaited<ReturnType<typeof createTestBrowser>>

export async function createTestBrowser(args: { headless: boolean, slowMo?: number }) {
  const { headless, slowMo } = args

  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless, slowMo })

  const page = await browser?.newPage()

  return {
    browser,
    page,
    close: async () => {
      try {
        // destroy everything
        await page?.close()
        await browser.close()
      }
      catch (error) {
        console.error('Error closing the browser:', error)
      }
    },
  }
}

export async function createTestServer(params: {
  cwd?: string
  moduleName?: string
  headless?: boolean
  slowMo?: number
  args?: Record<string, string | number>
  commands?: CliCommand[]
} & TestUtilSettings): Promise<TestServerConfig> {
  const { args = {} } = params || {}
  const { headless = true, slowMo } = params
  let { commands = [] } = params
  let { moduleName } = params
  const cwd = params.cwd || process.cwd()

  moduleName = moduleName || await getModuleName(cwd)

  // add additional cli args
  const additionalArgs = Object.entries({
    'postgres-url': 'postgres://test:test@localhost:5432',
    ...args,
  }).map(([key, val]) => `--${camelToKebab(key)} ${val}`)

  // randomize the ports on commands
  commands = commands.map((command) => {
    if (command.port.value)
      command.port.value = randomBetween(1000, 30000)

    return command
  })

  // add port options to cli command
  const portOptions = commands.filter(_ => _.port.value).map((_) => {
    return `--${_.command}-port ${String(_.port.value)}`
  })

  const cmd = [`npm exec -w ${moduleName} --`, `fiction run dev`, ...portOptions, ...additionalArgs]

  const runCmd = cmd.join(' ')

  log.info('createTestServer', `Creating test server for ${moduleName}`, { data: { cwd: process.cwd(), cmd: runCmd } })

  let childProcess: ExecaChildProcess | undefined
  await new Promise<void>((resolve) => {
    childProcess = execaCommand(runCmd, { env: { IS_TEST: '1' } })
    childProcess.stdout?.pipe(process.stdout)
    childProcess.stderr?.pipe(process.stderr)

    childProcess.stdout?.on('data', (d: Buffer) => {
      if (d.toString().includes('[ready]'))
        resolve()
    })
  })

  if (!childProcess)
    throw new Error('Could not start dev server')

  const bwsr = await createTestBrowser({ headless, slowMo })

  return {
    childProcess,
    commands,
    ...bwsr,
    destroy: async () => {
      if (childProcess) {
        childProcess.cancel()
        childProcess.kill()
      }
      await bwsr.close()
    },
  }
}

type TestPageAction = {
  type: 'visible' | 'click' | 'type' | 'keyboard' | 'exists'
  selector: string
  text?: string
  key?: string
  wait?: number
}

export async function performActions(args: {
  browser: TestBrowser
  path: string
  actions: readonly TestPageAction[] | TestPageAction[]
  port: number
}) {
  const { browser, path, actions, port } = args
  const page = browser.page

  const url = new URL(`http://localhost:${port}${path}`).toString()

  logger.info('NAVIGATE_TO', { data: { url } })

  await page.goto(url, { waitUntil: 'networkidle' })

  logger.info('NAVIGATED', { data: { url } })

  for (const action of actions) {
    const element = page.locator(action.selector)

    switch (action.type) {
      case 'click': {
        logger.info('CLICK_ELEMENT', { data: { selector: action.selector } })
        await element.click()
        break
      }
      case 'type': {
        logger.info('TYPE_TEXT', { data: { selector: action.selector, text: action.text } })
        await element.type(action.text || '')
        break
      }
      case 'keyboard': {
        logger.info('TYPE_KEY', { data: { key: action.key } })
        await page.keyboard.press(action.key || '')
        break
      }
      case 'visible': {
        const isVisible = await element.isVisible()
        logger.info('IS_VISIBLE', { data: { result: isVisible, selector: action.selector } })
        expect(isVisible, `${action.selector} is visible`).toBe(true)
        break
      }
      case 'exists': {
        const exists = await element.count()
        logger.info('EXISTS', { data: { result: exists, selector: action.selector } })
        expect(exists, `${action.selector} exists`).toBeGreaterThan(0)
        break
      }
    }

    if (action.wait)
      await waitFor(action.wait)
  }
}

function getModifiedCommands(commands: CliCommand[]) {
  const modifiedCommands = commands.map((command) => {
    if (command.port.value)
      command.port.value = randomBetween(1000, 30000)

    return command
  })

  const portOptions = commands.filter(_ => _.port.value).map((_) => {
    return `--${_.command}-port ${String(_.port.value)}`
  })

  return { commands: modifiedCommands, portOptions }
}

export async function appBuildTests(config: {
  moduleName?: string
  cwd?: string
  commands: CliCommand[]
}): Promise<void> {
  let { cwd = '', moduleName } = config

  cwd = cwd || path.dirname(require.resolve(`${moduleName}/package.json`))

  moduleName = moduleName || await getModuleName(cwd)

  if (!cwd)
    throw new Error('cwd is not defined')

  const logger = log.contextLogger('BUILD TESTS')
  const BUILD_TIMEOUT = 180_000

  describe(`BUILD TESTS: ${moduleName}`, () => {
    it(`PRERENDERS: ${moduleName}`, async () => {
      const { portOptions } = getModifiedCommands(config.commands)
      const command = [
        `npm -w ${moduleName} exec -- fiction run render`,
        ...portOptions,
      ].join(' ')

      logger.info('RENDER START', { data: command })

      const r = await executeCommand({
        command,
        envVars: { IS_TEST: '1', TEST_ENV: 'unit' },
        timeout: BUILD_TIMEOUT,
        resolveText: '[done:build]',
      })

      logger.info('RENDER DONE', { data: { stderr: r.stderr } })

      if (!r.stdout.includes('[done:build]'))
        logger.error('[done:build] MISSING!', { data: { stdout: r.stdout } })

      expect(r.stdout).toContain('[done:build]')
      const exists = fs.existsSync(path.join(cwd, './dist'))
      expect(exists).toBeTruthy()
      expect(r.stdout.toLowerCase()).not.toContain('error')
    }, BUILD_TIMEOUT)

    it(`RUNS DEV: ${moduleName}`, async () => {
      const { portOptions } = getModifiedCommands(config.commands)
      const command = [`npm -w ${moduleName} exec -- fiction run dev --exit`, ...portOptions].join(' ')

      const r = await executeCommand({
        command,
        envVars: { IS_TEST: '1', TEST_ENV: 'unit' },
        timeout: BUILD_TIMEOUT,
        resolveText: '[ready]',
      })

      expect(r.stdout).toContain('[ready]')
      expect(r.stderr).not.toContain('error')
    }, BUILD_TIMEOUT)

    it(`LOADS WITHOUT ERROR: ${moduleName}`, async () => {
      const { commands } = getModifiedCommands(config.commands)
      const result = await createTestServer({ moduleName, commands })

      const { page, destroy } = result

      const finalCommands = result.commands

      const errorLogs: string[] = []
      page.on('console', (message) => {
        if (message.type() === 'error')
          errorLogs.push(message.text())
      })

      page.on('pageerror', (err) => {
        errorLogs.push(err.message)
      })
      const appUrl = finalCommands.find(_ => _.command === 'app')?.url.value

      if (!appUrl)
        throw new Error('no app url')

      await page.goto(appUrl)

      const html = await page.innerHTML('body')

      if (errorLogs.length > 0)
        console.error(errorLogs)

      if (errorLogs.length > 0)
        errorLogs.forEach(e => console.error(e))

      expect(errorLogs).toMatchInlineSnapshot(`[]`)
      expect(errorLogs.length).toBe(0)
      expect(html).toBeTruthy()

      await destroy()
    }, BUILD_TIMEOUT)
  })
}

export async function appRunTest(config: {
  cmd: string
  port: number
  onTrigger: () => Promise<void>
}): Promise<void> {
  const { cmd } = config

  const BUILD_TIMEOUT = 60_000

  const command = [cmd].join(' ')

  await executeCommand({
    command,
    envVars: { IS_TEST: '1', TEST_ENV: 'unit' },
    timeout: BUILD_TIMEOUT,
    triggerText: '[ready]',
    onTrigger: async (args) => {
      try {
        await config.onTrigger()
      }
      finally {
        // This ensures the server is closed even if the assertions above fail
        args.close()
      }
    },
  })
}
