import { path } from '@fiction/core'
import { createTestUtils } from '@fiction/core/test-utils'
import dotenv from 'dotenv'
import { execa } from 'execa'
import { describe, expect, it } from 'vitest'

describe('environment checks', async () => {
  const testUtils = createTestUtils()

  const envVarEntries = testUtils.fictionEnv.getPluginVars().filter(_ => !_.isSystem && !_.isOptional && _.val.value).map(v => [v.name, v.val.value])
  const envVars = Object.fromEntries(envVarEntries)

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
})
