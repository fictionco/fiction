import { initApp } from "."

const { app, router } = initApp({ env: "client" })

// wait until router is ready before mounting to ensure hydration match
await router.isReady()

app.mount("#app")
