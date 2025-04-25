// core/utils/hook.ts

/**
 * Generic hook system that maintains type safety and ensures deterministic execution
 */
export class HooksUtil<T extends Record<string, (...args: any[]) => Promise<void>>> {
  private hooks = new Map<keyof T, Map<string, T[keyof T]>>()

  /**
   * Register a hook for a specific event
   * @param event The event to hook into
   * @param key Unique identifier for this hook (module:purpose format recommended)
   * @param callback The function to execute
   */
  on<K extends keyof T>(event: K, key: string, callback: T[K]): void {
    if (!this.hooks.has(event)) {
      this.hooks.set(event, new Map())
    }

    this.hooks.get(event)!.set(key, callback as T[keyof T])
  }

  /**
   * Run all hooks for a specific event
   * @param event The event to trigger
   * @param args Arguments to pass to the hook callbacks
   */
  async run<K extends keyof T>(event: K, ...args: Parameters<T[K]>): Promise<void> {
    const eventHooks = this.hooks.get(event)
    if (!eventHooks)
      return

    // Execute hooks in deterministic order by key
    const sortedHooks = Array.from(eventHooks.entries()).sort(([a], [b]) => a.localeCompare(b))

    for (const [key, hook] of sortedHooks) {
      try {
        await (hook as T[K])(...args)
      }
      catch (error) {
        console.error(`Error in ${String(event)} hook '${key}':`, error)
      }
    }
  }
}
