import { mapTypeHelper } from '../../util'
import feedbackHeader from './img/feedbackHeader.png'
import team from './img/team.png'
import rating from './img/rating.png'
import csat from './img/csat.png'
import survey from './img/survey.png'
import trends from './img/trends.png'

export const map = mapTypeHelper({
  scorecard: {
    header: 'full',
    class: 'text-primary-500',
    bgClass: 'text-primary-50',
    path: '/platform/scorecard',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.453 6.903a1.135 1.135 0 01-.904 0l-5.48-2.539a.538.538 0 010-.961L6.548.845a1.135 1.135 0 01.904 0l5.48 2.538a.54.54 0 010 .962l-5.48 2.558z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.25 7.335l-5.865 2.702a.962.962 0 01-.798 0L.75 7.335"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.25 10.46l-5.865 2.702a.96.96 0 01-.798 0L.75 10.46"></path></g></svg>`,
    heading: 'Connect your frontline to your bottom line.',
    name: 'Team Scorecard',
    tagline: 'Visualize team CX performance',
    screenshot: feedbackHeader,
    thumb: feedbackHeader,
    category: 'Workforce',
    description:
      'Recognize your best performers and close team performance gaps. Create the Disneyland experience.',
    aspects: [
      {
        align: 'wide',
        name: 'A scorecards for your team leaders',
        description: `Allow your managers to visualize the impact of customer experience on key growth metrics (repeat purchases, referrals, spend).`,
        aspects: [
          {
            name: 'Compare Performance',
            description:
              'See which people and teams are doing the best work for your customers.',
            thumb: csat,
          },
          {
            name: 'Incentivize',
            description:
              'With the scoreboard, your team will be incentivized to create \'disney-like\' experiences and delight customers.',
            thumb: rating,
          },
          {
            name: 'Pinpoint Problems',
            description:
              'Use Kaption CX analytics to see touch points that can be improved.',
            thumb: team,
          },
        ],
      },

      {
        align: 'left',
        name: 'Help your frontline improve',
        description: `With a comparative overview of performance you can identify who is falling behind and coach them to improve.`,
        screenshot: survey,
      },
      {
        align: 'right',
        name: 'Your Secret Growth Engine',
        description: `With insights generated from Kaption you can out-train and out-compete your competition.`,
        screenshot: trends,
      },
    ],
  },
})
