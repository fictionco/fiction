import type { ServiceList } from '@factor/api'
import type { Theme } from '../theme'
import { setup as fictionThemeSetup } from './fiction'
import { setup as minimalThemeSetup } from './minimal'
import { setup as adminThemeSetup } from './admin'

export function getThemes(args: ServiceList, options: { scope?: 'public' | 'all' } = {}): Theme[] {
  const { scope = 'all' } = options
  const themes = [
    fictionThemeSetup(args),
    minimalThemeSetup(args),
    adminThemeSetup(args),
  ]

  if (scope === 'public')
    return themes.filter(theme => theme.settings.isPublic)

  else
    return themes
}
