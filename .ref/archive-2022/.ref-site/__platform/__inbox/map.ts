import { mapTypeHelper } from '../../util'
import feedbackHeader from './img/feedbackHeader.png'
import team from './img/team.png'
import rating from './img/rating.png'
import csat from './img/csat.png'
import survey from './img/survey.png'
import trends from './img/trends.png'

export const map = mapTypeHelper({
  inbox: {
    header: 'full',
    class: 'text-primary-500',
    bgClass: 'text-primary-50',
    path: '/platform/inbox',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M.96 10.268a3.132 3.132 0 002.753 2.76c1.07.12 2.167.222 3.287.222s2.218-.102 3.287-.222a3.132 3.132 0 002.753-2.76c.114-1.063.21-2.155.21-3.268s-.096-2.205-.21-3.269a3.132 3.132 0 00-2.753-2.76C9.217.853 8.12.75 7 .75S4.782.852 3.713.972A3.132 3.132 0 00.96 3.732C.846 4.794.75 5.886.75 7s.096 2.205.21 3.268z"></path><path fill="#ffffff" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M13.208 8h-3.22c-.55 0-.982.47-1.225.965C8.499 9.503 7.972 10 6.999 10c-.974 0-1.501-.497-1.765-1.035C4.992 8.469 4.56 8 4.01 8H.789c.032.84.1 1.671.183 2.478a2.873 2.873 0 002.541 2.563c1.129.122 2.305.209 3.486.209 1.18 0 2.356-.087 3.485-.209a2.873 2.873 0 002.54-2.563A38.04 38.04 0 0013.209 8z"></path></g></svg>`,
    heading: 'Keep every conversation in one place.',
    name: 'Inbox',
    tagline: 'Messages in one place',
    screenshot: feedbackHeader,
    thumb: feedbackHeader,
    category: 'Marketing',
    description: 'Put your customer conversations in one place and focus.',
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
