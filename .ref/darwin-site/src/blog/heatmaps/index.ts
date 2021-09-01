import { BlogMap } from "@factor/plugin-blog-engine/types"
export const map: BlogMap = {
  whatAreWebsiteHeatmaps: {
    publishDate: "2021-7-21",
    status: "published",
    type: ["article"],
    fileImport: (): Promise<any> => import("./whatAre/post.md"),
    imageImport: (): Promise<any> => import("./whatAre/image.webp"),
  },
}
