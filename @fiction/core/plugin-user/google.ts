import type { vue } from '../utils/index.js'
import type { ManageUserResponse } from './endpoint.js'
import type { FictionUser, User } from './index.js'
import { log } from '../plugin-log/index.js'
import { getNakedDomain } from '../utils/index.js'

const logger = log.contextLogger('Fiction - Google One Tap')

type GoogleCodeClient = {
  requestCode: () => void
}

type GoogleCodeResponse = {
  code: string
  scope: string
  authuser: string
  prompt: string
}

type GoogleCodeClientConfig = {
  client_id: string
  scope: string
  ux_mode: 'popup'
  callback: (response: GoogleCodeResponse) => void
  error_callback?: (error: { type: string }) => void
}
declare global {
  interface Window {
    __googleLoading?: Promise<void>
    google?: typeof import('google-one-tap') & {
      accounts: {
        oauth2: {
          initTokenClient: (config: TokenClientConfig) => TokenClient
          initCodeClient: (config: GoogleCodeClientConfig) => GoogleCodeClient
        }
      }
    }
    gtag?: (...args: any[]) => void

  }
}

interface CredentialResponse {
  credential: string
  select_by: string
  client_id?: string
}

export async function loadGoogleSignInLibrary(): Promise<void> {
  // Already loaded
  if (window.google?.accounts)
    return

  // Already loading
  if (window.__googleLoading)
    return window.__googleLoading

  window.__googleLoading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true

    // Poll for google object initialization
    const poll = (retries = 100) => {
      if (window.google?.accounts) {
        resolve()
      }
      else if (retries <= 0) {
        reject(new Error('Google API initialization timeout'))
      }
      else {
        setTimeout(() => poll(retries - 1), 50)
      }
    }

    script.onload = () => poll()
    script.onerror = () => reject(new Error('Failed to load Google API'))

    document.head.appendChild(script)
  })

  return window.__googleLoading
}

type TokenClient = {
  requestAccessToken: () => void
}

type TokenClientConfig = {
  client_id: string
  scope: string
  callback: (response: { access_token?: string, error?: string }) => void
  error_callback?: (error: { type: string }) => void
}

type GoogleAuthOptions = {
  fictionUser: FictionUser
  onComplete?: (response: ManageUserResponse) => void | Promise<void>
  onFinally?: () => void
  isSending?: { value: boolean }
  createOnEmpty?: boolean
  createUserFields?: Partial<User>
}

export async function googleAuth(options: GoogleAuthOptions): Promise<void> {
  const { fictionUser, onComplete, onFinally, createOnEmpty, createUserFields } = options

  if (!window || !fictionUser.googleClientId) {
    onComplete?.({ status: 'error', message: 'Google auth not available' })
    onFinally?.()
    return
  }

  if (fictionUser.fictionEnv?.isTest.value) {
    logger.info('Google auth disabled in test mode')
    onFinally?.()
    return
  }

  try {
    await loadGoogleSignInLibrary()

    if (!window.google?.accounts?.oauth2) {
      throw new Error('Google OAuth2 not available')
    }

    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: fictionUser.googleClientId,
      scope: 'email profile openid',
      ux_mode: 'popup',
      callback: async (response) => {
        try {
          if (!response.code) {
            throw new Error('No authorization code received')
          }

          // Exchange code for tokens on backend
          const loginResult = await fictionUser.requests.ManageUser.request({
            _action: 'loginGoogle',
            code: response.code,
            createOnEmpty,
            createUserFields,
          })

          await onComplete?.(loginResult)
        }
        catch (error) {
          onComplete?.({ status: 'error', message: (error as Error).message })
        }
        finally {
          onFinally?.()
        }
      },
      error_callback: (error) => {
        logger.error('Google auth error_callback:', { error })
        onComplete?.({ status: 'error' })
        onFinally?.()
      },
    })

    client.requestCode()
  }
  catch (error) {
    logger.error('googleAuth error:', { error })
    onComplete?.({ status: 'error', message: (error as Error).message })
    onFinally?.()
  }
}

type GoogleOneTapSettings = {
  autoSignIn?: boolean
  signinButtonId?: string
  showPrompt?: boolean
  fictionUser: FictionUser
  cookieDomain?: string
  isSending?: vue.Ref
  isDarkMode?: boolean
  callback?:
    | ((
      r: Awaited<
        ReturnType<FictionUser['requests']['ManageUser']['request']>
      >,
    ) => void)
    | undefined
}

async function handleGoogleCredentialResponse(response: CredentialResponse, settings: GoogleOneTapSettings): Promise<void> {
  const { isSending } = settings

  if (isSending)
    isSending.value = true

  const loginResponse
    = await settings.fictionUser.requests.ManageUser.request(
      {
        _action: 'loginGoogle',
        credential: response.credential,
      },
      { debug: true },
    )
  if (settings.callback)
    settings.callback(loginResponse)

  if (isSending)
    isSending.value = false
}
// const googleAuthRequest = userEndpoints().UserGoogleAuth.request
// type CallbackResponse = Awaited<ReturnType<typeof googleAuthRequest>>
export async function googleOneTap(settings: GoogleOneTapSettings): Promise<void> {
  const { autoSignIn = false, signinButtonId, cookieDomain, showPrompt = true, fictionUser, isDarkMode = false } = settings

  if (!window)
    return

  if (fictionUser.fictionEnv?.isTest.value) {
    logger.info('googleOneTap disabled: isTest')
    return
  }

  if (!fictionUser.googleClientId) {
    logger.error('googleOneTap disabled: no googleClientId', { data: settings })
    return
  }

  const user = await fictionUser.userInitialized({ caller: 'googleOneTap' })

  await loadGoogleSignInLibrary()

  const el = signinButtonId ? document.querySelector<HTMLElement>(signinButtonId) : undefined

  if (window.google === undefined) {
    logger.info('Google One Tap not loaded (window.google is undefined)')
  }
  else {
    const state_cookie_domain = cookieDomain || getNakedDomain()
    logger.info('google one tap initialize', {
      data: {
        clientId: fictionUser.googleClientId,
        state_cookie_domain,
        settings,
      },
    })
    const initializeArgs = {
      client_id: fictionUser.googleClientId,
      callback: async (credentialResponse: CredentialResponse) => {
        logger.info('google one tap callback', { data: credentialResponse })
        await handleGoogleCredentialResponse(credentialResponse, settings)
      },
      auto_select: autoSignIn, // auto login
      cancel_on_tap_outside: true,
      context: 'signin',
      state_cookie_domain,
    } as const

    logger.info('initializing', { data: { initializeArgs, ...settings } })

    if (!window.google.accounts?.id)
      throw new Error('google.accounts.id not loaded')

    window.google.accounts.id.initialize(initializeArgs)

    if (el) {
      const theme = isDarkMode ? 'filled_black' : 'outline'
      window.google.accounts.id.renderButton(el, { theme, size: 'large', width: 290 })
    }

    if (showPrompt && !user)
      window.google.accounts.id.prompt()
  }
}
