export default Factor => {
  return new class {
    constructor() {
      if (Factor.FACTOR_ENV == "build") {
        this.addConfig()
      }
    }

    addConfig() {
      Factor.$filters.add(
        "firebase-config",
        _ => {
          _.hosting = {
            public: Factor.$paths.folder("dist"),
            ignore: ["firebase.json", "**/.*", "**/node_modules/**"]
          }

          return _
        },
        { priority: 50 }
      )
    }
  }()
}
