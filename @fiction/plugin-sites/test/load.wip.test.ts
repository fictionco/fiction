/**
 * @vitest-environment happy-dom
 */
import { shortId } from '@fiction/core'
import { afterEach, describe, expect, it } from 'vitest'
import type { Site } from '../site'
import { getMountContext, loadSite, loadSiteById, loadSiteFromTheme, requestManageSite } from '../load'
import { createSiteTestUtils } from './siteTestUtils'

describe('getMountContext', () => {
  it('should return correct context when mountContext is provided', () => {
    const args = {
      mountContext: {
        siteId: '123',
        siteMode: 'editor',
      },
    }
    const result = getMountContext(args)
    expect(result).toEqual({
      siteId: '123',
      siteMode: 'editor',
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
    })
  })

  it('accounts for empty selectors and queries', () => {
    const args = {
      selectorType: undefined,
      selectorId: undefined,
      queryVars: {
        siteId: undefined,
      },
      currentSubDomain: 'test',
      siteMode: 'editable',
    } as const
    const result = getMountContext(args)
    expect(result).toEqual({
      subDomain: 'test',
      siteMode: 'editable',
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
    })
  })

  it('should use currentSubDomain when no other selectors are provided', () => {
    const args = {
      currentSubDomain: 'current.domain',
    }
    const result = getMountContext(args)
    expect(result.subDomain).toBe('current.domain')
  })

  it('should throw an error when multiple selectors are provided', () => {
    const args = {
      mountContext: { siteId: '123', themeId: '456' },
    }
    expect(() => getMountContext(args)).toThrow('MountContext Error')
  })

  it('should throw an error when no selectors are provided', () => {
    const args = {}
    expect(() => getMountContext(args)).toThrow('MountContext Error')
  })

  it('should handle non-default siteMode', () => {
    const args = {
      mountContext: {
        siteId: '123',
        siteMode: 'custom',
      },
    }
    const result = getMountContext(args)
    expect(result).toEqual({
      siteId: '123',
      siteMode: 'custom',
    })
  })
})

describe('site plugin tests', async () => {
  const testUtils = await createSiteTestUtils()
  await testUtils.init()
  const subDomain = `test-${shortId({ len: 3, withNumbers: false })}`

  const common = {
    factorSites: testUtils.factorSites,
    siteRouter: testUtils.factorRouterSites,
    siteMode: 'standard',
  } as const

  const r = await requestManageSite({
    fields: {
      title: 'test site',
      themeId: 'test',
      subDomain,
    },
    _action: 'create',
    caller: 'sitePluginTest',
    ...common,
  })

  const site = r.site as Site

  if (!site)
    throw new Error('no site')

  afterEach(async () => {
    await testUtils.factorRouter.push(`/`)
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
    if (!subDomain)
      throw new Error('no sub domain')

    const mountContext = getMountContext({ currentSubDomain: subDomain })

    const loaded = await loadSite({ ...common, mountContext })

    expect(loaded).toBeDefined()

    expect(loaded?.subDomain.value).toBe(subDomain)
  })

  it('should load a site by themeId', async () => {
    const themeId = 'test'
    await testUtils.factorRouter.push(`${testUtils.factorAdmin.adminBaseRoute}/preview/theme/${themeId}/`)

    const { selectorType, selectorId } = testUtils.factorRouter.params.value as Record<string, string>
    const mountContext = getMountContext({ selectorType, selectorId, siteMode: 'standard' })
    const site = await loadSite({
      ...common,
      mountContext,
    })

    expect(site).toBeDefined()
    expect(site?.themeId.value).toBe(themeId)
  })

  it('should load a site by siteId extracted from URL', async () => {
    const siteId = site.siteId
    await testUtils.factorRouter.push(`${testUtils.factorAdmin.adminBaseRoute}/preview/site/${siteId}/`)

    const { selectorType, selectorId } = testUtils.factorRouter.params.value as Record<string, string>
    const mountContext = getMountContext({ selectorType, selectorId, siteMode: 'standard' })
    const loaded = await loadSite({ ...common, mountContext })

    expect(loaded).toBeDefined()
    expect(loaded?.siteId).toBe(siteId)
  })

  it('should not load a site for reserved subdomain www', async () => {
    await testUtils.factorRouter.push(`/my/path`)

    expect(() => getMountContext({ currentSubDomain: 'www', siteMode: 'standard' })).toThrowErrorMatchingInlineSnapshot(`[Error: WWW Subdomain]`)
  })
})
