// @unocss-include

import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { refineOptions } from '@fiction/cards/utils/refiner'
import { standardOption } from '@fiction/cards/inputSets'
import { CardTemplate } from '@fiction/site/card'

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
    },
  })
}

const options = [
  standardOption.ai(),
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
