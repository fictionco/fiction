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
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],
  lang: 'en-US',
  title: 'Fiction Docs',
  description: 'Documentation for Fiction marketing platform and content development system',
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Fiction Docs',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'User Guide', link: '/guide/introduction' },
      { text: 'Developer Docs', link: '/developer/introduction' },
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
        {
          text: 'Essentials',
          items: [
            { text: 'Editing Your Site', link: '/guide/editing' },
          ],
        },
      ],
      '/developer/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/developer/introduction' },
          ],
        },
        {
          text: 'Essentials',
          items: [
            { text: 'Create a Site', link: '/developer/site' },
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
