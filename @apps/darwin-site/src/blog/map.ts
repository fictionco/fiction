import { BlogMap } from "@factor/plugin-blog-engine/types"
import { map as HeatmapsMap } from "./heatmaps"
import { map as ExternalMap } from "@darwin_/blog/content/map"

export const map: BlogMap = {
  ...HeatmapsMap,
  ...ExternalMap,
}
