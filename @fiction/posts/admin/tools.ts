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
    toolId: 'postSettings',
    title: 'Post Settings',
    icon: 'i-tabler-edit-circle',
    location: 'context',
    isDefault: true,
    el: vue.defineAsyncComponent(() => import('./ToolPostMain.vue')),
  },
] as const satisfies EditorTool[]

export const postEditController = new AdminEditorController({ tools })
