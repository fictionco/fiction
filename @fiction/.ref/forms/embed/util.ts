export interface EmbedItemConfig {
  agentId?: string
  embedId?: string
  frameUrl?: string
  embeddedElId?: string
  originalEl?: HTMLElement
  trigger?: EmbedTrigger
  mode?: EmbedMode
  position?: EmbedPosition
}

export const embedModes = ['inline', 'full', 'popover', 'slideover', 'modal'] as const
export type EmbedMode = (typeof embedModes)[number]

export type EmbedTrigger = 'click' | 'init' | 'tab' | 'button' | 'bubble' | 'event'

export type EmbedPosition = 'bc' | 'br' | 'bl' | 'tr' | 'tl' | 'tc'

export interface EmbedProps {
  mode: EmbedMode
  icon: string
  text: string
  width: number
  trigger: EmbedTrigger
  position: EmbedPosition
  el?: HTMLElement
  baseUrl: string
}

export const buttonIcons = [
  { label: 'Chat Bubble Center', value: 'i-heroicons-chat-bubble-bottom-center' },
  { label: 'Chat Bubble Left', value: 'i-heroicons-chat-bubble-oval-left' },
  { label: 'Chat Bubble Left / Right', value: 'i-heroicons-chat-bubble-left-right' },
  { label: 'Smiley Face', value: 'i-heroicons-face-smile' },
  { label: 'Happy Comment', value: 'i-carbon-chat-bot' },
  { label: 'Comment', value: 'i-carbon-chat' },
  { label: 'Checkmark', value: 'i-heroicons-check' },
  { label: 'Checklist', value: 'i-carbon-list-checked' },
  { label: 'Star', value: 'i-heroicons-star' },
  { label: 'Info', value: 'i-heroicons-information-circle' },
]

export const embedPosition = [
  {
    label: 'Bottom / Right',
    value: 'br',
    style: { right: '1.5rem', bottom: '1.5rem' },
  },
  {
    label: 'Bottom / Center',
    value: 'bc',
    style: { transform: 'translateX(-50%)', left: '50%', bottom: '1.5rem' },
  },
  {
    label: 'Bottom / Left',
    value: 'bl',
    style: { left: '1.5rem', bottom: '1.5rem' },
  },
]
