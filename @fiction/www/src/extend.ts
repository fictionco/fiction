import * as themeFiction from '@fiction/theme-fiction/index.js'
import * as themeMinimal from '@fiction/theme-minimal/index.js'
import * as themeAdmin from '@fiction/admin/theme/index.js'
import type { FictionEnv } from '@fiction/core'
import type { Theme } from '@fiction/site/theme.js'
import type { FictionStripe } from '@fiction/plugins/plugin-stripe/plugin.js'
import { getExtensionIndexTypeHelper } from '@fiction/plugin-extend/index.js'
import type { FictionAdmin } from '@fiction/admin/index.js'
import type { SpecificService } from './index.js'

export async function getThemes(args: { fictionEnv: FictionEnv, fictionStripe: FictionStripe, fictionAdmin: FictionAdmin }): Promise<Theme[]> {
  const themes = Promise.all([
    themeFiction.setup(args),
    themeMinimal.setup(args),
    themeAdmin.setup(args),
  ])

  return themes
}

export function getExtensionIndex(_args: SpecificService) {
  return [
  ]
}
