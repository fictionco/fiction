const fs = require("fs-extra")

module.exports = Factor => {
  return new (class {
    constructor() {
      const conf = Factor.$paths.get("config")
      const gen = Factor.$paths.get("generated")
      const res = require("path").resolve

      Factor.$paths.add({
        "keys-public": res(conf, "keys-public.json"),
        "keys-private-raw": res(conf, "keys-private.json"),
        "keys-encrypted-development": res(gen, "keys-encrypted-development.json"),
        "keys-encrypted-production": res(gen, "keys-encrypted-production.json"),
        passwords: res(conf, "passwords.json")
      })

      this.pathRaw = Factor.$paths.get("keys-private-raw")
      this.pathPasswords = Factor.$paths.get("passwords")
      this.pathEncProduction = Factor.$paths.get("keys-encrypted-production")
      this.pathEncDevelopment = Factor.$paths.get("keys-encrypted-development")

      this.doWatchers()

      Factor.$filters.add("cli-tasks", _ => {
        _.push({
          command: (ctx, task) => {
            task.title = this.analyzeKeys("development")
          },
          title: `Analyzing "development" private keys`
        })

        _.push({
          command: (ctx, task) => {
            task.title = this.analyzeKeys("production")
          },
          title: `Analyzing "production" private keys`
        })

        return _
      })
    }

    file(p) {
      if (fs.pathExistsSync(p)) {
        return require(p)
      } else return false
    }

    analyzeKeys(environment) {
      const status = [`${Factor.$utils.toLabel(environment)} keys:`]

      const raw = this.getRawKeys(environment)
      const password = this.getPassword(environment)

      if (raw) {
        status.push("Unencrypted keys found.")
      } else {
        status.push("No unencrypted keys found.")
      }

      if (password) {
        status.push("Encryption password found.")
      } else {
        status.push("Missing encryption password.")
      }

      if (password && raw) {
        this.createEncryptedFile({ environment, raw, password })
        status.push(`Generated encrypted file.`)
      } else {
        status.push(`No files generated.`)
      }

      return status.join(" ")
    }

    doWatchers() {
      Factor.$filters.add("build-watchers", _ => {
        _.push({
          name: "Keys Changed",
          files: [this.pathRaw],
          callback: ({ event, path }) => {
            const es = ["development", "production"]
            es.forEach(environment => this.analyzeKeys(environment))
          }
        })
        return _
      })
    }

    getRawKeys(environment) {
      const raw = this.file(this.pathRaw)

      if (!raw || !raw[environment]) {
        return false
      }

      // Get only data needed for environment
      return {
        [environment]: raw[environment],
        checksum: "factor",
        all: raw.all || {}
      }
    }

    readEncryptedSecrets(environment) {
      const filterKey = `keys-encrypted-${environment}`
      const file = Factor.$paths.get(filterKey)

      let encrypted = {}
      encrypted = this.file(file)
      let decrypted
      if (encrypted) {
        try {
          decrypted = require("crypto-json").decrypt(encrypted, this.getPassword(environment))
        } catch (error) {}
      }

      if (decrypted && (decrypted.checksum == "factor" || !decrypted.checksum)) {
        return decrypted
      } else {
        return {}
      }
    }

    writeJsonFile({ data, path }) {
      fs.writeFileSync(path, JSON.stringify(data, null, "  "))
    }

    createEncryptedFile({ environment, raw, password }) {
      const encrypted = require("crypto-json").encrypt(raw, password)

      this.writeJsonFile({
        path: Factor.$paths.get(`keys-encrypted-${environment}`),
        data: encrypted
      })
    }

    readEncrypted(environment) {
      const password = this.getPassword(environment)

      let config = {}

      if (password) {
        config = this.readEncryptedSecrets(environment)
      }

      return config
    }

    getPassword(environment) {
      let password = Factor.$filters.apply(`master-password-${environment}`)

      if (password) {
        return password
      }

      let passwordFile = this.file(this.pathPasswords)

      if (!passwordFile) {
        return false
      }

      return passwordFile[environment] ? passwordFile[environment] : false
    }
  })()
}
