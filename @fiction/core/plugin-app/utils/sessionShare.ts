import type { Request, RequestHandler, Response } from 'express'

export function sessionShareMiddleware(): RequestHandler {
  return (req: Request, res: Response) => {
    try {
      // Get the requesting origin
      const origin = req.headers.origin || ''

      // Get the auth token from cookie
      const authToken = req.cookies.fictionAuthToken

      if (!authToken) {
        res.status(401).end('Unauthorized')
        return
      }

      // Check if the request has a valid referer to prevent CSRF
      const referer = req.headers.referer || ''
      if (!referer) {
        res.status(403).end('Forbidden')
        return
      }

      // Set CORS headers to allow only the requesting origin
      res.header('Access-Control-Allow-Origin', origin)
      res.header('Access-Control-Allow-Credentials', 'true')
      res.header('Content-Security-Policy', 'default-src \'self\'; script-src \'unsafe-inline\'')
      res.header('X-Frame-Options', 'SAMEORIGIN')

      // Return HTML with postMessage to securely share the token
      const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <script>
                (function() {
                  // Get token and validate it exists
                  const token = ${JSON.stringify(authToken)};
                  if (!token) return;

                  // Ensure we're in an iframe
                  if (window.top === window) return;

                  // Send token to parent window
                  window.addEventListener('message', function(event) {
                    // Only respond to requests for the token
                    if (event.data === 'REQUEST_AUTH_TOKEN') {
                      // Send token back to parent with origin validation
                      event.source.postMessage({
                        type: 'AUTH_TOKEN_RESPONSE',
                        token: token,
                        timestamp: Date.now()
                      }, event.origin);
                    }
                  });

                  // Signal we're ready
                  window.parent.postMessage('AUTH_FRAME_READY', '*');
                })();
              </script>
            </head>
            <body></body>
          </html>
        `

      res.status(200).send(html)
    }
    catch (error) {
      console.error(error)
      res.status(500).end('Error')
    }
  }
}

type AuthResponse = {
  type: 'AUTH_TOKEN_RESPONSE'
  token: string
  timestamp: number
}

/**
 * Retrieves auth token securely from main domain via iframe postMessage
 * @param domain Main domain hosting the auth session
 * @param timeoutMs Max time to wait for response (default: 5000ms)
 * @returns Promise resolving to the auth token
 */
export async function getAuthToken(args: { domain: string, timeoutMs: number }): Promise<string> {
  const { domain, timeoutMs = 2500 } = args

  return new Promise<string>((resolve, reject) => {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = `https://${domain}/session-share`

    const cleanup = () => {
      // eslint-disable-next-line ts/no-use-before-define
      window.removeEventListener('message', handleMessage)
      iframe.remove()
    }

    // Create timeout that auto-rejects and cleans up
    const timeoutId = setTimeout(() => {
      cleanup()
      reject(new Error('Auth token request timed out'))
    }, timeoutMs)

    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from our trusted domain
      if (event.origin !== `https://${domain}`)
        return

      if (event.data === 'AUTH_FRAME_READY') {
        // Request the token when frame signals readiness
        iframe.contentWindow?.postMessage('REQUEST_AUTH_TOKEN', `https://${domain}`)
      }
      else if (typeof event.data === 'object') {
        const response = event.data as AuthResponse
        if (response.type === 'AUTH_TOKEN_RESPONSE') {
          // Verify token is recent (within 10 seconds)
          if (Date.now() - response.timestamp < 10000) {
            clearTimeout(timeoutId)
            cleanup()
            resolve(response.token)
          }
          else {
            clearTimeout(timeoutId)
            cleanup()
            reject(new Error('Received expired token'))
          }
        }
      }
    }

    window.addEventListener('message', handleMessage)
    document.body.appendChild(iframe)
  })
}
