import path from 'node:path'
import { Buffer } from 'node:buffer'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { MainFile } from '@fiction/core/plugin-env'

import type { ResultPromise } from 'execa'
import { execa } from 'execa'
import { executeCommand, getMainFilePath, importIfExists } from '../nodeUtils'

const cwd = path.dirname(new URL('../../../www/package.json', import.meta.url).pathname)
describe('node utils', () => {
  beforeAll(() => {

  })

  it('hashes files correct', async () => {

  })

  it('has right cwd', async () => {
    expect(cwd).toMatchInlineSnapshot(`"/Users/arpowers/dev/fiction/@fiction/www"`)
  })
  it('gets correct main file path', async () => {
    const filePath = getMainFilePath({ cwd })

    expect(filePath).toContain(`/www/src/index.ts`)
  })

  it('imports files if it exists', async () => {
    const importFile = (await importIfExists(cwd)) as Record<string, any>
    expect(Object.keys(importFile).sort()).toMatchInlineSnapshot(
      `
      [
        "setup",
      ]
    `,
    )
  })

  it('gets correct server entry config', async () => {
    const filePath = getMainFilePath({ cwd })
    expect(filePath).toMatchInlineSnapshot(`"/Users/arpowers/dev/fiction/@fiction/www/src/index.ts"`)
    if (!filePath)
      throw new Error('No file path found')

    const mainFileImports = (await import(filePath)) as MainFile

    const serviceConfig = await mainFileImports.setup()

    if (!serviceConfig?.service)
      throw new Error('No service config found')

    const service = serviceConfig?.service

    expect(Object.keys(service).sort()).toMatchInlineSnapshot(`
      [
        "fictionAdmin",
        "fictionAi",
        "fictionApp",
        "fictionAppSites",
        "fictionAws",
        "fictionCache",
        "fictionDb",
        "fictionEmail",
        "fictionEmailActions",
        "fictionEnv",
        "fictionExtend",
        "fictionMedia",
        "fictionMonitor",
        "fictionRouter",
        "fictionRouterSites",
        "fictionServer",
        "fictionSites",
        "fictionStripe",
        "fictionSubscribe",
        "fictionTeam",
        "fictionUi",
        "fictionUser",
      ]
    `)
  })
})

/**
 * EXECUTE COMMAND TESTS
 */
// Mock execaCommand
vi.mock('execa', () => ({
  execa: vi.fn(),
}))

function mockProcess(code: number, stdoutData: string[], stderrData: string[]) {
  const stdout = {
    pipe: vi.fn(),
    on: vi.fn((event, handler) => {
      if (event === 'data')
        stdoutData.forEach(data => handler(Buffer.from(data)))
    }),
  }
  const stderr = {
    pipe: vi.fn(),
    on: vi.fn((event, handler) => {
      if (event === 'data')
        stderrData.forEach(data => handler(Buffer.from(data)))
    }),
  }
  return {
    stdout,
    stderr,
    on: vi.fn((event, handler) => {
      if (event === 'close')
        handler(code)
    }),
  }
}

describe('executeCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should execute the command successfully and return stdout', async () => {
    const mockOutput = ['line 1', 'line 2']
    const cp = mockProcess(0, mockOutput, [])
    vi.mocked(execa).mockReturnValue(cp as unknown as ResultPromise)

    const result = await executeCommand({ command: 'echo "Hello, World!"' })
    expect(result.stdout).toBe(mockOutput.join('\n'))
    expect(result.stderr).toBe('')
    expect(cp.stdout.pipe).toHaveBeenCalled()
    expect(cp.stderr.pipe).toHaveBeenCalled()
    expect(cp.stdout.on).toHaveBeenCalled()
    expect(cp.stderr.on).toHaveBeenCalled()
  })

  it('should handle command failure and return stderr', async () => {
    const mockErrors = ['error 1', 'error 2']
    const cp = mockProcess(1, [], mockErrors)
    vi.mocked(execa).mockReturnValue(cp as unknown as ResultPromise)

    await expect(executeCommand({ command: 'exit 1' }))
      .rejects.toThrow(`Command failed with exit code 1\nErrors:\n${mockErrors.join('\n')}`)
  })

  it('should handle process errors', async () => {
    const cp = mockProcess(0, [], [])
    const errorMessage = 'Process error'
    cp.on = vi.fn((event, handler) => {
      if (event === 'error')
        handler(new Error(errorMessage))
    })
    vi.mocked(execa).mockReturnValue(cp as unknown as ResultPromise)

    await expect(executeCommand({ command: 'echo "Hello, World!"' })).rejects.toThrow(errorMessage)
  })
})
