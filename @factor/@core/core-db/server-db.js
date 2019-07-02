module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.DB_CONNECTION = Factor.$config.setting("DB_CONNECTION")
      this.dbConfig()

      if (!this.DB_CONNECTION) {
        throw new Error("Missing the database connection string (DB_CONNECTION)")
      }

      Factor.$filters.callback("close-server", async () => {
        if (this._connected) {
          await Factor.$mongoose.connection.close()

          this._connected = false
        }
        return
      })
      Factor.$filters.add("initialize-server", () => {
        this.connectDb()
      })

      this.shutdownEvents()
    }

    dbConfig() {
      // https://mongoosejs.com/docs/guide.html#autoIndex
      if (process.env.NODE_ENV == "production") {
        Factor.$mongoose.set("autoIndex", false)
      }
    }

    async connectDb() {
      if (!this._connected) {
        try {
          this._connected = true
          await Factor.$mongoose.connect(this.DB_CONNECTION, { useNewUrlParser: true })
          return
        } catch (error) {
          Factor.$error.throw(error)
        }
      }
    }

    readyStateMap() {
      //  console.log("Mongo", this.readyStateMap()[Factor.$mongoose.connection.readyState])
      return ["disconnected", "connected", "connecting", "disconnecting"]
    }

    gracefulShutdown({ msg, callback }) {
      if (this._connected) {
        Factor.$mongoose.connection.close().then(() => {
          console.log(`DB Disconnect (${msg})`)
          this._connected = false
          callback()
        })
      }
    }

    shutdownEvents() {
      const _this = this
      // CAPTURE APP TERMINATION / RESTART EVENTS
      // To be called when process is restarted or terminated

      // For nodemon restarts
      process.once("SIGUSR2", function() {
        _this.gracefulShutdown({
          msg: "Development restart",
          callback: () => {
            process.kill(process.pid, "SIGUSR2")
          }
        })
      })
      // For app termination
      process.on("SIGINT", function() {
        _this.gracefulShutdown({
          msg: "App termination",
          callback: () => {
            process.exit(0)
          }
        })
      })

      process.on("SIGTERM", function() {
        _this.gracefulShutdown({
          msg: "App termination",
          callback: () => {
            process.exit(0)
          }
        })
      })
    }
  })()
}
