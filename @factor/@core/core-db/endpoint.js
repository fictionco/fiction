module.exports.default = (Factor, DB) => {
  return new (class {
    constructor() {}

    async run(params) {
      const { model, method, _arguments = [] } = params
      const DataModel = await DB.getModel(model)
      let result
      if (!DataModel) {
        throw new Error(`DB Model for ${model} does not exist.`)
      } else {
        try {
          console.log({ DataModel, model, method, _arguments })
          result = await DataModel[method].apply(DataModel, _arguments)
        } catch (error) {
          throw new Error(error)
        }
      }

      return result
    }
  })()
}
