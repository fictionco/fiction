import { envConfig, safeDirname } from '@fiction/core'

/**
 * Add path for tailwindcss to scan for styles
 */
envConfig.register({ name: 'EDITOR_ROOT', onLoad: ({ fictionEnv }) => { fictionEnv.addUiRoot(safeDirname(import.meta.url)) } })
