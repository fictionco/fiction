import { applyFilters } from "@factor/tools"

export default (): { data: any[] } => {
  return {
    data: applyFilters("importer-test", [])
  }
}
