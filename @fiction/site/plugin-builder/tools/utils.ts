import type { Site } from '@fiction/site'
import { SiteSchema as schema } from '@fiction/site/schema'
import { createOption } from '@fiction/ui'
import { t } from '../../tables'
import InputSpecialSlugs from './InputSpecialSlugs.vue'

export function getSiteOptions(args: { site: Site }) {
  const { site } = args

  return {
    global: createOption({
      schema,
      key: 'siteGlobal',
      label: 'Site',
      input: 'group',
      icon: { class: 'i-tabler-world-latitude' },
      options: [
        createOption({
          schema,
          key: 'title',
          label: 'Site Title',
          input: 'InputText',
          isRequired: true,
        }),
        createOption({
          schema,
          key: 'userConfig.titleTemplate',
          label: 'Page Title Format',
          description: 'Customize how page titles appear in browser tabs and search results. Use {{pageTitle}} for the current page name and {{siteTitle}} for your site name.',
          input: 'InputText',
          placeholder: '{{pageTitle}} - {{siteTitle}}',
        }),
        createOption({
          schema,
          key: 'userConfig.favicon',
          label: 'Favicon',
          description: 'Upload a square image (at least 32x32px) that represents your site in browser tabs and bookmarks',
          input: 'InputMediaUpload',
        }),
        createOption({
          schema,
          key: 'userConfig.shareImage',
          label: 'Sharing Image',
          description: 'Upload an image (1200x630px recommended) to appear when your site is shared on social platforms like Facebook, Twitter, or LinkedIn',
          input: 'InputMediaUpload',
        }),
        createOption({
          schema,
          key: 'userConfig.timezone',
          label: 'Time Zone',
          description: 'Sets how dates and times are displayed across your site based on your location',
          input: 'InputTimezone',
        }),
        createOption({
          schema,
          key: 'userConfig.locale',
          label: 'Language Code',
          description: 'Two-letter code that tells browsers and search engines what language your site uses (e.g., "en" for English, "es" for Spanish)',
          input: 'InputText',
          placeholder: 'en',
        }),
        createOption({
          schema,
          key: 'userConfig.googleAnalyticsId',
          label: 'Google Analytics ID',
          description: 'Enter your Google Analytics Measurement ID to enable website analytics. Format: G-XXXXXXXXXX',
          input: 'InputText',
          placeholder: 'G-XXXXXXXXXX',
        }),
        // createOption({
        //   key: 'userConfig.siteAdminActions ',
        //   label: 'Delete Site',
        //   input: 'InputActionList',
        //   props: {
        //     buttons: () => {
        //       const sending = vue.ref(false)
        //       return [
        //         {
        //           label: 'Permanently Delete Site...',
        //           design: 'outline' as const,
        //           theme: 'red' as const,
        //           size: 'sm',
        //           icon: 'i-tabler-trash',
        //           loading: sending.value,
        //           onClick: async () => {
        //             const confirmed = confirm('This will permanently delete your site. Are you sure?')
        //             const siteId = site.siteId
        //             if (confirmed) {
        //               sending.value = true
        //               site.fictionSites.settings.fictionRouter.
        //               // await site.fictionSites.requests.ManageSite.projectRequest({ _action: 'delete', where: { siteId }, caller: 'siteDeleter' })
        //               sending.value = false
        //               await siteGoto({ site, location: '/sites', options: { caller: 'siteDeleter' } })
        //             }
        //           },
        //         },
        //       ]
        //     },
        //   },

        // }),
      ],
    }),

  }
}

export function getPageOptions(args: { site: Site }) {
  const { site } = args

  return {
    essentials: createOption({
      key: 'group.pageSetup',
      label: 'Title and Slug',
      input: 'group',
      icon: { class: 'i-tabler-file-plus' },
      options: [
        createOption({
          testId: 'add-page-title',
          key: 'title',
          label: 'Page Title',
          input: 'InputText',
          placeholder: 'Enter Page Title',
          isRequired: true,
        }),
        createOption({
          testId: 'add-page-slug',
          key: 'slug',
          label: 'Slug',
          input: 'InputUsername',
          placeholder: 'page-slug',
          isRequired: true,
          props: {
            table: t.pages,
            columns: [
              { name: 'slug', allowReserved: true },
              { name: 'siteId', value: site.siteId },
            ],
          },
        }),

      ],
    }),
    special: createOption({
      key: 'group.pageSetup',
      label: 'Special Handling',
      input: 'group',
      icon: { class: 'i-tabler-file-text-spark' },
      options: [
        createOption({
          key: 'slug',
          label: 'Special Handling',
          input: InputSpecialSlugs,
          props: { site },
        }),
      ],
    }),
    seo: createOption({
      key: 'pageSeo',
      label: 'SEO / Meta Tags',
      input: 'group',
      icon: { class: 'i-tabler-search' },
      options: [
        createOption({
          testId: 'page-seo-title',
          key: 'userConfig.seo.title',
          label: 'SEO Title',
          subLabel: 'Title tag, defaults to page title',
          input: 'InputText',
          placeholder: 'Enter Page Title',
        }),
        createOption({
          testId: 'page-seo-description',
          key: 'userConfig.seo.description',
          label: 'SEO Description',
          subLabel: 'Page description metatag, displayed in search results',
          input: 'InputTextarea',
          placeholder: 'Enter Page Description',
          props: { rows: 5 },
        }),
      ],
    }),
  }
}
