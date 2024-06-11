import { InputOption } from '@fiction/ui'
import { type Organization, type StandardServices, type User, standardTable as t, vue } from '@fiction/core'
import type { SettingsTool } from '@fiction/admin/types'
import type NavMobile from '@fiction/ui/NavMobile.vue'

const def = vue.defineAsyncComponent

export function getTools(args: { service: StandardServices }) {
  const fictionUser = args.service.fictionUser
  const tools = [
    {
      slug: 'import',
      title: 'Add Subscribers',
      userConfig: { isNavItem: true, navIcon: 'i-tabler-table-share', navIconAlt: 'i-tabler-table-plus' },
      val: fictionUser.activeOrganization,

      options: (args) => {
        const { service } = args
        return vue.computed(() => {
          return [
            new InputOption({
              key: 'publication',
              input: def(() => import('./ElImportFile.vue')),

            }),

          ] satisfies InputOption[]
        },
        )
      },
    },
  ] satisfies SettingsTool[]

  return tools
}
