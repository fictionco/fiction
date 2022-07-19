import { vue } from "./libraries"

export const localRef = <A>(opts: {
  key: string
  def: A
  lifecycle: "session" | "local"
}) => {
  const { key, def, lifecycle } = opts

  const storage = lifecycle === "session" ? sessionStorage : localStorage
  const rawLocalValue = storage.getItem(key)

  const localValue =
    typeof def == "string"
      ? (rawLocalValue as typeof def)
      : typeof def == "number"
      ? Number.parseInt(rawLocalValue ?? "0")
      : typeof def == "boolean"
      ? Boolean(rawLocalValue)
      : (JSON.parse(rawLocalValue || "{}") as A)

  const init = localValue ?? def

  const refItem = vue.ref<A>(init as A)

  vue.watch(
    () => refItem.value,
    (v) => {
      if (typeof v !== "undefined") {
        const val =
          typeof v == "string"
            ? v
            : typeof v == "number"
            ? String(v)
            : typeof v == "boolean"
            ? v
              ? "1"
              : ""
            : JSON.stringify(v)

        storage.setItem(key, val)
      } else {
        storage.removeItem(key)
      }
    },
    { immediate: true },
  )

  return refItem
}

type LocalPersistence = "session" | "forever" | "all"

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
  persist?: LocalPersistence
}

type SetLocalArgs<T = unknown> = T extends string
  ? SetLocalBase & { raw?: boolean; value: string }
  : SetLocalBase & { raw?: undefined; value: T }

/**
 * @deprecated
 * replace by localRef or native
 */
export const setLocal = <T = unknown>(args: SetLocalArgs<T>): void => {
  const { key, value, persist = "forever", raw } = args

  if (!hasStorage()) return

  let v: string
  if (raw) {
    v = value as string
  } else {
    v = JSON.stringify(value)
  }

  if (persist == "session") {
    sessionStorage.setItem(key, v)
  } else {
    localStorage.setItem(key, v)
  }
}

interface LocalArgs {
  key: string
  persist?: LocalPersistence
  raw?: boolean
}

type loc = {
  <T = unknown>(args: LocalArgs): T | undefined
  <T = string>(args: LocalArgs & { raw: true }): T | undefined
}
/**
 * @deprecated
 * replace by localRef or native
 */
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
/**
 * @deprecated
 * replace by localRef or native
 */
export const removeLocal = (args: LocalArgs): void => {
  if (!hasStorage()) return

  const { key } = args

  sessionStorage.removeItem(key)
  localStorage.removeItem(key)

  return
}
