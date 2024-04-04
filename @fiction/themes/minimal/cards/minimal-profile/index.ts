// @unocss-include

import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { optionSets } from '@fiction/site/cards/inputSets'
import { CardTemplate } from '@fiction/site/card'
import InputAi from '@fiction/site/plugin-builder/InputAi.vue'

function ai() {
  const options = [
    new InputOption({ key: 'userConfig.purpose', input: InputAi }),
  ]
  return [
    new InputOption({ label: 'AI', input: 'group', options, key: 'AISettings' }),
  ]
}

function userControls() {
  const socials = optionSets.socials.toOptions()

  const options = [
    ...optionSets.mediaItems.toOptions({
      refine: {
        group: 'splash picture in portrait format',
      },
    }),
    ...optionSets.headers.toOptions({ refine: {
      heading: 'Primary headline for profile 3 to 8 words',
      subHeading: 'Formatted markdown of profile with paragraphs, 50 to 80 words, 2 paragraphs',
      superHeading: 'Shorter badge above headline, 2 to 5 words',
    } }),
    ...optionSets.navItems.toOptions({
      label: 'Bullets',
      groupPath: 'details',
      refine: {
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
    ...socials,
  ]

  return [
    new InputOption({ label: 'Settings', input: 'group', options, key: 'minProfileSettings' }),
  ]
}

const options = [
  ...ai(),
  ...userControls(),
]

const minimalProfile = new CardTemplate({
  templateId: 'minimalProfile',
  category: ['theme'],
  description: 'Minimal website profile',
  icon: 'i-tabler-user',
  iconTheme: 'blue',
  el: vue.defineAsyncComponent(() => import('./FiProfile.vue')),
  userConfig: {
    superHeading: 'Steve S. Smith',
    heading: 'Designing The Future of Tomorrow',
    subHeading: `Here, amidst the swirling currents of creativity, flows the vibrant stream of ideas, enriching the landscape with its distinct flair and substance. Engage with a world where every design is a testament to uniqueness, and every concept breathes life into fresh, pioneering visions.`,
    mediaItems: [{ media: { url: new URL('./pic.jpg', import.meta.url).href, format: 'url' as const } }],
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
  options,
})

export const templates = [minimalProfile] as const
