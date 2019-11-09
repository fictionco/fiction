const cwd = process.env.FACTOR_CWD || process.cwd()

try {
  require(`${cwd}/.factor/loader-server`)
} catch (error) {
  if (error.code !== "MODULE_NOT_FOUND") console.error(error)
}
