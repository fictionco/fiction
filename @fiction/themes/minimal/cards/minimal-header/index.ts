import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { standardOption } from '@fiction/cards/inputSets'
import { CardTemplate } from '@fiction/site/card'
import { refineOptions } from '@fiction/cards/utils/refiner'
import { createCard } from '@fiction/site'

const o = [
  new InputOption({ key: 'logo', label: 'Logo', input: 'InputMediaDisplay' }),
  standardOption.navItems({ key: 'nav' }),
] as const

const options = refineOptions({ inputOptions: o, refine: { title: false } })

const el = vue.defineAsyncComponent(() => import('./XHeader.vue'))
export const templates = [
  new CardTemplate({
    templateId: 'minimalHeader',
    category: ['theme'],
    icon: 'i-tabler-box-align-top',
    iconTheme: 'blue',
    el,
    userConfig: {
      logo: { format: 'html', html: 'Your Name' },
      nav: [
        { name: 'Home', href: '/' },
        { name: 'LinkedIn', href: '#', target: '_blank' },
      ],
      spacing: { spacingClass: 'py-0 lg:py-2' },
    },
    options,
    demoPage: () => {
      return [
        createCard({
          templateId: 'minimalHeader',
          el,
          userConfig: {
            logo: { html: 'Testing', format: 'html' },
            nav: [{ name: 'Foo', href: '/bar' }],
            spacing: { spacingClass: 'py-12' },
          },
        }),
        createCard({
          templateId: 'minimalHeader',
          el,
          userConfig: {
            logo: { url: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2830&q=80&sat=-100' },
            nav: [{ name: 'Lorem Ipsum Lorem Ipsum', href: '/bar' }, { name: 'Long Name', href: '/bar' }, { name: 'Foo', href: '/bar' }, { name: 'Foo', href: '/bar' }],
            spacing: { spacingClass: 'py-12' },
          },
        }),
      ]
    },
  }),
] as const
