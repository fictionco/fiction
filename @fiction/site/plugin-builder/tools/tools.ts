import { vue } from '@fiction/core'
import type { EditorTool } from '@fiction/admin'
import { AdminEditorController } from '@fiction/admin'
import type { Site } from '../../site'

export type ToolKeys = 'pageMaster' | 'addPage' | 'editPage' | 'ai' | 'global' | 'publish' | 'editCard'

export const tools = [
  {
    toolId: 'editPage',
    title: 'Edit Page',
    icon: 'i-tabler-edit',
    widthClasses: 'w-[430px]',
    el: vue.defineAsyncComponent(async () => import('./ToolPageEdit.vue')),
    isPrimary: true,
  },
  {
    toolId: 'pageMaster',
    icon: 'i-tabler-files',
    title: 'Manage Pages',
    el: vue.defineAsyncComponent(async () => import('./PageToolMaster.vue')),
    isPrimary: true,
  },

  {
    toolId: 'addPage',
    title: 'Add New Page',
    icon: 'i-tabler-file-plus',
    el: vue.defineAsyncComponent(async () => import('./ToolPageAdd.vue')),
  },
  {
    toolId: 'global',
    title: 'Global Settings',
    icon: 'i-tabler-adjustments',
    isPrimary: true,
    widthClasses: 'w-[500px]',
    el: vue.defineAsyncComponent(async () => import('./ToolPageGlobal.vue')),
  },
  {
    toolId: 'publish',
    title: 'Public URL',
    icon: 'i-tabler-link',
    isPrimary: true,
    widthClasses: 'w-[600px]',
    el: vue.defineAsyncComponent(async () => import('./ToolPagePublish.vue')),
  },
  {
    toolId: 'editCard',
    title: 'Edit Element',
    icon: 'i-tabler-edit-circle',
    location: 'context',
    isDefault: true,
    props: (args) => {
      const p = args as { site?: Site }
      return vue.computed(() => {
        const c = p.site?.activeCard.value
        const cardTitle = c?.title.value || c?.tpl.value?.settings.title
        const title = p.site?.editor.value.selectedCardId ? cardTitle : 'Select Element'
        const icon = c?.tpl.value?.settings.icon || 'i-tabler-click'
        const colorTheme = c?.tpl.value?.settings.colorTheme || 'theme'
        return { title, icon, colorTheme }
      })
    },
    el: vue.defineAsyncComponent(async () => import('./ToolCardEdit.vue')),
  },
] as const satisfies EditorTool<ToolKeys>[]

export const adminEditorController = new AdminEditorController<{ toolIds: ToolKeys }>({ tools })
