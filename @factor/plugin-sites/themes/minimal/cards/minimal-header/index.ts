// @unocss-include

import { vue } from '@factor/api'
import { InputOption } from '@factor/ui'
import { optionSets } from '../../../../cards/inputSets'
import { CardTemplate } from '../../../../card'

export const templates = [
  new CardTemplate({
    templateId: 'minimalHeader',
    category: ['basic'],
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
