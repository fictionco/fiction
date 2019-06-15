export default Factor => {
  return new (class {
    constructor() {
      Factor.$stack.cover({
        id: "db-service",
        service: _ => this.dbRequest(_)
      })
    }

    async dbRequest(params) {
      return await Factor.$endpoint.request({ id: "db", method: "run", params })
    }
  })()
}
