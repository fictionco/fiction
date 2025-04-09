import { vue } from './libraries'
import { deepMerge } from './obj'

// Global cache to store refs by key
const refCache: Record<string, ReturnType<typeof vue.ref>> = {}

export function localRef<T>(opts: {
  key: string
  def: T
  lifecycle?: 'session' | 'local' | 'disable'
  merge?: () => Partial<T> | undefined
}): vue.Ref<T> {
  const { key, def, lifecycle = 'local', merge } = opts

  // Return the existing ref if one is already created with the same key
  if (refCache[key])
    return refCache[key] as vue.Ref<T>

  const storage = typeof localStorage !== 'undefined' && lifecycle !== 'disable' ? (lifecycle === 'session' ? sessionStorage : localStorage) : null

  // Try to deserialize the value from storage or use default
  let initialValue: T
  const storedValue = storage?.getItem(key)
  try {
    let parsedValue = storedValue ? JSON.parse(storedValue) : def

    // Apply merge function if provided and parsedValue is a plain object
    if (merge && parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue)) {
      parsedValue = deepMerge([parsedValue, merge()])
    }

    initialValue = parsedValue
  }
  catch (error) {
    console.error(`Error parsing JSON from storage: ${(error as Error).message}`)
    initialValue = def // Use default value if JSON parsing fails
  }

  const refItem = vue.ref<T>(initialValue)
  refCache[key] = refItem // Store the ref in cache

  if (typeof window !== 'undefined') {
    vue.watch(() => refItem.value, (newValue) => {
      if (newValue === undefined) {
        storage?.removeItem(key)
        delete refCache[key]
      }
      else {
        storage?.setItem(key, JSON.stringify(newValue))
      }
    }, { immediate: true, deep: true })
  }

  return refItem as vue.Ref<T>
}
