import { createApp } from "."

const { app, router } = createApp({ env: "client" })

// wait until router is ready before mounting to ensure hydration match
await router.isReady()

app.mount("#app")
