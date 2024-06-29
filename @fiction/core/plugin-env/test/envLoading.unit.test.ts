/**
 * @vitest-environment happy-dom
 */

import type { Mock } from 'vitest'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { randomBetween, safeDirname, vue, waitFor } from '@fiction/core/utils'
import { FictionApp } from '@fiction/core/plugin-app'
import { FictionRouter } from '@fiction/core/plugin-router'
import type { FictionPluginSettings } from '@fiction/core/plugin.js'
import { FictionPlugin } from '@fiction/core/plugin.js'
import { CliCommand, FictionEnv } from '../index.js'
import type { ServiceConfig } from '../types.js'

let serviceConfig: ServiceConfig

class TestPlugin extends FictionPlugin {
  foo = vue.ref('')
  constructor(settings: FictionPluginSettings) {
    super('TestPlugin', { root: safeDirname(import.meta.url), ...settings })
  }

  override async setup() {
    this.foo.value = 'bar'
  }
}

let runCommandMock: Mock
let service: { fictionEnv: FictionEnv, fictionRouter: FictionRouter, fictionApp: FictionApp, testPlugin: TestPlugin }

describe('env service config', () => {
  beforeAll(async () => {
    const fictionEnv = new FictionEnv({
      cwd: safeDirname(import.meta.url, '..'),
      commands: [
        new CliCommand({
          command: 'test',
          options: { mode: 'production', exit: false, abc: 'xyz' },
          type: 'service',
          port: 3000,
        }),
        new CliCommand({
          command: 'testDev',
          options: { mode: 'development', exit: false, xyz: 'abc' },
          type: 'service',
          port: 5000,
        }),
      ],
    })
    const fictionRouter = new FictionRouter({ fictionEnv })
    const fictionApp = new FictionApp({ fictionEnv, port: randomBetween(3000, 4000), fictionRouter })
    const testPlugin = new TestPlugin({ fictionEnv })
    service = { fictionEnv, fictionRouter, fictionApp, testPlugin }
  })

  it('server run', async () => {
    runCommandMock = vi.fn(async (_args) => { })
    serviceConfig = {
      service,
      runVars: {},
      runCommand: runCommandMock,
      createMount: async (args) => {
        const mountEl = document.createElement('div')
        return service.fictionApp.mountApp({ mountEl, ...args })
      },
    }
    serviceConfig.service.fictionEnv.commandName.value = 'test'
    await serviceConfig.service.fictionEnv.serverRunCurrentCommand({ serviceConfig, cliVars: {} })

    expect(service.testPlugin.foo.value, 'ran setup callback').toBe('bar')

    // Assert that runCommandMock was called with the expected arguments
    expect(runCommandMock).toHaveBeenCalled()
    expect(runCommandMock).toHaveBeenCalledWith(expect.objectContaining({
      command: 'test',
      context: 'node',
    }))

    expect(service.fictionEnv.mode.value).toBe('production')
    expect(process.env.NODE_ENV).toBe('production')
    expect(process.env.ABC).toBe('xyz')
    expect(service.fictionEnv.currentCommand.value?.options).toMatchInlineSnapshot(`
      {
        "abc": "xyz",
        "exit": false,
        "mode": "production",
      }
    `)

    serviceConfig.service.fictionEnv.commandName.value = 'testDev'

    await waitFor(50)

    expect(service.fictionEnv.mode.value).toBe('development')
    expect(process.env.NODE_ENV).toBe('development')

    runCommandMock.mockClear()

    if (!serviceConfig.createMount)
      throw new Error('createMount not defined')

    await serviceConfig.createMount({ serviceConfig })
    expect(runCommandMock).toHaveBeenCalled()
    expect(runCommandMock).toHaveBeenCalledWith(expect.objectContaining({ command: 'testDev', context: 'app' }))
  })
})
