import { DocGroupRecord, mapTypeHelper } from "@factor/plugin-docs-engine"

export const docs = mapTypeHelper({
  introduction: {
    fileImport: (): Promise<any> => import("./content/introduction/index.md"),
  },
  coreConcepts: {
    fileImport: (): Promise<any> => import("./content/coreConcepts/index.md"),
  },
  quickstart: {
    fileImport: (): Promise<any> => import("./content/quickstart/index.md"),
  },
  configuration: {
    fileImport: (): Promise<any> => import("./content/configuration/index.md"),
  },
  upgrading: {
    fileImport: (): Promise<any> => import("./content/upgrading/index.md"),
  },
  styling: {
    fileImport: (): Promise<any> => import("./content/style/index.md"),
  },
  template: {
    title: "HTML Template",
    fileImport: (): Promise<any> => import("./content/template/index.md"),
  },
  metaTags: {
    fileImport: (): Promise<any> => import("./content/metaTags/index.md"),
  },
  routes: {
    fileImport: (): Promise<any> => import("./content/routes/index.md"),
  },
  appComponent: {
    fileImport: (): Promise<any> => import("./content/appComponent/index.md"),
  },
  store: {
    fileImport: (): Promise<any> => import("./content/store/index.md"),
  },
  publicFolder: {
    fileImport: (): Promise<any> => import("./content/publicFolder/index.md"),
  },
  preRender: {
    title: "Pre-Render",
    fileImport: (): Promise<any> => import("./content/preRender/index.md"),
  },
  deployServer: {
    title: "Server Deployment",
    fileImport: (): Promise<any> => import("./content/deployServer/index.md"),
  },
  endpoints: {
    title: "Custom Endpoints",
    fileImport: (): Promise<any> => import("./content/endpoints/index.md"),
  },
  serverConfig: {
    fileImport: (): Promise<any> => import("./content/serverConfig/index.md"),
  },
})

export const groups: DocGroupRecord<keyof typeof docs> = {
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
    path: "/docs/install",
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
    ],
  },
  server: {
    title: "Server",
    description: `Add advanced functionality with Factor's endpoint server`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>`,
    path: "/docs/install",
    menu: ["serverConfig", "endpoints"],
  },

  deployment: {
    title: "Deployment",
    description: `Learn how to take Factor to production`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>`,
    path: "/docs/install",
    menu: ["preRender", "deployServer"],
  },
}
