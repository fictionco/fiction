import { createRequire } from "module"
import path from "path"
import { expect, it, describe, beforeAll } from "vitest"
import {
  mainFilePath,
  serverRenderEntryConfig,
  importIfExists,
} from "../nodeUtils"
const require = createRequire(import.meta.url)

let cwd = ""
describe("node utils", () => {
  beforeAll(() => {
    process.env.NODE_ENV = "development"
    cwd = path.dirname(require.resolve("@factor/site/package.json"))
  })
  it("gets correct main file path", async () => {
    const filePath = mainFilePath({ cwd })

    expect(filePath).toMatchInlineSnapshot(
      '"/Users/arpowers/projects/factor/@apps/site/src/index.ts"',
    )
  })

  it("imports files if it exists", async () => {
    const importFile = await importIfExists(cwd)
    expect(importFile).toMatchInlineSnapshot(`
      {
        "setup": [Function],
        Symbol(Symbol.toStringTag): "Module",
      }
    `)
  })

  it("gets correct server entry config", async () => {
    const cwd = path.dirname(require.resolve("@factor/site/package.json"))

    const entryConfig = await serverRenderEntryConfig({ cwd })

    expect(entryConfig.plugins?.length).toBeGreaterThan(0)
    expect(entryConfig.routes?.length).toBeGreaterThan(0)
    expect(entryConfig.variables?.TEST_SERVER).toEqual("TEST")

    expect(entryConfig).toMatchInlineSnapshot(`
      {
        "plugins": [
          {
            "name": "DocsEngine",
            "sitemaps": [
              {
                "paths": [
                  "/docs/introduction",
                  "/docs/core-concepts",
                  "/docs/quickstart",
                  "/docs/configuration",
                  "/docs/dev-server",
                  "/docs/upgrading",
                  "/docs/styling",
                  "/docs/template",
                  "/docs/meta-tags",
                  "/docs/routes",
                  "/docs/app-component",
                  "/docs/store",
                  "/docs/public-folder",
                  "/docs/pre-render",
                  "/docs/deploy-server",
                  "/docs/endpoints",
                  "/docs/server-config",
                  "/docs/sitemaps",
                  "/docs/using-plugins",
                ],
                "topic": "docs",
              },
            ],
          },
          {
            "name": "blogEngine",
            "server": [Function],
            "sitemaps": [
              {
                "paths": [
                  "/blog/factorjs-version-3-released",
                ],
                "topic": "posts",
              },
            ],
          },
        ],
        "routes": [
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "home",
            "menus": [],
            "meta": undefined,
            "name": "Home",
            "parent": undefined,
            "path": "/",
            "priority": 100,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "plugins",
            "menus": [],
            "meta": undefined,
            "name": "Plugins",
            "parent": undefined,
            "path": "/plugins",
            "priority": 100,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "showcase",
            "menus": [],
            "meta": undefined,
            "name": "Showcase",
            "parent": undefined,
            "path": "/showcase",
            "priority": 100,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "showcaseSingle",
            "menus": [],
            "meta": undefined,
            "name": "Showcase Item",
            "parent": undefined,
            "path": "/showcase/:slug",
            "priority": 100,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "install",
            "menus": [],
            "meta": undefined,
            "name": "Install",
            "parent": undefined,
            "path": "/install",
            "priority": 100,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "testing",
            "menus": [],
            "meta": undefined,
            "name": "Testing",
            "parent": undefined,
            "path": "/testing",
            "priority": 100,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "blog",
            "menus": [],
            "meta": undefined,
            "name": "Blog",
            "parent": undefined,
            "path": "/blog",
            "priority": 100,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "blogIndex",
            "menus": [],
            "meta": undefined,
            "name": "Blog Index",
            "parent": "blog",
            "path": "/blog",
            "priority": 200,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "blogSingle",
            "menus": [],
            "meta": undefined,
            "name": "Blog Single",
            "parent": "blog",
            "path": "/blog/:slug",
            "priority": 200,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "docs",
            "menus": [],
            "meta": undefined,
            "name": "Docs",
            "parent": undefined,
            "path": "/docs",
            "priority": 100,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "docsIndex",
            "menus": [],
            "meta": undefined,
            "name": "Docs Index",
            "parent": "docs",
            "path": "/docs",
            "priority": 200,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "docsSingle",
            "menus": [],
            "meta": undefined,
            "name": "Docs Single",
            "parent": "docs",
            "path": "/docs/:slug",
            "priority": 200,
          },
        ],
        "variables": {
          "TEST_SERVER": "TEST",
        },
      }
    `)
  })
})
