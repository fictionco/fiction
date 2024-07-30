import { describe, expect, it } from 'vitest'
import fs from 'fs-extra'
import { execa } from 'execa'
import { path, randomBetween, safeDirname } from '@fiction/core'
import { appRunTest } from '@fiction/core/test-utils/buildTest.js'
import dotenv from 'dotenv'
import { createTestUtils } from '@fiction/core/test-utils'

describe('dist checks', async () => {
  const testUtils = createTestUtils()

  const envVarEntries = testUtils.fictionEnv.getPluginVars().filter(_ => !_.isSystem && !_.isOptional && _.val.value).map(v => [v.name, v.val.value])
  const envVars = Object.fromEntries(envVarEntries)

  const CI = process.env.CI

  // get local .env.test file if it exists
  const p = `${path.dirname(require.resolve('@fiction/core'))}/test-utils/.env.test`
  dotenv.config({ path: p })

  const services = [{ appId: 'fiction-sites' }, { appId: 'fiction-website' }, { appId: 'fiction-beacon' }]
  it('has secrets', async () => {
    const token = process.env.FLY_API_TOKEN

    if (!token)
      throw new Error('!!!FLY_API_TOKEN not found!!!')

    for (const service of services) {
      const { stdout } = await execa`flyctl secrets list -a ${service.appId} --access-token ${token}`

      // const secrets = ['FLY_API_TOKEN', 'POSTGRES_URL', 'GH_TOKEN', 'TOKEN_SECRET', 'AWS_ACCESS_KEY', 'AWS_ACCESS_KEY_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']
      const secrets = Object.keys(envVars)
      for (const secret of secrets)
        expect(stdout).toContain(secret)
    }
  })

  const dir = safeDirname(import.meta.url, '..')
  const distDir = `${dir}/dist`
  it('dist files built has dist files', async () => {
    const files = await fs.readdir(distDir)

    const expectedDirs = ['app', 'sites']
    expect(files).toEqual(expect.arrayContaining(expectedDirs))

    const expectedFiles = ['client', 'server']

    for (const dir of expectedDirs) {
      const dirFiles = await fs.readdir(`${distDir}/${dir}`)
      expect(dirFiles).toEqual(expect.arrayContaining(expectedFiles))
    }

    for (const appDir of expectedDirs) {
      const clientDirFiles = await fs.readdir(`${distDir}/${appDir}/client`)

      const clientFiles = ['index.html', 'assets', 'robots.txt']

      expect(clientDirFiles).toEqual(expect.arrayContaining(clientFiles))

      const serverFiles = ['mount.js', 'assets']

      const serverDirFiles = await fs.readdir(`${distDir}/${appDir}/server`)
      expect(serverDirFiles).toEqual(expect.arrayContaining(serverFiles))
    }
  })

  it('runs app', async () => {
    const appPort = randomBetween(1050, 60000)
    const sitesPort = randomBetween(1050, 60000)
    let html = ''
    let status = 0
    await appRunTest({
      cmd: `npm exec -w @fiction/www -- fiction run app --app-port=${appPort} --sites-port=${sitesPort}`,
      port: appPort,
      envVars: { ...envVars, CI },
      onTrigger: async () => {
        const response = await fetch(`http://localhost:${appPort}/`)
        html = await response.text()
        status = response.status
      },
    })
    expect(status).toBe(200)
    expect(html).toContain('<!DOCTYPE html>')
  })

  it('runs sites sub domain', async () => {
    const appPort = randomBetween(1050, 60000)
    const sitesPort = randomBetween(1050, 60000)
    let html = ''
    let status = 0
    await appRunTest({
      cmd: `npm exec -w @fiction/www -- fiction run sites --app-port=${appPort} --sites-port=${sitesPort}`,
      port: appPort,
      envVars: { ...envVars, CI },
      onTrigger: async () => {
        const response = await fetch(`http://test.lan.com:${sitesPort}/`)
        html = await response.text()
        status = response.status
      },
    })
    expect(status).toBe(200)
    expect(html).toContain('<!DOCTYPE html>')
  })
})
