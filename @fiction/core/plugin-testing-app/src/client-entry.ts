/* eslint-disable node/prefer-global/process */
import { initApp } from '.'

// prevent 'process' not defined errors in browser
if (typeof window !== 'undefined' && window.process === undefined) {
  // @ts-expect-error (avoid confusion with node process.env)
  window.process = { env: {} }
}

async function init() {
  const { app, router } = initApp({ env: 'client' })

  // wait until router is ready before mounting to ensure hydration match
  await router.isReady()

  app.mount('#app')
}

init().catch(console.error)
