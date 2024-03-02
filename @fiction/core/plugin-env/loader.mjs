import module from 'node:module'
import { URL } from 'node:url'

// https://nodejs.org/docs/latest-v20.x/api/module.html#moduleregisterspecifier-parenturl-options
module.register('./loader.mjs', import.meta.url)

const assetExtensionsRegex = /\.(webp|svg|jpg|png|gif|vue|md)$/
export function load(url, context, nextLoad) {
  // if an image, just return the file name
  if (assetExtensionsRegex.test(new URL(url).pathname)) {
    const fn = new URL(url).pathname.replace(/^.*[/\\]/, '')
    return {
      shortCircuit: true,
      format: 'module',
      source: `export default "${fn}"`,
    }
  }

  // Let Node.js handle all other format / sources.
  return nextLoad(url, context, nextLoad)
}
