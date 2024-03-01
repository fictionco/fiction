export default {}

// import path from "path"
// import { createRequire } from "module"
// import express from "express"
// import cors from "cors"
// import chokidar from "chokidar"
// import { log, RunConfig } from "@factor/api"
// import { FactorBundle } from "@factor/api/plugin-build/bundle"
// import { generateTemplates, outputFolders } from "./bundle"
// import { clientTagDir } from "./utils"

// const require = createRequire(import.meta.url)

// /**
//  * Watch for template changes
//  */
// const watchTemplates = (config: RunConfig): void => {
//   const { htmlFolder } = outputFolders()
//   chokidar
//     .watch([`${htmlFolder}/**`], {
//       ignoreInitial: true,
//     })
//     .on("all", async () => {
//       await generateTemplates(config)
//     })
// }
// /**
//  * Serve generated JS and HTML files
//  */
// export const devServer = async (config: RunConfig): Promise<void> => {
//   const PORT = process.env.PORT ?? 4000
//   const { htmlFolder, renderedFolder } = outputFolders()
//   const STAGE_ENV = process.env.STAGE_ENV ?? "local"
//   const app = express()

//   app.use(cors())

//   app.use("/", express.static(htmlFolder))
//   app.use("/", express.static(renderedFolder))
//   app.use("/", express.static(path.join(clientTagDir(), "dist")))

//   app.listen(PORT)

//   watchTemplates(config)

//   log.info("devServer", `ready`, {
//     data: { PORT, STAGE_ENV },
//   })
// }

// export const packageDir = (packageName?: string): string => {
//   if (!packageName) return ""

//   return path.dirname(require.resolve(`${packageName}/package.json`))
// }

// export const runDevelopment = async (config: RunConfig): Promise<void> => {
//   const NODE_ENV = "development"
//   const STAGE_ENV = "local"

//   Promise.all([
//     bundle({
//       ...config,
//       cwd: packageDir("@kaption/client"),
//       NODE_ENV,
//       STAGE_ENV,
//       bundleMode: "script",
//     }),
//     bundle({
//       ...config,
//       cwd: packageDir("@kaption/client-tag"),
//       NODE_ENV,
//       STAGE_ENV,
//       bundleMode: "script",
//     }),
//     bundle({
//       ...config,
//       cwd: packageDir("@kaption/proxy-frame"),
//       NODE_ENV,
//       STAGE_ENV,
//       bundleMode: "script",
//     }),
//   ]).catch((error) => console.error("error", "dev bundle", error))

//   await generateTemplates(config)
//   await devServer(config)
// }
