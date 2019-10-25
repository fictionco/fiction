import { addFilter, applyFilters } from "@factor/filters/util"

export default () => {
  return {
    data: applyFilters("importer-test", [])
  }
}
