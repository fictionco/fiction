const fs = require("fs-extra")

module.exports = Factor => {
  return new (class {
    constructor() {
      // const conf = Factor.$paths.get("config")
      // const res = require("path").resolve
      // Factor.$paths.add({
      //   "config-file": res(conf, "factor-config.json"),
      //   "secrets-file": res(conf, "factor-secrets.json"),
      //   "secrets-encrypted-development": res(conf, "secrets-encrypted-development.json"),
      //   "secrets-encrypted-production": res(conf, "secrets-encrypted-production.json"),
      //   decryptor: res(conf, "factor-decryptor.json")
      // })
      // this.pathRaw = Factor.$paths.get("secrets-file")
      // this.pathDecryptor = Factor.$paths.get("decryptor")
      // this.pathEncProduction = Factor.$paths.get("secrets-encrypted-production")
      // this.pathEncDevelopment = Factor.$paths.get("secrets-encrypted-development")
      // Factor.$filters.add("factor-config")
      //this.doWatchers()
      // Factor.$filters.add("cli-tasks", _ => {
      //   _.push({
      //     command: (ctx, task) => {
      //       task.title = this.analyzeKeys("development")
      //     },
      //     title: `Analyzing "development" private keys`
      //   })
      //   _.push({
      //     command: (ctx, task) => {
      //       task.title = this.analyzeKeys("production")
      //     },
      //     title: `Analyzing "production" private keys`
      //   })
      //   return _
      // })
    }

    file(p) {
      if (fs.pathExistsSync(p)) {
        return require(p)
      } else return false
    }

    analyzeKeys(environment) {
      const status = [`Secrets "${environment}":`]

      const raw = this.getRawKeys(environment)
      const password = this.getDecryptKey(environment)

      if (raw) {
        status.push("Unencrypted keys found.")
      } else {
        status.push("No unencrypted keys found.")
      }

      if (password) {
        status.push("Encryption key found.")
      } else {
        status.push("Missing encryption key.")
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
        config: raw.config || {}
      }
    }

    readEncryptedSecrets(environment) {
      const file = Factor.$paths.get(`secrets-encrypted-${environment}`)

      let encrypted = {}
      encrypted = this.file(file)

      let decrypted
      if (encrypted) {
        try {
          decrypted = require("crypto-json").decrypt(encrypted, this.getDecryptKey(environment))
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
        path: Factor.$paths.get(`secrets-encrypted-${environment}`),
        data: encrypted
      })
    }

    readEncrypted(environment) {
      const password = this.getDecryptKey(environment)

      let config = {}

      if (password) {
        config = this.readEncryptedSecrets(environment)
      }

      return config
    }

    getDecryptKey(environment) {
      const rawSecrets = this.file(this.pathRaw)
      const filterPassword = Factor.$filters.apply(`secrets-decrypt-${environment}`)
      const decryptor = this.file(this.pathDecryptor)

      if (filterPassword) {
        return password
      } else if (rawSecrets && rawSecrets[environment] && rawSecrets[environment].encrypt) {
        return rawSecrets[environment].encrypt
      } else if (decryptor && decryptor[environment]) {
        return decryptor[environment]
      } else {
        return ""
      }
    }
  })()
}
