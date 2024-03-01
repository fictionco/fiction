import path from 'node:path'
import { createRequire } from 'node:module'
import Handlebars from 'handlebars'
import glob from 'glob'
import fs from 'fs-extra'
import type { RunConfig } from '@factor/api'
import { FactorDb, log } from '@factor/api'
import { clientProjectInfoForClient } from '@kaption/lambda'

import type { Project } from '../plugin-admin/types'
import { AppTable } from '../plugin-admin/types'
import { clientTagDir } from './utils'
import { trackerConfig } from './settings'

const require = createRequire(import.meta.url)

export function outputFolders(): {
  htmlFolder: string
  renderedFolder: string
} {
  const dirname = new URL('.', import.meta.url).pathname
  return {
    htmlFolder: `${dirname}/html`,
    renderedFolder: `${dirname}/dist`,
  }
}
/**
 * Generate loader files to test tracking script in each stage
 */
export function createTestLoaders(): void {
  const srcTemplates = glob.sync(`${clientTagDir()}/*.tpl`)

  for (const stage of ['prod', 'local']) {
    const trackerSettings = trackerConfig({
      stage: stage as 'pre' | 'prod' | 'local',
    })

    srcTemplates.forEach((tpl) => {
      const html = fs.readFileSync(tpl, 'utf8')
      const template = Handlebars.compile(html)
      const result = template(trackerSettings)
      const name = path.basename(tpl).replace('.tpl', '')

      const loc = path.join(clientTagDir(), 'dist', name)
      log.l({
        level: 'info',
        context: 'testLoaders',
        description: `writing ${loc}`,
      })
      fs.ensureFileSync(loc)
      fs.writeFileSync(loc, result)
      log.l({
        level: 'info',
        context: 'testLoaders',
        description: `wrote ${loc}`,
      })
    })
  }
}

export async function getLocalSiteData(): Promise<Project | undefined> {
  const factorDb = new FactorDb({ connectionUrl: process.env.POSTGRES_URL })
  const sql = factorDb.client()

  const r = await sql
    .select<Project[]>('*')
    .from(AppTable.Projects)
    .where({ projectId: 'local' })
    .first()

  return r
}

export async function generateTemplates(_config: RunConfig): Promise<void> {
  const { htmlFolder, renderedFolder } = outputFolders()
  const trackerSettings = trackerConfig()

  // use localIP instead of localhost (use for phone debugging)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const localIp = (await require('address').ip()) as string

  trackerSettings.scriptTag = trackerSettings.scriptTag.replace(
    'localhost',
    localIp,
  )

  const localSiteData = await getLocalSiteData()

  const siteData = JSON.stringify(
    clientProjectInfoForClient(localSiteData) ?? {},
    null,
    2,
  )

  const srcTemplates = glob.sync(`${clientTagDir()}/*.tpl`)
  const htmlTemplates = glob.sync(`${htmlFolder}/*.tpl`)
  const wrapHtml = fs.readFileSync(`${htmlFolder}/parts/wrap.html.tpl`, 'utf8')

  const wrap = Handlebars.compile(wrapHtml)

  // Make sure html templates come after src ones
  const orderedTemplates = [...srcTemplates, ...htmlTemplates]

  const frameFiles = path.join(
    path.dirname(require.resolve('@kaption/frame')),
    'dist',
  )

  fs.emptyDirSync(renderedFolder)
  fs.ensureDirSync(frameFiles)
  fs.copySync(frameFiles, renderedFolder)
  orderedTemplates.forEach((tpl) => {
    let html = fs.readFileSync(tpl, 'utf8')

    if (htmlTemplates.includes(tpl))
      html = wrap({ ...trackerSettings, html, siteData, localIp })

    const template = Handlebars.compile(html)

    // Remove HTML tags which can help with formatting tpl files
    const result = template(trackerSettings)

    const name = path.basename(tpl).replace('.tpl', '')

    fs.writeFileSync(path.join(renderedFolder, name), result)
  })

  log.l({
    level: 'info',
    context: 'generateTemplates',
    description: `test site created`,
  })
}
