import { objectIdType } from "@factor/post/util"

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
