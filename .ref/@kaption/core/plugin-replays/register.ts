import { EnvVar, vars } from '@factor/api/plugin-env'

vars.register(() => [new EnvVar({ name: 'REPLAY_PORT', isOptional: true })])
