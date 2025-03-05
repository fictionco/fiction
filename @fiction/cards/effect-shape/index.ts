import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

const templateId = 'cardShapeEffectV1'

export const template = cardTemplate({
  templateId,
  category: ['effect'],
  title: 'Shape Background',
  subTitle: 'Add depth and visual interest with animated geometric shapes',
  description: `Create engaging visual depth with floating geometric shapes that respond to user interaction.
Perfect for enhancing hero sections, testimonials, or content areas with subtle animation and movement.
Features include customizable shapes, colors, animations, and interactive effects.`,
  icon: 'i-tabler-shape',
  colorTheme: 'emerald',
  el: vue.defineAsyncComponent(async () => import('./ElEffect.vue')),
  isPublic: false,
  isEffect: true,
  isDetached: () => true,
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig(args)
  },
})
