import type { FictionAdmin } from '@fiction/admin/index.js'
import type { FictionEnv } from '@fiction/core'
import type { FictionStripe } from '@fiction/plugin-stripe/index.js'

import type { Theme } from '@fiction/site/theme.js'
import * as themeAdmin from '@fiction/admin/theme/index.js'
import * as themeFiction from '@fiction/theme-fiction/index.js'

export async function getThemes(args: {
  fictionEnv: FictionEnv
  fictionStripe: FictionStripe
  fictionAdmin: FictionAdmin
}): Promise<Theme[]> {
  return [themeFiction.theme, themeAdmin.theme]
}
