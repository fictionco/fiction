import {
  expect,
  it,
  describe,
  beforeAll,
  createTestUtilServices,
} from "@factor/api/testUtils"
import { AppRoute } from "../appRoute"
import { FactorRouter } from ".."

const routes = [
  new AppRoute({
    name: "home",
    niceName: () => "Home",
    path: "/",
    menus: ["test"],
    component: () => import("./ElTest.vue"),
  }),

  new AppRoute({
    name: "notFound404",
    niceName: () => "404",
    path: "/:pathMatch(.*)*",
    priority: 1000,
    component: () => import("./ElTest.vue"),
  }),
  new AppRoute({
    name: "dashboard",
    niceName: () => "Dashboard",
    parent: "app",
    path: "/project/:projectId",
    menus: ["test"],
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
</svg>`,
    component: () => import("./ElTest.vue"),
  }),
  new AppRoute({
    name: "dashboardSingle",
    niceName: () => "Dashboard View",
    parent: "app",
    path: "/project/:projectId/dash/:dashboardId",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
</svg>`,
    component: () => import("./ElTest.vue"),
  }),

  new AppRoute({
    name: "app",
    niceName: () => "App",
    path: "/app",
    component: () => import("./ElTest.vue"),
    priority: 10,
  }),
]

let factorRouter: FactorRouter
describe("route handling", () => {
  beforeAll(async () => {
    const testUtils = await createTestUtilServices()
    factorRouter = new FactorRouter({ factorEnv: testUtils.factorEnv, routes })
  })
  it("generates routes for vue router", () => {
    expect(true).toBe(true)

    expect(factorRouter.vueRoutes.value).toMatchInlineSnapshot(`
      [
        {
          "children": [],
          "component": [Function],
          "meta": {
            "auth": undefined,
            "menus": [
              "test",
            ],
            "niceName": "Home",
          },
          "name": "home",
          "path": "/",
        },
        {
          "children": [],
          "component": [Function],
          "meta": {
            "auth": undefined,
            "menus": [],
            "niceName": "404",
          },
          "name": "notFound404",
          "path": "/:pathMatch(.*)*",
        },
        {
          "children": [],
          "component": [Function],
          "meta": {
            "auth": undefined,
            "menus": [],
            "niceName": "App",
          },
          "name": "app",
          "path": "/app",
        },
      ]
    `)
  })

  it("goes to route by key", async () => {
    await factorRouter.goto("dashboard", { projectId: "testProjectId" })

    expect(factorRouter.router.currentRoute.value.path).toBe(
      "/project/testProjectId",
    )

    await factorRouter.goto("home")

    expect(factorRouter.router.currentRoute.value.path).toBe("/")
  })
})
