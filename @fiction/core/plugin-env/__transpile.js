import path from 'node:path'
import { createRequire } from 'node:module'
import process from 'node:process'
import tsNode from 'ts-node'
import moduleAlias from 'module-alias'

const require = createRequire(import.meta.url)
const cwd = () => process.cwd()

export async function transpiler() {
  /**
   * Use UTC time to prevent differences between local and live envs
   */
  process.env.TZ = 'utc'
  /**
   * Allow Node to process TypeScript
   */
  const transpileModules = ['@fiction', '.*factor', '@kaption', 'dayjs', '.pnpm']
  tsNode.register({
    transpileOnly: true,
    compilerOptions: {
      strict: false,
      allowJs: true,
      resolveJsonModule: true,
      moduleResolution: 'node',
      module: 'ESNext',
      target: 'ES2020',
      esModuleInterop: true,
    },
    ignore: [
      `node_modules/(?!(${transpileModules.join('|')}))`,
      `node_modules/.pnpm/(?!(${transpileModules.join('|')}))`,
    ],
  })

  /**
   * Add needed workflow aliases
   * Alias: @src - Application source
   * Alias: @cwd - Current working directory
   */

  const primaryPackage = path.resolve(cwd(), 'package.json')

  const { main = 'index.js' } = require(primaryPackage)

  moduleAlias.addAlias('@src', () => path.dirname(path.resolve(cwd(), main)))
  moduleAlias.addAlias('@cwd', () => cwd())
  require.extensions['.vue'] = () => {}
  require.extensions['.webp'] = () => {}
}
