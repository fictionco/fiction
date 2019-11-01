import { applyFilters, toLabel } from "@factor/tools"

export function dashboardPostTypes() {
  return applyFilters("dashboard-post-types", []).map(_ => {
    return {
      baseRoute: typeof _.baseRoute == "undefined" ? _.postType : _.baseRoute,
      nameIndex: toLabel(_.postType),
      nameSingle: toLabel(_.postType),
      namePlural: toLabel(_.postType),
      ..._
    }
  })
}

export function getPostTypeUIConfig(postType) {
  return dashboardPostTypes().find(pt => pt.postType == postType)
}
