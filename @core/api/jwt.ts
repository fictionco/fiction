import { setCookie, getCookie, removeCookie } from "./cookie"
/**
 * Gets, Sets or Destroys the user JWT token out of local storage
 */
export const clientToken = (
  args: {
    action?: "set" | "get" | "destroy"
    token?: string
  } = {},
): string | undefined => {
  if (typeof localStorage == "undefined" || !localStorage) {
    return
  }
  const domain =
    process.env.NODE_ENV == "production"
      ? process.env.FACTOR_APP_DOMAIN
      : undefined
  const { action = "get", token } = args
  const TOKEN_KEY = "ffUser"
  if (action === "destroy") {
    removeCookie(TOKEN_KEY, { domain })
    //localStorage.removeItem(TOKEN_KEY)
  } else if (action == "set" && token) {
    setCookie(TOKEN_KEY, token, { expires: 14, domain })
    // localStorage.setItem(TOKEN_KEY, token)
  } else {
    // let localValue = localStorage.getItem(TOKEN_KEY)
    const cookieValue = getCookie(TOKEN_KEY)
    // if (!localValue && cookieValue) {
    //   localStorage.setItem(TOKEN_KEY, cookieValue)
    //   localValue = cookieValue
    // }
    return cookieValue ? cookieValue : ""
  }
}
