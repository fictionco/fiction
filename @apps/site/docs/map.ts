import { Doc, DocGroupRecord } from "@factor/plugin-docs-engine/types"

export const docs = [
  new Doc({
    key: "introduction",
    fileImport: (): Promise<any> => import("./content/introduction/index.md"),
  }),
  new Doc({
    key: "coreConcepts",
    fileImport: (): Promise<any> => import("./content/coreConcepts/index.md"),
  }),
  new Doc({
    key: "quickstart",
    fileImport: (): Promise<any> => import("./content/quickstart/index.md"),
  }),
  new Doc({
    key: "configuration",
    fileImport: (): Promise<any> => import("./content/configuration/index.md"),
  }),
  new Doc({
    key: "devServer",
    fileImport: (): Promise<any> => import("./content/devServer/index.md"),
  }),
  new Doc({
    key: "upgrading",
    fileImport: (): Promise<any> => import("./content/upgrading/index.md"),
  }),
  new Doc({
    key: "styling",
    fileImport: (): Promise<any> => import("./content/style/index.md"),
  }),
  new Doc({
    key: "template",
    title: "HTML Template",
    fileImport: (): Promise<any> => import("./content/template/index.md"),
  }),
  new Doc({
    key: "metaTags",
    fileImport: (): Promise<any> => import("./content/metaTags/index.md"),
  }),
  new Doc({
    key: "routes",
    fileImport: (): Promise<any> => import("./content/routes/index.md"),
  }),
  new Doc({
    key: "appComponent",
    fileImport: (): Promise<any> => import("./content/appComponent/index.md"),
  }),
  new Doc({
    key: "store",
    fileImport: (): Promise<any> => import("./content/store/index.md"),
  }),
  new Doc({
    key: "publicFolder",
    fileImport: (): Promise<any> => import("./content/publicFolder/index.md"),
  }),
  new Doc({
    key: "preRender",
    title: "Pre-Render",
    fileImport: (): Promise<any> => import("./content/preRender/index.md"),
  }),
  new Doc({
    key: "deployServer",
    title: "Server Deployment",
    fileImport: (): Promise<any> => import("./content/deployServer/index.md"),
  }),
  new Doc({
    key: "endpoints",
    title: "Custom Endpoints",
    fileImport: (): Promise<any> => import("./content/endpoints/index.md"),
  }),
  new Doc({
    key: "serverConfig",
    fileImport: (): Promise<any> => import("./content/serverConfig/index.md"),
  }),
  new Doc({
    key: "sitemaps",
    fileImport: (): Promise<any> => import("./content/sitemaps/index.md"),
  }),
  new Doc({
    key: "usingPlugins",
    fileImport: (): Promise<any> => import("./content/usingPlugins/index.md"),
  }),
]

export type DocKeysUnion<T extends Doc<string>[]> = {
  [K in keyof T]: T[K] extends Doc<infer T> ? T : never
}[number]

export type DocKeys = DocKeysUnion<typeof docs>

export const groups: DocGroupRecord<DocKeysUnion<typeof docs>> = {
  docs: {
    title: "Docs Home",
    description: `Learn how to work with Factor.`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>`,
    path: "/docs",
    menu: ["introduction", "coreConcepts"],
  },
  basics: {
    title: "Basics",
    description: `Learn how to configure and run Factor apps`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>`,
    path: "/docs/quickstart",
    menu: [
      "quickstart",
      "configuration",
      "upgrading",
      "template",
      "appComponent",
      "routes",
      "styling",
      "metaTags",
      "store",
      "publicFolder",
      "usingPlugins",
    ],
  },
  server: {
    title: "Server",
    description: `Add advanced functionality with Factor's endpoint server`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>`,
    path: "/docs/server-config",
    menu: ["serverConfig", "endpoints", "sitemaps"],
  },

  deployment: {
    title: "Deployment",
    description: `Learn how to take Factor to production`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>`,
    path: "/docs/pre-render",
    menu: ["preRender", "deployServer"],
  },
}
