import { vue } from '@factor/api'
import type { FeaturePage } from './featureMap'
import { featureGroups } from './featureMap'

export interface SiteNavItem {
  path: string
  name: string
  icon?: string
  visDropdown?: boolean
  subMenuGrid?: boolean
  subMenu?: FeaturePage<string>[]
}

export const featureNav = vue.ref<SiteNavItem[]>([
  {
    path: '',
    name: 'Forms and Feedback',
    icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
</svg>`,
    subMenuGrid: true,
    subMenu: featureGroups.feedback.filter(_ => _.path),
  },
  //   {
  //     path: "",
  //     name: "Marketing",
  //     icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
  // </svg>`,
  //     subMenuGrid: true,
  //     subMenu: featureGroups.marketing.filter((_) => _.path),
  //   },
  // {
  //   path: "",
  //   name: "BI",
  //   icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
  // </svg>`,
  //   subMenuGrid: true,
  //   subMenu: featureGroups.workforce.filter((_) => _.path),
  // },
  {
    path: '',
    name: 'CX Analytics',
    icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
</svg>`,
    subMenuGrid: true,
    subMenu: featureGroups.analytics.filter(_ => _.path),
  },
  {
    path: '/pricing',
    name: 'Plans and Pricing',
  },
])
