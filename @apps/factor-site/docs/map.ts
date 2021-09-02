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
    ],
  },

  advanced: {
    title: "Advanced",
    path: "/docs/events-goals",
    description: `Creating extensions, and advanced use-cases`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>`,
    menu: [],
  },
}
