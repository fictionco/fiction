import { vue } from '@fiction/core'
import type { EditorTool } from '@fiction/admin'
import { AdminEditorController } from '@fiction/admin'
import type { Site } from '../site'

export const tools = [
  {
    toolId: 'pages',
    icon: 'i-tabler-files',
    el: vue.defineAsyncComponent(() => import('./ToolPages.vue')),
    isPrimary: true,
  },
  {
    toolId: 'layout',
    icon: 'i-tabler-layout',
    el: vue.defineAsyncComponent(() => import('./LayoutTool.vue')),
    isPrimary: true,
  },
  {
    toolId: 'add',
    title: 'Add Elements',
    icon: 'i-tabler-new-section',
    el: vue.defineAsyncComponent(() => import('./ToolAdd.vue')),
    isPrimary: true,
  },

  {
    toolId: 'addPage',
    title: 'Add Page',
    icon: 'i-tabler-file-plus',
    el: vue.defineAsyncComponent(() => import('./ToolPageAdd.vue')),
  },
  {
    toolId: 'editPage',
    title: 'Edit Page',
    icon: 'i-tabler-files',
    widthClasses: 'w-[430px]',
    el: vue.defineAsyncComponent(() => import('./ToolPageEdit.vue')),
  },
  {
    toolId: 'ai',
    title: 'AI Generation',
    icon: 'i-tabler-sparkles',
    isPrimary: true,
    widthClasses: 'w-[500px]',
    el: vue.defineAsyncComponent(() => import('./ToolPageAi.vue')),
  },
  {
    toolId: 'global',
    title: 'Site Settings',
    icon: 'i-tabler-settings',
    isPrimary: true,
    widthClasses: 'w-[500px]',
    el: vue.defineAsyncComponent(() => import('./ToolPageGlobal.vue')),
  },
  {
    toolId: 'publish',
    title: 'Domain',
    icon: 'i-tabler-world',
    isPrimary: true,
    widthClasses: 'w-[600px]',
    el: vue.defineAsyncComponent(() => import('./ToolPagePublish.vue')),
  },
  {
    toolId: 'editCard',
    title: 'Edit Element',
    icon: 'i-tabler-edit-circle',
    location: 'context',
    props: (args) => {
      const p = args as { site?: Site }
      return vue.computed(() => {
        const c = p.site?.activeCard.value
        const cardTitle = c?.title.value || c?.tpl.value?.settings.title
        const title = p.site?.editor.value.selectedCardId ? cardTitle : 'Select Element'
        const icon = c?.tpl.value?.settings.icon || 'i-tabler-click'
        const iconTheme = c?.tpl.value?.settings.iconTheme || 'theme'
        return { title, icon, iconTheme }
      })
    },
    el: vue.defineAsyncComponent(() => import('./ToolCardEdit.vue')),
  },
] as const satisfies EditorTool[]

export type ToolKeys = (typeof tools)[number]['toolId']

export const siteEditController = new AdminEditorController({ tools })
