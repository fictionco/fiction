import { initApp } from "."

// prevent 'process' not defined errors in browser
if (typeof window !== "undefined" && typeof window.process == "undefined") {
  // @ts-ignore (avoid confusion with node process.env)
  window.process = { env: {} }
}

const { app, router } = initApp({ env: "client" })

// wait until router is ready before mounting to ensure hydration match
await router.isReady()

app.mount("#app")
