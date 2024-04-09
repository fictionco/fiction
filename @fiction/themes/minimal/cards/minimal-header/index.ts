// @unocss-include

import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { standardOption } from '@fiction/cards/inputSets'
import { CardTemplate } from '@fiction/site/card'

export const templates = [
  new CardTemplate({
    templateId: 'minimalHeader',
    category: ['theme'],
    icon: 'i-tabler-box-align-top',
    iconTheme: 'blue',

    el: vue.defineAsyncComponent(() => import('./XHeader.vue')),
    userConfig: {
      logo: { format: 'html', html: 'Your Name' },
      nav: [
        { name: 'Home', href: '/' },
        { name: 'LinkedIn', href: 'https://www.linkedin.com/in/arpowers', target: '_blank' },
      ],
      spacing: { spacingClass: 'py-0 lg:py-2' },
    },
    options: [
      new InputOption({ key: 'userConfig.logo', label: 'Logo', input: 'InputMediaDisplay' }),
      standardOption.navItems(),
    ],
  }),
] as const
