export default Factor => {
  return new (class {
    constructor() {
      this.SECRET = Factor.$config.setting("TOKEN_SECRET")

      Factor.$filters.callback("endpoints", { id: "auth", handler: () => require("./endpoint").default(Factor) })
    }

    signJWT(payload) {
      return jwt.sign(payload, this.SECRET)
    }

    verifyJWT(token) {
      try {
        return jwt.verify(token, this.SECRET)
      } catch (error) {
        throw new Error(error)
      }
    }
  })()
}
