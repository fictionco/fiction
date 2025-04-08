import type { CardConfigPortable, Site } from '@fiction/site'
import { colorThemeUser, toLabel, vue } from '@fiction/core'
import { PageSchema, SiteSchema } from '@fiction/site/schema'
import { createOption } from '@fiction/ui'
import { t } from '../../tables'
import { activeSiteHostname } from '../../utils/site'

export function getSiteOptions(args: { site: Site }) {
  const { site } = args

  return {
    global: createOption({
      schema: SiteSchema,
      key: 'siteGlobal',
      label: 'Metatags',
      input: 'group',
      icon: { class: 'i-tabler-world-latitude' },
      options: [
        createOption({
          schema: SiteSchema,
          key: 'title',
          label: 'Site Title',
          input: 'InputText',
          isRequired: true,
        }),
        createOption({
          schema: SiteSchema,
          key: 'userConfig.favicon',
          label: 'Favicon',
          description: 'Upload a square image (at least 32x32px) that represents your site in browser tabs and bookmarks',
          input: 'InputMediaUpload',
        }),
        createOption({
          schema: SiteSchema,
          key: 'userConfig.shareImage',
          label: 'Social Card Image',
          description: 'Upload an image (1200x630px recommended) to appear when your site is shared on social platforms like Facebook, Twitter, or LinkedIn',
          input: 'InputMediaUpload',
        }),

        createOption({
          schema: SiteSchema,
          key: 'siteGlobal',
          label: 'Advanced',
          input: 'group',
          icon: { class: 'i-tabler-rocket' },
          isClosed: true,
          options: [
            createOption({
              schema: SiteSchema,
              key: 'userConfig.titleTemplate',
              label: 'Page Title Format',
              description: 'Customize how page titles appear in browser tabs and search results. Use {{pageTitle}} for the current page name and {{siteTitle}} for your site name.',
              input: 'InputText',
              placeholder: '{{pageTitle}} - {{siteTitle}}',
            }),

            createOption({
              schema: SiteSchema,
              key: 'userConfig.googleAnalyticsId',
              label: 'Google Analytics ID',
              description: 'Enter your Google Analytics Measurement ID to enable website analytics. Format: G-XXXXXXXXXX',
              input: 'InputText',
              placeholder: 'G-XXXXXXXXXX',
            }),
          ],
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

    styling: createOption({
      schema: SiteSchema,
      key: 'site.styling',
      label: 'Color',
      input: 'group',
      icon: { class: 'i-tabler-palette' },
      options: [
        createOption({
          schema: SiteSchema,
          key: 'userConfig.standard.primaryColor',
          label: 'Primary Color',
          subLabel: 'Used for buttons, links, and important elements',
          input: 'InputColorTheme',
          list: colorThemeUser,
          placeholder: 'Default',
        }),

        createOption({
          schema: SiteSchema,
          key: 'userConfig.standard.prefersColorScheme',
          label: 'Dark / Light Mode',
          subLabel: 'Control how your site appears to visitors',
          input: 'InputRadioButton',
          props: { uiSize: 'sm' },
          list: [
            { value: 'light', label: 'Always Light' },
            { value: 'auto', label: 'Auto' },
            { value: 'dark', label: 'Always Dark' },
          ],
          placeholder: 'Select theme behavior',
        }),

      ],
    }),
    fonts: createOption({
      schema: SiteSchema,
      key: 'globalFonts',
      label: 'Typography',
      icon: { class: 'i-tabler-text-size' },
      input: 'group',
      options: [
        createOption({
          schema: SiteSchema,
          key: 'group.fonts.main',
          label: 'Primary Fonts',
          icon: { class: 'i-tabler-text-increase' },
          input: 'group',
          options: [
            createOption({
              schema: SiteSchema,
              key: 'userConfig.standard.fonts.title',
              label: 'Headings',
              subLabel: 'Used for page titles and major headings',
              input: 'InputFont',
              props: { noPreview: true },
            }),
            createOption({
              schema: SiteSchema,
              key: 'userConfig.standard.fonts.body',
              label: 'Main Text',
              subLabel: 'Used for paragraphs and general content',
              input: 'InputFont',
              props: { noPreview: true },
            }),
          ],
        }),

        createOption({
          schema: SiteSchema,
          key: 'groupl.fonts.accent',
          label: 'Accent Fonts',
          icon: { class: 'i-tabler-text-decrease' },
          input: 'group',
          options: [
            createOption({
              schema: SiteSchema,
              key: 'userConfig.standard.fonts.highlight',
              label: 'Accent Text',
              subLabel: 'Used for emphasis and special text',
              input: 'InputFont',
              props: { noPreview: true },
            }),
            createOption({
              schema: SiteSchema,
              key: 'userConfig.standard.fonts.sans',
              label: 'Sans-Serif',
              subLabel: 'Modern, clean style for UI elements',
              input: 'InputFont',
              props: { noPreview: true },
            }),
            createOption({
              schema: SiteSchema,
              key: 'userConfig.standard.fonts.serif',
              label: 'Serif',
              subLabel: 'Traditional style for formal content',
              input: 'InputFont',
              props: { noPreview: true },
            }),
            createOption({
              schema: SiteSchema,
              key: 'userConfig.standard.fonts.mono',
              label: 'Monospace',
              subLabel: 'Fixed-width font for code and technical content',
              input: 'InputFont',
              props: { noPreview: true },
            }),
          ],
        }),

      ],
    }),
    publish: createOption({
      schema: SiteSchema,
      key: 'site.publish',
      label: 'Domain',
      input: 'group',
      icon: { class: 'i-tabler-world-upload' },
      options: [
        createOption({
          schema: SiteSchema,
          key: 'group.subDomain',
          label: 'Fiction Subdomain',
          input: 'group',
          icon: { class: 'i-tabler-world-bolt' },
          options: [
            createOption({
              schema: SiteSchema,
              key: 'subDomain',
              label: 'Fiction Domain',
              input: 'InputUsername',
              isRequired: true,
              props: {
                beforeInput: 'https://',
                afterInput: '.fiction.com',
                table: t.sites,
                columns: [{ name: 'subDomain' }],
                uiSize: 'md',
              },
            }),
          ],
        }),
        createOption({
          schema: SiteSchema,
          key: 'group.subDomain',
          label: 'Custom Domain',
          input: 'group',
          icon: { class: 'i-tabler-world-www' },
          options: [
            createOption({
              schema: SiteSchema,
              key: 'customDomains',
              label: 'Enter Custom Domain',
              subLabel: 'Add custom domains for this site (e.g. www.example.com)',
              description: 'Connect your own domain name to your site. You\'ll need to update your DNS settings with your domain provider.',
              input: vue.defineAsyncComponent(() => import('./CustomDomain.vue')),
              isRequired: true,

              props: {
                destination: activeSiteHostname(site, { isProd: true }).value,
                uiSize: 'md',
              },
            }),
          ],
        }),
        createOption({
          key: 'group.instructions',
          label: 'Domain Setup Instructions',
          input: 'group',
          icon: { class: 'i-tabler-world-question' },
          options: [
            createOption({
              key: 'domainSetupInstructions',
              input: vue.defineAsyncComponent(() => import('./CustomDomainInstructions.vue')),
              props: {
                destination: activeSiteHostname(site, { isProd: true }).value,
              },
            }),
          ],
        }),
      ],
    }),
    history: createOption({
      key: 'group.revisions',
      label: 'Revisions',
      input: 'group',
      icon: { class: 'i-tabler-history' },
      options: [
        createOption({
          key: 'revisionHistory',
          input: vue.defineAsyncComponent(() => import('./InputRevisionHistory.vue')),
        }),
      ],
    }),
  }
}

export function getPageOptions(args: { site: Site, page?: CardConfigPortable, temp?: CardConfigPortable }) {
  const { site, page, temp } = args
  return {
    basic: createOption({
      schema: PageSchema,
      key: 'group.pageSetup',
      label: 'Settings',
      input: 'group',
      icon: { class: 'i-tabler-file-plus' },
      options: [
        createOption({
          schema: PageSchema,
          testId: 'add-page-title',
          key: 'title',
          label: 'Page Title',
          input: 'InputText',
          placeholder: toLabel(temp?.slug || page?.slug) || 'Enter Title',
          isRequired: true,
        }),

        createOption({
          schema: PageSchema,
          testId: 'add-page-slug',
          key: 'slug',
          label: 'Slug',
          input: 'InputUsername',
          placeholder: 'page-slug',
          isRequired: true,
          props: {
            beforeInput: `example.com/`,
            table: t.pages,
            columns: [
              { name: 'slug', allowReserved: true },
              { name: 'siteId', value: site.siteId },
            ],
          },
        }),
        createOption({
          schema: PageSchema,
          key: 'isHome',
          label: 'Set as Home Page',
          subLabel: 'If active, this page will be the default landing page for your site',
          input: 'InputToggle',
          props: {
            onlyOn: page?.isHome,
            textOn: 'Set as Home Page',
          },
        }),

      ],
    }),

    seo: createOption({
      key: 'group.pageSeo',
      label: 'SEO',
      input: 'group',
      icon: { class: 'i-tabler-search' },
      options: [
        createOption({
          schema: PageSchema,
          testId: 'page-seo-title',
          key: 'userConfig.standard.title',
          label: 'Meta Title',
          input: 'InputTextarea',
          placeholder: 'Enter Title',
          props: { rows: 3 },
        }),
        createOption({
          schema: PageSchema,
          testId: 'page-seo-description',
          key: 'userConfig.standard.description',
          label: 'Meta Description',
          input: 'InputTextarea',
          placeholder: 'Enter Description',
          props: { rows: 3 },
        }),
      ],
    }),

  }
}
