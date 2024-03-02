import { useService } from '@factor/api'
import type { ServiceContainer } from '@fiction/studio'

export function useFictionApp() {
  return useService<ServiceContainer>()
}

interface DashboardUrlOptions {
  path?: string
  queryArgs?: Record<string, string>
}

export function getDashboardUrl({
  path = '/',
  queryArgs,
}: DashboardUrlOptions = {}): string {
  const url = new URL('https://studio.fiction.com')
  url.pathname = path

  if (queryArgs) {
    const searchParams = new URLSearchParams({ www: '1' })
    Object.entries(queryArgs).forEach(([name, value]) => {
      searchParams.set(name, value)
    })
    url.search = searchParams.toString()
  }

  return url.toString()
}
