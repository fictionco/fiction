import type { EditorTool } from '@fiction/admin'
import { AdminEditorController } from '@fiction/admin'
import { vue } from '@fiction/core'

export type ToolKeys = 'history' | 'postSettings'

export const tools = [
  {
    toolId: 'history',
    icon: { class: 'i-tabler-history' },
    el: vue.defineAsyncComponent(() => import('./ToolHistory.vue')),
    location: 'primary',
    isPrimary: 'bottom',
  },
  {
    toolId: 'emailTest',
    title: 'Send Test Emails',
    icon: { class: 'i-tabler-mailbox' },
    location: 'primary',
    isPrimary: true,
    el: vue.defineAsyncComponent(async () => import('./email/ToolEmailTest.vue')),
  },
  {
    toolId: 'postSettings',
    title: 'Post Settings',
    icon: { class: 'i-tabler-edit-circle' },
    location: 'context',
    isDefault: true,
    el: vue.defineAsyncComponent(() => import('./ToolPostMain.vue')),
  },
] as const satisfies EditorTool[]

export const postEditController = new AdminEditorController({ tools })
