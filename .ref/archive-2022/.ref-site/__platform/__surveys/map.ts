import { mapTypeHelper } from '../../util'
import feedbackHeader from './img/feedbackHeader.png'
import team from './img/team.png'
import rating from './img/rating.png'
import csat from './img/csat.png'
import survey from './img/survey.png'
import trends from './img/trends.png'

export const map = mapTypeHelper({
  surveys: {
    header: 'full',
    class: 'text-primary-500',
    bgClass: 'text-primary-50',
    path: '/platform/surveys',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-width="1.5" d="M2.248 12.037a.978.978 0 00.894.907c2.647.222 5.069.222 7.716 0a.978.978 0 00.894-.907 60.092 60.092 0 000-8.609 1.01 1.01 0 00-.892-.924C9.623 2.352 8.33 2.156 7 2.156s-2.623.196-3.86.348a1.01 1.01 0 00-.892.924 60.092 60.092 0 000 8.609z"></path><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M5.094 6.516h3.812"></path><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M5.094 9.422h2.3"></path><rect width="5.656" height="2.969" x="4.172" y=".75" fill="#D7E0FF" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" rx="1.484"></rect></g></svg>`,
    name: 'Survey Engine',
    heading: 'Hear From Every Customer',
    category: 'Feedback',
    tagline: 'Hear From Every Customer',
    screenshot: feedbackHeader,
    thumb: feedbackHeader,
    description:
      'Bring the voice of the customer to your decision-making with on-site and external Surveys.',
    aspects: [
      {
        align: 'wide',
        name: 'Do Customer Development Right',
        description: `Build and deliver actionable customer surveys for a variety of different use cases.`,
        aspects: [
          {
            name: 'Validate and Learn',
            description:
              'Create new ideas and de-risk big projects by surveying your users to learn what they think about your latest plans.',
            thumb: csat,
          },
          {
            name: 'Improve Retention',
            description:
              'Collect higher-quality reviews addressing high-converting topics that actually inspire purchases',
            thumb: rating,
          },
          {
            name: 'Better Monetization',
            description:
              'Learn more about what customers value and how they see your pricing',
            thumb: team,
          },
        ],
      },
      {
        align: 'wide',
        name: 'Detect Issues Early',
        description: `Kaption combines user feedback with analytics and replays. The best way to tie user feedback with their specific actions.`,
        aspects: [
          {
            name: 'Feedback meets Recordings',
            description:
              'Is a user experiencing a bug you haven\'t seen? Simply load up their recording to view a live playback of their session.',
            thumb: csat,
          },
          {
            name: 'Catch Problems',
            description:
              'Don\'t wait for issues to be brought up by customers. Catch things early with in product feedback or surveys.',
            thumb: rating,
          },
          {
            name: 'Reduce Anxiety',
            description:
              'Using Kaption you can be sure that the customer\'s experience is going smoothly. Use alerts to inform and quickly fix problems.',
            thumb: team,
          },
        ],
      },
      {
        align: 'left',
        name: 'Custom Survey Engine',
        description: `Customers will see forms that are simple and completely customizable to match your brand.`,
        screenshot: survey,
      },
      {
        align: 'right',
        name: 'Feedback Analytics',
        description: `Customers will see forms that are simple and completely customizable to match your brand.`,
        screenshot: trends,
      },
      {
        align: 'wide',
        name: 'Feedback At Scale',
        description: `Meet your customers where they are and capture real-time feedback in the moments that matter.`,
        aspects: [
          {
            name: 'Know What\'s Missing',
            description:
              'Uncover trends, patterns and key drivers of customer loyalty with predictive intelligence. Focus on the areas that will maximize impact.',
            thumb: csat,
          },
          {
            name: 'Respond Quickly',
            description:
              'Create a single System of Action that puts the customer at the heart of the organization.',
            thumb: rating,
          },
          {
            name: 'Safe and Secure',
            description:
              'Have complete peace of mind with an enterprise-grade platform that offers best-in-class security, compliance and manageability.',
            thumb: team,
          },
        ],
      },
    ],
  },
})
