import mongoose from "mongoose"
import Factor from "@factor/core"

export default () => {
  const { DB_CONNECTION, NODE_ENV, FACTOR_DEBUG } = process.env
  return new (class {
    constructor() {
      if (!DB_CONNECTION) return

      Factor.$filters.callback("close-server", () => this.disconnectDb())
      Factor.$filters.callback("initialize-server", () => this.connectDb())
    }

    async disconnectDb(callback) {
      if (this.isConnected) {
        await mongoose.connection.close()

        if (callback) callback()

        this.isConnected = false
      }
      return
    }

    async connectDb() {
      if (!this.isConnected && this.readyState() != "connected") {
        try {
          this.isConnected = true
          await mongoose.connect(DB_CONNECTION, { useNewUrlParser: true })
          return
        } catch (error) {
          Factor.$log.error(error)
        }
      }
    }
    readyState() {
      const states = ["disconnected", "connected", "connecting", "disconnecting"]

      return states[mongoose.connection.readyState]
    }
  })()
}
