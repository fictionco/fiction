export default Factor => {
  return new (class {
    constructor() {
      if (Factor.FACTOR_ENV == "build") {
        this.addConfig()
      }
    }

    addConfig() {
      const { factorHostProject, projectId } = Factor.$config.setting("firebase") || {}
      const env = Factor.$config.setting("env")

      if (factorHostProject) {
        const { id, target } = factorHostProject
        Factor.$filters.add("firebaserc", _ => {
          _.targets = {
            [projectId]: {
              hosting: {
                [target]: [id]
              }
            }
          }
        })
      }
      Factor.$filters.add(
        "firebase-config",
        _ => {
          const hosting = {
            public: Factor.$paths.folder("dist"),
            ignore: ["firebase.json", "**/.*", "**/node_modules/**"]
          }

          hosting.headers = [
            {
              // Specifies a CORS header for all font files
              source: "**",
              headers: [
                {
                  key: "hosting-url",
                  value: "https://factor.fiction.com"
                }
              ]
            }
          ]

          if (factorHostProject) {
            hosting.target = factorHostProject.target
          }

          _.hosting = hosting

          return _
        },
        { priority: 50 }
      )
    }
  })()
}
