/**
 * Returns a url for display
 * @param url full url
 */
export const niceHost = (url: string): string => {
  const host = url.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
  const parts = host.split(".").slice(-3)
  if (parts[0] === "www") parts.shift()
  return parts.join(".")
}
