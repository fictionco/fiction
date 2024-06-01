import { EnvVar, vars } from '@fiction/core/plugin-env'

vars.register(() => [
  new EnvVar({ name: 'STRIPE_PUBLIC_KEY_TEST', isPublic: true }),
  new EnvVar({ name: 'STRIPE_SECRET_KEY_TEST', isPublic: false }),
  new EnvVar({ name: 'STRIPE_PUBLIC_KEY_PROD', isPublic: true, verify: ({ fictionEnv, value }) => { return !(fictionEnv.isProd.value && !value && fictionEnv.isApp.value) } }),
  new EnvVar({ name: 'STRIPE_SECRET_KEY_PROD', verify: ({ fictionEnv, value }) => {
    return !(fictionEnv.isProd.value && !value && !fictionEnv.isApp.value && !fictionEnv.isCi)
  }, isPublic: false }),
])
