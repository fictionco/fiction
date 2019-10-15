import { objectIdType } from "@factor/db/util"

export default Factor => {
  return {
    name: "jobs",
    callback: _s => {},
    schema: {
      jobLocation: String,
      jobApplyEmail: String,
      jobIcon: [{ type: objectIdType(), ref: "attachment" }]
    }
  }
}
