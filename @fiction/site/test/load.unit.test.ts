/**
 * @vitest-environment happy-dom
 */
import type { Site } from '../site'
import { shortId } from '@fiction/core'
import { afterAll, afterEach, describe, expect, it } from 'vitest'
import { domainMountContext, getMountContext, loadSite, loadSiteById, loadSiteFromTheme, requestManageSite } from '../load'
import { createSiteTestUtils } from './testUtils'

describe('domainMountContext', () => {
  it('should handle special domains correctly', () => {
    const runVars = { HOSTNAME: 'test.fiction.com' }
    const context = domainMountContext({ runVars })
    expect(context.subDomain).toBe('test')

    const runVarsLan = { HOSTNAME: 'theme-abc.lan.com' }
    const contextLan = domainMountContext({ runVars: runVarsLan })
    expect(contextLan.themeId).toBe('abc')
  })

  it('should handle non-special domains using ORIGINAL_HOST', () => {
    const runVars = { HOSTNAME: 'www.google.com', ORIGINAL_HOST: 'custom.fiction.com' }
    const context = domainMountContext({ runVars })
    expect(context.subDomain).toBe('custom')
  })

  it('should default to hostname if no suitable subdomain or theme is found', () => {
    const runVars = { HOSTNAME: 'www.google.com' }
    const context = domainMountContext({ runVars })
    expect(context.hostname).toBe('www.google.com')
  })

  it('return internal is ip', () => {
    const runVars = { HOSTNAME: '172.19.0.242' }
    const context = domainMountContext({ runVars })
    expect(context.internal).toBe('172.19.0.242')
  })

  it('return internal is localhost', () => {
    const runVars = { HOSTNAME: 'localhost' }
    const context = domainMountContext({ runVars })
    expect(context.internal).toBe('localhost')
  })
})

describe('getMountContext', () => {
  it('should prioritize mountContext if provided', () => {
    const runVars = {
      MOUNT_CONTEXT: {
        hostname: 'example.com',
      },
    }
    const result = getMountContext({ runVars })
    expect(result).toEqual(expect.objectContaining(runVars.MOUNT_CONTEXT))
  })

  it('should handle domain-based context correctly', () => {
    const runVars = { HOSTNAME: 'theme-xyz.lan.com' }
    const result = getMountContext({ runVars })
    expect(result.themeId).toBe('xyz')

    const runVarsOriginalHost = { HOSTNAME: 'www.google.com', ORIGINAL_HOST: 'sub.fiction.com' }
    const resultOriginalHost = getMountContext({ runVars: runVarsOriginalHost })
    expect(resultOriginalHost.subDomain).toBe('sub')
  })

  it('should throw an error when conflicting selectors are provided', () => {
    const runVars = {
      MOUNT_CONTEXT: { siteId: '123', themeId: '456' },
    }
    expect(() => getMountContext({ runVars })).toThrow('MountContext Error')
  })

  it('should return correct context when mountContext is provided', () => {
    const runVars = {
      MOUNT_CONTEXT: {
        siteId: '123',
        siteMode: 'editor',
      },
    }
    const result = getMountContext({ runVars })
    expect(result).toEqual({
      siteId: '123',
      siteMode: 'editor',
      contextCacheKey: expect.any(String),
    })
  })

  it('should return correct context when selectorType and selectorId are provided', () => {
    const args = {
      selectorType: 'site',
      selectorId: '123',
    }
    const result = getMountContext(args)
    expect(result).toEqual({
      siteId: '123',
      siteMode: 'standard',
      contextCacheKey: expect.any(String),
    })
  })

  it('accounts for empty selectors and queries', () => {
    const args = {
      selectorType: undefined,
      selectorId: undefined,
      queryVars: {
        siteId: undefined,
      },
      runVars: { HOSTNAME: 'xxx.fiction.test' },
      siteMode: 'editable',
    } as const
    const result = getMountContext(args)
    expect(result).toEqual({
      subDomain: 'xxx',
      siteMode: 'editable',
      contextCacheKey: expect.any(String),
    })
  })

  it('should return correct context when queryVars are provided', () => {
    const args = {
      queryVars: {
        siteId: '789',
      },
    }
    const result = getMountContext(args)
    expect(result).toEqual({
      siteId: '789',
      siteMode: 'standard',
      contextCacheKey: expect.any(String),
    })
  })

  it('should use currentSubDomain when no other selectors are provided', () => {
    const runVars = {
      HOSTNAME: 'current.domain',
    }
    const result = getMountContext({ runVars })
    expect(result.hostname).toBe('current.domain')
  })

  it('should throw an error when multiple selectors are provided', () => {
    const runVars = {
      MOUNT_CONTEXT: { siteId: '123', themeId: '456' },
    }
    expect(() => getMountContext({ runVars })).toThrow('MountContext Error')
  })

  it('should throw an error when no selectors are provided', () => {
    const args = {}
    expect(() => getMountContext(args)).toThrow('MountContext Error')
  })

  it('should handle non-default siteMode', () => {
    const runVars = {
      MOUNT_CONTEXT: {
        siteId: '123',
        siteMode: 'custom',
      },
    }
    const result = getMountContext({ runVars })
    expect(result).toEqual({
      siteId: '123',
      siteMode: 'custom',
      contextCacheKey: expect.any(String),
    })
  })
})

describe('site plugin tests', async () => {
  const testUtils = await createSiteTestUtils()
  const { user, orgId } = await testUtils.init()

  afterAll(() => testUtils.close())
  const handle = `test-${shortId({ len: 6, withNumbers: false })}`
  const hostname = `www.testing-${shortId({ len: 7 })}.com`
  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    siteMode: 'standard',
  } as const

  const r = await requestManageSite({
    fields: {
      title: 'test site',
      themeId: 'test',
      handle,
      isPrimary: true,
    },
    _action: 'create',
    caller: 'sitePluginTest',
    ...common,
  })

  const customDomains = {
    hostname,
    isPrimary: true,
  }

  // Insert custom domain into the database
  await testUtils.fictionSites.queries.ManageDomain.serve(
    { _action: 'create', orgId, fields: customDomains, userId: user?.userId, caller: 'test' },
    { server: true },
  )

  const site = r.site as Site

  if (!site)
    throw new Error('no site')

  afterEach(async () => {
    await testUtils.fictionRouter.push(`/`, { caller: 'sitePlugin' })
  })

  it('should load a site by hostname with loadSiteById', async (ctx) => {
    const loaded = await loadSiteById({
      where: { hostname },
      ...common,
    })

    const loaded2 = await loadSite({
      mountContext: { hostname },
      ...common,
    })

    const _r = await requestManageSite({
      fields: { },
      _action: 'update',
      caller: ctx.task.name,
      isPublishingDomains: true,
      where: { siteId: site.siteId },
      ...common,
    })

    expect(loaded).toBeDefined()
    expect(loaded?.siteId).toBe(site.siteId)

    expect(loaded2).toBeDefined()
    expect(loaded2?.siteId).toBe(site.siteId)
  })

  it('should load a site by ID with loadSiteById', async () => {
    const loaded = await loadSiteById({
      where: { siteId: site.siteId },
      ...common,
    })

    expect(loaded).toBeDefined()
    expect(loaded?.siteId).toBe(site.siteId)
  })

  it('should fail to load a site by undefined ID', async () => {
    const loaded = await loadSiteById({
      // @ts-expect-error test
      where: {},
      ...common,
    })

    expect(loaded).toBeUndefined()
  })

  it('should load a site from a theme with loadSiteFromTheme', async () => {
    const themeId = 'test'
    const loaded = await loadSiteFromTheme({ themeId, ...common, caller: 'loadTest' })

    expect(loaded).toBeDefined()
    expect(site.themeId.value).toBe(themeId)
  })

  it('should handle error when loading a site from an undefined theme', async () => {
    await expect(loadSiteFromTheme({
      // @ts-expect-error test
      themeId: undefined,
      ...common,
    })).rejects.toThrow('no theme found')
  })

  it('should load a site based on various parameters with loadSite', async () => {
    if (!handle)
      throw new Error('no sub domain')

    const mountContext = getMountContext({ queryVars: { handle } })

    const loaded = await loadSite({ ...common, mountContext })

    expect(loaded).toBeDefined()

    expect(loaded?.handle.value).toBe(handle)
  })

  it('should load a site by themeId', async (ctx) => {
    const themeId = 'test'
    await testUtils.fictionRouter.push(`${testUtils.fictionSites.previewRoute}/theme/${themeId}/`, { caller: ctx.task.name })

    const { selectorType, selectorId } = testUtils.fictionRouter.params.value as Record<string, string>
    const mountContext = getMountContext({ selectorType, selectorId, siteMode: 'standard' })
    const site = await loadSite({
      ...common,
      mountContext,
    })

    expect(site).toBeDefined()
    expect(site?.themeId.value).toBe(themeId)
  })

  it('should load a site by siteId extracted from URL', async (ctx) => {
    const siteId = site.siteId
    await testUtils.fictionRouter.push(`${testUtils.fictionSites.previewRoute}/site/${siteId}/`, { caller: ctx.task.name })

    const { selectorType, selectorId } = testUtils.fictionRouter.params.value as Record<string, string>
    const mountContext = getMountContext({ selectorType, selectorId, siteMode: 'standard' })
    const loaded = await loadSite({ ...common, mountContext })

    expect(loaded).toBeDefined()
    expect(loaded?.siteId).toBe(siteId)
  })
})
