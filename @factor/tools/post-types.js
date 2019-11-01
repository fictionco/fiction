import { applyFilters, toLabel } from "@factor/tools"

export function postTypesConfig() {
  return applyFilters("post-types-config", []).map(_ => {
    return {
      baseRoute: typeof _.baseRoute == "undefined" ? _.postType : _.baseRoute,
      nameIndex: toLabel(_.postType),
      nameSingle: toLabel(_.postType),
      namePlural: toLabel(_.postType),
      ..._
    }
  })
}

export function getPostTypeConfig(postType) {
  return postTypesConfig().find(pt => pt.postType == postType)
}
