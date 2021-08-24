const path = require("path")
const cwd = () => process.env.FACTOR_CWD || process.cwd()

module.exports = () => {
  /**
   * Use UTC time to prevent differences between local and live envs
   */
  process.env.TZ = "utc"
  /**
   * Allow Node to process TypeScript
   */
  const transpileModules = ["@factor", ".*factor", "@darwin_", "dayjs"]
  require("ts-node").register({
    transpileOnly: true,
    compilerOptions: {
      strict: false,
      allowJs: true,
      resolveJsonModule: true,
      moduleResolution: "node",
      module: "commonjs",
      target: "es2020",
      esModuleInterop: true,
    },
    ignore: [`node_modules/(?!(${transpileModules.join("|")}))`],
  })

  /**
   * Add needed workflow aliases
   * Alias: @src - Application source
   * Alias: @cwd - Current working directory
   */

  const primaryPackage = path.resolve(cwd(), "package.json")
  const { main = "index.js" } = require(primaryPackage)
  const moduleAlias = require("module-alias")

  moduleAlias.addAlias("@src", () => path.dirname(path.resolve(cwd(), main)))
  moduleAlias.addAlias("@cwd", () => cwd())
  require.extensions[".vue"] = () => {}
  require.extensions[".webp"] = () => {}
}
