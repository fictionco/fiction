const cwd = process.env.FACTOR_CWD || process.cwd()

try {
  require(cwd)
} catch (error) {
  // eslint-disable-next-line no-console
  if (error.code !== "MODULE_NOT_FOUND") console.error(error)
}
