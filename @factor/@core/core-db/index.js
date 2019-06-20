export default Factor => {
  return new (class {
    constructor() {}

    async run() {
      const params =
        arguments.length > 1
          ? {
              model: arguments[0],
              method: arguments[1],
              _arguments: arguments[2]
            }
          : arguments[0]
      return await Factor.$endpoint.request({ id: "db", method: "runRequest", params })
    }
  })()
}
