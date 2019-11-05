import { applyFilters } from "@factor/tools"
export default () => {
  return {
    name: "page",
    schema: applyFilters("page-template-schema", { template: String })
  }
}
