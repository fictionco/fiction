import { envConfig, safeDirname } from '@fiction/core'

export * from './tools'

/**
 * Add path for tailwindcss to scan for styles
 */
envConfig.register({ name: 'ADMIN_UI_ROOT', onLoad: ({ fictionEnv }) => { fictionEnv.addUiRoot(safeDirname(import.meta.url)) } })
