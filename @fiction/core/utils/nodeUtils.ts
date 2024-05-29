/* server-only-file */
import path from 'node:path'
import * as mod from 'node:module'
import type { Buffer } from 'node:buffer'
import process from 'node:process'
import v8 from 'node:v8'
import fs from 'fs-extra'
import type { ExecaError, ResultPromise } from 'execa'
import { execa } from 'execa'
import type { PackageJson } from '../types'
import { log } from '../plugin-log'
import { isNode } from './vars'
import { formatBytes } from './number'

interface WhichModule {
  moduleName?: string
  cwd?: string
}

const logger = log.contextLogger('nodeUtils')

export function logMemoryUsage() {
  // Repeated logging every 30 seconds
  const interval = setInterval(() => {
    const memoryUsage = v8.getHeapStatistics()
    const out = [
      'Memory /',
      `Used: ${formatBytes(memoryUsage.used_heap_size)}`,
      `Total: ${formatBytes(memoryUsage.total_heap_size)}`,
      `Limit: ${formatBytes(memoryUsage.heap_size_limit)}`,
    ]

    logger.info(out.join(' '))
  }, 60000)

  // This will not prevent the process from exiting if this is the only activity left in the event loop.
  interval.unref()
}

export async function executeCommand(args: {
  command: string
  envVars?: { [key: string]: string }
  timeout?: number
  resolveText?: string
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

      const onText = (text: string) => {
        if (resolveText && text.includes(resolveText))
          resolve(text)
        // close()

        if (args.triggerText && text.includes(args.triggerText) && args.onTrigger)
          void args.onTrigger({ ...commandDetails(), text, close, cp })
      }

      cp.stdout?.on('data', (d: Buffer) => {
        output.push(d.toString())
        onText(d.toString())
      })

      cp.stderr?.on('data', async (d: Buffer) => {
        errorsOutput.push(d.toString())
        onText(d.toString())
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

function mainFileRel(cwd: string): string {
  const pkgPath = path.resolve(cwd, 'package.json')
  const pkg = getRequire()(pkgPath) as PackageJson | undefined
  return pkg?.main ?? 'index'
}

export function getMainFilePath(params: WhichModule = {}): string | undefined {
  const { cwd, moduleName } = params
  return moduleName
    ? getRequire().resolve(moduleName)
    : cwd
      ? path.resolve(cwd, mainFileRel(cwd))
      : undefined
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

/**
 * Require a path if it exists and silence any not found errors if it doesn't
 */
export function requireIfExists<T = unknown>(mod: string): T | undefined {
  let result: T | undefined
  try {
    result = getRequire()(mod) as T
  }
  catch (error: any) {
    const e = error as NodeJS.ErrnoException
    if (e.code === 'MODULE_NOT_FOUND') {
      // get module missing in error message
      // https://stackoverflow.com/a/32808869
      const m = e.message.match(/(?<=')(.*?)(?=')/g)

      if (m && !m.includes(mod))
        throw error
    }
    else {
      throw error
    }
  }

  return result
}

export function resolveIfExists(mod: string): string | undefined {
  let result: string | undefined
  try {
    result = getRequire().resolve(mod)
  }
  catch (error: any) {
    const e = error as NodeJS.ErrnoException
    if (e.code === 'MODULE_NOT_FOUND') {
      // get module missing in error message
      // https://stackoverflow.com/a/32808869
      const m = e.message.match(/(?<=')(.*?)(?=')/g)

      if (m && !m.includes(mod))
        throw error
    }
    else {
      throw error
    }
  }

  return result
}

export async function streamToString(stream?: NodeJS.ReadableStream): Promise<string> {
  if (!stream)
    return ''
  const chunks: Uint8Array[] = []
  const { Buffer } = await import('node:buffer')
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Uint8Array) => chunks.push(Buffer.from(chunk)))
    stream.on('error', (err: Error) => reject(err))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}
