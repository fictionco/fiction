import { emitEvent } from "@factor/api/events"

export const userToken = (token?: string): string | void => {
  if (typeof localStorage == "undefined" || !localStorage) {
    return ""
  }
  const keyName = "token"
  if (token === "destroy") {
    localStorage.removeItem(keyName)
  } else if (token) {
    localStorage.setItem(keyName, JSON.stringify({ token }))
  } else {
    const v = localStorage.getItem(keyName)
    return v ? JSON.parse(v).token : ""
  }
}

// If JWT auth fails then delete token, etc.
export const handleTokenError = (
  error: Error | string,
  { onError }: { onError?: Function }
): void => {
  const badToken = "token signature is invalid"
  if (
    (error && typeof error == "string" && error.includes(badToken)) ||
    (typeof error == "object" && error.message && error.message.includes(badToken))
  ) {
    emitEvent("invalid-user-token", error)
  } else if (onError) {
    onError()
  }
}
