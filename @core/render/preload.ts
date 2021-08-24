const renderPreloadLink = (file: string): string => {
  if (file.endsWith(".js")) {
    return `<link rel="modulepreload" crossorigin href="${file}">`
  } else if (file.endsWith(".css")) {
    return `<link rel="stylesheet" href="${file}">`
  } else if (file.endsWith(".woff")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
  } else if (file.endsWith(".woff2")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
  } else if (file.endsWith(".gif")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`
  } else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`
  } else if (file.endsWith(".png")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`
  } else if (file.endsWith(".webp")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/webp">`
  } else {
    // TODO
    return ""
  }
}

export const renderPreloadLinks = (
  modules: string[],
  manifest: Record<string, any>,
): string => {
  let links = ""
  const seen = new Set()
  modules.forEach((id) => {
    const files = manifest[id]
    if (files) {
      files.forEach((file: string) => {
        if (!seen.has(file)) {
          seen.add(file)
          links += renderPreloadLink(file)
        }
      })
    }
  })
  return links
}

// export const prerenderStatic = async (): Promise<void> => {
//   const manifest = require(resolve("./dist/static/ssr-manifest.json"))
//   const template = fs.readFileSync(resolve("./dist/static/index.html"), "utf-8")
//   const { render } = require(resolve("./dist/server/entry-server.js"))

//   // determine routes to pre-render from src/pages
//   const routesToPrerender = fs.readdirSync(resolve("src/pages")).map((file) => {
//     const name = file.replace(/\.vue$/, "").toLowerCase()
//     return name === "home" ? `/` : `/${name}`
//   })

//   // pre-render each route...
//   for (const url of routesToPrerender) {
//     const [appHtml, preloadLinks] = await render(url, manifest)

//     const html = template
//       .replace(` <!--app-head-->`, preloadLinks)
//       .replace(`<!--app-html-->`, appHtml)

//     const filePath = `dist/static${url === "/" ? "/index" : url}.html`
//     fs.writeFileSync(resolve(filePath), html)
//     nLog("info", `pre-rendered: ${filePath}`)
//   }

//   // done, delete ssr manifest
//   fs.unlinkSync(resolve("dist/static/ssr-manifest.json"))
// }
