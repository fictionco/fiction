class FactorGlobal {
  public globalItems: Record<string, any>
  constructor() {
    this.globalItems = {}
  }
}

declare global {
  // eslint-disable-next-line no-var
  var factorGlobals: FactorGlobal
}

const _globalThis = typeof window !== "undefined" ? window : global

_globalThis.factorGlobals = new FactorGlobal()

export const setGlobal = <T = unknown>(key: string, value: T): void => {
  _globalThis.factorGlobals.globalItems[key] = value
}

export const getGlobal = <T = unknown>(key: string): T | undefined => {
  return _globalThis.factorGlobals.globalItems[key] as T | undefined
}
