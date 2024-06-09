import { InputOption } from '@fiction/ui'
import { type Organization, type StandardServices, type User, standardTable as t, vue } from '@fiction/core'
import type { SettingsTool } from '@fiction/admin/types'

const def = vue.defineAsyncComponent

export function getTools(args: { service: StandardServices }) {
  const fictionUser = args.service.fictionUser
  const tools = [
    {
      slug: 'import',
      title: 'Upload CSV File',
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
      slug: 'addSubscriber',
      title: 'Copy and Paste',
      userConfig: { isNavItem: true, navIcon: 'i-tabler-copy-check', navIconAlt: 'i-tabler-copy-check-filled' },
      val: fictionUser.activeUser,
      save: async (args) => {
        const { tool, service: { fictionUser } } = args

        const fields = tool.val?.value as User | undefined
        const userId = fictionUser.activeUser.value?.userId

        if (!userId)
          throw new Error('No active user')

        if (!fields)
          throw new Error('No fields')

        return await fictionUser.requests.ManageUser.projectRequest({ _action: 'update', fields, where: { userId } })
      },
      options: () => {
        return vue.computed(() => [
          new InputOption({
            key: 'userDetails',
            label: 'Basic Details',
            input: 'group',
            options: [
              new InputOption({ key: 'fullName', label: 'Full Name', input: 'InputText', placeholder: 'Your Full Name' }),
              new InputOption({ key: 'avatar', label: 'Avatar', input: 'InputMediaUpload', subLabel: 'Upload a square image or it will be cropped' }),
              new InputOption({ key: 'username', label: 'Unique Username', input: 'InputUsername', placeholder: 'my-username', props: { table: 'fiction_user', columns: [{ name: 'username' }] } }),
              new InputOption({ key: 'phone', label: 'Phone Number', description: 'Include country code. Used for 2FA and notifications.', input: 'InputPhone', placeholder: '+1 555 555 5555' }),
            ],
          }),
        ])
      },
    },
  ] satisfies SettingsTool[]

  return tools
}
