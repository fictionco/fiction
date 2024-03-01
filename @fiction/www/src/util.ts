// @unocss-include
import { vue } from '@factor/api'

export interface NavItem {
  name: string
  icon: string
  cb?: (e: MouseEvent) => void
  value?: string
}

export const nav = vue.ref<
  {
    name: string
    icon: string
    value?: string
    cb?: (e: MouseEvent) => void
  }[]
      >([
        {
          name: 'Tour',
          icon: 'i-carbon-rocket',
          value: '/tour',
        },
        {
          name: 'About',
          icon: 'i-carbon-rocket',
          value: '/about',
        },
      ],
      )
