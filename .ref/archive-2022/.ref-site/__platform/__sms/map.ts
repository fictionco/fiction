import { mapTypeHelper } from '../../util'
import feedbackHeader from './img/feedbackHeader.png'
import team from './img/team.png'
import rating from './img/rating.png'
import csat from './img/csat.png'
import survey from './img/survey.png'
import trends from './img/trends.png'

export const map = mapTypeHelper({
  sms: {
    header: 'full',
    class: 'text-primary-500',
    bgClass: 'text-primary-50',
    path: '/platform/sms',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.027 1.646A6.091 6.091 0 114.9 12.528l-3.33.554a.5.5 0 01-.556-.652l.852-2.541a6.091 6.091 0 012.161-8.243z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.813 5.5h4.875"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.813 8.5H8.5"></path></g></svg>`,
    heading: 'Conversational SMS Marketing',
    name: 'SMS Marketing',
    tagline: '98% open-rate campaigns',
    screenshot: feedbackHeader,
    thumb: feedbackHeader,
    category: 'Marketing',
    description:
      'Take advantage of text\'s 98% open rate with SMS marketing campaigns. Get a real response and measurable results.',
    aspects: [
      {
        align: 'wide',
        name: 'Text Like You Know Them',
        description: `Leverage data to target customers in the moments that matter most with tailored SMS & MMS messages that drive revenue and foster relationships.`,
        aspects: [
          {
            name: 'Targeted Campaigns',
            description:
              'Easily craft, personalize, and A/B test campaigns to text subscribers about product releases, sales, exclusive offers, and more.',
            thumb: csat,
          },
          {
            name: 'Segment Customers',
            description:
              'Create hyper-targeted segments to engage subscribers based on advanced data points, including customer behavior, attributes, and SMS data.',
            thumb: rating,
          },
          {
            name: '1:1 Conversations',
            description:
              'Spark two-way conversations with conversational text automation, in-app SMS chat, and help desk integrations to maximize loyalty and engagement.',
            thumb: team,
          },
        ],
      },

      {
        align: 'left',
        name: 'Build Your List',
        description: `Turn every customer into a subscriber and build a list that will power sales for years to come.`,
        screenshot: survey,
      },
      {
        align: 'right',
        name: 'Track SMS Engagement',
        description: `Accelerate your business growth with real-time analytics that deep dive into every aspect of your text marketing strategy.`,
        screenshot: trends,
      },
    ],
  },
})
