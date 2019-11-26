import { emitEvent } from "@factor/tools/events"

export function userToken(token?: boolean | null | string): string | void {
  if (typeof localStorage == "undefined" || !localStorage) {
    return ""
  }
  const keyName = "token"
  if (token === false || token === null) {
    localStorage.removeItem(keyName)
  } else if (token) {
    localStorage.setItem(keyName, JSON.stringify({ token }))
  } else {
    const v = localStorage.getItem(keyName)
    return v ? JSON.parse(v).token : ""
  }
}

// If JWT auth fails then delete token, etc.
export function handleTokenError(error, { onError = null }): void {
  const badToken = "JsonWebTokenError: invalid signature"
  if (
    (error && typeof error == "string" && error.includes(badToken)) ||
    (error.message && error.message.includes(badToken))
  ) {
    emitEvent("invalid-user-token", error)
  } else if (onError) onError()
}
