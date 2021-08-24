import dayjs from "dayjs/esm"
import relativeTime from "dayjs/esm/plugin/relativeTime"

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(relativeTime)
import { UserConfigApp } from "@factor/types"
import docsEngine from "@factor/plugin-docs-engine"

import { docs, groups } from "./docs/map"
import blogEngine from "@factor/plugin-blog-engine"
import { map as blogMap } from "./blog/map"

import { trackInteractions } from "./util"
import { routes } from "./routes"
export const setup = (): UserConfigApp => {
  trackInteractions()

  return {
    routes,
    plugins: [
      docsEngine({
        docs,
        groups,
        baseRoute: "/docs",
      }),
      blogEngine({
        map: blogMap,
        baseRoute: "/blog",
      }),
    ],
  }
}
