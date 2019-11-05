import Factor from "@factor/core"

export function storeItem(key, item) {
  return Factor.$store.add(key, item)
}

export function stored(key) {
  return Factor.$store.val(key)
}

export function getStoreState() {
  return Factor.$store.state
}
