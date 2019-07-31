module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.mongo = Factor.$mongo.mongoose
      this.DB_CONNECTION = Factor.$config.setting("DB_CONNECTION")
      this.dbConfig()



      if (!this.DB_CONNECTION) {
        Factor.$filters.callback("initial-server-start", () => {
          Factor.$log.warn("No database connection string (.env/DB_CONNECTION)")
        })
        return
      }


      Factor.$filters.callback("close-server", () => this.disconnectDb())
      Factor.$filters.add("initialize-server", () => {
        this.connectDb()
      })
    }

    dbConfig() {
      // https://mongoosejs.com/docs/guide.html#autoIndex
      if (process.env.NODE_ENV == "production") {
        this.mongo.set("autoIndex", false)
      } else if (Factor.FACTOR_DEBUG) {
        this.mongo.set("debug", true)
      }
    }

    async disconnectDb(callback) {
      if (this._connected) {
        await this.mongo.connection.close()

        if (callback) callback()

        this._connected = false
      }
      return
    }

    async connectDb() {

      if (!this._connected && this.readyState() != 'connected') {
        try {
          this._connected = true
          await this.mongo.connect(this.DB_CONNECTION, { useNewUrlParser: true })
          return
        } catch (error) {
          throw new Error(error)
        }
      }
    }
    readyState() {
      const activeState = this.mongo.connection.readyState

      const states = ["disconnected", "connected", "connecting", "disconnecting"]

      return states[activeState]
    }
  })()
}
