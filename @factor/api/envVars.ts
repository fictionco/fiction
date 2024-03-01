import { EnvVar, vars } from './plugin-env'

vars.register(() => [
  new EnvVar({
    name: 'SLACK_WEBHOOK_URL',
    isPublic: false,
  }),
])
