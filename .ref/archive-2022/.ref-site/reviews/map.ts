import { mapTypeHelper } from '../../util'
import feedbackHeader from './img/feedbackHeader.png'
import team from './img/team.png'
import rating from './img/rating.png'
import csat from './img/csat.png'
import survey from './img/survey.png'
import trends from './img/trends.png'

export const map = mapTypeHelper({
  reviews: {
    header: 'full',
    class: 'text-primary-500',
    bgClass: 'text-primary-50',
    path: '/platform/reviews',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" d="M4.027 1.646A6.091 6.091 0 114.9 12.528l-3.33.554a.5.5 0 01-.556-.652l.852-2.541a6.091 6.091 0 012.161-8.243z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.155.78a6.091 6.091 0 00-5.29 9.109l-.85 2.542a.5.5 0 00.555.652l3.33-.555a6.09 6.09 0 008.194-4.286 6.09 6.09 0 00.006-2.715"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 4.125L8.818 6C9.674 3.542 10.386 2.464 12 1"></path></g></svg>`,
    heading: 'Generate More Reviews',
    name: 'Generate Reviews',
    tagline: 'Capture the voice of your customers',
    screenshot: feedbackHeader,
    thumb: feedbackHeader,
    category: 'Feedback',
    description:
      'Generate more authentic reviews and display them where they will make the largest impact.',
    aspects: [
      {
        align: 'wide',
        name: 'Generate Authentic Reviews',
        description: `Build your reputation with every purchase. Use data-driven tools and make it simple to give feedback via reviews and ratings.`,
        aspects: [
          {
            name: 'Request with Email or SMS',
            description:
              'Collect detailed reviews from customers wherever they are using our frictionless in-mail technology and via SMS.',
            thumb: csat,
          },
          {
            name: 'Focus The Conversation',
            description:
              'Collect higher-quality reviews addressing high-converting topics that actually inspire purchases',
            thumb: rating,
          },
          {
            name: 'Images and Video',
            description:
              'Get relatable experiences and increase the impact of every review with customer photos and videos',
            thumb: team,
          },
        ],
      },
      {
        align: 'wide',
        name: 'Widgets and Galleries',
        description: `Display compelling content at the highest-intent moments.`,
        aspects: [
          {
            name: 'Top Review Highlights',
            description:
              'Display your best reviews at high-converting touch points throughout the shopping experience.',
            thumb: csat,
          },
          {
            name: 'Social Proof',
            description:
              'Decrease cart abandonment and upsell products by showing your best reviews and highly-rated products at checkout.',
            thumb: rating,
          },
          {
            name: 'Search and Filters',
            description:
              'Build buyer confidence by honing in on the right content to ensure customer satisfaction and minimize returns.',
            thumb: team,
          },
        ],
      },
      {
        align: 'left',
        name: 'Completely On-Brand',
        description: `Customers will see forms that are simple and completely customizable to match your brand.`,
        screenshot: survey,
      },
      {
        align: 'right',
        name: 'Analytics and Insights ',
        description: `Customers will see forms that are simple and completely customizable to match your brand.`,
        screenshot: trends,
      },
      {
        align: 'wide',
        name: 'Increase Website Traffic',
        description: `Customer reviews displayed on the right channels at the right time can make a huge impact on the traffic your store receives from shoppers who are ready to buy.`,
        aspects: [
          {
            name: 'Google Product Listings',
            description:
              'Showcasing your product reviews on Google Shopping Ads is a proven method to exponentially increase traffic to your website.',
            thumb: csat,
          },
          {
            name: 'Organic Rich Snippets',
            description:
              'Increase click-through rates and SEO ranking by displaying rich snippets with star ratings in search results.',
            thumb: rating,
          },
          {
            name: 'Social Ads and Sharing',
            description:
              'Allow customers to share their reviews on their favorite social platform, track most loyal fans, and reward customers for promoting your store.',
            thumb: team,
          },
        ],
      },
    ],
  },
})
