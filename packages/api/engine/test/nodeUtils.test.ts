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
      '"/Users/arpowers/projects/factor/packages/site/src/index.ts"',
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

    expect(entryConfig.root).toEqual(cwd)

    expect(entryConfig).toMatchInlineSnapshot(`
      {
        "plugins": [
          {
            "name": "DocsEngine",
            "paths": [
              "/Users/arpowers/projects/factor/packages/plugin-docs-engine/",
            ],
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
            "paths": [
              "/Users/arpowers/projects/factor/packages/plugin-blog-engine/",
            ],
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
          {
            "name": "HighlightCode",
            "paths": [
              "/Users/arpowers/projects/factor/packages/plugin-highlight-code/",
            ],
          },
          {
            "name": "NotifyPlugin",
            "paths": [
              "/Users/arpowers/projects/factor/packages/plugin-notify/",
            ],
          },
          Promise {},
        ],
        "root": "/Users/arpowers/projects/factor/packages/site",
        "routes": [
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "menus": [],
            "meta": undefined,
            "name": "home",
            "niceName": "Home",
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
            "menus": [],
            "meta": undefined,
            "name": "plugins",
            "niceName": "Plugins",
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
            "menus": [],
            "meta": undefined,
            "name": "showcase",
            "niceName": "Showcase",
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
            "menus": [],
            "meta": undefined,
            "name": "showcaseSingle",
            "niceName": "Showcase Item",
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
            "menus": [],
            "meta": undefined,
            "name": "install",
            "niceName": "Install",
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
            "menus": [],
            "meta": undefined,
            "name": "testing",
            "niceName": "Testing",
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
            "menus": [],
            "meta": undefined,
            "name": "blog",
            "niceName": "Blog",
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
            "menus": [],
            "meta": undefined,
            "name": "blogIndex",
            "niceName": "Blog Index",
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
            "menus": [],
            "meta": undefined,
            "name": "blogSingle",
            "niceName": "Blog Single",
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
            "menus": [],
            "meta": undefined,
            "name": "docs",
            "niceName": "Docs",
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
            "menus": [],
            "meta": undefined,
            "name": "docsIndex",
            "niceName": "Docs Index",
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
            "menus": [],
            "meta": undefined,
            "name": "docsSingle",
            "niceName": "Docs Single",
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
