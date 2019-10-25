import path from "path"

export const resolve = (specifier, parentModuleURL, defaultResolve) => {
  const base = process.env.FACTOR_CWD || process.cwd()

  const { main = "index.js" } = require(path.resolve(base, "package.json"))

  const aliases = {
    "~": base,
    "@": path.dirname(path.resolve(base, main)),
    "#": path.dirname(require.resolve("@factor/app"))
  }

  const alias = Object.keys(aliases).find(key => {
    return (
      specifier.indexOf(key) === 0 &&
      (specifier.length === key.length || specifier[key.length] === "/")
    )
  })

  const newSpecifier =
    alias === undefined
      ? specifier
      : path.join(aliases[alias], specifier.slice(alias.length))

  return defaultResolve(newSpecifier, parentModuleURL)
}
