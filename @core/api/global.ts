declare global {
  interface Window {
    process: { env?: Record<string, string> }
  }
}

class FactorGlobal {
  public globalItems: Record<string, any>
  constructor() {
    this.globalItems = {}
  }
}

const GlobalInstance = new FactorGlobal()

export const setGlobal = <T = unknown>(key: string, value: T): void => {
  GlobalInstance.globalItems[key] = value
}

export const getGlobal = <T = unknown>(key: string): T | undefined => {
  return GlobalInstance.globalItems[key] as T | undefined
}
