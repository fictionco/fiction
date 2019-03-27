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
      const keysRaw = Factor.$paths.get("keys-private-raw")
      this.makeEncryptedSecrets()
      Factor.$filters.add("dev-watchers", _ => {
        const files = [keysRaw]
        const watchers = [
          {
            files,
            cb: (event, path) => {
              if (path == keysRaw && event == "change") {
                this.makeEncryptedSecrets()
                return true
              }
            }
          }
        ]
        return _.concat(watchers)
      })
    }

    readEncryptedSecrets({ build = "development", password }) {
      const filterKey = `keys-encrypted-${build}`
      const file = Factor.$paths.get(filterKey)

      if (!file) {
        consola.error(`Cannot find file: ${filterKey}`)
        return
      }

      let encrypted = {}
      encrypted = require(file)
      return require("crypto-json").decrypt(encrypted, password)
    }

    makeEncryptedSecrets() {
      const fs = require("fs-extra")
      const consola = require("consola")

      let passwords = Factor.$filters.apply("master-password")

      let passwordsFile = Factor.$paths.get("passwords")
      if (!passwords) {
        try {
          passwords = require(passwordsFile)
        } catch (error) {}
      }

      if (!passwords) {
        consola.warn(
          `Didn't generate encrypted keys. No passwords @[${passwordsFile}] or Filter: 'master-password'`
        )
        return
      }

      const keysRaw = Factor.$paths.get("keys-private-raw")

      if (!fs.pathExistsSync(keysRaw)) {
        consola.error(`Couldn't Find Private Keys File @[${keysRaw}]`)
        return
      }

      const rawKeys = require(keysRaw)

      const generated = []
      if (passwords.development) {
        const encryptedDev = require("crypto-json").encrypt(rawKeys, passwords.development)
        fs.writeFileSync(
          Factor.$paths.get("keys-encrypted-development"),
          JSON.stringify(encryptedDev, null, "  ")
        )
        generated.push("dev")
      }

      if (passwords.production) {
        const encryptedProd = require("crypto-json").encrypt(rawKeys, passwords.production)
        fs.writeFileSync(
          Factor.$paths.get("keys-encrypted-production"),
          JSON.stringify(encryptedProd, null, "  ")
        )
        generated.push("prod")
      }

      if (generated.length > 0) {
        consola.success(`Generated Encrypted Keys [${generated.join(", ")}]`)
      }
    }
  }()
}
