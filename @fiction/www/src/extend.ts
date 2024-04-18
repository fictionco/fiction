import * as themeFiction from '@fiction/theme-fiction'
import * as themeMinimal from '@fiction/theme-minimal'
import * as themeAdmin from '@fiction/theme-admin'
import { type FictionEnv, getExtensionIndex } from '@fiction/core'
import type { Theme } from '@fiction/site/theme'
import type { FictionStripe } from '@fiction/plugins/plugin-stripe'
import type { ServiceList } from '.'

export async function getThemes(args: { fictionEnv: FictionEnv, fictionStripe: FictionStripe }): Promise<Theme[]> {
  const themes = Promise.all([
    themeFiction.setup(args),
    themeMinimal.setup(args),
    themeAdmin.setup(args),
  ])

  return themes
}

export function getExtensions(args: ServiceList) {
  return getExtensionIndex([
    {

      extensionId: 'fictionPosts',
      title: 'Post System',
      description: 'Extends the posts functionality of Fiction',
      getExtension: () => import('@fiction/plugin-posts'),
      getSettings: () => {
        return {
          test: true,
          ...args,
        }
      },
    },
  ])
}
