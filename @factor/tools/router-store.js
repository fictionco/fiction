import Factor from "@factor/core"

export function storeItem(item, value) {
  return Factor.$store.commit("setItem", { item, value })
}

export function stored(key) {
  return Factor.$store.getters["getItem"](key)
}

export function addRoutes(config) {
  return
}

export function getStoreState()
