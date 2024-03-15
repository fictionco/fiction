import { defineConfig } from 'vitepress'
const commitRef = process.env.COMMIT_REF?.slice(0, 8) || 'dev'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Fiction Docs",
  description: "Documentation for Fiction marketing platform and content development system",
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Fiction Docs',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: 'Resources',
      items: [
        { text: 'Privacy Policy', link: '/resources/privacy' },
        { text: 'Terms of Service', link: '/resources/terms' },
      ] },
    ],

    sidebar: {
      '/examples/':[
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' }
          ]
        }
      ],
      '/resources/':[
        {
          text: 'Resources',
          items: [
            { text: 'Terms of Service', link: '/resources/terms' },
            { text: 'Privacy Policy', link: '/resources/privacy' }
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/fictionco/fiction' }
    ],

    footer: {
      message: `Released under the GPLv2 License. (${commitRef})`,
      copyright: 'Copyright © 2023-present Fiction.com',
    },
  }
})
