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
import { randomBetween, removeUndefined, toKebab, toSnake, waitFor } from '../utils/index.js'
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
export class PlaywrightLogger {
  private logger = log.contextLogger('playwright')
  public errorLogs: string[] = []
  private currentUrl: string = ''
  private readonly caller: string
  private page?: Page

  constructor(caller: string) {
    this.caller = caller
  }

  async setupLogging(page: Page): Promise<void> {
    this.page = page
    page.on('console', this.handleConsoleMessage.bind(this))
    page.on('pageerror', this.handlePageError.bind(this))
    page.on('load', () => { this.currentUrl = page.url() })
  }

  close(): void {
    if (this.page) {
      this.page.removeListener('console', this.handleConsoleMessage.bind(this))
      this.page.removeListener('pageerror', this.handlePageError.bind(this))
      this.page = undefined
    }
  }

  private async handleConsoleMessage(message: playwrightTest.ConsoleMessage): Promise<void> {
    const type = message.type()
    const text = this.cleanMessage(message.text())

    if (type === 'debug')
      return

    const logData = {
      url: `${this.caller} -> ${this.currentUrl}`,
      location: `${message.location().url}:${message.location().lineNumber}:${message.location().columnNumber}`,
    }

    if (type === 'error' || type === 'warning') {
      const args = await this.serializeArguments(message.args())
      const stack = this.extractStackTrace(args)

      Object.assign(logData, {
        ...(stack && { stack }),
        ...(args.length > 0 && { args }),
      })

      if (type === 'error') {
        this.logger.error(text, { data: logData })
        this.errorLogs.push(`[${this.currentUrl}] ${text}`)
      }
      else {
        this.logger.warn(text, { data: logData })
      }
    }
    else {
      this.logger.info(text, { data: logData })
    }
  }

  private handlePageError(error: Error): void {
    const logData = {
      url: `${this.caller} -> ${this.currentUrl}`,
      stack: this.parseStackTrace(error.stack || ''),
    }
    this.logger.error(error.message, { data: logData })
    this.errorLogs.push(`[${this.currentUrl}] ${error.message}`)
  }

  private async serializeArguments(args: any[]): Promise<any[]> {
    const serialized = await Promise.all(args.map(async (arg) => {
      try {
        const value = await arg.jsonValue().catch(() => 'Unable to serialize')
        return JSON.parse(JSON.stringify(value, this.jsonReplacer))
      }
      catch {
        return 'Error serializing argument'
      }
    }))

    return serialized.filter(arg => !this.isStyleInfo(arg))
      .map(arg => typeof arg === 'string' ? this.cleanMessage(arg) : arg)
  }

  private extractStackTrace(args: any[]): string | null {
    const stackArg = args.find(arg => typeof arg === 'string' && arg.includes('at '))
    return stackArg ? this.parseStackTrace(stackArg) : null
  }

  private parseStackTrace(stack: string): string {
    return stack.split('\n')
      .filter(line => line.includes('/fiction/') && !line.includes('node_modules'))
      .join('\n')
  }

  private jsonReplacer(_key: string, value: any): any {
    if (value instanceof RegExp)
      return value.toString()
    if (typeof value === 'function')
      return '[Function]'
    if (typeof value === 'symbol')
      return value.toString()
    return value
  }

  private cleanMessage(message: string): string {
    message = message.replace(/%c/g, '').replace(/(?:color|font-weight|background-color): [^;]+;?\s*/g, '').trim()

    if (message.startsWith('[Vue warn]')) {
      const [warning, ...componentInfo] = message.split('\n')
      return `${warning} ${componentInfo.filter(line => line.trim() !== '' && !line.includes('at <')).join(' ')}`.trim()
    }

    return message.replace(/\n+/g, ' ')
  }

  private isStyleInfo(arg: any): boolean {
    return typeof arg === 'string' && /^(color|font-weight|background-color):/.test(arg)
  }

  getErrorLogs(): string[] {
    return this.errorLogs
  }
}

type TestPageAction = {
  type: 'visible' | 'click' | 'fill' | 'keyboard' | 'exists' | 'count' | 'value' | 'hasText' | 'notHasText' | 'hasValue' | 'notHasValue' | 'scrollTo' | 'frameInteraction' | 'callback' | 'hasAttribute'
  selector?: string
  text?: string
  isNot?: boolean
  attribute?: string
  expectedValue?: string
  key?: string
  wait?: number
  waitAfter?: number
  onValue?: (value?: Record<string, string>) => void
  callback?: (args: {
    page: Page
    element: playwrightTest.Locator
    action: TestPageAction
    browser: TestBrowser
  }) => Promise<void>
  frameSelector?: string
  frameActions?: TestPageAction[]
}

export async function performActions(args: {
  caller: string
  browser: TestBrowser
  path: string
  actions: readonly TestPageAction[] | TestPageAction[]
  port: number
}) {
  const { browser, path, actions, port, caller } = args
  const page = browser.page

  const url = new URL(path || '/', `http://localhost:${port}`).toString()

  const playwrightLogger = new PlaywrightLogger(caller)

  playwrightLogger.setupLogging(page)

  logger.info('NAVIGATING_TO', { data: { url } })

  await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 })

  logger.info('ARRIVED_AT', { data: { url } })

  let index = 0
  let lastSelector = ''
  let lastAction = ''
  for (const action of actions) {
    index++
    lastSelector = action.selector || ''
    lastAction = action.type

    logger.info(`---- ${index}: ACTION: ${lastAction} on ${lastSelector} ----`)
    const element = page.locator(action.selector || 'body')

    if (action.wait) {
      logger.info('WAIT_FOR', { data: { wait: `${action.wait}ms` } })
      await waitFor(action.wait)
    }

    if (['click', 'fill', 'hasText', 'hasValue', 'hasAttribute', 'visible'].includes(action.type)) {
      await element.first().waitFor({ state: 'visible', timeout: 30000 })
    }

    logger.info(toSnake(action.type, { upper: true }), { data: removeUndefined(action) })

    try {
      switch (action.type) {
        case 'scrollTo': {
          await element.scrollIntoViewIfNeeded()
          break
        }
        case 'hasValue': {
          await playwrightTest.expect(element).toHaveValue(action.text || '')
          break
        }
        case 'notHasValue': {
          await playwrightTest.expect(element).not.toHaveValue(action.text || '')
          break
        }
        case 'hasText': {
          await playwrightTest.expect(element).toContainText(action.text || '')
          break
        }
        case 'notHasText': {
          await playwrightTest.expect(element).not.toContainText(action.text || '')
          break
        }
        case 'hasAttribute': {
          if (!action.attribute || action.expectedValue === undefined) {
            throw new Error('Attribute name and expected value are required for hasAttribute action')
          }
          const attributeValue = await element.getAttribute(action.attribute)
          expect(attributeValue, `${action.selector} has attribute ${action.attribute} with value ${action.expectedValue}`).toBe(action.expectedValue)
          break
        }
        case 'click': {
          await element.click()
          break
        }
        case 'fill': {
          await element.fill(action.text || '')
          break
        }
        case 'keyboard': {
          await page.keyboard.press(action.key || '')
          break
        }
        case 'visible': {
          const isVisible = await element.isVisible()
          expect(isVisible, `${action.selector} is visible`).toBe(true)
          break
        }
        case 'exists': {
          await element.first().waitFor({ state: 'attached', timeout: 30000 })
          const exists = await element.count()
          expect(exists, `${action.selector} exists`).toBeGreaterThan(0)
          break
        }
        case 'count': {
          await element.first().waitFor({ state: 'attached', timeout: 30000 })
          const cnt = await element.count()
          expect(cnt, `${action.selector} count ${cnt}`).toBe(cnt)
          break
        }
        case 'value': {
          await waitFor(500)
          const value = await element.evaluate(el => el.dataset.value)
          const v = value ? JSON.parse(value) : {}
          action.callback?.(v)
          break
        }
        case 'callback': {
          if (action.callback) {
            await action.callback({ page, element, action, browser })
          }
          break
        }

        case 'frameInteraction': {
          if (!action.frameSelector || !action.frameActions) {
            throw new Error('Frame selector and actions are required for frame interaction')
          }
          const frame = page.frameLocator(action.frameSelector)
          for (const frameAction of action.frameActions) {
            index++
            lastSelector = frameAction.selector || ''
            lastAction = frameAction.type

            logger.info(`---- ${index}: FRAMEACTION: ${lastAction} on ${lastSelector} ----`)

            if (frameAction.wait) {
              logger.info('FRAME_WAIT_FOR', { data: { wait: `${frameAction.wait}ms` } })
              await waitFor(frameAction.wait)
            }

            const frameElement = frame.locator(frameAction.selector || 'body')

            if (['click', 'fill', 'hasText', 'hasValue', 'hasAttribute', 'visible'].includes(frameAction.type)) {
              await frameElement.first().waitFor({ state: 'visible', timeout: 30000 })
            }

            logger.info(toSnake(frameAction.type, { upper: true }), { data: removeUndefined(frameAction) })

            // Handle frame actions similarly to main actions
            switch (frameAction.type) {
              case 'click':
                await frameElement.click()
                break
              case 'fill':
                await frameElement.fill(frameAction.text || '')
                break
              case 'visible':
                expect(await frameElement.isVisible(), `${frameAction.selector} is visible in frame`).toBe(true)
                break
              case 'hasValue':
                await playwrightTest.expect(frameElement).toHaveValue(frameAction.text || '')
                break
              case 'hasText': {
                await playwrightTest.expect(frameElement).toContainText(frameAction.text || '')
                break
              }
              case 'scrollTo':
                await frameElement.scrollIntoViewIfNeeded()
                break
              case 'exists':
                await frameElement.waitFor({ state: 'attached', timeout: 30000 })
                expect(await frameElement.count(), `${frameAction.selector} exists in frame`).toBeGreaterThan(0)
                break
              case 'count':
                await frameElement.waitFor({ state: 'attached', timeout: 30000 })
                expect(await frameElement.count(), `${frameAction.selector} count in frame`).toBeGreaterThan(0)
                break
              case 'hasAttribute': {
                if (!frameAction.attribute || frameAction.expectedValue === undefined) {
                  throw new Error('Attribute name and expected value are required for hasAttribute action in frame')
                }
                const attributeValue = await frameElement.getAttribute(frameAction.attribute)
                expect(attributeValue, `${frameAction.selector} has attribute ${frameAction.attribute} with value ${frameAction.expectedValue} in frame`).toBe(frameAction.expectedValue)
                break
              }
              case 'value': {
                await waitFor(500)
                const value = await frameElement.evaluate(el => el.dataset.value)
                const v = value ? JSON.parse(value) : {}
                frameAction.callback?.(v)
                break
              }

              case 'callback': {
                if (frameAction.callback) {
                  await frameAction.callback({ page, element: frameElement, action: frameAction, browser })
                }
                break
              }

              default:
                throw new Error(`Unsupported frame action type: ${frameAction.type}`)
            }

            if (frameAction.waitAfter) {
              logger.info('WAIT_AFTER_FRAME_ACTION', { data: { wait: `${frameAction.waitAfter}ms` } })
              await waitFor(frameAction.waitAfter)
            }
          }
          break
        }
      }
    }
    catch (error) {
      const e = error as Error
      const actionType = action.type === 'frameInteraction' ? `frame: ${lastAction}` : action.type
      const sel = action.type === 'frameInteraction' ? `frame: ${lastSelector}` : action.selector
      const errorMessage = `ACTION_ERROR: ${actionType}(ind:${index}) on selector ${sel}: ${e.message}`
      const pageDom = await page.innerHTML('body')

      logger.error(errorMessage, { data: { error: e, data: { errorLogs: playwrightLogger.errorLogs, pageDom } } })
      throw new Error(errorMessage)
    }

    if (action.waitAfter) {
      logger.info('WAIT_AFTER', { data: { wait: `${action.waitAfter}ms` } })
      await waitFor(action.waitAfter)
    }
  }

  if (playwrightLogger.errorLogs.length > 0)
    playwrightLogger.errorLogs.forEach(e => console.error(e))
  // expect(errorLogs).toStrictEqual([])

  playwrightLogger.close()
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
