import { mapTypeHelper } from '../../util'
import feedbackHeader from './img/feedbackHeader.png'
import team from './img/team.png'
import rating from './img/rating.png'
import csat from './img/csat.png'
import survey from './img/survey.png'
import trends from './img/trends.png'

export const map = mapTypeHelper({
  testimonials: {
    header: 'full',
    class: 'text-primary-500',
    bgClass: 'text-primary-50',
    path: '/platform/testimonials',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 13.25A6.25 6.25 0 107 .75a6.25 6.25 0 000 12.5z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.827 7.961c.48 1.731 2.404 2.789 4.135 2.308 1.057-.385 1.923-1.25 2.211-2.308"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.548 5.558a.24.24 0 110-.481"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.548 5.558a.24.24 0 100-.481"></path><g><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.452 5.558a.24.24 0 110-.481"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.452 5.558a.24.24 0 100-.481"></path></g></g></svg>`,
    name: 'Testimonials',
    heading: 'Collect and Display Video Testimonials',
    category: 'Feedback',
    tagline: 'The ultimate social proof',
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
