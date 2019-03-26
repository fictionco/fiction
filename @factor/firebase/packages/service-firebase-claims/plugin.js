export default Factor => {
  return new class {
    constructor() {
      Factor.$events.$on("auth-user-signed-in", credentials => {
        const {
          user: { uid }
        } = credentials

        this.setCustomClaims(uid)
      })
    }

    async setCustomClaims(uid) {
      let result = await Factor.$endpoint.request({
        endpoint: "@factor/service-firebase-claims-endpoint",
        action: "customClaims",
        uid
      })

      if (result) {
        const refresh = !!result.refresh

        if (refresh) {
          await firebase.auth().currentUser.getIdToken(refresh)
          tokenResult = await firebase.auth().currentUser.getIdTokenResult(refresh)
        }

        return true
      } else {
        return false
      }
    }
  }()
}
