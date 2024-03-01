import { themeCard } from '../../theme'
import { standardCardTemplates as templates } from '../../cards'

export function setup() {
  return themeCard({
    templates,
    regionId: 'main',
    templateId: 'wrap',
    slug: '_default',
    cards: [
      themeCard({
        templates,
        templateId: 'features',
        userConfig: {
          heading: `Personal Branding <span class="font-serif italic">made easy</span>`,
          subHeading: `See why over 300 influencers are creating websites with Fiction <span class="italic">every day</span>.`,
          items: [
            {
              name: 'Authority',
              desc: 'Get your job listings in front of millions of top-rated designers looking for their next role with an average of 1.1K targeted clicks per month.',
            },

            {
              name: 'Networking',
              desc: 'Get your job listings in front of millions of top-rated designers looking for their next role with an average of 1.1K targeted clicks per month.',
            },
            {
              name: 'Opportunity',
              desc: 'Get your job listings in front of millions of top-rated designers looking for their next role with an average of 1.1K targeted clicks per month.',
            },
          ],
          actions: [
            {
              name: 'Create Account',
              href: '/signup',
            },
          ],
        },
      }),
    ],
  })
}
