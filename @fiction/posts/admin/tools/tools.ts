import type { EditorTool } from '@fiction/admin'
import { AdminEditorController } from '@fiction/admin'
import { vue } from '@fiction/core'

export type ToolKeys = 'history' | 'compose' | 'meta' | 'delivery'

export const tools = [
  {
    toolId: 'settings',
    title: 'Settings',
    icon: { class: 'i-tabler-adjustments' },
    location: 'primary',
    isPrimary: true,
    el: vue.defineAsyncComponent(() => import('./ToolOptions.vue')),
    design: 'drawer',
  },
  {
    toolId: 'history',
    icon: { class: 'i-tabler-history' },
    el: vue.defineAsyncComponent(() => import('./ToolOptions.vue')),
    location: 'primary',
    title: 'History',
    design: 'drawer',
    isPrimary: 'bottom',
  },

] as const satisfies EditorTool[]

export const postEditController = new AdminEditorController({ tools })
