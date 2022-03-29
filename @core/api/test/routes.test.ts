import { expect, it, describe } from "vitest"
import { AppRoute, generateRoutes } from "../router"

const routes = [
  new AppRoute({
    name: "home",
    niceName: "Home",
    path: "/",
    component: () => import("@factor/engine/test/ElTest.vue"),
  }),
  new AppRoute({
    name: "app",
    niceName: "App",
    path: "/app",
    component: () => import("@factor/engine/test/ElTest.vue"),
  }),
  new AppRoute({
    name: "notFound404",
    niceName: "404",
    path: "/:pathMatch(.*)*",
    priority: 1000,
    component: () => import("@factor/engine/test/ElTest.vue"),
  }),
  new AppRoute({
    name: "dashboard",
    niceName: "Dashboard",
    parent: "app",
    path: "/project/:projectId",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
</svg>`,
    component: () => import("@factor/engine/test/ElTest.vue"),
  }),
  new AppRoute({
    name: "dashboardSingle",
    niceName: "Dashboard View",
    parent: "app",
    path: "/project/:projectId/dash/:dashboardId",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
</svg>`,
    component: () => import("@factor/engine/test/ElTest.vue"),
  }),
]

describe("route handling", () => {
  it("generates routes for vue router", () => {
    const r = generateRoutes(routes)

    expect(r).toMatchInlineSnapshot(`
      [
        {
          "component": [Function],
          "name": "Home",
          "path": "/",
        },
        {
          "children": [
            {
              "component": [Function],
              "name": "Dashboard",
              "path": "/project/:projectId",
            },
            {
              "component": [Function],
              "name": "Dashboard View",
              "path": "/project/:projectId/dash/:dashboardId",
            },
          ],
          "component": [Function],
          "name": "App",
          "path": "/app",
        },
        {
          "component": [Function],
          "name": "404",
          "path": "/:pathMatch(.*)*",
        },
      ]
    `)
  })
})
