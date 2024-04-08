import { createCard } from '@fiction/site/theme'
import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { templates } from '../templates'
import people from './people2.webp'
import ap from './ap.webp'
import pro from './pro.webp'

const topHeroCard = createCard({
  templates,
  templateId: 'hero',
  userConfig: {
    superHeading: 'Company',
    subHeading: `The platform built to help you tell your story.`,
    heading: `About`,
    splash: { format: 'url', url: people },
    layout: 'justified',
  },
})

const missionHeroCard = createCard({
  templates,
  templateId: 'hero',
  userConfig: {
    superHeading: 'Mission',
    subHeading: `We believe everyone has a story to tell but most never get the chance. We're here to change that.`,
    heading: `Be Heard`,
    splash: { format: 'url', url: pro },
    layout: 'left',
  },
})

const teamCard = createCard({
  templates,
  templateId: 'team',
  userConfig: {
    subHeading: `People helping build your story`,
    heading: `Founders`,
    profiles: [{
      name: 'Andrew Powers',
      title: 'Founder',
      desc: 'Andrew is the founder of Fiction. He has a background in software engineering and has worked in the tech industry for over 20 years. He is passionate about building tools that help people tell their stories.',
      media: { format: 'url', url: ap },
      social: [{ name: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/arpowers' }],
    }],
    layout: 'mediabox',
  },
})

const aboutCard = createCard({
  templates,
  tpl: new CardTemplate({
    templateId: 'sites',
    el: vue.defineAsyncComponent(() => import('./AboutPage.vue')),
  }),
  userConfig: {},
})

export function page() {
  return createCard({
    templates,
    regionId: 'main',
    templateId: 'wrap',
    slug: 'about',
    cards: [
      createCard({
        templates,
        templateId: 'area',
        cards: [
          topHeroCard,
          missionHeroCard,
          teamCard,
          aboutCard,
        ],
      }),

    ],
  })
}
