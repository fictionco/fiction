import type { EditorTool } from '@fiction/admin'
import type { Site } from '../../site'
import { AdminEditorController } from '@fiction/admin'
import { vue } from '@fiction/core'

export type ToolKeys = 'pages' | 'pageAdd' | 'pageEdit' | 'sectionsAdd' | 'sectionsLayout' | 'siteSettings' | 'cardEdit' | 'allPages'

export function getTools(args: { site: Site }) {
  const { site } = args
  return [
    {
      toolId: 'allPages',
      title: 'Pages',
      icon: { class: 'i-tabler-files' },
      design: 'inline',
      isPrimary: true,
      onClick: () => (site.editingPageId.value = ''),
      isActive: () => site.editingPageId.value === '',
    },
    {
      toolId: 'pageEdit',
      title: 'Edit Page',
      icon: { class: 'i-tabler-file' },
      design: 'drawer',
      el: vue.defineAsyncComponent(async () => import('./ToolPageEdit.vue')),
    },
    {
      toolId: 'pageAdd',
      title: 'Add Page',
      icon: { class: 'i-tabler-file-plus' },
      el: vue.defineAsyncComponent(async () => import('./ToolPageAdd.vue')),
      design: 'modal',
    },
    {
      toolId: 'sectionsLayout',
      title: 'Elements',
      icon: { class: 'i-tabler-section' },
      el: vue.defineAsyncComponent(async () => import('./ToolSectionsLayout.vue')),
      isPrimary: true,
      design: 'drawer',
    },

    {
      toolId: 'siteSettings',
      title: 'Settings',
      icon: { class: 'i-tabler-settings' },
      el: vue.defineAsyncComponent(async () => import('./ToolSettings.vue')),
      isPrimary: true,
      design: 'drawer',
    },

    {
      toolId: 'cardEdit',
      title: 'Edit Section',
      icon: { class: 'i-tabler-edit-circle' },
      location: 'context',
      isDefault: true,
      props: (args) => {
        const p = args as { site?: Site }
        return vue.computed(() => {
          const c = p.site?.activeCard.value
          const cardTitle = c?.title.value || c?.tpl.value?.settings.title
          const title = p.site?.editor.value.selectedCardId ? cardTitle : 'Section Settings'
          const icon = c?.tpl.value?.settings.icon || 'i-tabler-click'
          const colorTheme = c?.tpl.value?.settings.colorTheme || 'theme'
          return { title, icon, colorTheme }
        })
      },
      el: vue.defineAsyncComponent(async () => import('./ToolCardEdit.vue')),
    },
  ] as const satisfies EditorTool<ToolKeys>[]
}

export const siteEditorController = (args: { site: Site }) => new AdminEditorController<{ toolIds: ToolKeys }>({ tools: getTools(args) })
