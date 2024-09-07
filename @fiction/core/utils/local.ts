import { ref, watch } from 'vue'
import type { Ref } from 'vue'

// Global cache to store refs by key
const refCache: Record<string, ReturnType<typeof ref>> = {}

export function localRef<T>(opts: { key: string, def: T, lifecycle?: 'session' | 'local' | 'disable' }): Ref<T> {
  const { key, def, lifecycle = 'local' } = opts

  // Return the existing ref if one is already created with the same key
  if (refCache[key])
    return refCache[key] as Ref<T>

  const storage = typeof localStorage !== 'undefined' && lifecycle !== 'disable' ? (lifecycle === 'session' ? sessionStorage : localStorage) : null

  // Try to deserialize the value from storage or use default
  let initialValue: T
  const storedValue = storage?.getItem(key)
  try {
    initialValue = storedValue ? JSON.parse(storedValue) : def
  }
  catch (error) {
    console.error(`Error parsing JSON from storage: ${(error as Error).message}`)
    initialValue = def // Use default value if JSON parsing fails
  }

  const refItem = ref<T>(initialValue)
  refCache[key] = refItem // Store the ref in cache

  if (typeof window !== 'undefined') {
    watch(() => refItem.value, (newValue) => {
      if (newValue === undefined) {
        storage?.removeItem(key)
        delete refCache[key]
      }
      else {
        storage?.setItem(key, JSON.stringify(newValue))
      }
    }, { immediate: true, deep: true })
  }

  return refItem as Ref<T>
}
