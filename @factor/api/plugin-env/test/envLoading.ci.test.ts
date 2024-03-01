/**
 * @vitest-environment happy-dom
 */

import type { Mock } from 'vitest'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { randomBetween, safeDirname, vue, waitFor } from '@factor/api/utils'
import { FactorApp } from '@factor/api/plugin-app'
import { FactorRouter } from '@factor/api/plugin-router'
import type { FactorPluginSettings } from '@factor/api/plugin'
import { FactorPlugin } from '@factor/api/plugin'
import { CliCommand, FactorEnv } from '..'
import type { ServiceConfig } from '../types'

let serviceConfig: ServiceConfig

class TestPlugin extends FactorPlugin {
  foo = vue.ref('')
  constructor(settings: FactorPluginSettings) {
    super('TestPlugin', { root: safeDirname(import.meta.url), ...settings })
  }

  async setup() {
    this.foo.value = 'bar'
  }
}

let runCommandMock: Mock
let service: { factorEnv: FactorEnv, factorRouter: FactorRouter, factorApp: FactorApp, testPlugin: TestPlugin }

describe('env service config', () => {
  beforeAll(async () => {
    const factorEnv = new FactorEnv({
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
    const factorRouter = new FactorRouter({ factorEnv })
    const factorApp = new FactorApp({ factorEnv, port: randomBetween(3000, 4000), factorRouter })
    const testPlugin = new TestPlugin({ factorEnv })
    service = { factorEnv, factorRouter, factorApp, testPlugin }
  })

  it('server run', async () => {
    runCommandMock = vi.fn(async (_args) => { })
    serviceConfig = {
      factorEnv: service.factorEnv,
      runCommand: runCommandMock,
      createService: async () => service,
      createMount: async (args) => {
        const mountEl = document.createElement('div')
        return await service.factorApp.mountApp({ mountEl, ...args })
      },
    }
    serviceConfig.factorEnv.commandName.value = 'test'
    await serviceConfig.factorEnv.serverRunCurrentCommand({ serviceConfig, cliVars: {} })

    expect(service.testPlugin.foo.value, 'ran setup callback').toBe('bar')

    // Assert that runCommandMock was called with the expected arguments
    expect(runCommandMock).toHaveBeenCalled()
    expect(runCommandMock).toHaveBeenCalledWith(expect.objectContaining({
      command: 'test',
      context: 'node',
    }))

    expect(service.factorEnv.mode.value).toBe('production')
    expect(process.env.NODE_ENV).toBe('production')
    expect(process.env.ABC).toBe('xyz')
    expect(service.factorEnv.currentCommand.value?.options).toMatchInlineSnapshot(`
      {
        "abc": "xyz",
        "exit": false,
        "mode": "production",
      }
    `)

    serviceConfig.factorEnv.commandName.value = 'testDev'

    await waitFor(50)

    expect(service.factorEnv.mode.value).toBe('development')
    expect(process.env.NODE_ENV).toBe('development')

    runCommandMock.mockClear()

    if (!serviceConfig.createMount)
      throw new Error('createMount not defined')

    await serviceConfig.createMount({ service, serviceConfig, runVars: {} })
    expect(runCommandMock).toHaveBeenCalled()
    expect(runCommandMock).toHaveBeenCalledWith(expect.objectContaining({
      command: 'testDev',
      context: 'app',
    }))
  })
})
