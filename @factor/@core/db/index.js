import { objectId } from "./util"

export default Factor => {
  return new (class {
    constructor() {}

    async request(method, params) {
      return await Factor.$endpoint.request({ id: "db", method, params })
    }

    async populate(obj, fields) {
      if (!obj._populated) {
        let _ids = []
        fields.forEach(f => {
          if (obj[f]) {
            _ids = [..._ids, ...obj[f]]
          }
        })

        const vals = await this.request("populate", { _ids })

        fields.forEach(f => {
          const newField = []
          if (obj[f]) {
            obj[f].forEach((_id, index) => {
              newField[index] = vals.find(_ => _._id == _id)
            })
            Factor.set(obj, f, newField)
          }
        })
        obj._populated = true
      }

      return obj
    }
  })()
}
