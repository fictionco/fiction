module.exports.default = Factor => {
  return new (class {
    constructor() {
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
        Factor.$mongoose.set("autoIndex", false)
      } else if (Factor.FACTOR_DEBUG) {
        Factor.$mongoose.set("debug", true)
      }
    }

    async disconnectDb(callback) {
      if (this._connected) {
        await Factor.$mongoose.connection.close()

        if (callback) callback()

        this._connected = false
      }
      return
    }

    async connectDb() {

      if (!this._connected && this.readyState() != 'connected') {
        try {
          this._connected = true
          await Factor.$mongoose.connect(this.DB_CONNECTION, { useNewUrlParser: true })
          return
        } catch (error) {
          throw new Error(error)
        }
      }
    }
    readyState() {
      const activeState = Factor.$mongoose.connection.readyState
      //  console.log("Mongo", this.readyStateMap()[Factor.$mongoose.connection.readyState])
      const states = ["disconnected", "connected", "connecting", "disconnecting"]

      return states[activeState]
    }
  })()
}
