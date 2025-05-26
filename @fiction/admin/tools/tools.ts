import type { ActionButton, ClickHandler, colorTheme, MediaObject } from '@fiction/core'
import type { InputOption } from '@fiction/ui'
import { FictionObject, vue } from '@fiction/core'

export type Handle = {
  testId: string
  handleId: string
  title: string
  subTitle?: string
  sub?: string
  depth: number
  icon?: MediaObject
  colorTheme?: typeof colorTheme[number]
  isDraggable?: boolean
  hasDrawer?: boolean
  handles?: Handle[]
  onClick?: ClickHandler
  actions?: ActionButton[]
  isActive?: boolean
}

export type EditorTool<T extends string = string, U extends Record<string, any> = Record<string, any>> = {
  toolId: T
  title?: string
  icon: MediaObject
  el?: vue.Component
  isPrimary?: boolean | 'top' | 'bottom' | 'secondary'
  isDefault?: boolean
  location?: 'primary' | 'context'
  design?: 'modal' | 'drawer' | 'inline'
  props?: (args: U) => vue.ComputedRef<Record<string, unknown>>
  modalClass?: string
  option?: InputOption
  onClick?: (args: { tool: EditorTool }) => void
  isActive?: (args: { tool: EditorTool }) => boolean
}

type ToolDrawHide = 'both' | 'right' | 'left' | ''

type AdminEditorControllerSettings = {
  tools: readonly EditorTool<any, any>[]
}

 type CardSurface = {
   toolIds: string
 }

// Utility type to merge two types
type MergeTypes<T, U> = T & Omit<U, keyof T>

// Use defaults
type Surface<T> = MergeTypes<T, CardSurface>

export class AdminEditorController<T extends CardSurface = CardSurface> extends FictionObject<AdminEditorControllerSettings> {
  tools = this.settings.tools

  constructor(settings: AdminEditorControllerSettings) {
    super('AdminEditorController', settings)
  }

  hideToolDrawers = vue.ref<ToolDrawHide>('')

  activeToolId = { primary: vue.ref<string>(), context: vue.ref<string>() }

  defaultTool = {
    context: vue.computed(() => this.settings.tools.find(t => t.isDefault && t.location === 'context')?.toolId),
  }

  activeTool = {
    primary: vue.computed(() => this.settings.tools.find(t => t.toolId === this.activeToolId.primary.value)),
    context: vue.computed(() => this.settings.tools.find(t => t.toolId === (this.activeToolId.context.value ? this.activeToolId.context.value : this.defaultTool.context.value))),
  }

  isUsingTool(args: { toolId?: Surface<T>['toolIds'], locations?: ('primary' | 'context')[] } = {}) {
    const t = this.tools.find(t => t.toolId === args.toolId)

    if (t?.isActive) {
      return t.isActive({ tool: t })
    }

    const { toolId, locations = ['primary', 'context'] } = args
    return locations.some(l => this.activeToolId[l].value === toolId)
  }

  useTool(args: { toolId: Surface<T>['toolIds'] | '', caller: string }) {
    const { toolId } = args

    const tool = this.settings.tools.find(t => t.toolId === toolId)

    const location = tool?.location || 'primary'

    if (tool?.onClick) {
      this.activeToolId[location].value = ''
      tool.onClick({ tool })
      return
    }

    this.activeToolId[location].value = toolId
  }

  reset() {
    this.activeToolId.primary.value = ''
    this.activeToolId.context.value = ''
  }
}
