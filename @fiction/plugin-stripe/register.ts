import { EnvVar, vars } from '@fiction/core/plugin-env'

vars.register(() => [
  new EnvVar({ name: 'STRIPE_PUBLIC_KEY_TEST', isPublic: true }),
  new EnvVar({ name: 'STRIPE_SECRET_KEY_TEST', isPublic: false }),
  new EnvVar({ name: 'STRIPE_PUBLIC_KEY_PROD', isPublic: true, verify: ({ factorEnv, value }) => { return !(factorEnv.isProd.value && !value && factorEnv.isApp.value) } }),
  new EnvVar({ name: 'STRIPE_SECRET_KEY_PROD', verify: ({ factorEnv, value }) => { return !(factorEnv.isProd.value && !value && !factorEnv.isApp.value) }, isPublic: false }),
])
