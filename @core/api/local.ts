type LocalScope = "functional" | "tracking" | "session"
type LocalType = "session" | "persistent" | "all"

const hasStorage = (): boolean => {
  if (
    typeof localStorage == "undefined" ||
    typeof sessionStorage == "undefined"
  ) {
    return false
  } else return true
}

interface SetLocalBase {
  key: string
  scope?: LocalScope
  type?: LocalType
}

type SetLocalArgs<T = unknown> = T extends string
  ? SetLocalBase & { raw?: boolean; value: string }
  : SetLocalBase & { raw?: undefined; value: T }

export const setLocal = <T = unknown>(args: SetLocalArgs<T>): void => {
  const { key, value, type = "persistent", raw } = args

  if (!hasStorage()) return

  let v: string
  if (raw) {
    v = value as string
  } else {
    v = JSON.stringify(value)
  }

  if (type == "session") {
    sessionStorage.setItem(key, v)
  } else {
    localStorage.setItem(key, v)
  }
}

interface LocalArgs {
  key: string
  type?: LocalType
  raw?: boolean
}

type loc = {
  <T = unknown>(args: LocalArgs): T | undefined
  <T = string>(args: LocalArgs & { raw: true }): T | undefined
}

export const getLocal: loc = (args) => {
  if (!hasStorage()) return

  const { key, raw } = args

  let v: string | undefined = sessionStorage.getItem(key) ?? undefined

  if (!v) {
    v = localStorage.getItem(key) ?? undefined
  }

  if (raw) return v

  return v ? (JSON.parse(v) as loc) : undefined
}

export const removeLocal = (args: LocalArgs): void => {
  if (!hasStorage()) return

  const { key } = args

  sessionStorage.removeItem(key)
  localStorage.removeItem(key)

  return
}
