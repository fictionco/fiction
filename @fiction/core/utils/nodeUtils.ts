import type { ExecaError, ResultPromise } from 'execa'
import type { Buffer } from 'node:buffer'
import * as mod from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { execa } from 'execa'
import fs from 'fs-extra'
import { log } from '../plugin-log'
import { formatBytes } from './number'
import { waitFor } from './utils.js'
import { isNode } from './vars'

const logger = log.contextLogger('nodeUtils')

export function getMonorepoRootPath() {
  let currentPath = process.cwd()

  // We'll check for up to 5 levels up to find the monorepo root
  for (let i = 0; i < 5; i++) {
    // Check for specific files that indicate the monorepo root
    if (fs.existsSync(path.join(currentPath, 'pnpm-workspace.yaml'))
      && fs.existsSync(path.join(currentPath, '.pnpmfile.js'))) {
      return currentPath
    }

    const parentPath = path.dirname(currentPath)
    if (parentPath === currentPath) {
      // We've reached the root of the filesystem
      break
    }
    currentPath = parentPath
  }

  // If we couldn't find the monorepo root, return null or throw an error
  return null
}

export async function getNodeBuffer() {
  if (!isNode())
    throw new Error('getNodeBuffer: not a node environment')

  const { Buffer } = await import('node:buffer')

  return Buffer
}

export async function logMemoryUsage() {
  const { default: v8 } = await import('node:v8')
  const memoryUsage = v8.getHeapStatistics()

  const heapSize = memoryUsage.used_heap_size
  if (heapSize <= 700000000) {
    return
  }

  const out = [
    'Memory:',
    `Used: ${formatBytes(memoryUsage.used_heap_size)}`,
    `Total: ${formatBytes(memoryUsage.total_heap_size)}`,
    `Limit: ${formatBytes(memoryUsage.heap_size_limit)}`,
  ]

  logger.info(out.join(' '))
}

export async function executeCommand(args: {
  command: string
  envVars?: { [key: string]: string }
  timeout?: number
  resolveText?: string
  beforeResolve?: () => Promise<void>
  triggerText?: string
  onTrigger?: (args: { stdout: string, stderr: string, text: string, close: () => void, cp: ResultPromise }) => Promise<void> | void
}) {
  const { command, envVars = {}, timeout = 10000, resolveText } = args
  const output: string[] = []
  const errorsOutput: string[] = []
  const commandDetails = () => ({ stdout: output.join(`\n`), stderr: errorsOutput.join(`\n`) })
  try {
    await new Promise((resolve, reject) => {
      const c = command.split(' ')

      const cp = execa(c[0], c.slice(1), { env: envVars, timeout, forceKillAfterTimeout: true })

      cp.stdout?.pipe(process.stdout)
      cp.stderr?.pipe(process.stderr)

      /**
       * NOTE: the order of listeners is important
       * they trigger in order of their addition
       */

      const close = () => {
        cp.kill()
        resolve(1)
      }

      const onText = async (text: string) => {
        if (resolveText && text.includes(resolveText)) {
          if (args.beforeResolve) {
            try {
              await args.beforeResolve()
              await waitFor(1000)
            }
            catch (error) {
              reject(error)
            }
          }

          resolve(text)
        }
        // close()

        if (args.triggerText && text.includes(args.triggerText) && args.onTrigger)
          void args.onTrigger({ ...commandDetails(), text, close, cp })
      }

      cp.stdout?.on('data', async (d: Buffer) => {
        output.push(d.toString())
        await onText(d.toString())
      })

      cp.stderr?.on('data', async (d: Buffer) => {
        errorsOutput.push(d.toString())
        await onText(d.toString())
      })

      void cp.on('close', (code) => {
        if (code === 0)
          resolve(output.join(`\n`))
        else
          reject(new Error(`Command failed with exit code ${code}\nErrors:\n${errorsOutput.join(`\n`)}`))
      })

      void cp.on('error', (err) => {
        reject(err)
      })
    })
  }
  catch (error) {
    const e = error as ExecaError
    if (e.isCanceled) {
      console.error('Killed by Close Signal')
    }
    else {
      console.error('[executeCommand] The command failed:', e)
      throw e // Rethrow the error to be handled by the caller
    }
  }

  return commandDetails()
}

export function getRequire() {
  if (!isNode())
    throw new Error('getRequire: not a node environment')

  return mod.Module.createRequire(import.meta.url)
}

/**
 * Require a path if it exists and silence any not found errors if it doesn't
 */
export async function importIfExists<T = unknown>(mod: string): Promise<T | undefined> {
  if (fs.existsSync(mod)) {
    const i = import(/* @vite-ignore */ mod)
    const v = (await i) as T
    return v
  }
}

export async function streamToString(stream?: NodeJS.ReadableStream): Promise<string> {
  if (!stream)
    return ''
  const chunks: Uint8Array[] = []
  const Buffer = await getNodeBuffer()
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Uint8Array) => chunks.push(Buffer.from(chunk)))
    stream.on('error', (err: Error) => reject(err))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

export function stripBrowserConsoleFormatting(message: string): string {
  // Regular expression to match the actual message content
  const messageRegex = /%c([^%]+)(?=%c|$)/g

  // Extract all message parts
  const messageParts = message.match(messageRegex)

  if (!messageParts) {
    // If no formatted parts found, return the original message
    return message
  }

  // Join the message parts, removing the %c prefix
  return messageParts.map(part => part.replace('%c', '')).join(' ').trim()
}
