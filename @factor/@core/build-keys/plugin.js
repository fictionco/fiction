const consola = require("consola")
module.exports = Factor => {
  return new class {
    constructor() {
      const conf = Factor.$paths.get("config")
      const gen = Factor.$paths.get("generated")
      const res = require("path").resolve

      Factor.$paths.add({
        "keys-public": res(conf, "keys-public.json"),
        "keys-private-raw": res(conf, "keys-private-raw.json"),
        "keys-encrypted-development": res(gen, "keys-encrypted-dev.json"),
        "keys-encrypted-production": res(gen, "keys-encrypted-prod.json"),
        "plugins-loader-app": res(gen, "load-plugins-app.js"),
        "plugins-loader-build": res(gen, "load-plugins-build.js"),
        passwords: res(conf, "passwords.json")
      })

      this.doWatchers()
    }

    doWatchers() {
      const rawKeysPath = Factor.$paths.get("keys-private-raw")

      Factor.$filters.add("build-watchers", _ => {
        this.makeEncryptedSecrets()
        _.push({
          name: "Keys Changed",
          files: [rawKeysPath],
          callback: ({ event, path }) => {
            this.makeEncryptedSecrets()
          }
        })
        return _
      })
    }

    readEncryptedSecrets({ build = "development", password }) {
      const filterKey = `keys-encrypted-${build}`
      const file = Factor.$paths.get(filterKey)

      if (!file) {
        Factor.$log.error(`Cannot find file: ${filterKey}`)
        return
      }

      let encrypted = {}
      encrypted = require(file)
      return require("crypto-json").decrypt(encrypted, password)
    }

    makeEncryptedSecrets() {
      const fs = require("fs-extra")
      const consola = require("consola")

      const rawKeysPath = Factor.$paths.get("keys-private-raw")

      if (!fs.pathExistsSync(rawKeysPath)) {
        Factor.$log.error(`
          Couldn't Find Unencrypted Private Keys File. 
          Add a json file @[${rawKeysPath}] with the format: 
            {
              "development" : {}, 
              "production" : {}, 
              "all":{}
            }
          Security Note: Don't commit this to your repo.
          `)
        return
      }

      const raw = require(rawKeysPath)[("development", "production")].forEach(environment => {
        this.createEncrypted({ environment, raw, passwords })
      })
    }

    getPassword(environment) {
      let password = Factor.$filters.apply(`master-password-${environment}`)

      if (password) {
        return password
      }

      let passwordfile = null
      try {
        passwordfile = require(Factor.$paths.get("passwords"))
      } catch (error) {}

      password = passwordfile && passwordfile[environment] ? passwordfile[environment] : false

      if (!password) {
        Factor.$log.warn(`
          A [${environment}] password is needed to read your secret API config.
          Add a JSON file @[${Factor.$paths.get("passwords")}] with the format: 
            {
              "production": "[production password]", 
              "development": "[development password]",  
            }
        `)
      }

      return password
    }

    createEncrypted({ environment, raw, passwords }) {
      const password = passwords[environment]

      const encrypted = require("crypto-json").encrypt(raw, password)

      fs.writeFileSync(
        Factor.$paths.get(`keys-encrypted-${environment}`),
        JSON.stringify(encrypted, null, "  ")
      )
    }
  }()
}
