import { mapTypeHelper } from '../../util'
import feedbackHeader from './img/feedbackHeader.png'
import team from './img/team.png'
import rating from './img/rating.png'
import csat from './img/csat.png'
import survey from './img/survey.png'
import trends from './img/trends.png'

export const map = mapTypeHelper({
  recognition: {
    header: 'full',
    class: 'text-primary-500',
    bgClass: 'text-primary-50',
    path: '/platform/recognition',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-width="1.5" d="M3.16 6.278c.052 2.1 1.736 3.937 3.836 3.937v0c2.133 0 3.777-1.808 3.835-3.94a33.017 33.017 0 00-.196-4.443.952.952 0 00-.786-.838A17.226 17.226 0 006.996.75c-.986 0-1.95.085-2.867.242a.942.942 0 00-.774.825 32.246 32.246 0 00-.195 4.461z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.996 10.223v3.027"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.592 13.25H9.4"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.602 1.712h1.644a1 1 0 011 1v.176c0 .936-.304 1.834-.845 2.496-.426.522-.973.864-1.56.985"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.364 1.712h-1.61a1 1 0 00-1 1v.176c0 .936.304 1.834.845 2.496.424.52.967.86 1.551.983"></path></g></svg>`,
    heading: 'Catch your people doing things right.',
    name: 'Employee Recognition',
    tagline: 'Reward your people for great work.',
    screenshot: feedbackHeader,
    thumb: feedbackHeader,
    category: 'Workforce',
    description:
      'See who is doing an outstanding job for your customers. Build a customer obsessed frontline culture based on positive feedback.',
    aspects: [
      {
        align: 'wide',
        name: 'Create goals and rewards for great CX',
        description: `Set goals and unlock rewards for your teams based on customer ratings.`,
        aspects: [
          {
            name: 'Shoutouts',
            description:
              'Leaders can identify high performers and send a personal message in a couple of clicks.',
            thumb: csat,
          },
          {
            name: 'Goals',
            description:
              'Keep individual and team goals that your team need to hit to ensure great CX.',
            thumb: rating,
          },
          {
            name: 'Instant Feedback',
            description:
              'Get quick feedback from customers and let stakeholders know about results right away.',
            thumb: team,
          },
        ],
      },

      {
        align: 'left',
        name: 'Gamify Great Experience',
        description: `Create a game out of continually improving the experience of your customers.`,
        screenshot: survey,
      },
      {
        align: 'right',
        name: 'Touch Point Analytics',
        description: `Visualize the trends in CX over time across workforce touch points`,
        screenshot: trends,
      },
    ],
  },
})
