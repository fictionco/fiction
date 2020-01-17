import { FactorSchema } from "@factor/post/types"
import { applyFilters } from "@factor/api"
export default (): FactorSchema => {
  return {
    name: "page",
    schema: applyFilters("page-template-schema", {
      template: {
        type: String,
        default: "default"
      }
    })
  }
}
