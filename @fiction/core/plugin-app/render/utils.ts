import path from 'node:path'
import fs from 'fs-extra'
import type { ViteDevServer } from 'vite'
import type { Request } from 'express'
import type { RunVars } from '../../inject'
import { FictionObject } from '../../plugin'

export type IndexHtmlSettings = {
  distClientFolder: string
  mountFilePath: string
}

export class IndexHtml extends FictionObject<IndexHtmlSettings> {
  rawTemplate = `<!DOCTYPE html><html><head><!--head--></head><body><div id="app"><!--app--></div></body></html>`
  constructor(settings: IndexHtmlSettings) {
    super('IndexHtml', settings)
  }

  private indexHtmlAddEntry(args: { template: string, isProd: boolean }): string {
    return args.template.replace(
      '</body>',
      `<script type="module" src="${args.isProd ? `@MOUNT_FILE_ALIAS` : `/@fs${this.settings.mountFilePath}`}"></script></body>`,
    )
  }

  private async indexHtmlAddDevTransform(args: { pathname?: string, template: string, viteServer: ViteDevServer }): Promise<string> {
    const { pathname = '/', template, viteServer } = args

    return await viteServer.transformIndexHtml(pathname, template)
  }

  async getRenderedIndexHtml(): Promise<string> {
    const distClient = this.settings.distClientFolder

    fs.ensureDirSync(distClient)
    const indexHtmlPath = path.resolve(distClient, './index.html')
    const template = fs.readFileSync(indexHtmlPath, 'utf8')
    return template
  }

  getBuildIndexHtml(): string {
    const template = this.rawTemplate
    const html = this.indexHtmlAddEntry({ template, isProd: true })
    return html
  }

  async getDevIndexHtml(args: { viteServer: ViteDevServer, pathname: string }): Promise<string> {
    const { viteServer } = args
    let template = this.rawTemplate
    template = await this.indexHtmlAddDevTransform({ template, viteServer })
    template = this.indexHtmlAddEntry({ template, isProd: false })
    return template
  }
}

export function getRequestVars(args: { request: Request }): Record<string, string> {
  const { request } = args

  // Extracting protocol (HTTP vs HTTPS)
  const protocol = request?.protocol || 'http' // Defaults to 'http' if protocol is not available

  // Extracting subdomain
  const subdomains = request?.subdomains || []
  const subdomain = subdomains.length > 0 ? subdomains.join('.') : ''

  // Extracting other relevant information
  const host = request?.get('host') // Hostname with port if applicable
  const hostname = request?.hostname
  const ip = request?.ip // IP address of the request
  const userAgent = request?.get('User-Agent') // User-Agent header

  // For debugging: concatenate all headers into a single string
  const allHeaders = request?.headers
    ? Object.entries(request.headers)
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join(', ')
    : ''

  const originalHost = request?.get('X-Original-Host') || ''

  const ORIGIN = `${protocol}://${host}`

  const requestVars: Partial<RunVars> = {
    PROTOCOL: protocol,
    SUBDOMAIN: subdomain,
    ORIGINAL_HOST: originalHost,
    HOST: host || '',
    HOSTNAME: hostname,
    IP_ADDRESS: ip || '',
    USER_AGENT: userAgent || '',
    ALL_HEADERS: allHeaders,
    PATHNAME: request?.originalUrl,
    ORIGIN,
    URL: `${ORIGIN}${request?.originalUrl}`,

  }

  return requestVars as Record<string, string>
}
