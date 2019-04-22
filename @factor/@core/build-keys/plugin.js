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

      Factor.$filters.add("build-start", () => {
        this.handleFiles()
      })
    }

    file(p) {
      if (fs.pathExistsSync(p)) {
        return require(p)
      } else return false
    }

    writeJsonFile({ data, path }) {
      fs.writeFileSync(path, JSON.stringify(data, null, "  "))
    }

    handleFiles() {
      if (!raw) {
        const _dev = this.readEncryptedSecrets("development")
        const _prod = this.readEncryptedSecrets("production")
        const enc = Object.assign({}, _dev, _prod)

        this.writeJsonFile({
          data: Object.assign({}, { all: {}, development: {}, production: {} }, _dev, _prod),
          path: this.pathRaw
        })
      } else {
        this.makeEncryptedSecrets(raw)
      }
      // if passwords and raw
      // generate encrypted
      // if NO passwords and raw
      // Generate default encrypted, with warning
      // if passwords and encrypted, NO raw
      // generate raw
    }

    doWatchers() {
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

    readEncryptedSecrets(environment) {
      const filterKey = `keys-encrypted-${environment}`
      const file = Factor.$paths.get(filterKey)

      let encrypted = {}
      encrypted = this.file(file)
      let decrypted
      if (encrypted) {
        decrypted = require("crypto-json").decrypt(encrypted, this.getPassword(environment))
      }

      if (decrypted && (decrypted.checksum == "factor" || !decrypted.checksum)) {
        return decrypted
      } else {
        return {}
      }
    }

    makeEncryptedSecrets(raw) {
      raw = raw || this.file(this.pathRaw)
      const envs = ["development", "production"]

      envs.forEach(environment => {
        this.createEncrypted({ environment, raw })
      })
    }
    createEncrypted({ environment, raw }) {
      const password = this.getPassword(environment)

      // Add a checksum that allows us to verify if file is decrypted
      raw.checksum = "factor"

      // Get only data needed for enviroment
      const envRaw = {}
      Object.keys(raw).forEach(k => {
        if (k == "all" || k == environment) {
          envRaw[k] = raw[k]
        }
      })

      const encrypted = require("crypto-json").encrypt(envRaw, password)

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

      let passwordfile = null
      try {
        passwordfile = require(Factor.$paths.get("passwords"))
      } catch (error) {}

      password = passwordfile && passwordfile[environment] ? passwordfile[environment] : ""

      if (!password) {
        Factor.$log.warn(`
          A [${environment}] password is needed to secure your private API keys.
          (Currently Factor is using an insecure default.)
          Add a JSON file @[${Factor.$paths.get("passwords")}] with the format: 
            {
              "production": "[production password]", 
              "development": "[development password]",  
            }
          
          Or use Filter: master-password-${environment}
        `)
      }

      return password
    }
  })()
}
