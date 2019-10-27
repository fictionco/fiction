import Factor from "@factor/core"
import { dbConnect, dbDisconnect } from "./server"
import { addCallback } from "@factor/filters/util"
export default () => {
  const { DB_CONNECTION, DB_CONNECTION_TEST, NODE_ENV, FACTOR_DEBUG } = process.env
  return new (class {
    constructor() {
      if (!DB_CONNECTION && !DB_CONNECTION_TEST) return

      addCallback("close-server", () => dbDisconnect())
      addCallback("initialize-server", () => dbConnect())
    }
  })()
}
