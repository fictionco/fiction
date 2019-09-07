export default Factor => {
  return new (class {
    constructor() {}

    async request(method, params) {
      return await Factor.$endpoint.request({ id: "emailList", method, params })
    }

    async addEmail({ email }) {
      console.log("send email", email)
      return await this.request("addEmail", { email })
    }
  })()
}
