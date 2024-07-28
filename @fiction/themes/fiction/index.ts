import type { FictionEnv, NavItem } from '@fiction/core'
import { Theme, createCard } from '@fiction/site/theme.js'
import { safeDirname } from '@fiction/core'
import { getDemoPages } from '@fiction/cards'
import type { FictionStripe } from '@fiction/plugin-stripe/plugin.js'
import { templates } from './templates.js'
import * as home from './home/index.js'
import * as tour from './tour/index.js'
import * as about from './about/index.js'
import * as developer from './developer/index.js'
import * as pricing from './pricing/index.js'
import * as affiliate from './affiliate/index.js'
import favicon from './img/favicon.svg'
import shareImage from './img/share-image.jpg'

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
      const pages = await Promise.all([
        home.page(args),
        tour.page(),
        about.page(),
        developer.page(),
        pricing.page({ fictionStripe }),
        affiliate.page(),
        ...demoPages,
      ])

      return {
        userConfig: {
          branding: {
            shareImage: { url: shareImage, format: 'url' },
            favicon: { url: favicon, format: 'url' },
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
          hidden: createCard({
            templates,
            cards: [
              createCard({ templates, templateId: 'mediaPop', userConfig: { } }),
            ],
          }),
          header: createCard({
            templates,
            cards: [
              createCard({
                templates,
                templateId: 'nav',
                userConfig: {
                  layout: 'navCenter',
                  logo: {
                    format: 'html',
                    html: `<svg class="min-w-24" xmlns="http://www.w3.org/2000/svg" fill="none" class="main-logo" viewBox="0 0 488 122"><path fill="currentColor" d="M271.21 72.237c-3.274-4.608-9.163-6.71-14.4-6.71-10.74 0-18.2 10.199-18.2 21.248 0 8.805 5.364 13.976 13.488 13.976 6.136-.179 12.058-2.383 16.889-6.29l1.837 17.051c-6.282 5.453-17.022 7.823-24.748 7.823-16.363 0-28.147-11.6-28.147-29.236 0-23.48 16.662-42.49 39.014-42.49 6.415 0 15.172 1.958 19.876 7.267l-5.609 17.36ZM305.105 48.895h14.347l-2.841 17.197h-14.214c-1.49 9.367-4.165 19.71-4.165 29.235 0 4.052 1.896 5.302 5.549 5.302a17.22 17.22 0 0 0 6.501-1.257l-1.663 17.746a62.655 62.655 0 0 1-15.298 2.238c-10.7 0-17.062-5.033-17.062-16.495 0-12.156 3.247-25.012 4.997-36.762l2.669-17.197h.04l1.351-8.667c.212-1.854.306-3.722.266-5.59a30.2 30.2 0 0 0-.266-4.299h20.981c.306 1.504.439 3.042.392 4.58a39.917 39.917 0 0 1-.539 6.298l-1.045 7.671ZM318.767 117.797a17.31 17.31 0 0 1-.539-4.889c.007-2.019.186-4.032.539-6.016l7.174-47.936c.252-1.902.392-3.818.405-5.734a29.855 29.855 0 0 0-.272-4.3h20.994a19.94 19.94 0 0 1 .406 4.616 39.674 39.674 0 0 1-.539 6.284l-7.173 47.935a39.283 39.283 0 0 0-.406 5.158 24.997 24.997 0 0 0 .406 4.889l-20.995-.007Zm20.416-76.593c-5.69 0-10.288-3.352-10.288-9.65 0-8.11 6.222-13.837 13.947-13.837 5.836 0 10.288 3.35 10.288 9.642.033 7.98-6.202 13.845-13.947 13.845ZM378.151 119.336c-16.456 0-29.159-10.198-29.159-29.07 0-24.318 16.835-42.62 39.593-42.62 16.582 0 29.159 10.322 29.159 29.235.02 24.263-16.689 42.455-39.593 42.455Zm7.839-53.814c-10.541 0-16.583 11.18-16.583 21.495 0 7.823 3.859 13.694 11.439 13.694 10.54 0 16.582-11.18 16.582-21.495.027-7.822-3.833-13.694-11.412-13.694h-.026ZM461.596 117.798a17.498 17.498 0 0 1-.539-4.89c.006-2.019.186-4.031.539-6.016l3.793-25.011c.419-2.267.645-4.567.672-6.882 0-5.734-2.17-8.941-7.992-8.941-9.476 0-12.59 9.36-13.814 17.615l-5.284 34.104H417.85l8.964-58.525c.252-1.998.386-4.004.399-6.016a29.994 29.994 0 0 0-.266-4.299h20.828a20.02 20.02 0 0 1 .406 4.622 40.605 40.605 0 0 1-.406 5.157h.133c4.877-6.71 12.057-11.043 20.322-11.043 13.262 0 19.77 6.573 19.77 20.122a56.034 56.034 0 0 1-.832 9.498l-4.744 30.472a39.268 39.268 0 0 0-.406 5.157 25.123 25.123 0 0 0 .406 4.897l-20.828-.021ZM181.593 47.795c1.125-6.813 1.837-12.574 9.968-13.776 3.015-.357 4.146-.488 6.987-.144l3.747-18.02c-4.585-.804-9.443-.68-13.548-.282-20.542 1.998-26.232 14.243-29.04 32.208H149.06l-2.149 17.828h10.134s-6.042 34.558-6.448 37.051c-.406 2.493-2.841 16.159-2.841 16.159l21.846-.316s-.373.138.752-7.107l8.158-45.766h14.859l-6.221 39.228c-.426 2.458-1.444 13.453-1.444 13.453l20.914-.158c.14-4.965.3-6.249.725-10.397.426-4.155 5.477-31.426 5.477-31.426.798-5.171 2.023-12.74 3.114-18.783.992-5.5.439-9.738.439-9.738h-34.782v-.014ZM101.983 122H50.804c-3.32 0-6.448-1.332-8.797-3.763L3.014 77.986C.065 74.95-.807 70.41.784 66.44c1.597-3.976 5.317-6.551 9.49-6.551h47.784V10.574c0-4.292 2.488-8.131 6.335-9.78 3.786-1.627 8.298-.7 11.192 2.287L114.6 43.346c2.349 2.438 3.64 5.659 3.64 9.079v52.804c-.006 9.251-7.293 16.771-16.256 16.771Zm-49.036-18.144h47.712v-49.24l-25.02-25.822v49.24H27.926l25.02 25.822Z"/></svg>`,
                  },
                  navA: [
                    { name: 'Tour', href: '/tour' },
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
                            { name: 'Features', href: '/demo-features' },
                            { name: 'FAQ / List', href: '/demo-faq' },
                            { name: 'Trek', href: '/demo-trek' },
                          ],
                        },
                        {
                          name: 'Portfolio',
                          items: [
                            { name: 'Showcase', href: '/demo-showcase' },
                            { name: 'Cinema', href: '/demo-cinema' },
                            { name: 'Marquee', href: '/demo-marquee' },
                            { name: 'Logos', href: '/demo-logos' },
                            { name: 'Metrics', href: '/demo-metrics' },
                          ],
                        },
                        {
                          name: 'Structure',
                          items: [
                            { name: 'Nav', href: '/demo-nav' },
                            { name: 'Footer', href: '/demo-footer' },
                            { name: 'Maps', href: '/demo-maps' },
                            { name: 'Area', href: '/demo-area' },
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
          footer: createCard({
            templates,
            cards: [
              createCard({
                templates,
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
