import { InputOption } from '@fiction/ui'
import { type Organization, type StandardServices, type User, standardTable as t, vue } from '@fiction/core'
import type { SettingsTool } from '@fiction/admin/types'

const def = vue.defineAsyncComponent

export function getTools(args: { service: StandardServices }) {
  const fictionUser = args.service.fictionUser
  const tools = [
    {
      slug: 'import',
      title: 'Import Subscribers (.csv)',
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
    {
      slug: 'add',
      title: 'Add By Email',
      userConfig: { isNavItem: true, navIcon: 'i-tabler-copy-check', navIconAlt: 'i-tabler-copy-check-filled' },
      val: fictionUser.activeUser,
      options: () => {
        return vue.computed(() => [
          new InputOption({
            key: 'userDetails',
            input: 'group',
            options: [
              new InputOption({ key: 'emailList', label: 'Email List', input: 'InputTextarea', placeholder: 'example@example.com, another@gmail.com, yet.another@example' }),
            ],
          }),
        ])
      },
    },
    {
      slug: 'export',
      title: 'Export List',
      userConfig: { isNavItem: true, navIcon: 'i-tabler-file-export' },
      val: fictionUser.activeUser,
      options: () => {
        return vue.computed(() => [
          new InputOption({
            key: 'userDetails',
            label: 'Copy and Paste Emails',
            input: 'group',
            options: [
              new InputOption({ key: 'fullName', label: 'Full Name', input: 'InputText', placeholder: 'Your Full Name' }),
            ],
          }),
        ])
      },
    },
  ] satisfies SettingsTool[]

  return tools
}
