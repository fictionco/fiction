const parse = require("qs").parse

const cors = require("cors")({ origin: true })
module.exports = Factor => {
  return new class {
    constructor() {
      this.endpointService = Factor.$filters.apply("endpoint-service")

      if (!this.endpointService) {
        throw new Error("[Factor] No endpoint service provided.")
      }
    }

    requestHandler(plugin) {
      const requester = (req, res) => {
        return cors(req, res, async () => {
          await this.onRequest(plugin, req, res)
          return
        })
      }

      return this.endpointService(requester)
    }

    async onRequest(plugin, req, res) {
      const { query, body } = req

      const GET = parse(query)

      const POST = this.isJson(body) ? JSON.parse(body) : body

      const ENDPOINT_ARGS = { ...POST, ...GET }

      const out = await this.handler(plugin, ENDPOINT_ARGS)

      res
        .status(200)
        .jsonp(out)
        .end()

      return
    }

    async handler(plugin, ENDPOINT_ARGS) {
      const { action = "", uid = "", report = "", endpoint = "", ...args } = ENDPOINT_ARGS

      let out = {}
      let user
      let ep
      try {
        if (!action) {
          throw new Error("[API] No Action Provided")
        }

        //   user = uid ? await auth.getUser(uid) : {}

        // const endpointGlobals = {
        //   uid,
        //   user,
        //   action,
        //   query,
        //   config,
        //   utils: _,
        //   root,
        //   req
        // }

        ep = plugin(Factor)

        if (ep[action] && typeof ep[action] == "function") {
          out = await ep[action](args)
        } else {
          throw new Error(`[API] Method for "${action}" does not exist.`)
        }
      } catch (error) {
        const { message, stack } = error
        out = {
          error: { message, stack }
        }
      }
    }

    isJson(str) {
      try {
        JSON.parse(str)
      } catch (error) {
        return false
      }
      return true
    }
  }()
}
