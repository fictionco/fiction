// @unocss-include

import { vue } from '@factor/api'
import { InputOption } from '@factor/ui'
import { optionSets } from '../../../../cards/inputSets'
import { CardTemplate } from '../../../../card'
import InputAi from '../../../../el/InputAi.vue'

function ai() {
  const options = [
    new InputOption({ key: 'userConfig.purpose', input: InputAi }),
  ]
  return [
    new InputOption({ label: 'AI', input: 'group', options, key: 'AISettings' }),
  ]
}

function options() {
  const options = [
    ...optionSets.mediaItems.toOptions({
      refineOption: {
        group: {
          refine: {
            media: 'user profile picture in portrait format',
          },
        },
      },
    }),
    ...optionSets.headers.toOptions({ refineOption: {
      heading: 'Primary headline for profile 3 to 8 words',
      subHeading: 'Formatted markdown of profile with paragraphs, 50 to 80 words, 2 paragraphs',
      superHeading: 'Shorter badge above headline, 2 to 5 words',
    } }),
    ...optionSets.navItems.toOptions({
      label: 'Bullets',
      groupPath: 'details',
      refineOption: {
        title: true,
        group: {
          description: 'Concise detail information like email, city, skills, last job, etc.',
          refine: {
            name: 'Label for profile detail (Email)',
            desc: 'Value for profile detail (email@example.com), max 3 words',
            href: true,
          },
        },
      },
    }),
    ...optionSets.socials.toOptions(),
  ]

  return [
    new InputOption({ label: 'Settings', input: 'group', options, key: 'minProfileSettings' }),
  ]
}

export const templates = [
  new CardTemplate({
    templateId: 'minimalProfile',
    category: ['basic'],
    description: 'Minimal website profile',
    icon: 'i-tabler-user',
    iconTheme: 'blue',
    el: vue.defineAsyncComponent(() => import('./XProfile.vue')),
    userConfig: {
      superHeading: 'Steve S. Smith',
      heading: 'Designing The Future of Tomorrow',
      subHeading: `Here, amidst the swirling currents of creativity, flows the vibrant stream of ideas, enriching the landscape with its distinct flair and substance. Engage with a world where every design is a testament to uniqueness, and every concept breathes life into fresh, pioneering visions.`,
      items: [{ media: { url: new URL('./pic.jpg', import.meta.url).href, format: 'url' } }],
      detailsTitle: 'About Me',
      details: [
        { name: 'Location', desc: 'Laguna Beach, CA' },
        { name: 'Email', desc: 'hello@mywebsite.com', href: 'mailto:hello@example.com' },
        { name: 'Phone', desc: '123-456-7890' },
      ],
      socials: [
        { name: 'Facebook', href: 'https://x.com/arpowers', icon: 'facebook' },
        { name: '@arpowers', href: 'https://x.com/arpowers', icon: 'x' },
        { name: 'LinkedIn', href: 'https://linkedin.com/in/arpowers', icon: 'linkedin' },
        { name: 'Youtube', href: 'https://twitter.com/arpowers', icon: 'youtube' },
      ],
    },
    options: [
      ...ai(),
      ...options(),
    ],

  }),
] as const
