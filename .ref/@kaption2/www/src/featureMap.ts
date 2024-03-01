import { groupBy, vue } from '@factor/api'

const def = vue.defineAsyncComponent

export type FeatureCategory =
  | 'workforce'
  | 'analytics'
  | 'marketing'
  | 'feedback'

type FigureComponent = (() => Promise<vue.Component>) | vue.Component
export interface FeaturePageParams {
  icon?: string
  class?: string
  bgClass?: string
  name: string
  category?: FeatureCategory
  tagline?: string
  heading?: string
  description?: string
  figure?: FigureComponent
  align?: 'left' | 'right' | 'wide'
  aspects?: FeaturePageParams[]
  target?: '_blank' | '_self'
}

type FeaturePageParamsMain<T> = FeaturePageParams & { key: T }

export type FeaturePageKeysUtility<T extends FeaturePage<string>[]> = {
  [K in keyof T]: T[K] extends FeaturePage<infer T> ? T : never
}[number]

export class FeaturePage<T extends string> {
  key: T
  name: string
  icon?: string
  class?: string
  bgClass?: string
  category?: string
  tagline?: string
  heading?: string
  description?: string
  header?: 'split' | 'full'
  align?: 'left' | 'right' | 'wide'
  figure?: FigureComponent
  aspects?: FeaturePageParams[]
  target?: '_blank' | '_self'
  constructor(params: FeaturePageParamsMain<T>) {
    this.key = params.key
    this.icon = params.icon
    this.name = params.name
    this.class = params.class
    this.category = params.category
    this.tagline = params.tagline
    this.heading = params.heading
    this.description = params.description
    this.figure = params.figure
    this.align = params.align
    this.aspects = params.aspects
    this.target = params.target
  }

  public get path(): string {
    return `/platform/${this.key}`
  }
}

export const featureList = [
  new FeaturePage({
    key: 'reviews',
    class: 'text-primary-500',
    bgClass: 'text-primary-50',

    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" d="M4.027 1.646A6.091 6.091 0 114.9 12.528l-3.33.554a.5.5 0 01-.556-.652l.852-2.541a6.091 6.091 0 012.161-8.243z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.155.78a6.091 6.091 0 00-5.29 9.109l-.85 2.542a.5.5 0 00.555.652l3.33-.555a6.09 6.09 0 008.194-4.286 6.09 6.09 0 00.006-2.715"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 4.125L8.818 6C9.674 3.542 10.386 2.464 12 1"></path></g></svg>`,
    heading: 'Generate More Reviews',
    name: 'Generate Reviews',
    tagline: 'Capture the voice of your customers',
    figure: def(() => import('./figures/SplashFigure.vue')),
    category: 'feedback',
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
            figure: def(() => import('./figures/ReviewRequestEmail.vue')),
          },
          {
            name: 'Focus The Conversation',
            description:
              'Collect higher-quality reviews addressing high-converting topics that actually inspire purchases',
            figure: def(() => import('./figures/ReviewPrompts.vue')),
          },
          {
            name: 'Images and Video',
            description:
              'Get relatable experiences and increase the impact of every review with customer photos and videos',
            figure: def(() => import('./figures/ReviewImage.vue')),
          },
        ],
      },
      {
        align: 'right',
        name: 'Widgets and Galleries',
        description: `Display compelling content at the highest-intent moments.`,
        figure: def(() => import('./figures/ReviewWidgetFigure.vue')),
        aspects: [
          {
            name: 'Top Review Highlights',
            description:
              'Display your best reviews at high-converting touch points throughout the shopping experience.',
          },
          {
            name: 'Social Proof',
            description:
              'Increase conversion by showing your best reviews and highly-rated products at checkout.',
          },
          {
            name: 'Search and Filters',
            description:
              'Build buyer confidence by honing in on the right content to ensure customer satisfaction and minimize returns.',
          },
        ],
      },

      {
        align: 'left',
        name: 'Increase Website Traffic',
        description: `Customer reviews displayed on the right channels at the right time can make a huge impact on the traffic your store receives from shoppers who are ready to buy.`,
        figure: def(() => import('./figures/GoogleListingFigure.vue')),
        aspects: [
          {
            name: 'Google Product Listings',
            description:
              'Showcasing your product reviews on Google Shopping Ads is a proven method to exponentially increase traffic to your website.',
          },
          {
            name: 'Organic Rich Snippets',
            description:
              'Increase click-through rates and SEO ranking by displaying rich snippets with star ratings in search results.',
          },
          {
            name: 'Social Ads and Sharing',
            description:
              'Allow customers to share their reviews on their favorite social platform, track most loyal fans, and reward customers for promoting your store.',
          },
        ],
      },
    ],
  }),
  new FeaturePage({
    key: 'recognition',
    class: 'text-primary-500',
    bgClass: 'text-primary-50',

    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-width="1.5" d="M3.16 6.278c.052 2.1 1.736 3.937 3.836 3.937v0c2.133 0 3.777-1.808 3.835-3.94a33.017 33.017 0 00-.196-4.443.952.952 0 00-.786-.838A17.226 17.226 0 006.996.75c-.986 0-1.95.085-2.867.242a.942.942 0 00-.774.825 32.246 32.246 0 00-.195 4.461z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.996 10.223v3.027"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.592 13.25H9.4"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.602 1.712h1.644a1 1 0 011 1v.176c0 .936-.304 1.834-.845 2.496-.426.522-.973.864-1.56.985"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.364 1.712h-1.61a1 1 0 00-1 1v.176c0 .936.304 1.834.845 2.496.424.52.967.86 1.551.983"></path></g></svg>`,
    heading: 'Catch your people doing things right.',
    name: 'Track Employee Performance',
    tagline: 'Reward your people for great work.',
    figure: def(() => import('./figures/SplashFigure.vue')),

    category: 'workforce',
    description:
      'See who is doing an outstanding job for your customers. Build a customer obsessed frontline culture based on positive feedback.',
    aspects: [
      {
        align: 'right',
        name: 'Create goals and rewards for great CX',
        description: `Set goals and unlock rewards for your teams based on customer ratings.`,
        figure: def(() => import('./figures/RecognitionHero.vue')),

        aspects: [
          {
            name: 'Shoutouts',
            description:
              'Leaders can identify high performers and send a personal message in a couple of clicks.',
          },
          {
            name: 'Goals',
            description:
              'Keep individual and team goals that your team need to hit to ensure great CX.',
          },
          {
            name: 'Instant Feedback',
            description:
              'Get quick feedback from customers and let stakeholders know about results right away.',
          },
        ],
      },
    ],
  }),
  new FeaturePage({
    key: 'chat',

    class: 'text-primary-500',
    bgClass: 'text-primary-50',

    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
  </svg>`,
    heading: 'Connect better with SMS.',
    name: 'Collect Leads with SMS',
    tagline: 'Retain web users via SMS',
    figure: def(() => import('./figures/SplashFigure.vue')),

    category: 'marketing',
    description: 'Easily connect with customers while they\'re on your website.',

    aspects: [
      {
        align: 'left',
        name: 'Keep The Conversation Going',
        description: `Kaption webchat immediately moves web visitors to a persistent conversation.`,
        figure: def(() => import('./figures/ChatCompare.vue')),
        aspects: [
          {
            name: 'Stop Drop-off',
            description:
              'By moving to text, you\'ll retain 75% more of the web visitors who start chats with you.',
          },
          {
            name: 'Personalize and Convert',
            description: 'Use contact profiles to personalize conversations.',
          },
        ],
      },
    ],
  }),
  new FeaturePage({
    key: 'contacts',

    class: 'text-primary-500',
    bgClass: 'text-primary-50',

    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" d="M9.397 7.009a2.399 2.399 0 100-4.798 2.399 2.399 0 000 4.798z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.397 7.009a2.399 2.399 0 00.852-4.642"></path><path fill="" d="M12.674 10.379c1.173.781.38 2.288-1.03 2.288H6.35c-1.41 0-2.202-1.507-1.028-2.288a6.609 6.609 0 013.676-1.11c1.36 0 2.623.409 3.676 1.11z"></path><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.36 6.533a2.6 2.6 0 100-5.2 2.6 2.6 0 000 5.2z"></path><path fill="" stroke="currentColor" stroke-width="1.5" d="M9.344 10.187c1.272.847.413 2.48-1.116 2.48H2.49c-1.528 0-2.387-1.633-1.115-2.48A7.164 7.164 0 015.36 8.984c1.473 0 2.844.443 3.985 1.203z"></path><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M8.007 12.668h3.638c1.41 0 2.202-1.508 1.029-2.29a6.62 6.62 0 00-1.03-.56"></path></g></svg>`,
    heading: 'Personalize with Profiles',
    name: 'Build Customer Profiles',
    tagline: 'Keep track of your users',
    figure: def(() => import('./figures/SplashFigure.vue')),

    category: 'marketing',
    description:
      'Save and coordinate contact information across channels and touch points.',

    aspects: [
      {
        align: 'left',
        name: 'Personalize and Conquer',
        description: `Make the customer experience magical with advanced profiles and contact lists.`,
        figure: def(() => import('./figures/ContactHero.vue')),
        aspects: [
          {
            name: 'Segment and Identify',
            description:
              'Use segments to understand trends and signals between different groups of users.',
          },
          {
            name: 'Qualify Your Leads',
            description:
              'Know who you\'re talking to and what they\'re interested in.',
          },
        ],
      },
    ],
  }),

  new FeaturePage({
    key: 'inbox',

    class: 'text-primary-500',
    bgClass: 'text-primary-50',

    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
  </svg>`,
    heading: 'Keep every conversation in one place.',
    name: 'Manage Communication',
    tagline: 'Messages in one place',
    figure: def(() => import('./figures/SplashFigure.vue')),
    category: 'marketing',
    description: 'Put your customer conversations in one place and focus.',
    aspects: [
      {
        align: 'right',
        name: 'Complete Interaction Management',
        description: `Make the entire customer interaction elegant and simple. Inbox is the fast way to communicate.`,
        figure: def(() => import('./figures/InboxHero.vue')),
        aspects: [
          {
            name: 'Quickly Respond',
            description:
              'Clear your inbox fast because your entire task list is in one place.',
          },
          {
            name: 'Prioritize Messages',
            description:
              'Messages are grouped to help you focus on the customers who need attention first.',
          },
          {
            name: 'Communicate Intelligently',
            description:
              'Contact profiles will help you get a full backstory for every message.',
          },
        ],
      },
    ],
  }),
  new FeaturePage({
    key: 'live',

    class: 'text-primary-500',
    bgClass: 'text-primary-50',

    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.71 8.026H3.555c-.728 0-1.203-.75-.826-1.374C4.298 4.06 6.834 1.653 9.29.755L9.024 4.63c.893.033 1.843.107 2.653.247.559.097.837.68.545 1.165-1.064 1.771-3.562 4.595-7.167 7.204.077-1.841.24-3.507.654-5.22z"></path></g></svg>`,
    name: 'Gather Contextual Feedback',
    heading: 'Get live feedback about your site or product',
    category: 'feedback',
    tagline: 'Instant contextual feedback',
    figure: def(() => import('./figures/SplashFigure.vue')),

    description:
      'Use continuous feedback to identify UI errors, content mistakes, and missing information.',
    aspects: [
      {
        align: 'left',
        name: 'Continuous User Feedback',
        description: `Improve your product or website with insights generated from in-app feedback widgets.`,
        figure: def(() => import('./figures/FeedbackContext.vue')),
        aspects: [
          {
            name: 'Find New Ways to Improve',
            description: 'Show off successful use cases and happy customers. ',
          },
          {
            name: 'Contextual Feedback Widget',
            description:
              'There is no stronger form of social proof than video testimonials from happy customers.',
          },
          {
            name: 'Feedback Button',
            description:
              'Your customers will like the chance to explain how your product has helped their business.',
          },
        ],
      },
    ],
  }),
  new FeaturePage({
    key: 'scorecard',

    class: 'text-primary-500',
    bgClass: 'text-primary-50',

    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.453 6.903a1.135 1.135 0 01-.904 0l-5.48-2.539a.538.538 0 010-.961L6.548.845a1.135 1.135 0 01.904 0l5.48 2.538a.54.54 0 010 .962l-5.48 2.558z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.25 7.335l-5.865 2.702a.962.962 0 01-.798 0L.75 7.335"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.25 10.46l-5.865 2.702a.96.96 0 01-.798 0L.75 10.46"></path></g></svg>`,
    heading: 'Connect your frontline to your bottom line.',
    name: 'Track Team Performance',
    tagline: 'Visualize team CX performance',
    figure: def(() => import('./figures/SplashFigure.vue')),

    category: 'workforce',
    description:
      'Recognize your best performers and close team performance gaps. Create the Disneyland experience.',
    aspects: [
      {
        align: 'left',
        name: 'A scorecards for your team leaders',
        description: `Allow your managers to visualize the impact of customer experience on key growth metrics (repeat purchases, referrals, spend).`,
        figure: def(() => import('./figures/TeamHeroScorecard.vue')),
        aspects: [
          {
            name: 'Compare Performance',
            description:
              'See which people and teams are doing the best work for your customers.',
          },
          {
            name: 'Incentivize',
            description:
              'With the scoreboard, incentivize your team to create \'disney-like\' experiences and delight customers.',
          },
          {
            name: 'Pinpoint Problems',
            description:
              'Use Kaption CX analytics to see touch points that can be improved.',
          },
        ],
      },
    ],
  }),

  new FeaturePage({
    key: 'surveys',

    class: 'text-primary-500',
    bgClass: 'text-primary-50',

    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>`,
    name: 'Build Custom Surveys',
    heading: 'Craft beautiful custom surveys',
    category: 'feedback',
    tagline: 'Hear From Every Customer',
    figure: def(() => import('./figures/SplashFigure.vue')),

    description:
      'Bring the voice of the customer to your decision-making with on-site and external Surveys.',
    aspects: [
      {
        align: 'wide',
        name: 'Do Customer Development Right',
        description: `Build and deliver actionable customer surveys for a variety of different use cases.`,
        aspects: [
          {
            name: 'Survey-lytics',
            description:
              'Get new ideas and insights by combining analytics with user feedback. ',
            figure: def(() => import('./figures/SurveyAspectResults.vue')),
          },
          {
            name: 'Data Advantage',
            description:
              'Create an advantage by combining qualitative and quantitative data.',
            figure: def(() => import('./figures/SurveyAspectData.vue')),
          },
          {
            name: 'Insights = Growth',
            description:
              'Learn more about what customers value and how they see your pricing',
            figure: def(() => import('./figures/SurveyAspectInsights.vue')),
          },
        ],
      },
      {
        align: 'left',
        name: 'Qualitative Meets Quantitative',
        description: `Kaption combines user feedback with analytics and replays. The best way to tie user feedback with their specific actions.`,
        figure: def(() => import('./figures/SurveyUnite.vue')),

        aspects: [
          {
            name: 'The Full Story',
            description:
              'Combine all sorts of data to create a holistic view of the customer journey.',
          },
          {
            name: 'Proactive',
            description:
              'Don\'t wait for issues to be brought up by customers. Catch things early with in product feedback or surveys.',
          },
          {
            name: 'Know What\'s Missing',
            description:
              'Uncover trends, patterns and key drivers of customer loyalty with predictive intelligence. Focus on the areas that will maximize impact.',
          },
        ],
      },
    ],
  }),
  new FeaturePage({
    key: 'replay',

    class: 'text-orange-500',
    bgClass: 'text-orange-50',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,

    name: 'Session Replay',
    tagline: 'See what your users see',
    description:
      'See where users get stuck, increase conversion rates, and debug your product faster with smart metadata.',
    figure: def(() => import('./figures/SplashFigure.vue')),

    category: 'analytics',
    aspects: [
      {
        align: 'wide',
        tagline: 'Qualitative Analytics',
        name: 'Qualitative Meets Quantitative',
        description: `Kaption combines detailed data analytics along with qualitative tools to give you the best of both worlds.`,
        figure: def(() => import('./ui-analytics/ReplayFig.vue')),
      },
      {
        align: 'wide',
        tagline: 'Qualitative Analytics',
        name: 'See with New Eyes',
        description: `Your visitors experience your site with new eyes. Watch session replays to visualize how they absorb your content, where they get stuck, and thus where you can improve...`,
        figure: def(() => import('./ui-analytics/ReplayMouse.vue')),
      },
      {
        align: 'wide',
        tagline: 'Powerful Data At Your Fingertips',
        name: 'Focus Your (Recording) Efforts',
        description: `With Kaption, you only record the sessions that you feel are interesting to your business. For example, record when a conversion happens or if a user hits an error.`,
        figure: def(() => import('./ui-analytics/ReplaySettings.vue')),
      },
    ],
  }),
  new FeaturePage({
    key: 'behavior',

    class: 'text-green-500',
    bgClass: 'text-green-50',

    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12.97 10.987a.989.989 0 00-.202-1.104L9.403 6.518l1.924-1.923a.962.962 0 00-.481-1.616C7.516 1.662 5.568 1.183 1.94.777c-.343-.039-.675.02-.91.254-.233.234-.264.593-.253.91.128 3.752.619 5.7 2.202 8.905a.962.962 0 001.616.442l1.923-1.923 3.447 3.447a.884.884 0 00.93.204v0a3.535 3.535 0 002.003-1.868l.072-.161z"></path></g></svg>`,
    name: 'Behavioral Analytics',
    tagline: 'Track every interaction',
    figure: def(() => import('./figures/SplashFigure.vue')),
    category: 'analytics',
    description:
      'Use behavioral data, like scrolls and clicks, to enhance traditional metrics like bounce rate and time on site.',
    aspects: [
      {
        align: 'wide',
        tagline: 'High Resolution Analytics',
        name: 'Understand what performs and what doesn\'t..',
        description: `Traditional metrics, like bounce rate, don't give you the full story.
          Kaption tracks and aggregates every interaction on your site to help you see what creates engagement and leads to conversion.`,
        figure: def(() => import('./ui-analytics/AnalyticsBehaviorFigure.vue')),
      },
      {
        align: 'wide',
        tagline: 'Depth of Engagement',
        name: 'See how visitors are engaging.',
        description: `Use metrics like scroll depth or touches per page to see if users are really reading your material. As you optimize, see the results improve over time.`,
        figure: def(() => import('./ui-analytics/AnalyticsBehaviorEngage.vue')),
      },
    ],
  }),

  new FeaturePage({
    key: 'conversion',

    class: 'text-blue-600',
    bgClass: 'bg-blue-100',
    icon: `<svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path d="M3.059 9.12342C4.32337 9.23411 5.64301 9.37262 7.00004 9.37262C8.35707 9.37262 9.6767 9.23412 10.9411 9.12342C11.4642 9.07763 11.8703 8.64163 11.8703 8.1165V2.43945C11.8703 1.91432 11.4642 1.47832 10.9411 1.43253C9.6767 1.32184 8.35707 1.18333 7.00004 1.18333C5.64301 1.18333 4.32337 1.32184 3.059 1.43253C2.53588 1.47832 2.12976 1.91432 2.12976 2.43945V8.1165C2.12976 8.64163 2.53588 9.07763 3.059 9.12342Z" fill="" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path><path d="M2.12976 12.8167L2.12976 3.09561" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`,

    name: 'Conversion Tracking',
    tagline: 'Measure custom data',
    description:
      'Easily create events and goals to track and visualize macro and micro conversions',
    figure: def(() => import('./figures/SplashFigure.vue')),

    category: 'analytics',
    aspects: [
      {
        align: 'wide',
        tagline: 'Real time conversion measurement',
        name: 'Turn conversion into a science',
        description: `Fully quantify your customer acquisition costs with advanced, yet simple, conversion measurement tools.`,
        figure: def(
          () => import('./ui-analytics/AnalyticsConversionTools.vue'),
        ),
      },
      {
        align: 'wide',
        tagline: 'Light-weight testing and results',
        name: 'Macro vs Micro',
        description: `Break goals into macro or micro conversions and weight your results accordingly. Create a formula for your traffic investments.`,
        figure: def(
          () => import('./ui-analytics/AnalyticsConversionMicroMacro.vue'),
        ),
      },
    ],
  }),
  new FeaturePage({
    key: 'heatmaps',

    class: 'text-red-500',
    bgClass: 'text-red-50',
    icon: `<svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path d="M1.63819 12.7433C2.03129 12.6731 2.43418 12.5221 2.86393 12.3846C3.50614 12.1791 4.14822 11.9462 4.74101 11.7964C4.8881 11.7593 5.04194 11.762 5.18939 11.7977L9.09204 12.7434C9.74536 12.8864 10.3932 12.6163 11.1173 12.3846C11.5645 12.2415 12.0115 12.0852 12.4419 11.9528C12.8911 11.8147 13.2187 11.4085 13.2187 10.9386V2.58094C13.2187 2.11103 12.8855 1.70698 12.4174 1.74757C11.8969 1.79269 11.3403 1.92721 10.9436 2.02964C10.4706 2.15176 9.92689 2.40431 9.39833 2.64088C9.19999 2.72965 8.97781 2.74844 8.76663 2.69726L4.96532 1.77612C4.312 1.63314 3.30748 1.87025 2.69014 2.02964C2.30452 2.12921 1.87187 2.31548 1.43874 2.50911C1.07473 2.67183 0.838623 3.03423 0.838623 3.43296V11.9386C0.838623 12.4085 1.1756 12.8259 1.63819 12.7433Z" fill="" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path><path d="M9.08524 12.7417L5.18937 11.7977C5.11574 11.7798 5.04052 11.7702 4.96533 11.7697V1.90305C4.96533 1.86088 4.96795 1.81912 4.97307 1.778L8.76661 2.69726C8.87377 2.72323 8.98376 2.73118 9.09203 2.72112V12.6239C9.09203 12.6635 9.08973 12.7029 9.08524 12.7417Z" fill="" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></g></svg>`,

    name: 'Live Heatmaps',
    tagline: 'Visualize user behavior',
    description:
      'View the interaction heatmap across your website in real time. See how elements change people\'s behavior.',
    figure: def(() => import('./figures/SplashFigure.vue')),

    category: 'analytics',
    aspects: [
      {
        align: 'wide',
        tagline: 'On-Demand Live Heatmaps',

        name: `Data meets context.`,
        description: `Bring together the qualitative and quantitative. Use heatmaps to add context and meaning to your data.`,
        figure: def(() => import('./ui-analytics/AnalyticsHeatmapFigure.vue')),
      },
      {
        align: 'wide',
        tagline: 'Filter and Control Heatmap Data',
        name: 'Custom Heatmaps in Realtime',
        description: `Use analytics filters, date controls and other tools to visualize how different segments of traffic behave over time.`,
        figure: def(
          () => import('./ui-analytics/AnalyticsHeatmapRealtime.vue'),
        ),
      },
    ],
  }),
  new FeaturePage({
    key: 'performance',

    class: 'text-green-500',
    bgClass: 'bg-green-50',

    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>`,
    name: 'Debugging',
    tagline: 'Detect errors and slowdowns',
    figure: def(() => import('./figures/SplashFigure.vue')),

    description:
      'Kaption triggers events on errors and tracks your website vitals over time',
    category: 'analytics',
    aspects: [
      {
        align: 'wide',
        tagline: 'Debugging Made Simple',
        name: 'Debugging is a headache without visualization.',
        description: `JavaScript errors can be hard to reproduce, as often they are specific to an environment. Use Kaption to isolate identify where errors are happening and their root cause.`,

        figure: def(
          () => import('./ui-analytics/AnalyticsPerformanceErrors.vue'),
        ),
      },
    ],
  }),
  new FeaturePage({
    key: 'realtime',

    class: 'text-orange-500',
    bgClass: 'text-orange-50',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
</svg>`,

    name: 'Real-time Data',
    tagline: 'Learn faster, move faster.',
    description:
      'Proactively monitor your user experience, find issues before they cost you revenue and improve fast.',
    figure: def(() => import('./figures/SplashFigure.vue')),

    category: 'analytics',
    aspects: [
      {
        align: 'wide',
        tagline: 'Smart performance monitoring',
        name: 'Watch your performance, as it happens...',
        description: `Create smart realtime dashboards to use in the office or to see the results of marketing efforts.`,
        figure: def(
          () => import('./ui-analytics/AnalyticsRealtimePerformance.vue'),
        ),
      },
      {
        align: 'wide',
        tagline: 'Fix problems fast',
        name: 'Smart Verification and Monitoring',
        description: `Sure everything is working correctly? Use custom realtime dashboards to watch exactly the metrics important to you, in real time.`,
        figure: def(
          () => import('./ui-analytics/AnalyticsRealtimeMonitoring.vue'),
        ),
      },
    ],
  }),
]

export type FeaturePageKeysUnion = FeaturePageKeysUtility<typeof featureList>

export const featureGroups = groupBy<
  Record<FeatureCategory, FeaturePage<string>[]>
>(featureList, 'category')
