import type { ThemeConfig, ThemeConfigArgs } from '@fiction/site'

import type { StockMedia } from '@fiction/ui/stock'
import { cardConfig } from '@fiction/cards/index.js'

type SectionArgs = ThemeConfigArgs & {
  stock: StockMedia
}

export async function getPages(args: SectionArgs) {
  const { stock } = args

  return [
    // Home page
    cardConfig({
      slug: 'welcome',
      isHome: true,
      cards: [
        cardConfig({
          templateId: 'cardOverlaySliderV1',
          userConfig: {
            autoSlide: true,
            items: [
              {
                title: 'Your Primary Headline',
                subTitle: 'Notice how a strong subheadline adds context and depth',
                media: stock.getRandomByTags(['woman']),
                textBlend: 'difference',
              },
              {
                title: 'Memorable First Impressions',
                subTitle: 'Multiple slides help showcase different aspects of your brand',
                media: stock.getRandomByTags(['woman']),
                textBlend: 'difference',
              },
              {
                title: 'Your Brand Position',
                subTitle: 'Use this space to communicate your unique value proposition',
                media: stock.getRandomByTags(['woman']),
                textBlend: 'difference',
              },
            ],
          },
        }),
        cardConfig({
          templateId: 'cardFeaturesV1',
          userConfig: {
            standard: {
              headers: {
                title: 'Core Offerings',
                subTitle: 'Highlight your primary services or specialties here',
                layout: 'left',
              },
            },
            items: [
              {
                title: 'Primary Service',
                description: 'Describe your first key offering here. What problem does it solve? Who is it for? Use 2-3 concise sentences that highlight benefits rather than just features.',
                icon: { iconId: 'briefcase' },
                color: 'blue',
                columns: '2',
              },
              {
                title: 'Secondary Service',
                description: 'Your second offering should complement the first. Notice how these descriptions establish expertise without being overly technical or filled with jargon.',
                icon: { iconId: 'bulb' },
                color: 'emerald',
                columns: '2',
              },
              {
                title: 'Tertiary Service',
                description: 'Complete your service trinity with a third distinct offering. The icon, color, and description work together to create a cohesive yet varied presentation.',
                icon: { iconId: 'users' },
                color: 'indigo',
                columns: '2',
              },
            ],
            style: {
              iconStyle: 'duotone',
            },
          },
        }),
        cardConfig({
          templateId: 'cardHeroV1',
          userConfig: {
            items: [
              {
                layout: 'left',
                title: 'Your Professional Title',
                subTitle: 'This brief professional bio should be approximately 15-25 words. Focus on expertise, location, and scope of service.',
                superTitle: {
                  text: 'Brand Tagline',
                  icon: { iconId: 'star' },
                  theme: 'primary',
                },
                media: stock.getRandomByTags(['woman']),
                action: {
                  buttons: [
                    { label: 'Primary CTA', href: '/work', theme: 'primary' },
                    { label: 'Secondary CTA', href: '/contact' },
                  ],
                },
              },
            ],
          },
        }),

        cardConfig({
          templateId: 'cardMetricsV1',
          userConfig: {
            standard: {
              headers: {
                title: 'Proof Points',
                subTitle: 'Numbers that demonstrate your impact and experience',
              },
            },
            items: [
              { label: 'Key Metric #1', value: 120, format: 'number', description: 'Brief explanation' },
              { label: 'Success Rate', value: 98, format: 'percent', description: 'Client satisfaction' },
              { label: 'Industry Reach', value: 23, description: 'Markets served' },
            ],
          },
        }),
        cardConfig({
          templateId: 'CardParallaxScrollV1',
          userConfig: {
            standard: {
              headers: {
                layout: 'center',
                superTitle: { text: 'Portfolio', icon: { iconId: 'briefcase' }, theme: 'primary' },
                title: 'Featured Projects',
                subTitle: 'See how the parallax effect creates visual interest as you scroll',
              },
            },
            items: [
              {
                title: 'Project One Title',
                content: 'Describe your first featured project. What challenge did it address? What was your approach? What were the results?',
                media: stock.getRandomByTags(['object']),
                parallaxStrength: 0.4,
                action: {
                  buttons: [
                    { label: 'View Details', href: '/work/project-one' },
                  ],
                },
              },
              {
                title: 'Project Two Title',
                content: 'Your second project demonstrates range and versatility. This description should be similar in length but highlight different skills.',
                media: stock.getRandomByTags(['object']),
                parallaxStrength: 0.6,
                action: {
                  buttons: [
                    { label: 'Learn More', href: '/work/project-two' },
                  ],
                },
              },
              {
                title: 'Project Three Title',
                content: 'Complete the showcase with a third distinctive project. Notice how these three together create a compelling narrative about your capabilities.',
                media: stock.getRandomByTags(['object']),
                parallaxStrength: 0.5,
                action: {
                  buttons: [
                    { label: 'Explore Project', href: '/work/project-three' },
                  ],
                },
              },
            ],
          },
        }),
        cardConfig({
          templateId: 'cardPostsListV1',
          userConfig: {
            standard: {
              headers: {
                title: 'Latest Insights',
                subTitle: 'Share your expertise through regular content updates',
              },
            },
            posts: {
              viewSlug: 'blog',
            },
          },

        }),

      ],
    }),

    // Work/Projects page
    cardConfig({
      slug: 'work',
      cards: [
        cardConfig({
          templateId: 'cardHeroV1',
          userConfig: {
            items: [
              {
                title: 'Portfolio',
                subTitle: 'A curated collection of projects demonstrating your expertise and approach across different contexts',
                superTitle: {
                  text: 'Selected Works',
                  icon: { iconId: 'briefcase' },
                  theme: 'primary',
                },
                media: stock.getRandomByTags(['aspect:wide']),
                action: {
                  buttons: [
                    { label: 'View Projects', href: '#featured', theme: 'primary' },
                    { label: 'Client Work', href: '#consulting' },
                  ],
                },
              },
            ],
          },
        }),
        cardConfig({
          templateId: 'cardBentoV1',
          userConfig: {
            items: [
              {
                superTitle: { text: 'Featured Project', theme: 'blue' },
                title: 'Primary Project Name',
                content: 'Notice how this featured project gets more space. Use this for your most impressive or recent work.',
                bg: stock.getRandomByTags(['object']),
                cols: 6,
                rows: 2,
                theme: 'blue',
                verticalPosition: 'top',
                action: {
                  buttons: [{ label: 'View Project', href: '/work/project-one' }],
                },
              },
              {
                title: 'Secondary Project',
                content: 'Smaller tiles work well for supporting projects. Keep descriptions brief but impactful.',
                bg: stock.getRandomByTags(['object']),
                cols: 3,
                rows: 2,
                theme: 'emerald',
              },
              {
                title: 'Tertiary Project',
                content: 'The bento grid layout allows for visual hierarchy while maintaining a cohesive look.',
                bg: stock.getRandomByTags(['object']),
                cols: 3,
                rows: 2,
                theme: 'violet',
              },
              {
                superTitle: { text: 'Client Work', theme: 'indigo' },
                title: 'Client Project Title',
                content: 'For client work, focus on the challenge and your solution rather than technical details.',
                media: stock.getRandomByTags(['object']),
                cols: 4,
                rows: 3,
                theme: 'indigo',
              },
              {
                title: 'Product Launch',
                content: 'Color coding your projects by type creates an intuitive navigation experience.',
                bg: stock.getRandomByTags(['object']),
                cols: 4,
                rows: 3,
                theme: 'cyan',
              },
              {
                title: 'Featured Presentation',
                content: 'The mix of images and video creates visual interest throughout your portfolio.',
                media: stock.getRandomByTags(['object']),
                verticalPosition: 'top',
                cols: 4,
                rows: 3,
                theme: 'rose',
              },
            ],
          },
        }),
        cardConfig({
          templateId: 'cardPhotoGalleryV1',
          userConfig: {
            standard: {
              headers: {
                title: 'Project Gallery',
                subTitle: 'Visual showcase of work across different contexts',
              },
            },
            items: [
              {
                title: 'Category One',
                content: 'Each gallery item can represent a category of work rather than individual projects.',
                media: stock.getRandomByTags(['object']),
                cols: '2',
                theme: 'blue',
              },
              {
                title: 'Category Two',
                content: 'Consistent styling creates cohesion while different images maintain visual interest.',
                media: stock.getRandomByTags(['object']),
                cols: '2',
                theme: 'emerald',
              },
              {
                title: 'Category Three',
                content: 'The lightbox functionality allows visitors to view full-size images without leaving the page.',
                media: stock.getRandomByTags(['object']),
                cols: '2',
                theme: 'violet',
              },
              {
                title: 'Category Four',
                content: 'Themes can match your brand colors while maintaining a coordinated palette.',
                media: stock.getRandomByTags(['object']),
                cols: '2',
                theme: 'indigo',
              },
              {
                title: 'Category Five',
                content: 'Brief descriptions help visitors understand the context of each visual.',
                media: stock.getRandomByTags(['object']),
                cols: '2',
                theme: 'cyan',
              },
              {
                title: 'Category Six',
                content: 'Six categories create a balanced layout that works well on most screen sizes.',
                media: stock.getRandomByTags(['object']),
                cols: '2',
                theme: 'rose',
              },
            ],
            layout: {
              gapSize: 'md',
              aspectRatio: 'video',
              animation: 'fade',
              showAllText: false,
            },
            lightbox: {
              enabled: true,
              showCaption: true,
            },
          },
        }),
      ],
    }),

    // About/Background page
    cardConfig({
      slug: 'about',
      cards: [
        cardConfig({
          templateId: 'cardStoryV1',
          userConfig: {
            standard: {
              headers: {
                title: 'My Story',
                subTitle: 'How personal experience shaped professional expertise',
              },
            },
            items: [
              {
                title: 'The Beginning',
                content: 'Start with your origin story. What sparked your interest in your field? Share a personal anecdote that connects emotionally with readers while establishing the foundation of your expertise.',
                media: stock.getRandomByTags(['people']),
              },
              {
                title: 'The Development',
                content: 'Describe your professional development. What training, mentorship, or pivotal experiences shaped your approach? This section bridges your beginning with your current professional identity.',
                media: stock.getRandomByTags(['people']),
              },
              {
                title: 'The Approach',
                content: 'Articulate your current philosophy and methodology. How do your experiences inform your work today? This section should connect your past with your present offerings and establish your unique value.',
                media: stock.getRandomByTags(['people']),
              },
            ],
          },
        }), // Career journey
        cardConfig({
          templateId: 'cardTimelineV1',
          userConfig: {
            standard: {
              headers: {
                title: 'Professional Timeline',
                subTitle: 'Key milestones in the evolution of expertise',
              },
            },
            items: [
              {
                title: 'Early Achievement',
                content: 'Describe an early professional milestone that established your foundation in the field',
                date: '2009',
                icon: { iconId: 'plane' },
              },
              {
                title: 'Major Transition',
                content: 'Highlight a pivotal moment that marked growth or a shift in your professional trajectory',
                date: '2012',
                icon: { iconId: 'device-tv' },
              },
              {
                title: 'Industry Recognition',
                content: 'Feature an award, publication, or other recognition that validates your expertise externally',
                date: '2015',
                icon: { iconId: 'award' },
              },
              {
                title: 'Innovation Point',
                content: 'Describe a project or initiative where you created something new or pioneered an approach',
                date: '2018',
                icon: { iconId: 'briefcase' },
              },
              {
                title: 'Current Focus',
                content: 'Share your present professional emphasis, connecting past achievements with future direction',
                date: '2021',
                icon: { iconId: 'bulb' },
              },
            ],
          },
        }), // Experience timeline
        cardConfig({
          templateId: 'cardQuotesV1',
          userConfig: {
            standard: {
              headers: {
                title: 'Client Testimonials',
                subTitle: 'What others say about working with me',
              },
            },
            items: [
              {
                text: 'A compelling testimonial focuses on specific results or experiences rather than generic praise. The quote should sound authentic and conversational.',
                author: {
                  label: 'Client Name',
                  subLabel: 'Professional Title, Company',
                  media: stock.getRandomByTags(['man']),
                },
              },
              {
                text: 'Include testimonials from different client types to demonstrate versatility. Each quote should highlight different aspects of your service or approach.',
                author: {
                  label: 'Client Name',
                  subLabel: 'Position, Organization',
                  media: stock.getRandomByTags(['woman']),
                },
              },
              {
                text: 'The most powerful testimonials address initial client concerns and how you overcame them. This builds trust with potential clients who may have similar hesitations.',
                author: {
                  label: 'Client Name',
                  subLabel: 'Role, Company',
                  media: stock.getRandomByTags(['man']),
                },
              },
            ],
          },
        }), // Testimonials
      ],
    }),

    // Blog/Insights page
    cardConfig({
      slug: 'blog',
      cards: [
        cardConfig({ templateId: 'cardBlogV1' }),
      ],
    }),

  ]
}

export async function getConfig(args: Omit<SectionArgs, 'stock'>): Promise<ThemeConfig> {
  const { factory } = args
  const stock = await factory.getStockMedia()
  const a = { ...args, stock }

  const pages = await getPages(a)

  return {
    pages,
    userConfig: { },
  }
}
