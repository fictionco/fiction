// @unocss-include
import type { ActionItem, ClickHandler } from '@fiction/core'
import { vue } from '@fiction/core'
import type { Site } from '../site'
import type { iconStyle } from '../util'

export type Handle = {
  handleId: string
  title: string
  sub?: string
  depth: number
  icon?: string
  iconTheme?: keyof typeof iconStyle
  isDraggable?: boolean
  hasDrawer?: boolean
  handles?: Handle[]
  onClick?: ClickHandler
  actions?: ActionItem[]
  isActive?: boolean
}

export type EditorTool<T extends string = string> = {
  toolId: T
  title?: string
  icon: string
  el?: vue.Component
  isPrimary?: boolean
  location?: 'left' | 'right'
  props?: (site: Site) => vue.ComputedRef<Record<string, unknown>>
  widthClasses?: string
}

// Define your tools with const assertion
export const toolList = [
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
    props: (site: Site) => vue.computed(() => ({ site })),
  },
  {
    toolId: 'editPage',
    title: 'Edit Page',
    icon: 'i-tabler-files',
    widthClasses: 'w-[430px]',
    el: vue.defineAsyncComponent(() => import('./ToolPageEdit.vue')),
    props: (site: Site) => vue.computed(() => ({ site })),
  },
  {
    toolId: 'ai',
    title: 'AI Completion Settings',
    icon: 'i-tabler-sparkles',
    isPrimary: true,
    widthClasses: 'w-[500px]',
    props: (_site: Site) => vue.computed(() => ({})),
    el: vue.defineAsyncComponent(() => import('./ToolPageAi.vue')),
  },
  {
    toolId: 'global',
    title: 'Global Settings',
    icon: 'i-tabler-settings',
    isPrimary: true,
    widthClasses: 'w-[500px]',
    props: (_site: Site) => vue.computed(() => ({})),
    el: vue.defineAsyncComponent(() => import('./ToolPageGlobal.vue')),
  },
  {
    toolId: 'publish',
    title: 'Publishing',
    icon: 'i-tabler-world',
    isPrimary: true,
    widthClasses: 'w-[600px]',
    props: (_site: Site) => vue.computed(() => ({})),
    el: vue.defineAsyncComponent(() => import('./ToolPagePublish.vue')),
  },
  {
    toolId: 'editCard',
    title: 'Edit Element',
    icon: 'i-tabler-edit-circle',
    location: 'right',

    props: (site: Site) => {
      return vue.computed(() => {
        const c = site.activeCard.value
        const cardTitle = c?.title.value || c?.tpl.value?.settings.title
        const title = site.editor.value.selectedCardId ? cardTitle : 'Select Element'
        const icon = c?.tpl.value?.settings.icon || 'i-tabler-click'
        const iconTheme = c?.tpl.value?.settings.iconTheme || 'theme'
        return { title, icon, iconTheme }
      })
    },
    el: vue.defineAsyncComponent(() => import('./ToolCardEdit.vue')),
  },
] as const

export type ToolKeys = (typeof toolList)[number]['toolId']
export function tools() {
  return toolList as readonly EditorTool<ToolKeys>[]
}
