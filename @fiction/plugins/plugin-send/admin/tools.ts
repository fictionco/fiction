import { InputOption } from '@fiction/ui'
import { vue } from '@fiction/core'
import { SettingsTool } from '@fiction/admin/types'

import type { EditorTool } from '@fiction/admin'
import { AdminEditorController } from '@fiction/admin'
import type { FictionSend } from '..'

export const tools = [
  // {
  //   toolId: 'posts',
  //   icon: 'i-tabler-box-multiple',
  //   el: vue.defineAsyncComponent(() => import('./ToolSettings.vue')),
  //   location: 'primary',
  //   isPrimary: true,
  // },
  // {
  //   toolId: 'email',
  //   icon: 'i-tabler-mail-share',
  //   el: vue.defineAsyncComponent(() => import('./ToolSettings.vue')),
  //   location: 'primary',
  //   isPrimary: true,
  // },
  // {
  //   toolId: 'subscriptions',
  //   icon: 'i-tabler-user-up',
  //   el: vue.defineAsyncComponent(() => import('./ToolSettings.vue')),
  //   location: 'primary',
  //   isPrimary: true,
  // },
  // {
  //   toolId: 'history',
  //   icon: 'i-tabler-history',
  //   el: vue.defineAsyncComponent(() => import('./ToolHistory.vue')),
  //   location: 'primary',
  //   isPrimary: true,
  // },
  {
    toolId: 'postSettings',
    title: 'Post Settings',
    icon: 'i-tabler-edit-circle',
    location: 'context',
    isDefault: true,
    props: () => {
      return vue.computed(() => ({}))
    },
    el: vue.defineAsyncComponent(() => import('./ToolEmailMain.vue')),
  },
] as const satisfies EditorTool[]

export type ToolKeys = (typeof tools)[number]['toolId']

export const postEditController = new AdminEditorController({ tools })

export function getTools(args: { fictionSend: FictionSend }) {
  const { fictionSend } = args

  const dataRef = vue.ref({})

  const tools = [

    new SettingsTool({
      slug: 'view',
      title: 'Create Email',
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
        ] satisfies InputOption[]
      },
    }),
  ]
  return tools as SettingsTool[]
}
