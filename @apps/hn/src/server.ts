import { UserConfigServer } from "@factor/api"
import { listTypesArray } from "./api/types"
export const setup = (): UserConfigServer => {
  const sitemap = {
    topic: "lists",
    paths: listTypesArray.map((view: string) => {
      return `/v/${view}`
    }),
  }
  return {
    sitemaps: [sitemap],
  }
}
