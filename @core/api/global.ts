declare global {
  interface Window {
    process: { env?: Record<string, string> }
    GlobalInstance: FactorGlobal
  }
}

class FactorGlobal {
  public globalItems: Record<string, any>
  constructor() {
    this.globalItems = {}
  }
}

const _window =
  typeof window !== "undefined" ? window : ({} as Record<string, FactorGlobal>)

_window.GlobalInstance = new FactorGlobal()

export const setGlobal = <T = unknown>(key: string, value: T): void => {
  _window.GlobalInstance.globalItems[key] = value
}

export const getGlobal = <T = unknown>(key: string): T | undefined => {
  return _window.GlobalInstance.globalItems[key] as T | undefined
}
