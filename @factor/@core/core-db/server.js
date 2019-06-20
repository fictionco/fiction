module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.DB = require("./db").default(Factor)
      Factor.$filters.callback("endpoints", { id: "db", handler: this })
    }
    async runRequest(params) {
      const { model, method, _arguments = [] } = params
      const DataModel = this.DB.getModel(model)
      let result
      if (!DataModel) {
        throw new Error(`DB Model for ${model} does not exist.`)
      } else {
        try {
          result = await DataModel[method].apply(DataModel, _arguments)
        } catch (error) {
          throw new Error(error)
        }
      }

      return result
    }
    async run() {
      const params =
        arguments.length > 1
          ? {
              model: arguments[0],
              method: arguments[1],
              _arguments: arguments[2]
            }
          : arguments[0]
      return await this.runRequest(params)
    }
  })()
}
