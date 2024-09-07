/**
 * @vitest-environment happy-dom
 */

import { crossVar } from '@fiction/core/utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EnvVar, FictionEnv } from '../index.js'
import { vars } from '../onImport.js'

describe('fictionEnv', () => {
  let fictionEnv: FictionEnv

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    crossVar.clear()
    fictionEnv = new FictionEnv({
      cwd: '/test',
      envFiles: ['/test/.env'],
      meta: { app: { name: 'TestApp' } },
    })
  })

  afterEach(() => {
    fictionEnv.cleanup({ reason: 'test cleanup' })
  })

  it('initializes with correct default values', () => {
    expect(fictionEnv.id).toBe('test-app')
    expect(fictionEnv.cwd).toBe('/test')
    expect(fictionEnv.envFiles).toEqual(['/test/.env'])
    expect(fictionEnv.mode.value).toBe('development')
    expect(fictionEnv.isApp.value).toBe(false)
    expect(fictionEnv.isProd.value).toBe(false)
  })

  it('handles command setting and options', () => {
    crossVar.set('COMMAND', 'test-command')
    crossVar.set('COMMAND_OPTS', JSON.stringify({ mode: 'development' }))

    fictionEnv = new FictionEnv({ cwd: '/test' })

    expect(fictionEnv.commandName.value).toBe('test-command')
    expect(fictionEnv.commandOpts.value).toEqual({ mode: 'development' })
    expect(fictionEnv.mode.value).toBe('development')
  })

  it('adds UI and static paths correctly', () => {
    fictionEnv.addUiRoot('/test/ui')

    expect(fictionEnv.uiPaths.has('/test/ui/*.vue')).toBe(true)
    expect(fictionEnv.uiPaths.has('/test/ui/**/*.ts')).toBe(true)
    expect(fictionEnv.staticPaths.has('/test/ui/static')).toBe(true)
  })

  it('handles environment variables correctly', () => {
    vars.register(() => [
      new EnvVar({ name: 'TEST_VAR', isPublic: true }),
    ])
    crossVar.setAny('TEST_VAR', 'test-value')

    expect(crossVar.get('TEST_VAR')).toBe('test-value')

    expect(fictionEnv.var('TEST_VAR')).toBe('test-value')
    expect(fictionEnv.getRenderedEnvVars()).toHaveProperty('TEST_VAR', 'test-value')
  })

  it('emits resetUi event', () => new Promise((done) => {
    fictionEnv.events.on('resetUi', (event) => {
      expect(event.detail).toEqual({ scope: 'all', cause: expect.any(String), trigger: 'test' })
      done(true)
    })

    fictionEnv.events.emit('resetUi', { scope: 'all', cause: 'resetUi tests', trigger: 'test' })
  }))

  it('tracks held keys correctly', () => {
    fictionEnv.events.emit('keypress', { key: 'a', direction: 'down' })
    expect(fictionEnv.heldKeys.value.a).toBe(true)

    fictionEnv.events.emit('keypress', { key: 'a', direction: 'up' })
    expect(fictionEnv.heldKeys.value.a).toBeFalsy()
  })

  it('runs hooks correctly', async () => {
    const mockHook = vi.fn()
    fictionEnv.addHook({ hook: 'runCommand', callback: mockHook })

    await fictionEnv.runHooks('runCommand', 'test', {})
    expect(mockHook).toHaveBeenCalledWith('test', {})
  })

  it('handles cross run command correctly', async () => {
    const mockServiceConfig = {
      runCommand: vi.fn(),
      service: { fictionEnv },
      runVars: {},
    }

    await fictionEnv.crossRunCommand({
      context: 'node',
      serviceConfig: mockServiceConfig,
      cliVars: { },
    })

    expect(mockServiceConfig.runCommand).toHaveBeenCalled()
  })
})
