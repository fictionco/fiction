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
      '"/Users/arpowers/Projects/factor/packages/site/src/index.ts"',
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
              "/Users/arpowers/Projects/factor/packages/plugin-docs-engine/",
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
              "/Users/arpowers/Projects/factor/packages/plugin-blog-engine/",
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
              "/Users/arpowers/Projects/factor/packages/plugin-highlight-code/",
            ],
          },
          {
            "name": "NotifyPlugin",
            "paths": [
              "/Users/arpowers/Projects/factor/packages/plugin-notify/",
            ],
          },
          Promise {},
          {
            "name": "FactorUi",
            "paths": [
              "/Users/arpowers/Projects/factor/packages/ui/",
            ],
          },
          {
            "endpoints": [
              UserMethod {
                "basePath": "/user",
                "baseURL": [Function],
                "key": "Login",
                "queryHandler": QueryLogin {
                  "dayjs": [Function],
                  "getDb": [Function],
                  "isNode": true,
                  "qu": [Function],
                  "stop": [Function],
                },
                "requestHandler": undefined,
              },
              UserMethod {
                "basePath": "/user",
                "baseURL": [Function],
                "key": "NewVerificationCode",
                "queryHandler": QueryNewVerificationCode {
                  "dayjs": [Function],
                  "getDb": [Function],
                  "isNode": true,
                  "qu": [Function],
                  "stop": [Function],
                },
                "requestHandler": undefined,
              },
              UserMethod {
                "basePath": "/user",
                "baseURL": [Function],
                "key": "SetPassword",
                "queryHandler": QuerySetPassword {
                  "dayjs": [Function],
                  "getDb": [Function],
                  "isNode": true,
                  "qu": [Function],
                  "stop": [Function],
                },
                "requestHandler": undefined,
              },
              UserMethod {
                "basePath": "/user",
                "baseURL": [Function],
                "key": "ResetPassword",
                "queryHandler": QueryResetPassword {
                  "dayjs": [Function],
                  "getDb": [Function],
                  "isNode": true,
                  "qu": [Function],
                  "stop": [Function],
                },
                "requestHandler": undefined,
              },
              UserMethod {
                "basePath": "/user",
                "baseURL": [Function],
                "key": "UpdateCurrentUser",
                "queryHandler": QueryUpdateCurrentUser {
                  "dayjs": [Function],
                  "getDb": [Function],
                  "isNode": true,
                  "qu": [Function],
                  "stop": [Function],
                },
                "requestHandler": undefined,
              },
              UserMethod {
                "basePath": "/user",
                "baseURL": [Function],
                "key": "SendOneTimeCode",
                "queryHandler": QuerySendOneTimeCode {
                  "dayjs": [Function],
                  "getDb": [Function],
                  "isNode": true,
                  "qu": [Function],
                  "stop": [Function],
                },
                "requestHandler": undefined,
              },
              UserMethod {
                "basePath": "/user",
                "baseURL": [Function],
                "key": "VerifyAccountEmail",
                "queryHandler": QueryVerifyAccountEmail {
                  "dayjs": [Function],
                  "getDb": [Function],
                  "isNode": true,
                  "qu": [Function],
                  "stop": [Function],
                },
                "requestHandler": undefined,
              },
              UserMethod {
                "basePath": "/user",
                "baseURL": [Function],
                "key": "StartNewUser",
                "queryHandler": QueryStartNewUser {
                  "dayjs": [Function],
                  "getDb": [Function],
                  "isNode": true,
                  "qu": [Function],
                  "stop": [Function],
                },
                "requestHandler": undefined,
              },
              UserMethod {
                "basePath": "/user",
                "baseURL": [Function],
                "key": "CurrentUser",
                "queryHandler": QueryCurrentUser {
                  "dayjs": [Function],
                  "getDb": [Function],
                  "isNode": true,
                  "qu": [Function],
                  "stop": [Function],
                },
                "requestHandler": undefined,
              },
              UserMethod {
                "basePath": "/user",
                "baseURL": [Function],
                "key": "ManageUser",
                "queryHandler": QueryManageUser {
                  "dayjs": [Function],
                  "getDb": [Function],
                  "isNode": true,
                  "qu": [Function],
                  "stop": [Function],
                },
                "requestHandler": undefined,
              },
              UserMethod {
                "basePath": "/user",
                "baseURL": [Function],
                "key": "UserGoogleAuth",
                "queryHandler": QueryUserGoogleAuth {
                  "clientId": undefined,
                  "clientSecret": undefined,
                  "dayjs": [Function],
                  "getDb": [Function],
                  "isNode": true,
                  "qu": [Function],
                  "stop": [Function],
                },
                "requestHandler": undefined,
              },
            ],
            "name": "FactorUser",
          },
        ],
        "root": "/Users/arpowers/Projects/factor/packages/site",
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
