import path from 'node:path'
import { createRequire } from 'node:module'
import { configDefaults, defineConfig } from 'vitest/config'
import pluginVue from '@vitejs/plugin-vue'
import codspeedPlugin from '@codspeed/vitest-plugin'
import { getMarkdownPlugins } from './@factor/api/plugin-app/utils/vitePluginMarkdown'

const require = createRequire(import.meta.url)

const factorPath = path.join(
  path.dirname(require.resolve('@factor/api')),
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
  plugins: [pluginVue(), ...getMarkdownPlugins(), codspeedPlugin()],
  build: { sourcemap: true },

  test: {
    testTimeout: 30000,
    env: {
      NODE_ENV: 'development',
    },
    exclude: ['**/node_modules/**', '**/dist/**', '.git', '.cache', '**/.ref/**', '**/.ref-*/**'],
    globalSetup: [`${factorPath}/setupGlobal.ts`],
    setupFiles: [`${factorPath}/setupTest.ts`],
    environmentOptions: { jsdom },
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html'],
      exclude: [
        ...configDefaults.coverage.exclude!,
        '**/*.vue',
        '**/*.cjs',
        '**/*.js',
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
