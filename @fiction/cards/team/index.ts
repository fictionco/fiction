import { vue } from '@fiction/core'
import { CardTemplate, createCard } from '@fiction/site'
import { standardOption } from '../inputSets'

const el = vue.defineAsyncComponent(async () => import('./ElCard.vue'))

export const templates = [
  new CardTemplate({
    templateId: 'team',
    category: ['marketing'],
    description: 'Team listing',
    icon: 'i-tabler-layout-bottombar-collapse-filled',
    colorTheme: 'orange',
    el,
    options: [
      standardOption.headers(),
      standardOption.mediaItems(),
      standardOption.actionItems(),
    ],
    userConfig: {},
    demoPage: () => page(),
  }),
] as const

export function page() {
  const originalProfiles = {
    name: 'James Bond',
    title: 'Founder',
    desc: 'Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.',
    media: {
      format: 'url' as const,
      url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    },
    social: [{
      icon: 'linkedin',
      href: 'https://www.linkedin.com/in/arpowers',
    }, {
      icon: 'x',
      href: 'https://www.linkedin.com/in/arpowers',
    }],
  }

  const duplicatedProfiles = Array.from({ length: 4 }, () => originalProfiles)
  return [
    createCard({
      el,
      templateId: 'team',
      userConfig: {
        subHeading: `People helping build your story`,
        heading: `Team`,
        profiles: duplicatedProfiles,
        layout: 'mediabox',
      },
    }),
    createCard({
      el,
      templateId: 'team',
      userConfig: {
        subHeading: `People helping build your story`,
        heading: `Team`,
        profiles: duplicatedProfiles,
      },

    }),
  ]
}
