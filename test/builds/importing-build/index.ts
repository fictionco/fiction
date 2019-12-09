import { applyFilters } from "@factor/api"

export default (): { data: any[] } => {
  return {
    data: applyFilters("importer-test", [])
  }
}
