import { mapTypeHelper } from '../../util'
import feedbackHeader from './img/feedbackHeader.png'
import team from './img/team.png'
import rating from './img/rating.png'
import csat from './img/csat.png'
import survey from './img/survey.png'
import trends from './img/trends.png'

export const map = mapTypeHelper({
  contacts: {
    header: 'full',
    class: 'text-primary-500',
    bgClass: 'text-primary-50',
    path: '/platform/contacts',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" d="M9.397 7.009a2.399 2.399 0 100-4.798 2.399 2.399 0 000 4.798z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.397 7.009a2.399 2.399 0 00.852-4.642"></path><path fill="" d="M12.674 10.379c1.173.781.38 2.288-1.03 2.288H6.35c-1.41 0-2.202-1.507-1.028-2.288a6.609 6.609 0 013.676-1.11c1.36 0 2.623.409 3.676 1.11z"></path><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.36 6.533a2.6 2.6 0 100-5.2 2.6 2.6 0 000 5.2z"></path><path fill="" stroke="currentColor" stroke-width="1.5" d="M9.344 10.187c1.272.847.413 2.48-1.116 2.48H2.49c-1.528 0-2.387-1.633-1.115-2.48A7.164 7.164 0 015.36 8.984c1.473 0 2.844.443 3.985 1.203z"></path><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M8.007 12.668h3.638c1.41 0 2.202-1.508 1.029-2.29a6.62 6.62 0 00-1.03-.56"></path></g></svg>`,
    heading: 'Build user lists and information',
    name: 'Contact Management',
    tagline: 'Keep track of your users',
    screenshot: feedbackHeader,
    thumb: feedbackHeader,
    category: 'Marketing',
    description:
      'Save and coordinate contact information across channels and touch points.',
    aspects: [
      {
        align: 'wide',
        name: 'Complete Interaction Management',
        description: `Make the entire customer interaction elegant and simple. Inbox is the fast way to communicate.`,
        aspects: [
          {
            name: 'Quickly Respond',
            description:
              'Clear your inbox fast because your entire task list is in one place.',
            thumb: csat,
          },
          {
            name: 'Prioritize Messages',
            description:
              'Messages are grouped to help you focus on the customers who need attention first.',
            thumb: rating,
          },
          {
            name: 'Communicate Intelligently',
            description:
              'Contact profiles will help you get a full backstory for every message.',
            thumb: team,
          },
        ],
      },

      {
        align: 'left',
        name: 'SMS or Email',
        description: `Be channel agnostic. The conversation can continue where it started whether thats SMS or email`,
        screenshot: survey,
      },
      {
        align: 'right',
        name: 'Inbox Analytics',
        description: `Kaption tracks all interactions and helps you understand patterns in user response to team actions.`,
        screenshot: trends,
      },
    ],
  },
})
