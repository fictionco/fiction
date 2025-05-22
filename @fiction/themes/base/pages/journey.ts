import type { CardConfigPortable } from '@fiction/site/tables.js'
import { cardConfig } from '@fiction/cards/index.js'
import { createStockMediaHandler } from '@fiction/ui/stock/index.js'

export async function getCards(): Promise<CardConfigPortable[]> {
  const stock = await createStockMediaHandler()

  return [
    cardConfig({
      templateId: 'cardStoryV1',
      userConfig: {
        standard: {
          headers: {
            title: 'My Story',
            subTitle: 'How personal experience shaped professional expertise',
          },
        },
        items: [
          {
            title: 'The Beginning',
            content: 'Start with your origin story. What sparked your interest in your field? Share a personal anecdote that connects emotionally with readers while establishing the foundation of your expertise.',
            media: stock.getRandomByTags(['people']),
          },
          {
            title: 'The Development',
            content: 'Describe your professional development. What training, mentorship, or pivotal experiences shaped your approach? This section bridges your beginning with your current professional identity.',
            media: stock.getRandomByTags(['people']),
          },
          {
            title: 'The Approach',
            content: 'Articulate your current philosophy and methodology. How do your experiences inform your work today? This section should connect your past with your present offerings and establish your unique value.',
            media: stock.getRandomByTags(['people']),
          },
        ],
      },
    }), // Career journey
    cardConfig({
      templateId: 'cardTimelineV1',
      userConfig: {
        standard: {
          headers: {
            title: 'Professional Timeline',
            subTitle: 'Key milestones in the evolution of expertise',
          },
        },
        items: [
          {
            title: 'Early Achievement',
            content: 'Describe an early professional milestone that established your foundation in the field',
            date: '2009',
            icon: { iconId: 'plane' },
          },
          {
            title: 'Major Transition',
            content: 'Highlight a pivotal moment that marked growth or a shift in your professional trajectory',
            date: '2012',
            icon: { iconId: 'device-tv' },
          },
          {
            title: 'Industry Recognition',
            content: 'Feature an award, publication, or other recognition that validates your expertise externally',
            date: '2015',
            icon: { iconId: 'award' },
          },
          {
            title: 'Innovation Point',
            content: 'Describe a project or initiative where you created something new or pioneered an approach',
            date: '2018',
            icon: { iconId: 'briefcase' },
          },
          {
            title: 'Current Focus',
            content: 'Share your present professional emphasis, connecting past achievements with future direction',
            date: '2021',
            icon: { iconId: 'bulb' },
          },
        ],
      },
    }), // Experience timeline
    cardConfig({
      templateId: 'cardQuotesV1',
      userConfig: {
        standard: {
          headers: {
            title: 'Client Testimonials',
            subTitle: 'What others say about working with me',
          },
        },
        items: [
          {
            text: 'A compelling testimonial focuses on specific results or experiences rather than generic praise. The quote should sound authentic and conversational.',
            author: {
              label: 'Client Name',
              subLabel: 'Professional Title, Company',
              media: stock.getRandomByTags(['man']),
            },
          },
          {
            text: 'Include testimonials from different client types to demonstrate versatility. Each quote should highlight different aspects of your service or approach.',
            author: {
              label: 'Client Name',
              subLabel: 'Position, Organization',
              media: stock.getRandomByTags(['woman']),
            },
          },
          {
            text: 'The most powerful testimonials address initial client concerns and how you overcame them. This builds trust with potential clients who may have similar hesitations.',
            author: {
              label: 'Client Name',
              subLabel: 'Role, Company',
              media: stock.getRandomByTags(['man']),
            },
          },
        ],
      },
    }), // Testimonials
  ]
}
