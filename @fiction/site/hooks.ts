import '@fiction/core/plugin-env/hooks'

declare module '@fiction/core/plugin-env/hooks' {
  interface FictionEnvHookDictionary {
    userOnLogout: { args: [] }
    onSetClientToken: { args: [string] }
  }
}
