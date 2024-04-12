import module from 'node:module'
import { URL } from 'node:url'

// https://nodejs.org/docs/latest-v20.x/api/module.html#moduleregisterspecifier-parenturl-options
module.register('./loader.mjs', import.meta.url)

const assetExtensionsRegex = /\.(webp|svg|jpg|jpeg|png|gif|vue|md|css|scss|sass|less|ttf|otf|woff|woff2|eot|mp3|wav|ogg|mp4|webm|avi)$/
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
