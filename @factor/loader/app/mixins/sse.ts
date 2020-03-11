import Vue from "vue"

export default {
  methods: {
    logSse(this: any, ...args: any[]): void {
      this.log("[SSE]", ...args)
    },

    logSseError(this: any, ...args: any[]): void {
      this.logError("[SSE]", ...args)
    },

    sseConnect(this: any, path: string): void {
      if (!Vue.$sse) {
        if (typeof EventSource === "undefined") {
          this.logSse("EventSource is not supported in current browser")
          return
        }

        this.logSse(`Connecting to ${path}`)

        Vue.$sse = new EventSource(path)

        Vue.$sse.addEventListener("message", (event: { data: any }) =>
          this.onSseMessage(event)
        )
      }
    },

    onSseMessage(this: any, message: { data: any }): void {
      const data = JSON.parse(message.data)

      data && this.onSseData && this.onSseData(data)
    },

    sseClose(this: any): void {
      if (Vue.$sse) {
        Vue.$sse.close()
        delete Vue.$sse
      }
    }
  }
}
