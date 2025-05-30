import type { FictionUser } from '@fiction/core'
import type { Site } from '@fiction/site'
import type { FictionAdmin } from '..'

export function getFictionAuthUrl({
  fictionAdmin,
  site,
  redirect,
  scope = 'login',
  token,
}: {
  fictionAdmin: FictionAdmin
  site?: Site
  redirect?: string
  scope?: 'login' | 'signup' | 'reset'
  token?: string
}): string {
  if (typeof window === 'undefined')
    return ''

  const { appUrl } = fictionAdmin.settings.fictionApp
  const baseUrl = `${appUrl.value}/app/auth`
  const originRedirect = redirect?.startsWith('/') ? `${window.location.origin}${redirect}` : redirect ?? window.location.href

  const params = new URLSearchParams({
    redirect: encodeURIComponent(originRedirect),
    ...(site?.org.value?.handle && { for: site.org.value.handle }),
    ...(scope && { scope }),
    ...(token && { t: token }),
  })

  return `${baseUrl}?${params.toString()}`
}

export function getFictionNavItems(args: { fictionAdmin: FictionAdmin, fictionUser: FictionUser, site?: Site }) {
  const { fictionAdmin, fictionUser, site } = args
  const urls = fictionAdmin.urls()
  const isLoggedIn = fictionUser.activeUser.value
  return isLoggedIn
    ? [
        { label: 'Dashboard', href: urls.dashboard, icon: { class: 'i-tabler-north-star' } },
        { label: 'Sign Out', href: '/?_logout=1', icon: { class: 'i-tabler-arrow-down-left' } },
      ]
    : [
        { label: 'Sign In', href: getFictionAuthUrl({ fictionAdmin, site }), icon: { class: 'i-tabler-arrow-up-right' } },
      ]
}
