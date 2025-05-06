import type { FictionAdmin } from '@fiction/admin/index.js'
import type { FictionEnv } from '@fiction/core'
import type { FictionStripe } from '@fiction/plugin-stripe/index.js'

import type { Theme } from '@fiction/site/theme.js'
import type { SpecificService } from './index.js'
import * as themeAdmin from '@fiction/admin/theme/index.js'
import * as themeBase from '@fiction/theme-base/index.js'
import * as themeFiction from '@fiction/theme-fiction/index.js'
import * as themeMinimal from '@fiction/theme-minimal/index.js'
import * as themePrestige from '@fiction/theme-prestige/index.js'

export async function getThemes(args: {
  fictionEnv: FictionEnv
  fictionStripe: FictionStripe
  fictionAdmin: FictionAdmin
}): Promise<Theme[]> {
  const themes = Promise.all([
    themeBase.theme,
    themeFiction.theme,
    themeMinimal.theme,
    themeAdmin.theme,
    themePrestige.theme,
  ])

  return themes
}

export function getExtensionIndex(_args: SpecificService) {
  return [
  ]
}
