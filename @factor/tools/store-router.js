import Factor from "@factor/core"

export function storeSet(key, item) {
  return Factor.$store.add(key, item)
}

export function storeGet(key) {
  return Factor.$store.val(key)
}
