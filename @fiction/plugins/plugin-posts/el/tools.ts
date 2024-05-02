import { vue } from '@fiction/core'
import type { EditorTool } from '@fiction/admin'
import { AdminEditorController } from '@fiction/admin'

export const tools = [
  {
    toolId: 'pages',
    icon: 'i-tabler-files',
    el: vue.defineAsyncComponent(() => import('./ToolSettings.vue')),
    isPrimary: true,
  },
] as const satisfies EditorTool[]

export type ToolKeys = (typeof tools)[number]['toolId']

export const postEditController = new AdminEditorController({ tools })
