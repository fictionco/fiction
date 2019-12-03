import { FactorSchema } from "@factor/post/types"
import { applyFilters } from "@factor/tools"
export default (): FactorSchema => {
  return {
    name: "page",
    schema: applyFilters("page-template-schema", { template: String })
  }
}
