import { addCallback } from "@factor/tools/filters"

export function addGlobalPrefetch(cb) {
  addCallback("global-prefetch", cb)
}
