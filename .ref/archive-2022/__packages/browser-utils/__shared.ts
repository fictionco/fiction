/**
 * Functions here are potentially included server side
 * Don't include non NODE compatible code
 */

/**
 * Makes an approximate 24 character objectId string
 */
// export const objectId = (idLength = 16): string => {
//   const nts = (s: number): string => Math.floor(s).toString(idLength)
//   return (
//     nts(Date.now() / 1000) +
//     " ".repeat(idLength).replace(/./g, () => nts(Math.random() * idLength))
//   )
// }
/**
 * Stringify and hash
 * https://github.com/joliss/fast-js-hash-benchmark
 */
// export const fastHash = (data: unknown): string => {
//   return SparkMD5.hash(stableStringify(data)).toString()
// }
// /**
//  * Parse settings using dot notation
//  * @param key - dot.notation pointer to settings
//  * @param settings - object - all settings object
//  * @remarks
//  * Cases: [port] [app.name] [roles.arpowers@gmail.com]
//  */
// export const dotSetting = <T = unknown>({
//   key,
//   settings,
// }: {
//   key: string
//   settings: Record<string, any>
// }): T | undefined => {
//   const currentKey = key.slice(0, key.indexOf("."))
//   const subKeys = key.slice(key.indexOf(".") + 1)

//   if (typeof settings[key] !== "undefined") {
//     return settings[key]
//   } else if (typeof settings[currentKey] === "object") {
//     return dotSetting({ key: subKeys, settings: settings[currentKey] })
//   } else {
//     return undefined
//   }
// }

/**
 * Capitalize first letter
 */
// export const cap = (text?: string): string => {
//   if (!text) return ""
//   return text.charAt(0).toUpperCase() + text.slice(1)
// }
