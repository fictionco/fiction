import process from 'node:process'
import { defineConfig } from 'vitepress'

const commitRef = process.env.COMMIT_REF?.slice(0, 8) || 'dev'

const resources = [
  { text: 'Team', link: '/team' },
  { text: 'Support', link: '/resources/support' },
  { text: 'Privacy Policy', link: '/resources/privacy' },
  { text: 'Terms of Service', link: '/resources/terms' },
  { text: 'Discord Chat', link: 'https://discord.gg/e5wNxdDW8u' },
  { text: 'GitHub Discussions', link: 'https://github.com/fictionco/fiction/discussions' },
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    ],
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    ],
    [
      'link',
      { href: 'https://fonts.googleapis.com/css2?family=Poppins&display=swap', rel: 'stylesheet' },
    ],
  ],
  lang: 'en-US',
  title: 'Fiction Docs',
  description: 'Documentation for Fiction marketing platform and content development system',
  themeConfig: {

    logo: { light: '/logo-light.svg', dark: '/logo-dark.svg', alt: 'Fiction Icon' },
    siteTitle: false,
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'User Guide', link: '/guide/introduction' },
      { text: 'Resources', items: [...resources] },
      { text: 'Fiction Homepage', link: 'https://www.fiction.com', target: '_self' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
          ],
        },
      ],
      '/resources/': [
        {
          text: 'Resources',
          items: [
            ...resources,
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/fictionco/fiction' },
    ],

    footer: {
      message: `Released under the GPLv2 License. (${commitRef})`,
      copyright: 'Copyright © 2023-present Fiction.com',
    },

    search: {
      provider: 'local',
    },
  },
})
