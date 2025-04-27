import type { Site } from '../site'
import type { CardConfigPortable, TableSiteConfig } from '../tables'
import { vue } from '@fiction/core'

export type HistoryEntry = {
  type: 'card' | 'site'
  cardConfig?: Partial<CardConfigPortable>
  siteConfig?: Partial<TableSiteConfig>
  timestamp?: number
  description: string
} & (
  { type: 'card', cardConfig: Partial<CardConfigPortable> } |
  { type: 'site', siteConfig: Partial<TableSiteConfig> }
)
export class SiteHistory {
  past: vue.Ref<HistoryEntry[]> = vue.ref<HistoryEntry[]>([])
  future: vue.Ref<HistoryEntry[]> = vue.ref<HistoryEntry[]>([])
  private isHistoryAction = vue.ref(false)
  readonly maxHistorySize = 20

  constructor(private site: Site) {}

  init() {
    // Capture initial state
    this.saveState({ description: 'Initial state', type: 'site', siteConfig: this.site.toConfig() })
  }

  private async applyState(entry: HistoryEntry) {
    this.isHistoryAction.value = true

    try {
      const { type } = entry
      if (type === 'card') {
        const { cardConfig } = entry
        const card = this.site.availableCards.value.find(c => c.cardId === cardConfig?.cardId)

        if (card && cardConfig) {
          await card.update(cardConfig, { caller: 'history', noHistory: true })
        }
      }
      else if (type === 'site') {
        const { siteConfig = {} } = entry
        await this.site.update(siteConfig, { caller: 'history', noSave: false, noSync: false, noHistory: true })
      }
    }
    finally {
      this.isHistoryAction.value = false
    }
  }

  saveState(args: HistoryEntry) {
    if (typeof window === 'undefined')
      return

    const { description } = args
    const entry: HistoryEntry = {
      ...args,
      timestamp: Date.now(),
      description,
    }

    this.past.value.push(entry)
    this.future.value = [] // Clear redo stack on new action

    // Limit history size
    if (this.past.value.length > this.maxHistorySize) {
      this.past.value.shift()
    }

    this.site.frame.syncHistoryEntry({ historyEntry: entry })
  }

  async undo() {
    // Need at least two states to undo (current + previous)
    if (this.past.value.length < 2)
      return false

    // Pop current state and move to future
    const currentState = this.past.value.pop()!
    this.future.value.push(currentState)

    // Get previous state (now last in past)
    const previousState = this.past.value[this.past.value.length - 1]
    await this.applyState(previousState)
    return true
  }

  async redo() {
    const entry = this.future.value.pop()
    if (!entry)
      return false

    const currentState: HistoryEntry = {
      type: 'site',
      siteConfig: this.site.toConfig(),
      timestamp: Date.now(),
      description: 'Pre-redo state',
    }

    this.past.value.push(currentState)
    await this.applyState(entry)
    return true
  }

  canUndo = vue.computed(() => this.past.value.length > 1) // Need at least 2 states
  canRedo = vue.computed(() => this.future.value.length > 0)
}
