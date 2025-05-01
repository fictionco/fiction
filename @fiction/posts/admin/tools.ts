import type { EditorTool } from '@fiction/admin'
import { AdminEditorController } from '@fiction/admin'
import { vue } from '@fiction/core'

export type ToolKeys = 'history' | 'postSettings'

export const tools = [
  {
    toolId: 'ai',
    title: 'AI',
    icon: { class: 'i-tabler-sparkles' },
    location: 'primary',
    isPrimary: true,
    el: vue.defineAsyncComponent(() => import('./ToolAi.vue')),
    design: 'drawer',
  },
  {
    toolId: 'history',
    icon: { class: 'i-tabler-history' },
    el: vue.defineAsyncComponent(() => import('./ToolHistory.vue')),
    location: 'primary',
    title: 'History',
    design: 'drawer',
    isPrimary: 'bottom',
  },

] as const satisfies EditorTool[]

export const postEditController = new AdminEditorController({ tools })
