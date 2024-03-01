import { createTestUtils } from '@factor/api/test-utils/init'
import { describe, expect, it } from 'vitest'
import { waitFor } from '@factor/api/utils'
import { AppRoute } from '../appRoute'
import { FactorRouter } from '..'

const component = () => import('./ElTest.vue')
const routes = [
  new AppRoute({ name: 'home', path: '/', component }),
  new AppRoute({ name: 'notFound404', path: '/:pathMatch(.*)*', priority: 1000, component }),
  new AppRoute({ name: 'testPage1', path: '/test/:testId/:anotherId?', component }),
  new AppRoute({ name: 'userProfile', path: '/users/:userId/profile', component }),
  new AppRoute({ name: 'userOrg', path: '/users/:userId/org/:orgId', component }),
]

describe('factorRouterCreate', async () => {
  const testUtils = await createTestUtils()

  await testUtils.init()

  const factorRouter = new FactorRouter({
    factorEnv: testUtils.factorEnv,
    routes,
    baseUrl: 'https://www.test.com',
    routerId: 'testRouter',
  })

  it('errors if not initialized', async () => {
    await expect(factorRouter.goto('testPage1', { testId: '123' })).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: router not initialized [testRouter]]`)
    await expect(factorRouter.push({ path: '123' })).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: router not initialized [testRouter]]`)
  })

  it('syncs with vue router', async () => {
    factorRouter.create()

    expect(factorRouter.router.value).toBeDefined()
    await factorRouter.goto('/tour/:testId', { testId: '123' }, { test: 'abc' })

    await waitFor(50)

    expect(factorRouter.router.value?.currentRoute.value.path).toMatchInlineSnapshot(`"/tour/123"`)

    expect(factorRouter.router.value?.currentRoute.value.fullPath, 'correct vue router path').toBe('/tour/123?test=abc')

    expect(factorRouter.current.value.fullPath, 'correct utility path').toBe('/tour/123?test=abc')
  })
})

describe.skip('factorRouter', async () => {
  const testUtils = await createTestUtils()

  await testUtils.init()

  const factorRouter = new FactorRouter({ factorEnv: testUtils.factorEnv, routes, baseUrl: 'https://www.test.com', create: true })

  factorRouter.addReplacers({ orgId: 'activeOrg123' })

  describe('factorRouter - ref and replacers', () => {
    it('replaces :userId with provided value and :orgId with active user org id', async () => {
      const userId = 'user42'
      const routeRef = factorRouter.routeRef('userOrg', { userId })

      await waitFor(50)
      // The expected path is '/users/user42/org/activeOrg123'
      expect(routeRef.value).toBe(`/users/${userId}/org/activeOrg123`)
    })

    it('retains :userId in the path if no value provided and replaces :orgId', () => {
      const routeRef = factorRouter.routeRef('userOrg')

      // The expected path is '/users/:userId/org/activeOrg123' because :userId was not replaced
      expect(routeRef.value).toBe(`/users/:userId/org/activeOrg123`)
    })

    it('removes trailing slashes', () => {
      const routeRef = factorRouter.routeRef('userProfile', { userId: 'user42' })

      // The expected path is '/users/user42/profile' with no trailing slash
      expect(routeRef.value).toBe(`/users/user42/profile`)
    })
  })

  describe('factorRouter - link and url methods', () => {
    it('correctly constructs links with route parameters', async () => {
      const link = factorRouter.link('testPage1', { testId: '123', anotherId: 'whatever' })
      await waitFor(50)

      expect(link.value).toBe('/test/123/whatever')
    })

    it('correctly constructs full URLs using the url method', async () => {
      const fullUrl = factorRouter.url('testPage1', { testId: '123' })

      expect(fullUrl.value).toBe('https://www.test.com/test/123')
    })

    it('should handle query params well', () => {
      const link = factorRouter.link('testPage1', { testId: '123' }, { foo: 'bar', xyz: 'abc' }).value // missing dashboardId
      expect(link).toBe('/test/123?foo=bar&xyz=abc') // or whatever the expected behavior is
    })
    it('goes to route by key', async () => {
      await factorRouter.goto('testPage1', { testId: '123' })

      expect(factorRouter.current.value.path).toBe('/test/123')

      await factorRouter.goto('home', {}, {}, { caller: 'test' })

      expect(factorRouter.current.value.path).toBe('/')
    })
  })

  it('generates routes for vue router', () => {
    expect(factorRouter.vueRoutes.value).toMatchInlineSnapshot(`
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
