// @unocss-include

import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { optionSets } from '../../../../cards/inputSets'
import { CardTemplate } from '../../../../card'

export const templates = [
  new CardTemplate({
    templateId: 'minimalHeader',
    category: ['theme'],
    icon: 'i-tabler-box-align-top',
    iconTheme: 'blue',
    spacingClass: 'py-0 lg:py-2',
    el: vue.defineAsyncComponent(() => import('./XHeader.vue')),
    userConfig: {
      logo: { format: 'html', html: 'Minimal' },
      nav: [
        { name: 'Home', href: '/' },
        { name: 'LinkedIn', href: 'https://www.linkedin.com/in/arpowers', target: '_blank' },
      ],
    },
    options: [
      new InputOption({ key: 'userConfig.logo', label: 'Logo', input: 'InputMediaDisplay' }),
      ...optionSets.navItems.toOptions(),
    ],
  }),
] as const
