import { mapTypeHelper } from '../../util'
import feedbackHeader from './img/feedbackHeader.png'
import team from './img/team.png'
import rating from './img/rating.png'
import csat from './img/csat.png'
import survey from './img/survey.png'
import trends from './img/trends.png'

export const map = mapTypeHelper({
  live: {
    header: 'full',
    class: 'text-primary-500',
    bgClass: 'text-primary-50',
    path: '/platform/live',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.71 8.026H3.555c-.728 0-1.203-.75-.826-1.374C4.298 4.06 6.834 1.653 9.29.755L9.024 4.63c.893.033 1.843.107 2.653.247.559.097.837.68.545 1.165-1.064 1.771-3.562 4.595-7.167 7.204.077-1.841.24-3.507.654-5.22z"></path></g></svg>`,
    name: 'Live Feedback',
    heading: 'Get live feedback about your site or product',
    category: 'Feedback',
    tagline: 'Instant contextual feedback',
    screenshot: feedbackHeader,
    thumb: feedbackHeader,
    description:
      'You can collect video testimonials from your customers with no need for a developer or website hosting.',
    aspects: [
      {
        align: 'wide',
        name: 'Undeniable Social Proof',
        description: `Video testimonials are undeniably powerful in convincing new customers.`,
        aspects: [
          {
            name: 'Show off Success',
            description: 'Show off successful use cases and happy customers. ',
            thumb: csat,
          },
          {
            name: 'Ultimate Social Proof',
            description:
              'There is no stronger form of social proof than video testimonials from happy customers.',
            thumb: rating,
          },
          {
            name: 'Natural Incentives',
            description:
              'Your customers will like the chance to explain how your product has helped their business.',
            thumb: team,
          },
        ],
      },

      {
        align: 'left',
        name: 'Understand Performance',
        description: `Track the metrics from all embedded videos, help your marketing team understand the performance at a glance, even promote the best-performing videos to different marketing channels.`,
        screenshot: survey,
      },
      {
        align: 'right',
        name: 'Add Videos from Anywhere',
        description: `If you received testimonials on Twitter, G2, Linkedin, YouTube and Vimeo, add them onto your Wall of Love. Social proof is such a powerful marketing asset.`,
        screenshot: trends,
      },
    ],
  },
})
