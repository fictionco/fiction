import Factor from "@factor/core"

export default () => {
  return new (class {
    constructor() {}

    async populate({ _ids }) {
      const _in = Array.isArray(_ids) ? _ids : [_ids]
      const result = await Factor.$dbServer.model("post").find({
        _id: { $in: _in }
      })

      return Array.isArray(_ids) ? result : result[0]
    }
  })()
}
