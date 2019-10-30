import { applyFilters } from "@factor/tools"
export default () => {
  return {
    name: "page",
    callback: _s => {},
    schema: applyFilters("page-template-schema", {
      template: String
    }),
    options: {}
  }
}
