import { applyFilters } from "@factor/tools"
export default () => {
  return {
    name: "page",
    callback: () => {},
    schema: applyFilters("page-template-schema", {
      template: String
    }),
    options: {}
  }
}
