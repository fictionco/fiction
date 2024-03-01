/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */

import type {
  KaptionTestUtils,
} from '@kaption/core/test-utils'
import {
  createKaptionTestUtils,
} from '@kaption/core/test-utils'
import { base64 } from '@factor/api'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { getProvider } from '../../providers'
import { KaptionIntegrations } from '..'

type CurrentTestUtils = KaptionTestUtils & {
  kaptionIntegrations: KaptionIntegrations
}
let testUtils: CurrentTestUtils | undefined

const openMock = vi.fn(() => {
  return () => true
})

vi.stubGlobal('open', openMock)
const provider = 'googleSheets'
const context = 'test'

describe('oauth', () => {
  beforeAll(async () => {
    const utils = await createKaptionTestUtils({ serverPort: 10_000 })

    const kaptionIntegrations = new KaptionIntegrations(utils)

    utils.kaptionIntegrations = kaptionIntegrations

    testUtils = utils as CurrentTestUtils

    testUtils.initialized = await testUtils.init()
  })

  // test oauth connection
  // it("creates correct url", async () => {
  //   await testUtils?.kaptionIntegrations.clientConnect({
  //     provider,
  //     context,
  //   })

  //   expect(openMock.mock.calls[0].length).toBe(3)
  // })

  it('gets provider and urls', async () => {
    const { factorDb, factorEnv, initialized, kaptionIntegrations }
      = testUtils || {}
    const projectId = initialized?.project.projectId
    const organizationId = initialized?.project.organizationId

    if (
      !factorDb
      || !factorEnv
      || !projectId
      || !organizationId
      || !kaptionIntegrations
    )
      throw new Error('test utils are undefined')

    const integration = getProvider({
      provider,
      factorDb,
      factorEnv,
      projectId: initialized?.project.projectId,
      organizationId,
      kaptionIntegrations,
      context,
    })

    const redirectUri = kaptionIntegrations.getOAuthUrl({
      provider,
      action: 'callback',
    })

    expect(redirectUri).toContain('oauth/googleSheets/callback')

    const scope = integration.auth.scope

    const state = base64({
      str: JSON.stringify({ projectId, organizationId, context, settings: {} }),
      action: 'encode',
    })

    const authorizationUri = integration.auth.getAuthUrl({
      redirectUri,
      scope,
      state,
    })

    const comp = new URL(authorizationUri)

    expect(comp.host).toMatchInlineSnapshot('"accounts.google.com"')

    const k = [...comp.searchParams.keys()].map(k => k)
    expect(k).toMatchInlineSnapshot(`
      [
        "prompt",
        "access_type",
        "response_type",
        "redirect_uri",
        "scope",
        "state",
        "client_id",
      ]
    `)

    const authUrl = await kaptionIntegrations.oAuthHandler({
      mode: 'init',
      params: { provider },
      query: { state },
    })

    expect(authUrl).toContain('accounts.google.com')

    /**
     * For this to provide a successful response, the redirect URL would need to match
     * the one used to generate the code,
     * https://developers.google.com/oauthplayground
     */
    const returnHtml = await kaptionIntegrations.oAuthHandler({
      mode: 'callback',
      params: {
        provider,
      },
      query: {
        state,
        code: '4/0ARtbsJrZKH5jWoqIpryfP9lv2sQX2NYP0bI2gh4mXPSM8c3Jms7ybCq3MaO9aCxbXj7TAw',
      },
    })

    expect(returnHtml).toContain(`<html>`)
  })
})
