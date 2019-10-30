import { applyFilters } from "@factor/tools"

export default () => {
  return {
    data: applyFilters("importer-test", [])
  }
}
