import { mapTypeHelper } from '../../util'
import feedbackHeader from './img/feedbackHeader.png'
import team from './img/team.png'
import rating from './img/rating.png'
import csat from './img/csat.png'
import survey from './img/survey.png'
import trends from './img/trends.png'

export const map = mapTypeHelper({
  ugc: {
    header: 'full',
    class: 'text-primary-500',
    bgClass: 'text-primary-50',
    path: '/platform/ugc',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-width="1.5" d="M1.014 7.991c.063.478.45.852.93.897 1.156.11 2.362.247 3.604.247 1.24 0 2.448-.137 3.603-.247.48-.045.867-.419.93-.897.123-.927.264-1.893.264-2.886 0-.992-.14-1.958-.264-2.886a1.04 1.04 0 00-.93-.897c-1.155-.109-2.362-.247-3.603-.247-1.242 0-2.448.138-3.604.247a1.04 1.04 0 00-.93.897C.89 3.147.75 4.113.75 5.105c0 .993.141 1.959.264 2.886z"></path><path fill="#ffffff" d="M3.919 11.241c.063.478.45.852.93.897 1.156.11 2.362.247 3.603.247 1.242 0 2.448-.137 3.604-.247.48-.045.867-.419.93-.897.123-.927.264-1.893.264-2.886 0-.992-.14-1.958-.264-2.886a1.04 1.04 0 00-.93-.897c-1.156-.109-2.362-.247-3.604-.247-1.24 0-2.447.138-3.603.247a1.04 1.04 0 00-.93.897c-.123.928-.264 1.894-.264 2.886 0 .993.14 1.959.264 2.886z"></path><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.193 9.532c-.793-.716-1.666-1.207-2.556-1.207-1.832 0-3.587 2.074-4.723 3.916.826.078 1.674.144 2.538.144 1.064 0 2.103-.1 3.105-.198l.5-.049c.479-.045.866-.419.93-.897l.03-.229c.064-.484.13-.978.176-1.48z"></path><path fill="currentColor" d="M6.5 7.825a1 1 0 100-2 1 1 0 000 2z"></path><path stroke="currentColor" stroke-width="1.5" d="M3.919 11.241c.063.478.45.852.93.897 1.156.11 2.362.247 3.603.247 1.242 0 2.448-.137 3.604-.247.48-.045.867-.419.93-.897.123-.927.264-1.893.264-2.886 0-.992-.14-1.958-.264-2.886a1.04 1.04 0 00-.93-.897c-1.156-.109-2.362-.247-3.604-.247-1.24 0-2.447.138-3.603.247a1.04 1.04 0 00-.93.897c-.123.928-.264 1.894-.264 2.886 0 .993.14 1.959.264 2.886z"></path></g></svg>`,
    heading: 'Let your customers sell your customers',
    name: 'User Generated Content',
    tagline: 'Let users convince your visitors',
    screenshot: feedbackHeader,
    thumb: feedbackHeader,
    category: 'Marketing',
    description:
      'Unleash the power of visual user-generated content to create convincing marketing across your site.',
    aspects: [
      {
        align: 'wide',
        name: 'Keep The Conversation Going',
        description: `Kaption webchat immediately moves web visitors to a text based conversation.`,
        aspects: [
          {
            name: 'Stop Drop-off',
            description:
              'By moving to text, you\'ll retain 72% more of the web visitors who start chats with you.',
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
