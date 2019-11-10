export function userToken(token) {
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
export function handleTokenError(error, { onTokenError, onError = null }) {
  if (error && error.includes("JsonWebTokenError: invalid signature")) {
    if (onTokenError) onTokenError()
  } else if (onError) onError()
}
