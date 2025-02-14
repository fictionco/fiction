import type { EditorTool } from '@fiction/admin'
import { AdminEditorController } from '@fiction/admin'
import { vue } from '@fiction/core'

export type ToolKeys = 'history' | 'postSettings'

export const tools = [
  {
    toolId: 'history',
    icon: 'i-tabler-history',
    el: vue.defineAsyncComponent(() => import('./ToolHistory.vue')),
    location: 'primary',
    isPrimary: true,
  },
  {
    toolId: 'emailPreview',
    title: 'Email Preview',
    icon: 'i-tabler-eye',
    location: 'primary',
    isPrimary: true,
    widthClasses: 'w-[400px] lg:w-[700px]',
    el: vue.defineAsyncComponent(async () => import('./email/ToolEmailPreview.vue')),
  },
  {
    toolId: 'emailTest',
    title: 'Send Test Emails',
    icon: 'i-tabler-mailbox',
    location: 'primary',
    isPrimary: true,
    widthClasses: 'w-[400px] lg:w-[500px]',
    el: vue.defineAsyncComponent(async () => import('./email/ToolEmailTest.vue')),
  },
  {
    toolId: 'postSettings',
    title: 'Post Settings',
    icon: 'i-tabler-edit-circle',
    location: 'context',
    isDefault: true,
    el: vue.defineAsyncComponent(() => import('./ToolPostMain.vue')),
  },
] as const satisfies EditorTool[]

export const postEditController = new AdminEditorController({ tools })
