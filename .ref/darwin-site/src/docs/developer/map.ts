import { DocGroupRecord, mapTypeHelper } from "@factor/plugin-docs-engine"
import { MarkdownFile } from "@factor/types"
import ElemTable from "./overview/ElemTable.vue"

export const group: DocGroupRecord<keyof typeof docs> = {
  developer: {
    title: "Developer API",
    path: "/docs/api-overview",
    description: `Darwin's developer API with deep support for all different types of tracking and monitoring.`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg"   fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>`,
    menu: [
      "apiOverview",
      "client",
      "identification",
      "track",
      "group",
      "commonFields",
    ],
  },
}

export const docs = mapTypeHelper({
  apiOverview: {
    title: "API Overview",
    fileImport: (): Promise<MarkdownFile> => import("./overview/doc.md"),
  },
  client: {
    title: "JavaScript Client",
    fileImport: (): Promise<MarkdownFile> => import("./overview/client.md"),
  },

  identification: {
    title: "Identification",
    fileImport: (): Promise<MarkdownFile> =>
      import("./overview/identification.md"),
    components: { ElemTable },
  },
  track: {
    title: "Tracking Events",
    fileImport: (): Promise<MarkdownFile> => import("./overview/track.md"),
    components: { ElemTable },
  },
  group: {
    title: "Grouping Users",
    fileImport: (): Promise<MarkdownFile> => import("./overview/group.md"),
    components: { ElemTable },
  },
  commonFields: {
    title: "Common Fields",
    fileImport: (): Promise<MarkdownFile> =>
      import("./overview/commonFields.md"),
    components: { ElemTable },
  },
})
