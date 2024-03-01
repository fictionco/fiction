import { mapTypeHelper } from '../../util'
import feedbackHeader from './img/feedbackHeader.png'
import team from './img/team.png'
import rating from './img/rating.png'
import csat from './img/csat.png'
import survey from './img/survey.png'
import trends from './img/trends.png'

export const map = mapTypeHelper({
  webchat: {
    header: 'full',
    class: 'text-primary-500',
    bgClass: 'text-primary-50',
    path: '/platform/webchat',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="#ffffff" d="M3.454 1.621a5.237 5.237 0 016.816 1.242 5.293 5.293 0 011.009 4.48 5.293 5.293 0 01-1.024 2.118 5.26 5.26 0 01-4.125 1.975 5.235 5.235 0 01-1.924-.377l-2.761.463a.5.5 0 01-.557-.652l.7-2.1A5.302 5.302 0 013.454 1.62z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.454 1.621a5.237 5.237 0 016.816 1.242 5.293 5.293 0 011.009 4.48 5.293 5.293 0 01-1.024 2.118 5.26 5.26 0 01-4.125 1.975 5.235 5.235 0 01-1.924-.377l-2.761.463a.5.5 0 01-.557-.652l.7-2.1A5.302 5.302 0 013.454 1.62z"></path><path fill="#FFFFFF" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.254 5.602a3.928 3.928 0 00-5.113.931 3.97 3.97 0 00-.756 3.36 3.97 3.97 0 002.146 2.685 3.926 3.926 0 003.158.102l2.071.347a.375.375 0 00.418-.488l-.525-1.576a3.978 3.978 0 00-1.4-5.361z"></path></g></svg>`,
    heading: 'Connect better with SMS WebChat.',
    name: 'SMS Webchat',
    tagline: 'Retain web users via SMS',
    screenshot: feedbackHeader,
    thumb: feedbackHeader,
    category: 'Marketing',
    description:
      'Webchat lets you easily connect with customers while they\'re on your website.',
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
