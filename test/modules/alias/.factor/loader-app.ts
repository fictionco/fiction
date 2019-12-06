const cwd = process.env.FACTOR_CWD || process.cwd()

try {
  require(`${cwd}/.factor/loader-app`)
} catch (error) {
  if (error.code !== "MODULE_NOT_FOUND") console.error(error)
}
