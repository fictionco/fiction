import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { standardOption } from '@fiction/cards/inputSets'
import { CardTemplate } from '@fiction/site/card'

export const templates = [
  new CardTemplate({
    templateId: 'minimalFooter',
    category: ['theme'],
    icon: 'i-tabler-box-align-bottom',
    colorTheme: 'blue',

    el: vue.defineAsyncComponent(async () => import('./XTemplate.vue')),
    getUserConfig: () => ({
      nav: [{ name: 'Home', href: '/', target: '_self' }],
    }),
    options: [
      new InputOption({ key: 'userConfig.logo', label: 'Logo', input: 'InputMediaDisplay' }),
      standardOption.navItems(),
      standardOption.socials(),
    ],
  }),
] as const
