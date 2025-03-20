import type { ResultPromise } from 'execa'
import { Buffer } from 'node:buffer'

import { execa } from 'execa'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { executeCommand } from '../nodeUtils'

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
      .rejects
      .toThrow(`Command failed with exit code 1\nErrors:\n${mockErrors.join('\n')}`)
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
