// @unocss-include

import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { CardTemplate } from '@fiction/site/card'
import { createCard } from '@fiction/site'
import { refineOptions } from '../utils/refiner'
import { standardOption } from '../inputSets'
import type { UserConfig } from './ElCard.vue'

function userControls() {
  const options = [
    standardOption.mediaItems({ generation: { prompt: 'Splash picture in portrait format' } }),
    standardOption.headers({ generation: { prompt: 'home page text' } }),
    standardOption.navItems({ label: 'Bullets', key: 'details', generation: { prompt: 'short bullet details, resume contact information' } }),
    standardOption.socials({ generation: { prompt: 'social media accounts' } }),
  ]

  return refineOptions({
    inputOptions: [
      new InputOption({ label: 'Settings', input: 'group', options, key: 'minProfileSettings' }),
    ],
    refine: {
      'mediaItems': 'Splash picture in portrait format',
      'heading': 'Primary headline for profile 3 to 8 words',
      'subHeading': 'Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs',
      'superHeading': 'Shorter badge above headline, 2 to 5 words',
      'details.name': 'Label for a detail, like "Location"',
      'details.desc': 'Value for a detail, like "Laguna Beach, CA"',
      'socialsTitle': false,
      'socials.desc': false,
    },
  })
}

const options = [
  standardOption.ai(),
  ...userControls(),
]

const templateId = 'profile'

const defaultContent: UserConfig = {
  superHeading: 'A Tagline or Category',
  heading: 'A Catchy Headline About Something',
  subHeading: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  mediaItems: [
    { media: { url: 'https://images.unsplash.com/photo-1577565177023-d0f29c354b69?q=80&w=2943&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
    { media: { url: 'https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?q=80&w=3648&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
  ],
  detailsTitle: 'About Me',
  details: [
    { name: 'Location', desc: 'Somewhere, USA' },
    { name: 'Email', desc: 'hello@mywebsite.com', href: 'mailto:hello@example.com' },
    { name: 'Phone', desc: '123-456-7890' },
  ],
  socials: [
    { name: '@handle on facebook', href: '#', icon: 'facebook', target: '_blank' },
    { name: '@handle on x', href: '#', icon: 'x', target: '_blank' },
    { name: '@handle on linkedin', href: '#', icon: 'linkedin', target: '_blank' },
  ],
}
const minimalProfile = new CardTemplate({
  templateId,
  category: ['marketing'],
  description: 'A minimal profile card with a splash image, headline, subheading, and contact details.',
  icon: 'i-tabler-user',
  iconTheme: 'blue',
  el: vue.defineAsyncComponent(() => import('./ElCard.vue')),
  userConfig: defaultContent,
  isPublic: true,
  options,
})

export const templates = [minimalProfile] as const

export function demo() {
  return createCard({
    slug: 'card-profile',
    cards: [
      createCard({ templateId, templates, userConfig: { } }),
      createCard({ templateId, templates, userConfig: { layout: 'left' } }),
    ],
  })
}
