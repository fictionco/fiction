import Factor from "@factor/core"
import { applyFilters } from "@factor/filters/util"

export function getPostTypes() {
  return applyFilters("post-types", []).map(_ => {
    return {
      baseRoute: typeof _.baseRoute == "undefined" ? _.postType : _.baseRoute,
      nameIndex: toLabel(_.postType),
      nameSingle: toLabel(_.postType),
      namePlural: toLabel(_.postType),
      ..._
    }
  })
}

export function postTypeMeta(postType) {
  return getPostTypes().find(pt => pt.postType == postType)
}
