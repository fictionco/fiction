module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.DB_CONNECTION = Factor.$config.setting("DB_CONNECTION")
      this.dbConfig()

      if (!this.DB_CONNECTION) {
        throw new Error("Missing the database connection string (DB_CONNECTION)")
      }

      Factor.$filters.callback("close-server", async () => {
        return await this.disconnectDb()
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

    async disconnectDb(callback) {
      if (this._connected) {
        await Factor.$mongoose.connection.close()

        if (callback) callback()

        this._connected = false
      }
      return
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

    async gracefulShutdown({ msg, callback }) {
      await this.disconnectDb(callback)
    }

    shutdownEvents() {
      const _this = this
      // CAPTURE APP TERMINATION / RESTART EVENTS
      // To be called when process is restarted or terminated

      // For nodemon restarts
      process.once("SIGUSR2", function() {
        _this.disconnectDb(() => {
          process.kill(process.pid, "SIGUSR2")
        })
      })

      process.on("CALL_AND_RETRY_LAST", function() {
        _this.disconnectDb(() => {
          process.exit(0)
        })
      })
      // For app termination
      process.on("SIGINT", function() {
        _this.disconnectDb(() => {
          process.exit(0)
        })
      })

      process.on("SIGTERM", function() {
        _this.disconnectDb(() => {
          process.exit(0)
        })
      })
    }
  })()
}
