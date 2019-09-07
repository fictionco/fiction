export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("endpoints", { id: "emailList", handler: this })
    }

    async addEmail({ email, listId = "emailList" }) {
      const result = await Factor.$dbServer
        .model("post")
        .updateOne(
          { permalink: listId },
          { $addToSet: { list: { email, verified: false } } },
          { upsert: true }
        )

      this.sendEmail()
      // const doc = await Factor.$dbServer.model("post").findOne({ permalink: "emailList" })

      // console.log("LIST", email, doc.list, doc)

      return true
    }

    verifyEmail() {
      //   db.students.updateOne(
      //     { _id: 4, "grades.grade": 85 },
      //     { $set: { "grades.$.std" : 6 } }
      //  )
    }

    async emails() {}

    async sendEmail(args) {
      const { to, subject, action, _id, code, text, linkText } = args
      const linkUrl = `${Factor.$config.setting(
        "currentUrl"
      )}?_action=${action}&code=${code}&_id=${_id}`

      return await Factor.$emailServer.sendTransactional({
        to,
        subject,
        text,
        linkText,
        linkUrl
      })
    }
  })()
}
