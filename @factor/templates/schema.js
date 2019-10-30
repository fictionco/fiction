import { applyFilters } from "@factor/tools"
export default {
  name: "page",
  callback: _s => {},
  schema: applyFilters("page-template-schema", {
    template: String
  }),
  options: {}
}
