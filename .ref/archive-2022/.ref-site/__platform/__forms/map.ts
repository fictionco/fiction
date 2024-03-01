import { mapTypeHelper } from '../../util'
import feedbackHeader from './img/feedbackHeader.png'
import team from './img/team.png'
import rating from './img/rating.png'
import csat from './img/csat.png'

export const map = mapTypeHelper({
  forms: {
    header: 'full',
    class: 'text-primary-500',
    bgClass: 'text-primary-50',
    path: '/platform/forms',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-width="1.5" d="M9.633 11.683a53.15 53.15 0 00.085-4.682 1.563 1.563 0 00-.3-.886c-.715-.973-1.284-1.579-2.222-2.303-.26-.2-.578-.309-.906-.316-.326-.007-.667-.01-1.03-.01-1.102 0-1.99.032-2.91.095a1.573 1.573 0 00-1.464 1.47 53.146 53.146 0 00-.102 3.317c0 1.136.035 2.245.102 3.315.05.79.676 1.417 1.464 1.47.92.064 1.808.097 2.91.097 1.1 0 1.99-.033 2.909-.096a1.573 1.573 0 001.464-1.47z"></path><path fill="#ffffff" stroke="currentColor" stroke-width="1.5" d="M13.114 8.948a53.087 53.087 0 00.085-4.683 1.563 1.563 0 00-.3-.886c-.715-.973-1.284-1.578-2.222-2.302-.26-.2-.578-.31-.906-.316C9.445.754 9.104.75 8.741.75c-1.102 0-1.99.033-2.91.096a1.573 1.573 0 00-1.464 1.47 53.149 53.149 0 00-.102 3.316c0 1.137.035 2.246.102 3.316.05.789.676 1.417 1.464 1.47.92.064 1.808.097 2.91.097 1.1 0 1.99-.033 2.909-.096a1.573 1.573 0 001.464-1.47z"></path></g></svg>`,
    heading: 'Grow Subscribers with Forms and Pages',
    name: 'Forms and Landing Pages',
    tagline: 'Build Your List',
    screenshot: feedbackHeader,
    thumb: feedbackHeader,
    category: 'Marketing',
    description:
      'Expertly designed forms and landing pages that make growing your list a breeze.',
    aspects: [
      {
        align: 'wide',
        name: 'Powerful Forms and Pages',
        description: `Use proven form and page templates to capture subscriber details in the best way possible.`,
        aspects: [
          {
            name: 'Email + SMS',
            description:
              'Collect consent and find out how to reach customers on their preferred channels.',
            thumb: csat,
          },
          {
            name: 'Expertly designed',
            description:
              'The best forms don\'t just look good—they\'re optimized to drive conversions and avoid overwhelming site visitors.',
            thumb: rating,
          },
          {
            name: 'Grow The List',
            description:
              'Add forms directly to your website so customers can subscribe to brand updates.',
            thumb: team,
          },
        ],
      },
    ],
  },
})
