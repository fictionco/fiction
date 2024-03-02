import fetch, { Headers, Request, Response } from "node-fetch"

/**
 * Polyfill global fetch
 * https://github.com/node-fetch/node-fetch#providing-global-access
 * https://www.stefanjudis.com/notes/global-fetch-landed-in-node-18/
 */
if (!globalThis.fetch) {
  //@ts-ignore
  globalThis.fetch = fetch
  globalThis.Headers = Headers
  //@ts-ignore
  globalThis.Request = Request
  //@ts-ignore
  globalThis.Response = Response
}
