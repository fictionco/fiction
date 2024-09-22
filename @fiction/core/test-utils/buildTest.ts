import type { ResultPromise } from 'execa'
import type { Buffer } from 'node:buffer'
import type { Browser, Page } from 'playwright'
import type { CliCommand } from '../plugin-env/index.js'
import type { PackageJson } from '../types/index.js'
import type { TestUtilSettings } from './init.js'
import path from 'node:path'
import process from 'node:process'
import * as playwrightTest from '@playwright/test'
import { execa } from 'execa'
import fs from 'fs-extra'
import { describe, expect, it } from 'vitest'
import { log } from '../plugin-log/index.js'
import { randomBetween, toKebab, waitFor } from '../utils/index.js'
import { executeCommand, stripBrowserConsoleFormatting } from '../utils/nodeUtils.js'
import { isCi } from '../utils/vars.js'

const logger = log.contextLogger('E2E')

async function getModuleName(cwd: string): Promise<string> {
  const pkg = await import(/* @vite-ignore */`${cwd}/package.json`) as PackageJson
  return pkg.name
}

export interface TestServerConfig {
  childProcess: ResultPromise
  commands: CliCommand[]
  destroy: () => Promise<void>
  browser: Browser
  page: Page
}

export type TestBrowser = Awaited<ReturnType<typeof createTestBrowser>>

export async function createTestBrowser(args: { headless: boolean, slowMo?: number }) {
  const slowMo = isCi() ? 0 : args.slowMo
  const headless = isCi() ? true : args.headless

  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless, slowMo })

  const context = await browser.newContext()
  const page: Page = await context.newPage()

  return {
    browser,
    page,
    context,
    reset: async () => {
      try {
        // clear cookies and local storage
        await context.clearCookies()
        await context.clearPermissions()
        await page.evaluate(() => {
          localStorage.clear()
          sessionStorage.clear()
        })
      }
      catch (error) {
        console.error('Error resetting the context:', error)
      }
    },
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
  runCommand?: string
} & TestUtilSettings): Promise<TestServerConfig> {
  const { args = {}, runCommand = 'dev' } = params || {}
  const { headless = true, slowMo } = params
  let { commands = [] } = params
  let { moduleName } = params
  const cwd = params.cwd || process.cwd()

  moduleName = moduleName || await getModuleName(cwd)

  // add additional cli args
  const additionalArgs = Object.entries({
    'postgres-url': 'postgres://test:test@localhost:5432',
    ...args,
  }).map(([key, val]) => `--${toKebab(key)} ${val}`)

  // randomize the ports on commands
  commands = commands.map((command) => {
    if (command.port.value)
      command.port.value = randomBetween(10000, 30000)

    return command
  })

  // add port options to cli command
  const portOptions = commands.filter(_ => _.port.value).map((_) => {
    return `--${_.command}-port ${String(_.port.value)}`
  })

  const cmd = [`npm exec -w ${moduleName} --`, `fiction run ${runCommand}`, ...portOptions, ...additionalArgs]

  const runCmd = cmd.join(' ')

  log.info('createTestServer', `Creating test server for ${moduleName}`, { data: { cwd: process.cwd(), cmd: runCmd } })

  let childProcess: ResultPromise | undefined
  await new Promise<void>((resolve) => {
    const c = runCmd.split(' ')
    childProcess = execa(c[0], c.slice(1), { env: { IS_TEST: '1' } })
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
      if (childProcess)
        childProcess.kill()

      await bwsr.close()
    },
  }
}

type TestPageAction = {
  type: 'visible' | 'click' | 'fill' | 'keyboard' | 'exists' | 'count' | 'value' | 'hasText' | 'scrollTo' | 'frameInteraction'
  selector?: string
  text?: string
  key?: string
  wait?: number
  callback?: (value?: Record<string, string>) => void
  frameSelector?: string
  frameActions?: TestPageAction[]
}

export async function performActions(args: {
  browser: TestBrowser
  path: string
  actions: readonly TestPageAction[] | TestPageAction[]
  port: number
}) {
  const { browser, path, actions, port } = args
  const page = browser.page

  const url = new URL(path || '/', `http://localhost:${port}`).toString()

  const errorLogs: string[] = []

  // page.on('request', request => logger.debug(`${request.method()}-->${request.url()}`))
  // page.on('response', request => logger.debug(`${request.status()}<--${request.url()}`))

  page.on('console', (message) => {
    const txt = stripBrowserConsoleFormatting(message.text())
    logger.info('CONSOLE', { data: { message: txt } })
    if (message.type() === 'error')
      errorLogs.push(txt)
  })

  page.on('pageerror', (err) => {
    logger.info('PAGEERROR', { data: { message: err.message } })
    errorLogs.push(err.message)
  })

  logger.info('NAVIGATING_TO', { data: { url } })

  await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 })

  logger.info('ARRIVED_AT', { data: { url } })

  for (const action of actions) {
    const element = page.locator(action.selector || 'body')

    if (action.wait) {
      await waitFor(action.wait)
    }

    try {
      switch (action.type) {
        case 'scrollTo': {
          logger.info('SCROLL_TO', { data: { selector: action.selector } })
          await element.scrollIntoViewIfNeeded()
          break
        }
        case 'hasText': {
          logger.info('HAS_TEXT', { data: { selector: action.selector, text: action.text } })
          await playwrightTest.expect(element).toContainText(action.text || '')
          break
        }
        case 'click': {
          await element.first().waitFor({ state: 'visible', timeout: 5000 })
          logger.info('CLICK_ELEMENT', { data: { selector: action.selector } })
          await element.click()
          break
        }
        case 'fill': {
          const exists = await element.count()
          logger.info('FILL_TEXT', { data: { selector: action.selector, text: action.text, exists } })
          await element.fill(action.text || '')
          break
        }
        case 'keyboard': {
          logger.info('TYPE_KEY', { data: { key: action.key } })
          await page.keyboard.press(action.key || '')
          break
        }
        case 'visible': {
          await element.first().waitFor({ state: 'visible', timeout: 20000 })
          const isVisible = await element.isVisible()
          logger.info('IS_VISIBLE', { data: { result: isVisible, selector: action.selector } })
          expect(isVisible, `${action.selector} is visible`).toBe(true)
          break
        }
        case 'exists': {
          await element.first().waitFor({ state: 'attached', timeout: 10000 })
          const exists = await element.count()
          logger.info('EXISTS', { data: { result: exists, selector: action.selector } })
          expect(exists, `${action.selector} exists`).toBeGreaterThan(0)
          break
        }
        case 'count': {
          await element.first().waitFor({ state: 'attached', timeout: 10000 })
          const cnt = await element.count()
          logger.info('CNT', { data: { result: cnt, selector: action.selector } })
          expect(cnt, `${action.selector} count ${cnt}`).toBe(cnt)
          break
        }
        case 'value': {
          await waitFor(500)
          const value = await element.evaluate(el => el.dataset.value)
          logger.info('VALUE', { data: { result: value, selector: action.selector } })
          const v = value ? JSON.parse(value) : {}
          action.callback?.(v)
          break
        }
        case 'frameInteraction': {
          if (!action.frameSelector || !action.frameActions) {
            throw new Error('Frame selector and actions are required for frame interaction')
          }
          const frame = page.frameLocator(action.frameSelector)
          for (const frameAction of action.frameActions) {
            const frameElement = frame.locator(frameAction.selector || 'body')
            // Handle frame actions similarly to main actions
            switch (frameAction.type) {
              case 'click':
                await frameElement.click()
                break
              case 'fill':
                await frameElement.fill(frameAction.text || '')
                break
              case 'visible':
                await frameElement.waitFor({ state: 'visible', timeout: 20000 })
                expect(await frameElement.isVisible(), `${frameAction.selector} is visible in frame`).toBe(true)
                break
              case 'hasText': {
                logger.info('HAS_TEXT', { data: { selector: frameAction.selector, text: frameAction.text } })
                await playwrightTest.expect(frameElement).toContainText(frameAction.text || '')
                break
              }
              case 'scrollTo':
                await frameElement.scrollIntoViewIfNeeded()
                break
              case 'exists':
                await frameElement.waitFor({ state: 'attached', timeout: 10000 })
                expect(await frameElement.count(), `${frameAction.selector} exists in frame`).toBeGreaterThan(0)
                break
              case 'count':
                await frameElement.waitFor({ state: 'attached', timeout: 10000 })
                expect(await frameElement.count(), `${frameAction.selector} count in frame`).toBeGreaterThan(0)
                break
              case 'value': {
                await waitFor(500)
                const value = await frameElement.evaluate(el => el.dataset.value)
                const v = value ? JSON.parse(value) : {}
                frameAction.callback?.(v)
                break
              }
              default:
                throw new Error(`Unsupported frame action type: ${frameAction.type}`)
            }
          }
          break
        }
      }
    }
    catch (error) {
      const e = error as Error
      const errorMessage = `ACTION_ERROR: ${action.type} on selector ${action.selector}: ${e.message}`
      const pageDom = await page.innerHTML('body')

      logger.error(errorMessage, { data: { error: e, data: { errorLogs, pageDom } } })
      throw new Error(errorMessage)
    }

    if (action.wait)
      await waitFor(action.wait)
  }

  if (errorLogs.length > 0)
    errorLogs.forEach(e => console.error(e))
  // expect(errorLogs).toStrictEqual([])
}

function getModifiedCommands(commands: CliCommand[]) {
  const modifiedCommands = commands.map((command) => {
    if (command.port.value)
      command.port.value = randomBetween(10000, 30000)

    return command
  })

  const portOptions = commands.filter(_ => _.port.value).map((_) => {
    return `--${_.command}-port ${String(_.port.value)}`
  })

  return { commands: modifiedCommands, portOptions }
}

export async function appBuildTests(config: { moduleName?: string, cwd?: string, commands: CliCommand[] }): Promise<void> {
  let { cwd = '', moduleName } = config

  cwd = cwd || path.dirname(require.resolve(`${moduleName}/package.json`))

  moduleName = moduleName || await getModuleName(cwd)

  if (!cwd)
    throw new Error('cwd is not defined')

  const logger = log.contextLogger('UIUX')
  const BUILD_TIMEOUT = 180_000
  const { portOptions, commands } = getModifiedCommands(config.commands)

  const checkRunCommand = async (runCommand: string, opts: { portCommand?: string } = {}) => {
    const { portCommand = '' } = opts
    const command = [`npm -w ${moduleName} exec -- fiction run ${runCommand} --exit`, ...portOptions].join(' ')

    try {
      const r = await executeCommand({
        command,
        envVars: { IS_TEST: '1', TEST_ENV: 'unit' },
        timeout: BUILD_TIMEOUT,
        resolveText: '[ready]',
        beforeResolve: async () => {
          const url = commands.find(_ => _.command === runCommand || (portCommand && _.command === portCommand))?.url.value
          try {
            logger.info(`RUN CHECK START`, { data: { command, url } })

            if (!url)
              throw new Error('no url')

            await fetch(url)

            logger.info('RUN CHECK DONE', { data: { url } })
          }
          catch (error) {
            logger.error('FETCH PROBLEM', { error, data: { commands, runCommand, url } })
            throw error
          }
        },
      })

      expect(r.stdout).toContain('[ready]')
      expect(r.stderr).not.toContain('error')
    }
    catch (e) {
      logger.error(`RUN CHECK ERROR in ${runCommand}`, { error: e })
    }
  }

  describe(`BUILD TESTS: ${moduleName}`, () => {
    it(`PRERENDERS: ${moduleName}`, async () => {
      const command = [`npm -w ${moduleName} exec -- fiction run render`, ...portOptions].join(' ')

      logger.info('RENDER START', { data: command })

      const r = await executeCommand({ command, envVars: { IS_TEST: '1', TEST_ENV: 'unit' }, timeout: BUILD_TIMEOUT, resolveText: '[done:build]' })

      logger.info('RENDER DONE', { data: { stderr: r.stderr } })

      if (!r.stdout.includes('[done:build]'))
        logger.error('[done:build] MISSING!', { data: { stdout: r.stdout } })

      expect(r.stdout).toContain('[done:build]')
      const exists = fs.existsSync(path.join(cwd, './dist'))
      expect(exists).toBeTruthy()
      expect(r.stdout.toLowerCase()).not.toContain('error')
    }, BUILD_TIMEOUT)

    it(`RUNS PROD: ${moduleName}`, async () => {
      await checkRunCommand('app')
    }, BUILD_TIMEOUT)

    it(`RUNS DEV: ${moduleName}`, async () => {
      await checkRunCommand('dev', { portCommand: 'app' })
    }, BUILD_TIMEOUT)

    it(`LOADS WITHOUT ERROR: ${moduleName}`, async () => {
      const { commands } = getModifiedCommands(config.commands)
      const result = await createTestServer({ moduleName, commands, runCommand: 'app' })

      const { page, destroy } = result

      const finalCommands = result.commands

      const errorLogs: string[] = []
      page.on('console', (message) => {
        const txt = stripBrowserConsoleFormatting(message.text())
        logger.info('CONSOLE', { data: { message: txt } })
        if (message.type() === 'error' && !txt.includes('404'))
          errorLogs.push(txt)
      })

      page.on('pageerror', (err) => {
        logger.info('PAGEERROR', { data: { message: err.message } })
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
  envVars?: Record<string, string>
}): Promise<void> {
  const { cmd } = config

  const BUILD_TIMEOUT = 60_000

  const command = [cmd].join(' ')

  await executeCommand({
    command,
    envVars: { IS_TEST: '1', TEST_ENV: 'unit', ...config.envVars },
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
