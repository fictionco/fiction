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

      await this.sendConfirmEmail({ email, listId })
      // const doc = await Factor.$dbServer.model("post").findOne({ permalink: "emailList" })

      // console.log("LIST", email, doc.list, doc)

      return true
    }

    async verifyEmail({ email, list, code }) {
      console.log("VERIFY THAT EMAIL")

      const doc = await Factor.$dbServer.model("post").findOne({ permalink: list })

      console.log("LIST", doc, { email, list, code })
      //   db.students.updateOne(
      //     { _id: 4, "grades.grade": 85 },
      //     { $set: { "grades.$.std" : 6 } }
      //  )
    }

    async sendConfirmEmail({ email, listId }) {
      const action = `verify-email-list`
      const code = Factor.$randomToken()
      const { subject, text, linkText } = Factor.$emailList.getSetting({
        key: "emails.confirm",
        listId
      })

      const linkUrl = `${Factor.$config.setting(
        "currentUrl"
      )}?_action=${action}&code=${code}&email=${email}&list=${listId}`

      return await Factor.$emailServer.sendTransactional({
        to: email,
        subject,
        text,
        linkText,
        linkUrl
      })
    }
  })()
}
