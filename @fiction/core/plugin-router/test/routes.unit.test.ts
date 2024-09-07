import { createTestUtils } from '@fiction/core/test-utils/init'
import { waitFor } from '@fiction/core/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FictionRouter } from '..'
import { AppRoute } from '../appRoute'

const component = async () => import('./ElTest.vue')
const routes = [
  new AppRoute({ name: 'home', path: '/', component }),
  new AppRoute({ name: 'notFound404', path: '/:pathMatch(.*)*', priority: 1000, component }),
  new AppRoute({ name: 'testPage1', path: '/test/:testId/:anotherId?', component }),
  new AppRoute({ name: 'userProfile', path: '/users/:userId/profile', component }),
  new AppRoute({ name: 'userOrg', path: '/users/:userId/org/:orgId', component }),
]

describe('fictionRouterCreate', async () => {
  const testUtils = createTestUtils()

  await testUtils.init()

  const fictionRouter = new FictionRouter({
    fictionEnv: testUtils.fictionEnv,
    routes,
    baseUrl: 'https://www.test.com',
    routerId: 'testRouter',
  })

  it('errors if not initialized', async (ctx) => {
    await expect(fictionRouter.push({ path: '123' }, { caller: ctx.task.name })).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: router not initialized [testRouter]]`)
  })

  it('syncs with vue router', async () => {
    fictionRouter.create()

    expect(fictionRouter.router.value).toBeDefined()
    await fictionRouter.push({ path: '/tour/123', query: { test: 'abc' } }, { caller: 'test' })

    await waitFor(50)

    expect(fictionRouter.router.value?.currentRoute.value.path).toMatchInlineSnapshot(`"/tour/123"`)

    expect(fictionRouter.router.value?.currentRoute.value.fullPath, 'correct vue router path').toBe('/tour/123?test=abc')

    expect(fictionRouter.current.value.fullPath, 'correct utility path').toBe('/tour/123?test=abc')
  })
})

describe('fictionRouter', async () => {
  const testUtils = createTestUtils()

  await testUtils.init()

  const fictionRouter = new FictionRouter({ fictionEnv: testUtils.fictionEnv, routes, baseUrl: 'https://www.test.com', create: true })

  fictionRouter.addReplacers({ orgId: 'activeOrg123' })

  describe('fictionRouter - ref and replacers', () => {
    it('replaces :userId with provided value and :orgId with active user org id', async () => {
      const userId = 'user42'
      const routeRef = fictionRouter.routeRef('userOrg', { userId })

      await waitFor(50)
      // The expected path is '/users/user42/org/activeOrg123'
      expect(routeRef.value).toBe(`/users/${userId}/org/activeOrg123`)
    })

    it('retains :userId in the path if no value provided and replaces :orgId', () => {
      const routeRef = fictionRouter.routeRef('userOrg')

      // The expected path is '/users/:userId/org/activeOrg123' because :userId was not replaced
      expect(routeRef.value).toBe(`/users/:userId/org/activeOrg123`)
    })

    it('removes trailing slashes', () => {
      const routeRef = fictionRouter.routeRef('userProfile', { userId: 'user42' })

      // The expected path is '/users/user42/profile' with no trailing slash
      expect(routeRef.value).toBe(`/users/user42/profile`)
    })
  })

  it('generates routes for vue router', () => {
    expect(fictionRouter.vueRoutes.value).toMatchInlineSnapshot(`
      [
        {
          "children": [],
          "component": [Function],
          "meta": {
            "auth": undefined,
            "niceName": [Function],
            "title": "Home",
          },
          "name": "home",
          "path": "/",
          "props": undefined,
        },
        {
          "children": [],
          "component": [Function],
          "meta": {
            "auth": undefined,
            "niceName": [Function],
            "title": "Test Page1",
          },
          "name": "testPage1",
          "path": "/test/:testId/:anotherId?",
          "props": undefined,
        },
        {
          "children": [],
          "component": [Function],
          "meta": {
            "auth": undefined,
            "niceName": [Function],
            "title": "User Profile",
          },
          "name": "userProfile",
          "path": "/users/:userId/profile",
          "props": undefined,
        },
        {
          "children": [],
          "component": [Function],
          "meta": {
            "auth": undefined,
            "niceName": [Function],
            "title": "User Org",
          },
          "name": "userOrg",
          "path": "/users/:userId/org/:orgId",
          "props": undefined,
        },
        {
          "children": [],
          "component": [Function],
          "meta": {
            "auth": undefined,
            "niceName": [Function],
            "title": "Not Found404",
          },
          "name": "notFound404",
          "path": "/:pathMatch(.*)*",
          "props": undefined,
        },
      ]
    `)
  })
})

describe('fictionRouter2', () => {
  let testUtils: ReturnType<typeof createTestUtils>
  let fictionRouter: FictionRouter

  beforeEach(async () => {
    testUtils = createTestUtils()
    await testUtils.init()
    fictionRouter = new FictionRouter({
      fictionEnv: testUtils.fictionEnv,
      routes,
      baseUrl: 'https://www.test.com',
      routerId: 'testRouter',
      create: true,
    })
    fictionRouter.addReplacers({ orgId: 'activeOrg123' })
  })

  describe('initialization', () => {
    it('creates router with correct settings', () => {
      expect(fictionRouter.routerId).toBe('testRouter')
      expect(fictionRouter.baseUrl).toBe('https://www.test.com')
      expect(fictionRouter.routes.value).toHaveLength(routes.length)
      expect(fictionRouter.router.value).toBeDefined()
    })

    it('errors if not initialized', async () => {
      const uninitializedRouter = new FictionRouter({
        fictionEnv: testUtils.fictionEnv,
        routes,
        routerId: 'uninitializedRouter',
      })
      await expect(uninitializedRouter.push('/test/123', { caller: 'testinit' }))
        .rejects
        .toThrow('router not initialized [uninitializedRouter]')
    })
  })

  describe('navigation', () => {
    it('pushes new routes', async () => {
      await fictionRouter.push('/test/123', { caller: 'test' })
      expect(fictionRouter.current.value.path).toBe('/test/123')
    })
  })

  describe('utility methods', () => {
    it('gets raw path', () => {
      const rawPath = fictionRouter.rawPath('testPage1')
      expect(rawPath).toBe('/test/:testId/:anotherId?')
    })
  })

  describe('clone method', () => {
    it('creates a clone with overridden settings', () => {
      const clonedRouter = fictionRouter.clone({ routeBasePath: '/preview' })
      expect(clonedRouter.routeBasePath).toBe('/preview')
      expect(clonedRouter.routerId).toBe('testRouter_clone')
    })

    it('cloned router has its own routes', () => {
      const clonedRouter = fictionRouter.clone()
      clonedRouter.update([new AppRoute({ name: 'newRoute', path: '/new', component })])
      expect(clonedRouter.routes.value).toHaveLength(routes.length + 1)
      expect(fictionRouter.routes.value).toHaveLength(routes.length)
    })
  })
})

describe('fictionRouter Hooks', () => {
  let testUtils: ReturnType<typeof createTestUtils>
  let fictionRouter: FictionRouter

  beforeEach(async () => {
    testUtils = createTestUtils()
    await testUtils.init()
    fictionRouter = new FictionRouter({
      fictionEnv: testUtils.fictionEnv,
      routes,
      baseUrl: 'https://www.test.com',
      routerId: 'testRouter',
      create: true,
    })
  })

  it('calls routeBeforeEach hook', async () => {
    const mockBeforeEach = vi.fn().mockReturnValue({ navigate: true })
    fictionRouter.settings.fictionEnv?.addHook({
      hook: 'routeBeforeEach',
      caller: 'test',
      callback: mockBeforeEach,
    })

    await fictionRouter.push('/test/123', { caller: 'test' })

    expect(mockBeforeEach).toHaveBeenCalledWith(expect.objectContaining({
      to: expect.any(Object),
      from: expect.any(Object),
      navigate: true,
    }))
  })

  it('calls routeAfterEach hook', async () => {
    const mockAfterEach = vi.fn()
    fictionRouter.settings.fictionEnv?.addHook({
      hook: 'routeAfterEach',
      caller: 'test',
      callback: mockAfterEach,
    })

    await fictionRouter.push('/test/123', { caller: 'test' })

    expect(mockAfterEach).toHaveBeenCalledWith(expect.objectContaining({
      to: expect.any(Object),
      from: expect.any(Object),
    }))
  })

  it('respects navigate value from routeBeforeEach hook', async () => {
    await fictionRouter.push('/', { caller: 'test' })
    const mockBeforeEach = vi.fn().mockReturnValue({ navigate: false })
    fictionRouter.settings.fictionEnv?.addHook({
      hook: 'routeBeforeEach',
      caller: 'test',
      callback: mockBeforeEach,
    })
    expect(fictionRouter.current.value.name).toMatchInlineSnapshot(`"home"`)

    await fictionRouter.push('/test/123', { caller: 'test' })

    expect(mockBeforeEach).toHaveBeenCalled()

    // The navigation should not have occurred
    expect(fictionRouter.current.value.name).toBe('home')
  })

  it('allows navigation when routeBeforeEach returns true', async () => {
    const mockBeforeEach = vi.fn().mockReturnValue({ navigate: true })
    fictionRouter.settings.fictionEnv?.addHook({
      hook: 'routeBeforeEach',
      caller: 'test',
      callback: mockBeforeEach,
    })

    await fictionRouter.push('/test/123', { caller: 'test' })

    expect(fictionRouter.current.value.name).toBe('testPage1')
  })

  it('handles async routeBeforeEach hook', async () => {
    const mockBeforeEach = vi.fn().mockResolvedValue({ navigate: true })
    fictionRouter.settings.fictionEnv?.addHook({
      hook: 'routeBeforeEach',
      caller: 'test',
      callback: mockBeforeEach,
    })

    await fictionRouter.push('/test/123', { caller: 'test' })

    expect(mockBeforeEach).toHaveBeenCalled()
    expect(fictionRouter.current.value.name).toBe('testPage1')
  })

  it('sets loadingRoute during navigation', async () => {
    const mockBeforeEach = vi.fn().mockImplementation(async () => {
      await waitFor(50) // Simulate some async operation
      return { navigate: true }
    })
    fictionRouter.settings.fictionEnv?.addHook({
      hook: 'routeBeforeEach',
      caller: 'test',
      callback: mockBeforeEach,
    })

    const navigationPromise = fictionRouter.push('/test/123', { caller: 'test' })

    expect(fictionRouter.loadingRoute.value).toBe(true)

    await navigationPromise

    expect(fictionRouter.loadingRoute.value).toBe(false)
  })
})
