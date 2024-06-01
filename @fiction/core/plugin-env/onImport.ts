import { vue } from '../utils'
import type { FictionEnv } from '.'

type EnvConfigCallback = { name: string, onLoad: (args: { fictionEnv: FictionEnv }) => void }
class EnvConfigList {
  list: (EnvConfigCallback)[] = []

  register(v: EnvConfigCallback) {
    // this might not be needed since imports are only loaded once
    if (!this.list.find(l => l.name === v.name))
      this.list.push(v)
  }
}

export const envConfig = new EnvConfigList()

/**
 * Register Env Vars and Their Handling
 */
type VerifyVar = (params: {
  fictionEnv: FictionEnv
  value: string | undefined
}) => boolean

interface EnvVarSettings<X extends string> {
  name: X
  val?: string | undefined
  verify?: VerifyVar
  isOptional?: boolean
  isPublic?: boolean
  isSystem?: boolean
}

export class EnvVar<X extends string> {
  name: X
  val: vue.Ref<string | undefined>
  verify?: VerifyVar
  isOptional: boolean
  isPublic: boolean
  isSystem: boolean
  constructor(settings: EnvVarSettings<X>) {
    this.name = settings.name
    this.val = vue.ref(settings.val)
    this.verify = settings.verify
    this.isOptional = settings.isOptional || false
    this.isPublic = settings.isPublic || false
    this.isSystem = settings.isSystem || false
  }
}

class EnvVarList {
  list: (() => EnvVar<string>[])[] = [
    () => [
      new EnvVar({ name: 'NODE_ENV', isPublic: true, isSystem: true }),
      new EnvVar({ name: 'COMMAND', isPublic: true, isSystem: true }),
      new EnvVar({ name: 'COMMAND_OPTS', isPublic: true, isSystem: true }),
      new EnvVar({ name: 'RUNTIME_VERSION', isPublic: true, isSystem: true }),
      new EnvVar({ name: 'RUNTIME_COMMIT', isPublic: true, isSystem: true }),
      new EnvVar({ name: 'IS_TEST', isPublic: true, isSystem: true }),
    ],
  ]

  register(v: () => EnvVar<string>[]) {
    this.list.push(v)
  }
}

/**
 * Singleton of var callbacks.
 * Register envVars (as a side-effect on import) from plugins and then call the functions
 * once FictionEnv has set up.
 */
export const vars = new EnvVarList()
