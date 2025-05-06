import type { FictionUser } from '@fiction/core'
import type { Site } from '@fiction/site'
import type { FictionAdmin } from '..'

export function getFictionAuthUrl(args: {
  fictionAdmin: FictionAdmin
  site?: Site
  redirect?: string
  scope?: 'login' | 'signup' | 'reset'
  token?: string
}): string {
  const { fictionAdmin, site, redirect, scope = 'login', token } = args
  const authHost = fictionAdmin.settings.fictionApp.appUrl.value
  const baseUrl = `${authHost}/app/auth`

  // Use provided redirect or current URL as fallback
  const fallbackUrl = typeof window !== 'undefined' ? window.location.href : ''
  const urlEncodedRedirect = encodeURIComponent(redirect || fallbackUrl)

  // Build query parameters
  const params = new URLSearchParams({ redirect: urlEncodedRedirect })
  if (site?.org.value?.handle)
    params.append('for', site.org.value.handle)
  if (scope)
    params.append('scope', scope)
  if (token)
    params.append('t', token)

  return `${baseUrl}?${params.toString()}`
}

export function getFictionNavItems(args: { fictionAdmin: FictionAdmin, fictionUser: FictionUser, site?: Site }) {
  const { fictionAdmin, fictionUser, site } = args
  const urls = fictionAdmin.urls()
  const isLoggedIn = fictionUser.activeUser.value
  return isLoggedIn
    ? [
        { label: 'Dashboard', href: urls.dashboard, icon: { class: 'i-tabler-tools' } },
        { label: 'User Settings', href: urls.settings, icon: { class: 'i-tabler-user' } },
        { label: 'Sign Out', href: '/?_logout=1', icon: { class: 'i-tabler-arrow-down-left' } },
      ]
    : [
        { label: 'Sign In', href: getFictionAuthUrl({ fictionAdmin, site }), icon: { class: 'i-tabler-arrow-up-right' } },
      ]
}
