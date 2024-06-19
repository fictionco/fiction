import { InputOption } from '@fiction/ui'
import { vue } from '@fiction/core'
import { SettingsTool } from '@fiction/admin/types'
import type { FictionSend } from '..'

export function getTools(args: { fictionSend: FictionSend }) {
  const { fictionSend } = args

  const avatar = vue.ref({})
  const dataRef = vue.ref({})

  const tools = [
    new SettingsTool({
      title: 'Back',
      href: '/subscriber',
      userConfig: { isNavItem: true, navIcon: 'i-tabler-arrow-down-left', navIconAlt: 'i-tabler-arrow-left' },
    }),
    new SettingsTool({
      slug: 'view',
      title: 'View Subscriber',
      userConfig: { isNavItem: true, navIcon: 'i-tabler-user', navIconAlt: 'i-tabler-user' },
      val: dataRef,
      getActions: (args) => {
        const loading = vue.ref(false)
        return vue.computed(() => {
          return [{
            name: 'Save Subscriber',
            onClick: async () => {
              loading.value = true
              //

              loading.value = false
            },
            loading: loading.value,
            btn: 'primary',
            iconAfter: 'i-tabler-arrow-up-right',
          }]
        })
      },
      options: (_args) => {
        return [
          new InputOption({
            key: 'userDetails',
            label: 'Subscriber',
            input: 'group',
            options: [
              new InputOption({ key: 'email', label: 'Email', input: 'InputEmail' }),
              new InputOption({ key: 'status', label: 'Status', input: 'InputSelectCustom', list: ['active', 'unsubscribed', 'cleaned'] }),
              new InputOption({ key: 'inlineTags', label: 'Tags', input: 'InputItems', placeholder: 'Tag, Tag, Tag' }),
            ],
          }),
          new InputOption({
            key: 'userDetails',
            label: 'User Details',
            input: 'group',
            options: [
              new InputOption({ key: 'inlineUser.fullName', label: 'Full Name', input: 'InputText', placeholder: 'Your Full Name' }),
              new InputOption({ key: 'inlineUser.avatar', label: 'Avatar', input: 'InputMediaUpload', subLabel: 'Upload a square image or it will be cropped' }),
              new InputOption({ key: 'inlineUser.phone', label: 'Phone Number', description: 'Include country code. Used for 2FA and notifications.', input: 'InputPhone', placeholder: '+1 555 555 5555' }),
            ],
          }),
        ] satisfies InputOption[]
      },
    }),
  ]
  return tools as SettingsTool[]
}
