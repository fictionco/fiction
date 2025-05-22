import type { ViteUserConfig } from 'vitest/config'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import pluginVue from '@vitejs/plugin-vue'
import { configDefaults, defineConfig } from 'vitest/config'
import { getMarkdownPlugins } from './@fiction/core/plugin-app/utils/vitePluginMarkdown.js'

const require = createRequire(import.meta.url)

const corePath = path.join(
  path.dirname(require.resolve('@fiction/core')),
  '/test-utils',
)

export function sourceFolder(moduleName: string): string {
  const appPath = require.resolve(moduleName)
  return path.dirname(appPath)
}

const jsdom = {
  url: 'http://localhost:10000/thepathname?q=example&utm_campaign=testCampaign&utm_medium=testMedium&utm_source=testSource',
  referrer: 'https://www.twitter.com',
  html: `<!DOCTYPE html><head><title>Test Title</title></head><body>Page Content <a href="#">link</a></body></html>`,
}

export default defineConfig({
  plugins: [
    pluginVue(),
    ...getMarkdownPlugins(),
  ] as ViteUserConfig['plugins'],
  build: { sourcemap: true },
  root: process.cwd(),
  clearScreen: false,
  test: {

    // added to fix a memory error 3.0.4 -> https://github.com/vitest-dev/vitest/issues/7288
    fakeTimers: {
      toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'],
    },
    testTimeout: 60000,
    hookTimeout: 40000,
    env: {
      NODE_ENV: 'development',
    },
    exclude: ['**/node_modules/**', '**/dist/**', '.git', '.cache', '**/.ref/**', '**/.ref-*/**', '**/__*/*'],
    globalSetup: [`${corePath}/setupGlobal.ts`],
    setupFiles: [`${corePath}/setupTest.ts`],
    environmentOptions: { jsdom },
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html'],
      exclude: [
        ...configDefaults.coverage.exclude!,
        '**/*.vue',
        '**/*.cjs',
        '**/*.js',
        '**/test-utils/**',
        '**/resource/**',
        '**/dist/**',
        '**/node_modules/**',
        '**/coverage/**',
        '**/test/**',
        '**/scripts/**',
      ],
    },
    alias: [
      // https://github.com/vitest-dev/vitest/discussions/1806
      {
        find: /^monaco-editor$/,
        replacement: path.join(__dirname, `/node_modules/monaco-editor/esm/vs/editor/editor.api`),
      },
    ],

  },
})
