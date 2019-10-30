import { objectIdType } from "@factor/post/util"

export default {
  name: "jobs",
  schema: {
    jobLocation: String,
    jobApplyEmail: String,
    jobIcon: [{ type: objectIdType(), ref: "attachment" }]
  }
}
