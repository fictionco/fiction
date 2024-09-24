import type { EditorTool } from '@fiction/admin'
import { AdminEditorController } from '@fiction/admin'
import { vue } from '@fiction/core'

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
  {
    toolId: 'history',
    icon: 'i-tabler-history',
    el: vue.defineAsyncComponent(async () => import('./ToolHistory.vue')),
    location: 'primary',
    isPrimary: true,
  },
  {
    toolId: 'postSettings',
    title: 'Post Settings',
    icon: 'i-tabler-edit-circle',
    location: 'context',
    isDefault: true,
    el: vue.defineAsyncComponent(async () => import('./ToolPostMain.vue')),
  },
] as const satisfies EditorTool[]

export type ToolKeys = (typeof tools)[number]['toolId']

export const postEditController = new AdminEditorController({ tools })
