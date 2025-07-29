import { vue } from './libraries'

/**
 * Transform options for data serialization and deserialization
 */
export interface TransformOptions<T, S = any> {
  /** Prepare data before serialization (server-side) */
  prepare?: (data: T) => S | Promise<S>
  /** Unpack data after deserialization (client-side) */
  unpack?: (data: S) => T | Promise<T>
}

/**
 * A composable for handling server-side data loading with integrated cache key tracking
 *
 * @param options Configuration options for the SSR data loading
 * @returns A set of utilities for managing SSR data
 */
export function useSSRData<T = any, S = any>(options: {
  /** Key or computed ref that triggers a refresh when changed */
  key: string | vue.ComputedRef<string>
  /** Initial data state */
  initialValue?: T
  /** Function to fetch data when needed */
  fetchData: () => Promise<T>
  /** Optional condition to determine if data should be fetched */
  shouldFetch?: () => boolean
  /** Optional transform functions for data serialization/deserialization */
  transform?: TransformOptions<T, S>
}) {
  // Extract options with default values
  const { fetchData, initialValue, shouldFetch = () => true, transform } = options

  // Handle key as string or computed ref
  const keyRef = typeof options.key === 'string'
    ? vue.computed(() => options.key as string)
    : options.key as vue.ComputedRef<string>

  // Get SSR context if available
  const ssrContext = vue.getCurrentInstance()?.appContext?.provides?.initialState
    || (vue.isRef(vue.inject('initialState')) ? vue.inject('initialState') : null)

  // State
  const data = vue.shallowRef<T | undefined>(initialValue)
  const loading = vue.ref(false)
  const error = vue.ref<Error | null>(null)
  const hasInitialized = vue.ref(false)
  const previousKey = vue.ref(keyRef.value)

  // // Check for SSR data synchronously on initialization
  // if (typeof window !== 'undefined') {
  //   const currentKey = keyRef.value
  //   if (window.__INITIAL_STATE__?.[currentKey] !== undefined) {
  //     hasInitialized.value = true
  //   }
  // }

  // Check for server-rendered data
  const getInitialData = async (): Promise<T | undefined> => {
    let initialData: any = undefined
    const currentKey = keyRef.value

    // Check global window object for initial state (browser-only)
    if (typeof window !== 'undefined' && window.__INITIAL_STATE__?.[currentKey]) {
      initialData = window.__INITIAL_STATE__[currentKey]
    }
    // Check provided inject context
    else if (ssrContext && ssrContext.value?.[currentKey]) {
      initialData = ssrContext.value[currentKey]
    }
    // Apply unpack transform if available and we have data
    if (initialData !== undefined && !!transform?.unpack) {
      const unpacked = await transform.unpack(initialData)
      return unpacked
    }

    return initialData !== undefined ? initialData : initialValue
  }

  /**
   * Load data, respecting SSR state and browser hydration
   */
  const load = async (force = false) => {
    // Don't fetch if already loading and not forced
    if (loading.value && !force)
      return

    // Don't fetch if condition is not met and not forced
    if (!shouldFetch() && !force)
      return

    const currentKey = keyRef.value

    // Check for existing server-rendered data first time
    if (!hasInitialized.value) {
      const initialData = await getInitialData()
      if (initialData !== undefined) {
        data.value = initialData
        hasInitialized.value = true
        previousKey.value = currentKey
        return
      }
    }

    // Fetch data if not already available or forced reload
    loading.value = true
    error.value = null

    try {
      data.value = await fetchData()
      previousKey.value = currentKey
    }
    catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      console.error(`Error loading SSR data for key "${currentKey}":`, err)
    }
    finally {
      loading.value = false
      hasInitialized.value = true
    }
  }

  // Watch for key changes to refresh data
  const isSSR = typeof window === 'undefined'

  /**
   * Setup SSR prefetching in server context
   */
  if (isSSR) {
    const ctx = vue.useSSRContext()
    if (ctx && !ctx.initialState) {
      ctx.initialState = {}
    }

    vue.onServerPrefetch(async () => {
      if (shouldFetch()) {
        await load(true)

        // Add to SSR context for hydration
        if (ctx && data.value !== undefined) {
          if (!ctx.initialState)
            ctx.initialState = {}

          const currentKey = keyRef.value

          // Apply prepare transform if available
          if (transform?.prepare && data.value !== undefined) {
            const prepped = await transform.prepare(data.value)

            ctx.initialState[currentKey] = prepped
          }
          else {
            ctx.initialState[currentKey] = data.value
          }
        }
      }
    })
  }
  else {
    vue.onMounted(() => {
      vue.watch(keyRef, (newKey, oldKey) => {
        if (newKey !== oldKey) {
          const force = hasInitialized.value
          load(force)
        }
      }, { immediate: true })
    })
  }

  return {
    data,
    loading,
    hasInitialized,
    error,
    /** Refresh data regardless of current state */
    refresh: () => load(true),
    /** Reset to initial value */
    reset: () => {
      data.value = initialValue
      error.value = null
      hasInitialized.value = false
    },
  }
}

// Add type declaration for global window object
declare global {
  interface Window {
    __INITIAL_STATE__?: Record<string, any>
  }
}
