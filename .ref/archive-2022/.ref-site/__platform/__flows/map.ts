import { mapTypeHelper } from '../../util'
import feedbackHeader from './img/feedbackHeader.png'
import team from './img/team.png'
import rating from './img/rating.png'
import csat from './img/csat.png'
import survey from './img/survey.png'
import trends from './img/trends.png'

export const map = mapTypeHelper({
  flows: {
    header: 'full',
    class: 'text-primary-500',
    bgClass: 'text-primary-50',
    path: '/platform/flows',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.181 11.26c1.005-.724 2.444-1.959 3.598-3.514.44-.593.44-1.4 0-1.992-1.155-1.555-2.593-2.79-3.598-3.514-.315-.228-.734.004-.734.393V4.5h-2.5c-2 0-5.8 1.8-5 7 .5-.833 1.5-2.5 5-2.5h2.5v1.867c0 .389.42.62.734.393z"></path></g></svg>`,
    heading: 'Follow up on customer feedback.',
    name: 'Follow Up Flows',
    tagline: 'Get context by following up with email and SMS',
    screenshot: feedbackHeader,
    thumb: feedbackHeader,
    category: 'Marketing',
    description:
      'Create beautiful, engaging emails and texts that send themselves. With Kaption, advanced multi-channel marketing automation is as easy as it is powerful.',
    aspects: [
      {
        align: 'wide',
        name: 'Automation Made Simple',
        description: `Get a head start on email and text messaging automation. Dozens of essential flows are built in, fully customizable and ready for any mix of emails and texts.`,
        aspects: [
          {
            name: 'Email + SMS',
            description:
              'Reach customers the way they prefer, with flows that can have any mix of emails and texts.',
            thumb: csat,
          },
          {
            name: 'Pre-built automations',
            description:
              'No need to start from scratch. Common flows are built in and 100% customizable.',
            thumb: rating,
          },
          {
            name: 'A/B testing',
            description:
              'Learn which emails and texts inspire action, and get better and better over time.',
            thumb: team,
          },
        ],
      },

      {
        align: 'left',
        name: 'All The Critical Flows',
        description: `Get a head start on email and text messaging automation. Dozens of essential flows are built in, fully customizable and ready for any mix of emails and texts.`,
        screenshot: survey,
      },
      {
        align: 'right',
        name: 'Data-Driven Marketing',
        description: `Kaption's multi-channel digital marketing automation software is how you turn all that data into personalized experiences at scale.`,
        screenshot: trends,
      },
    ],
  },
})
