import glob from "glob"

export const getFaviconPath = (src: string): string => {
  let faviconPath = ""
  const paths = [`${src}/favicon*`, `${src}/**/favicon*`, `${src}/icon*`]

  paths.some((paths) => {
    const r = glob.sync(paths)

    if (r && r.length > 0) {
      faviconPath = r[0]
      return true
    } else {
      return false
    }
  })

  return faviconPath
}
