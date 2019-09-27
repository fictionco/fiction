module.exports.default = Factor => {
  return require(`${Factor.$paths.get("app")}/.factor/loader-settings.js`)
}
