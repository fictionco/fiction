import type { Request, RequestHandler, Response } from 'express'
import { crossVar } from '.'
import { FictionObject } from '../plugin'
import { log } from '../plugin-log'
import { manageClientUserToken } from './jwt'

const logger = log.contextLogger('SessionTokenUtil')

// Shared constants to keep DRY
const TOKEN_MESSAGES = {
  REQUEST: 'REQUEST_AUTH_TOKEN',
  FRAME_READY: 'AUTH_FRAME_READY',
  RESPONSE_TYPE: 'AUTH_TOKEN_RESPONSE',
} as const

type AuthResponse = {
  type: typeof TOKEN_MESSAGES.RESPONSE_TYPE
  token: string
  timestamp: number
  reason: string
}

type SessionTokenSettings = {
  appUrl?: string
  endpoint: string
  timeoutMs?: number
  tokenKey: string
  cacheDurationMs?: number
  tokenFreshnessMs?: number
}

/**
 * Manages cross-domain session token sharing
 */
export class SessionTokenUtil extends FictionObject<SessionTokenSettings> {
  cachedToken?: string
  cacheTimestamp = 0
  iframe?: HTMLIFrameElement
  cacheDurationMs = this.settings.cacheDurationMs || 60000
  timeoutMs = this.settings.timeoutMs || 2500
  tokenFreshnessMs = this.settings.tokenFreshnessMs || 10000

  constructor(settings: SessionTokenSettings) {
    super('SessionTokenUtil', settings)
  }

  async getAuthToken(): Promise<string | undefined> {
    if (typeof window === 'undefined')
      return undefined

    return this.isRootDomain() ? manageClientUserToken({ key: this.settings.tokenKey }) : this.getSharedSessionToken()
  }

  isRootDomain(): boolean {
    const { hostname } = new URL(window.location.href)
    const rootDomain = new URL(this.settings.appUrl || '/', 'https://dummybase.com').hostname
    return hostname === rootDomain || hostname.endsWith(`.${rootDomain}`) || hostname.includes('localhost')
  }

  async getSharedSessionToken(): Promise<string | undefined> {
    const now = Date.now()

    if (this.cachedToken && now - this.cacheTimestamp < this.cacheDurationMs!)
      return this.cachedToken

    const { token, reason } = await this.requestTokenViaIframe()
    if (token)
      [this.cachedToken, this.cacheTimestamp] = [token, now]

    logger.info('shared session token', { data: { token, reason } })

    return token
  }

  requestTokenViaIframe(): Promise<{ token?: string, reason: string }> {
    if (typeof window === 'undefined')
      return Promise.resolve({ reason: 'no window' })

    return new Promise((resolve) => {
      const renderToken = crossVar.get('RENDER_TOKEN') || ''
      const src = [this.settings.appUrl, this.settings.endpoint, `?renderToken=${encodeURIComponent(renderToken)}`].join('')
      this.iframe = Object.assign(document.createElement('iframe'), { style: { display: 'none' }, src })

      const cleanup = (args: { token?: string, reason: string }) => {
        const { token, reason } = args
        // eslint-disable-next-line ts/no-use-before-define
        window.removeEventListener('message', handler)
        // eslint-disable-next-line ts/no-use-before-define
        clearTimeout(timeout)
        this.iframe?.parentNode?.removeChild(this.iframe)
        this.iframe = undefined

        resolve({ token, reason })
      }
      const handler = (event: MessageEvent) => {
        if (event.origin !== this.settings.appUrl)
          return
        if (event.data === TOKEN_MESSAGES.FRAME_READY) {
          this.iframe?.contentWindow?.postMessage(TOKEN_MESSAGES.REQUEST, this.settings.appUrl)
        }
        else if (event.data?.type === TOKEN_MESSAGES.RESPONSE_TYPE) {
          const { token, timestamp, reason } = event.data as AuthResponse

          const freshness = this.tokenFreshnessMs || 10000
          if (Date.now() - timestamp > freshness) {
            cleanup({ reason: 'token is too old' })
          }

          logger.info('received token', { data: { token, timestamp } })

          cleanup({ token, reason })
        }
      }

      window.addEventListener('message', handler)
      document.body.appendChild(this.iframe)

      const timeout = setTimeout(() => (cleanup({ reason: 'timeout' })), this.timeoutMs)
      this.iframe.onerror = () => (cleanup({ reason: 'iframe error' }))
    })
  }

  cancelPendingRequests(): void {
    this.iframe?.parentNode?.removeChild(this.iframe)
    this.iframe = undefined
  }
}

/**
 * Creates session middleware for Express
 */
export function createSessionSharingMiddleware(tokenKey: string): RequestHandler {
  return (req: Request, res: Response) => {
    const { referer = '' } = req.headers

    const authToken = req.cookies[tokenKey]

    logger.info('Session sharing middleware', { data: { referer, authToken } })

    if (!referer) {
      res.status(403).end()
      return
    }

    res.set({
      'Access-Control-Allow-Credentials': 'true',
      'Content-Security-Policy': 'default-src \'self\'; script-src \'unsafe-inline\'',
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer-when-downgrade',
    })

    const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <script>
              (function() {
                if (window.top === window) return;

                const token = ${JSON.stringify(authToken)};
                window.addEventListener('message', function(event) {
                  if (event.data === '${TOKEN_MESSAGES.REQUEST}') {
                    event.source.postMessage({
                      type: '${TOKEN_MESSAGES.RESPONSE_TYPE}',
                      token: token,
                      timestamp: Date.now(),
                      reason: '${authToken ? 'logged in' : 'not logged in'}',
                    }, event.origin);
                  }
                });

                window.parent.postMessage('${TOKEN_MESSAGES.FRAME_READY}', '*');
              })();
            </script>
          </head>
          <body></body>
        </html>
      `

    res.send(html)
  }
}
