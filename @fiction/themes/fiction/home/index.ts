import type { template as bentoTemplate } from '@fiction/cards/content-bento/index.js'
import type { template as featuresTemplate } from '@fiction/cards/content-features'
import type { template as heroTemplate } from '@fiction/cards/content-hero'
import type { template as marqueeTemplate } from '@fiction/cards/media-marquee/index.js'
import type { template as wrapTemplate } from '@fiction/cards/page-wrap/index.js'
import type { template as logosTemplate } from '@fiction/cards/proof-logos/index'
import type { template as cardStatementTemplate } from '@fiction/cards/slider-statement'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock/index.js'

export async function getHomePage(args: { factory: CardFactory, stock: StockMedia }) {
  const { factory, stock } = args

  return factory.fromTemplate<typeof wrapTemplate>({
    regionId: 'main',
    templateId: 'cardPageWrapV1',
    slug: '_home',
    title: 'Home',
    userConfig: {
      site: {
        title: 'Fiction - Personal Branding Platform',
        description: 'Transform your expertise into influence using Fiction\'s AI-powered personal branding platform. Create authentic content, grow your audience, and build authority - all guided by intelligent automation.',
      },
    },
    cards: [
      await factory.fromTemplate({
        templateId: 'cardPageAreaV1',
        userConfig: { },
        cards: [
          await factory.fromTemplate<typeof bentoTemplate>({
            templateId: 'cardBentoV1',
            userConfig: {
              items: [
                {
                  cols: 12,
                  rows: 3,
                  superTitle: {
                    icon: { class: 'i-tabler-rocket' },
                    text: 'Personal Marketing for Leaders',
                  },
                  title: 'It all begins with your story...',
                  content: 'Fiction is an elite personal marketing engine and content creation platform that helps you build influence.',
                  theme: 'blue',
                  themeMode: 'dark',
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  bg: {
                    ...stock.getRandomByTags(['aspect:landscape']),
                    overlay: { opacity: 0.3 },
                  },
                  action: {
                    buttons: [
                      {
                        label: 'Create Account',
                        href: '/app?_reload=1',
                        theme: 'primary',
                        icon: 'i-tabler-user-circle',
                        design: 'solid',
                        size: 'lg',
                      },
                    ],
                  },
                },
              ],
            },
          }),

          await factory.fromTemplate<typeof cardStatementTemplate>({
            templateId: 'cardStatementSliderV1',
            userConfig: {
              items: [
                {
                  title: 'The Personal Growth Platform',
                  content: 'Fiction is a simple and powerful platform that helps you grow your personal brand. Our AI-powered tools help you create content, grow your audience, and build authority.',
                },
              ],
              standard: {
                background: { },
              },
            },
          }),

          await factory.fromTemplate<typeof marqueeTemplate>({
            templateId: 'cardMarqueeV1',
            userConfig: {

              items: [
                {
                  title: 'Andrew Powers',
                  subTitle: 'Serial Entrepreneur',
                  media: {
                    url: `${new URL('img/andrew.jpg', import.meta.url).href}?blurhash=UbD%2Be.f%2B9an%24~UbIE2aeskaeV%40W%3BM%7BaeoLbb`,
                  },
                  href: 'https://www.andrewpowers.com',
                },

                {
                  title: 'Hugo Rebora',
                  subTitle: 'Podcaster',
                  media: stock.getAssetBySlug('rebora'),
                  href: '#',
                },
                {
                  title: 'Selena Gomez',
                  subTitle: 'Musician',
                  media: {
                    url: new URL('img/selena.jpg', import.meta.url).href,
                  },
                },

                {
                  title: 'Olivia Alani',
                  subTitle: 'Fashion Designer',
                  media: stock.getAssetBySlug('olivia'),
                  href: '#',
                },
                {
                  title: 'Gabriel Torres',
                  subTitle: 'Coach',
                  media: stock.getAssetBySlug('abgcuk'),
                  href: '#',
                },

                {
                  title: 'Barack Obama',
                  subTitle: 'Politician',
                  media: {
                    url: new URL('img/obama.webp', import.meta.url).href,
                  },
                },
                {
                  title: 'Sarah Bands',
                  subTitle: 'Director',
                  media: stock.getAssetBySlug('bands'),
                  href: '#',
                },
                {
                  title: 'Dean Stoecker',
                  subTitle: 'Founder, Alteryx',
                  media: {
                    url: new URL('img/dean2.jpg', import.meta.url).href,
                  },
                },
                {
                  title: 'Joe Rogan',
                  subTitle: 'Comedian / Podcaster',
                  media: {
                    url: new URL('img/rogan.jpg', import.meta.url).href,
                  },
                },
              ],
            },
          }),
          await factory.fromTemplate<typeof featuresTemplate>({
            templateId: 'cardFeaturesV1',
            userConfig: {
              standard: {
                headers: {
                  title: 'Signature Performances',
                  subTitle: 'Curated magical experiences for discerning audiences',
                  layout: 'left',
                },
              },
              items: [
                {
                  title: 'Corporate Illusions',
                  description: 'Elevate your corporate message through sophisticated deception. From product reveals to brand storytelling, we transform business objectives into moments of astonishment.',
                  icon: { iconId: 'briefcase' },
                  color: 'blue',
                  columns: '2',
                },
                {
                  title: 'Creative Direction',
                  description: 'Behind the scenes of television\'s most captivating illusions. Bringing magical authenticity to productions like Netflix\'s "The Magicians" and Broadway\'s "The Prestige".',
                  icon: { iconId: 'bulb' },
                  color: 'emerald',
                  columns: '2',
                },
                {
                  title: 'Private Exhibitions',
                  description: 'Intimate performances crafted for distinguished gatherings. Specializing in high-society events where every detail is an opportunity for wonder.',
                  icon: { iconId: 'users' },
                  color: 'indigo',
                  columns: '2',
                },
              ],
              style: {
                iconStyle: 'solid',
              },
            },
          }),
          await factory.fromTemplate<typeof logosTemplate>({
            templateId: 'cardLogosV1',
            userConfig: {
              items: [
                {
                  label: 'The New York Times',
                  href: 'https://www.nytimes.com/2024/04/05/opinion/ezra-klein-podcast-nilay-patel.html',
                  media: stock.getLocalMedia({ key: 'logoNyt' }),
                },
                {
                  label: 'The Guardian',
                  href: 'https://www.theguardian.com/technology/2022/nov/12/when-ai-can-make-art-what-does-it-mean-for-creativity-dall-e-midjourney',
                  media: stock.getLocalMedia({ key: 'logoGuardian' }),
                },
                {
                  label: 'TechCrunch',
                  href: 'https://techcrunch.com/sponsor/fluency/the-ai-revolution-using-artificial-intelligence-to-unlock-massive-time-savings/',
                  media: stock.getLocalMedia({ key: 'logoTechcrunch' }),
                },
              ],
              label: 'Read About Us In',
            },
          }),
        ],

      }),

    ],
  })
}
