import type { FictionEnv, NavItem } from '@fiction/core'
import type { FictionStripe } from '@fiction/plugin-stripe/plugin.js'
import { getCardTemplates, getDemoPages } from '@fiction/cards'
import { safeDirname } from '@fiction/core'
import { CardFactory } from '@fiction/site/cardFactory.js'
import { Theme } from '@fiction/site/theme.js'
import favicon from '@fiction/ui/brand/favicon.svg'
import FictionLogo from '@fiction/ui/brand/FictionLogo.vue'
import icon from '@fiction/ui/brand/icon.png'
import shareImage from '@fiction/ui/brand/shareImage.png'
import * as about from './about/index.js'
import * as affiliate from './affiliate/index.js'
import * as developer from './developer/index.js'
import * as home from './home/index.js'
import * as pricing from './pricing/index.js'
import { templates } from './templates.js'
import * as tour from './tour/index.js'

const socials: NavItem[] = [
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/company/fictionco',
    target: '_blank',
    name: 'LinkedIn',
    icon: `linkedin`,
  },
  {
    key: 'github',
    href: 'https://github.com/fictionco',
    target: '_blank',
    name: 'Github',
    icon: `github`,
  },
  {
    key: 'x',
    href: 'https://www.x.com/fictionplatform',
    target: '_blank',
    name: 'X',
    icon: 'x',
  },
]

export async function getFactory() {
  const templates = await getCardTemplates()
  return new CardFactory({ templates })
}

export async function setup(args: { fictionEnv: FictionEnv, fictionStripe?: FictionStripe }) {
  const { fictionEnv, fictionStripe } = args

  const domain = fictionEnv.meta.app?.domain || 'fiction.com'
  return new Theme({
    fictionEnv,
    root: safeDirname(import.meta.url),
    themeId: 'fiction',
    title: 'Fiction',
    description: 'Fiction\'s actual website',
    screenshot: new URL('./img/screenshot.jpg', import.meta.url).href,
    version: '1.0.0',
    templates,
    isPublic: false,
    userConfig: {},
    getConfig: async (args) => {
      const { site } = args

      const demoPages = await getDemoPages({ templates, fictionEnv, site })

      const factory = await getFactory()
      const tourPage = await tour.getPage({ factory })
      const pages = await Promise.all([
        home.page(args),
        tourPage,
        about.page(),
        developer.page(),
        pricing.page({ fictionStripe }),
        affiliate.page(),
        ...demoPages,
      ])

      return {
        userConfig: {
          branding: {
            shareImage: { url: shareImage, format: 'image' },
            favicon: { url: favicon, format: 'image' },
            icon: { url: icon, format: 'image' },
          },
          seo: {
            titleTemplate: `{{pageTitle}} - Fiction`,
          },
          customCode: { gtmContainerId: `GTM-5LQBZDJ` },
          styling: {
            buttons: {
              design: 'ghost',
              rounding: 'full',
              hover: 'pop',
            },
          },
        },
        pages,
        sections: {
          hidden: await factory.create({
            cards: [
              await factory.create({ templateId: 'mediaPop', userConfig: { } }),
              await factory.create({ templateId: 'textEffects', userConfig: { } }),
            ],
          }),
          header: await factory.create({
            cards: [
              await factory.create({
                templateId: 'nav',
                userConfig: {
                  layout: 'navCenter',
                  logo: {
                    format: 'component',
                    el: FictionLogo,
                  },
                  navA: [
                    { name: 'Why Fiction', href: '/tour' },
                    { name: 'About', href: '/about' },
                    {
                      name: 'Web Elements',
                      desc: 'Professional components for your website',
                      subStyle: 'mega',
                      items: [
                        {
                          name: 'Content',
                          items: [
                            { name: 'Statement', href: '/demo-statement' },
                            { name: 'Tour', href: '/demo-tour' },
                            { name: 'Hero', href: '/demo-hero' },

                            { name: 'Trek', href: '/demo-trek' },
                            { name: 'Testimonials', href: '/demo-testimonials' },
                            { name: 'Hitlist', href: '/demo-hitlist' },
                          ],
                        },
                        {
                          name: 'Portfolio',
                          items: [
                            { name: 'Gallery', href: '/demo-gallery' },
                            { name: 'Showcase', href: '/demo-showcase' },
                            { name: 'Cinema', href: '/demo-cinema' },
                            { name: 'Marquee', href: '/demo-marquee' },
                            { name: 'Logos', href: '/demo-logos' },
                            { name: 'Metrics', href: '/demo-metrics' },
                          ],
                        },
                        {
                          name: 'Site',
                          items: [
                            { name: 'Nav', href: '/demo-nav' },
                            { name: 'Footer', href: '/demo-footer' },
                            { name: 'Maps', href: '/demo-maps' },
                            { name: 'Area', href: '/demo-area' },
                            { name: 'Contact', href: '/demo-contact' },
                          ],
                        },
                        {
                          name: 'Typography',
                          items: [
                            { name: 'Ticker', href: '/demo-ticker' },
                            { name: 'Fit Text', href: '/demo-fitText' },
                            { name: 'Quotes', href: '/demo-quotes' },

                          ],
                        },
                        {
                          name: 'Posts',
                          items: [
                            { name: 'Magazine', href: '/demo-magazine' },
                          ],
                        },
                        {
                          name: 'Profile',
                          items: [
                            { name: 'Over Slide', href: '/demo-overSlide' },
                            { name: 'Profile', href: '/demo-profile' },
                            { name: 'Story', href: '/demo-story' },
                          ],
                        },
                        {
                          name: 'More',
                          items: [
                            { name: 'Capture', href: '/demo-capture' },
                            { name: 'Pricing', href: '/demo-pricing' },
                            { name: 'People', href: '/demo-people' },
                            { name: 'Features', href: '/demo-features' },
                            { name: 'FAQ / List', href: '/demo-faq' },
                          ],
                        },
                        {
                          name: 'Standard UI',
                          items: [
                            { name: 'Buttons', href: '/demo-xbutton' },
                            { name: 'Inputs', href: '/demo-xinput' },
                            { name: 'Media', href: '/demo-xmedia' },
                            { name: 'Logo', href: '/demo-xlogo' },
                          ],
                        },
                      ],
                    },
                  ],
                  navB: [
                    { name: 'Account', href: '/app?_reload=1', itemStyle: 'user', items: [
                      { name: 'Sign In', href: '/app/auth/login?_reload=1', authState: 'loggedOut' },
                      { name: 'Dashboard', href: '/app?_reload=1', authState: 'loggedIn' },
                    ] },
                  ],

                },
              }),
            ],
          }),
          footer: await factory.create({
            cards: [
              await factory.create({
                templateId: 'footer',
                userConfig: {
                  logo: {
                    format: 'html',
                    html: `<svg width="50px" height="50px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34.5005 41H17.187C16.0637 41 15.0057 40.5523 14.211 39.7352L1.01935 26.2084C0.0221016 25.1882 -0.272797 23.6627 0.265224 22.3287C0.805496 20.9924 2.06388 20.1269 3.47534 20.1269H19.6407V3.55352C19.6407 2.11105 20.4827 0.820906 21.7838 0.266998C23.0647 -0.279986 24.591 0.0315868 25.5702 1.03554L38.7686 14.5671C39.5633 15.3864 40 16.4688 40 17.6182V35.364C39.9977 38.4728 37.5328 41 34.5005 41ZM17.9119 34.9024H34.0525V18.3544L25.5882 9.67651V26.2245H9.4476L17.9119 34.9024Z" fill="currentColor" /></svg>`,
                  },
                  tagline: 'The Personal Marketing Platform',
                  starline: 'Join 1000s of Happy Customers',
                  nav: [
                    {
                      name: 'Explore',
                      items: [
                        { href: '/tour', name: 'Tour' },
                        { href: '/pricing', name: 'Pricing' },
                        { href: '/developer', name: 'Developer' },
                      ],
                    },
                    {
                      name: 'Company',
                      items: [
                        { href: '/about', name: 'About' },
                        { href: '/affiliate', name: 'Affiliate' },
                      ],
                    },
                    {
                      name: 'Using Fiction',
                      items: [
                        { href: `https://docs.${domain}`, name: 'Docs', target: '_blank' },
                        { href: `https://docs.${domain}/resources/support.html`, name: 'Support', target: '_blank' },
                        { href: '/app?_reload=1', name: 'Dashboard' },
                      ],
                    },
                  ],
                  legal: {
                    privacyPolicyUrl: `https://docs.${domain}/resources/privacy.html`,
                    termsOfServiceUrl: `https://docs.${domain}/resources/terms.html`,
                    copyrightText: `Fiction, Inc.`,
                  },
                  socials,
                  badges: [
                    {
                      href: 'https://stripe.com/partners',
                      target: '_blank',
                      name: 'Stripe Verified Partner',
                      media: {
                        format: 'html',
                        html: `<svg  width="174"  height="28" xmlns="http://www.w3.org/2000/svg" ><g fill="none" fill-rule="evenodd">   <rect     width="173"     height="27"     x=".5"     y=".5"     stroke="currentColor"     opacity=".5"     rx="6"   />   <path     fill="currentColor"     d="M79.79 11.12L77.1 18h-1.44l-2.7-6.88h1.71l1.71 4.63 1.71-4.63h1.7zm.78 6.88v-6.88h4.34v1.36h-2.67v1.37h2.28v1.31h-2.28v1.48h2.75V18h-4.42zm7.34-5.56v1.82h.76c.57 0 .98-.39.98-.91 0-.54-.41-.91-.98-.91h-.76zM86.28 18v-6.88h2.61c1.42 0 2.43.92 2.43 2.23 0 .89-.47 1.61-1.26 1.99L91.59 18h-1.78l-1.34-2.43h-.56V18h-1.63zm6.4 0v-6.88h1.67V18h-1.67zm3.31 0v-6.88h4.34v1.36h-2.67v1.63h2.28v1.36h-2.28V18h-1.67zm5.47 0v-6.88h1.67V18h-1.67zm3.31 0v-6.88h4.34v1.36h-2.67v1.37h2.28v1.31h-2.28v1.48h2.75V18h-4.42zm5.71 0v-6.88h2.73c1.99 0 3.4 1.43 3.4 3.44S115.2 18 113.21 18h-2.73zm1.67-5.52v4.16h.98c1.05 0 1.78-.85 1.78-2.08s-.73-2.08-1.78-2.08h-.98zm8.17 5.52v-6.88h2.65c1.44 0 2.46.94 2.46 2.27s-1.02 2.25-2.46 2.25h-1.02V18h-1.63zm1.63-5.56v1.89h.8c.59 0 1.02-.39 1.02-.94 0-.57-.43-.95-1.02-.95h-.8zm3.12 5.56l2.7-6.88h1.44L131.9 18h-1.62l-.53-1.42h-2.53L126.7 18h-1.63zm3.42-4.87l-.81 2.21h1.61l-.8-2.21zm5.82-.69v1.82h.76c.57 0 .98-.39.98-.91 0-.54-.41-.91-.98-.91h-.76zM132.68 18v-6.88h2.61c1.42 0 2.43.92 2.43 2.23 0 .89-.47 1.61-1.26 1.99l1.53 2.66h-1.78l-1.34-2.43h-.56V18h-1.63zm7.64 0v-5.52h-1.99v-1.36h5.63v1.36h-1.98V18h-1.66zm4.7 0v-6.88h1.44l3.1 4.24v-4.24h1.55V18h-1.44l-3.09-4.24V18h-1.56zm7.73 0v-6.88h4.34v1.36h-2.67v1.37h2.28v1.31h-2.28v1.48h2.75V18h-4.42zm7.34-5.56v1.82h.76c.57 0 .98-.39.98-.91 0-.54-.41-.91-.98-.91h-.76zM158.46 18v-6.88h2.61c1.42 0 2.43.92 2.43 2.23 0 .89-.47 1.61-1.26 1.99l1.53 2.66h-1.78l-1.34-2.43h-.56V18h-1.63zM51 10.068L65 7v10.935L51 21V10.068zm5.323 6.469a.778.778 0 001.07-.004l3.814-3.664a.726.726 0 000-1.048.778.778 0 00-1.078 0l-3.27 3.129-.986-.9a.778.778 0 00-1.078 0 .726.726 0 000 1.048l1.528 1.439zM42.97 15.07h-4.428c.1 1.093.877 1.415 1.759 1.415.899 0 1.606-.194 2.223-.516v1.88c-.615.351-1.427.605-2.508.605-2.204 0-3.748-1.423-3.748-4.237 0-2.376 1.31-4.263 3.462-4.263 2.15 0 3.27 1.886 3.27 4.276 0 .225-.02.714-.03.84zm-3.254-3.214c-.566 0-1.195.44-1.195 1.492h2.34c0-1.05-.59-1.492-1.145-1.492zm-7.037 6.598c-.791 0-1.275-.345-1.6-.59l-.005 2.64-2.262.496-.001-10.89h1.992l.118.576a2.495 2.495 0 011.773-.732c1.588 0 3.085 1.476 3.085 4.192 0 2.965-1.48 4.308-3.1 4.308zm-.526-6.434c-.52 0-.845.196-1.08.463l.013 3.467c.219.245.536.443 1.067.443.836 0 1.397-.94 1.397-2.196 0-1.22-.57-2.177-1.397-2.177zm-6.538-1.91h2.271v8.177h-2.27v-8.178zm0-2.612L27.885 7v1.9l-2.27.498v-1.9zm-2.346 5.245v5.544h-2.262v-8.178h1.956l.143.69c.529-1.004 1.587-.8 1.888-.69v2.145c-.288-.096-1.19-.235-1.725.489zm-4.775 2.675c0 1.375 1.427.947 1.717.827v1.9c-.301.17-.848.309-1.588.309-1.343 0-2.35-1.02-2.35-2.401l.01-7.486 2.209-.484.002 2.026h1.718v1.99h-1.718v3.319zm-2.746.398c0 1.68-1.296 2.638-3.178 2.638a6.11 6.11 0 01-2.474-.53v-2.227c.76.426 1.727.745 2.477.745.504 0 .868-.14.868-.57 0-1.115-3.44-.695-3.44-3.278 0-1.652 1.224-2.64 3.059-2.64.75 0 1.499.119 2.248.427v2.197c-.688-.383-1.562-.6-2.25-.6-.474 0-.769.14-.769.505 0 1.05 3.46.551 3.46 3.333z"/></g></svg>`,
                      },
                    },
                  ],
                },
              }),
            ],
          }),
        },
      }
    },

  })
}
