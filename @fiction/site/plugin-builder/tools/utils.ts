import type { Card, CardConfigPortable, PageTemplate, Site } from '@fiction/site'
import { colorThemeUser, toLabel, vue } from '@fiction/core'
import { TablePageSchema as PageSchema, TableSiteSchema as schema } from '@fiction/site/tables'
import { createOption } from '@fiction/ui'
import { t } from '../../tables'

export function getSiteOptions(args: { card: Card, site: Site }) {
  const { card } = args
  const org = card.site?.org.value

  return {
    domain: createOption({
      schema,
      key: 'domain.group',
      label: 'Domain',
      input: 'group',
      icon: { class: 'i-tabler-world-upload' },
      options: [
        createOption({
          schema,
          key: 'org.handle',
          label: 'Fiction Domain',
          input: 'InputHandle',
          isRequired: true,
          props: {
            beforeInput: 'https://',
            afterInput: '.fiction.com',
            table: 'fiction_org',
            columns: [{ name: 'handle' }],
            uiSize: 'md',
          },
        }),
        createOption({
          key: 'customDomains',
          label: 'Enter Custom Domain',
          description: 'Add your custom domain, you\'ll need to set up DNS records for it to work.',
          input: vue.defineAsyncComponent(() => import('./CustomDomain.vue')),
          isRequired: true,
        }),
        createOption({
          key: 'domainSetupInstructions',
          label: 'Setup Instructions',
          input: vue.defineAsyncComponent(() => import('./CustomDomainInstructions.vue')),
          props: {
            destination: `https://${org?.handle}.fictionsites.com`,
          },
        }),
      ],
    }),
    global: createOption({
      schema,
      key: 'siteGlobal',
      label: 'Brand',
      input: 'group',
      icon: { class: 'i-tabler-world-latitude' },
      options: [
        createOption({ schema, key: `org.name`, label: 'Name', input: 'InputText', placeholder: 'Enter a name', isRequired: true, description: 'Your brand name' }),
        createOption({ schema, key: 'org.email', label: 'Email', input: 'InputEmail', isRequired: true, description: 'Your primary contact email.' }),
        createOption({ schema, key: 'org.handle', label: 'Handle', input: 'InputHandle', placeholder: 'my-handle', props: { table: 'fiction_org', columns: [{ name: 'handle' }] }, description: 'Used in URLs and mentions.' }),
        createOption({ schema, key: 'org.profile.headline', label: 'Headline', input: 'InputUrl', isRequired: true, placeholder: 'Enter a headline' }),
        createOption({ schema, key: 'org.profile.summary', label: 'About', input: 'InputTextarea', isRequired: true, placeholder: 'Enter a description' }),
        createOption({ schema, key: 'org.avatar', label: 'Avatar', input: 'InputMedia' }),
        createOption({ schema, key: 'org.branding.logo', label: 'Logo', subLabel: 'For visual identity', input: 'InputMedia' }),
        createOption({ schema, key: 'org.branding.primaryColor', label: 'Primary Color', input: 'InputColorTheme', placeholder: 'Default', props: { mode: 'bright' } }),

        createOption({
          key: 'about',
          label: 'All Settings',
          subLabel: 'Additional settings found in workspace settings',
          input: 'InputActionList',
          props: {
            buttons: () => {
              return [
                {
                  href: card.link('/settings/org?tab=brand'),
                  label: 'Go to Workspace Settings',
                  iconAfter: 'i-tabler-arrow-up-right',
                  size: 'sm',
                  theme: 'primary',
                },
              ]
            },
          },
        }),

        // createOption({
        //   schema: schema,
        //   key: 'userConfig.favicon',
        //   label: 'Favicon',
        //   description: 'Upload a square image (at least 32x32px) that represents your site in browser tabs and bookmarks',
        //   input: 'InputMedia',
        // }),
        // createOption({
        //   schema: schema,
        //   key: 'userConfig.shareImage',
        //   label: 'Social Card Image',
        //   description: 'Upload an image (1200x630px recommended) to appear when your site is shared on social platforms like Facebook, Twitter, or LinkedIn',
        //   input: 'InputMedia',
        // }),

        // createOption({
        //   schema: schema,
        //   key: 'userConfig.googleAnalyticsId',
        //   label: 'Google Analytics ID',
        //   description: 'Enter your Google Analytics Measurement ID to enable website analytics. Format: G-XXXXXXXXXX',
        //   input: 'InputText',
        //   placeholder: 'G-XXXXXXXXXX',
        // }),

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

export function getPageOptions(args: {
  site: Site
  page?: CardConfigPortable
  temp?: CardConfigPortable
  editMode: 'new' | 'edit'
  pageTemplates?: PageTemplate[]
}) {
  const { site, page, temp, editMode, pageTemplates } = args

  const basicOptions = [
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
      subLabel: page?.isHome ? 'Unused when set to home page' : '',
      input: 'InputHandle',
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

    createOption({
      schema: PageSchema,
      key: 'nav',
      label: 'Show in Navigation',
      input: 'InputToggle',
      props: {
        valueOn: 'show',
        valueOff: 'hide',
        defaultValue: 'show',
      },
    }),
  ]

  if (editMode === 'edit') {
    basicOptions.push(
      createOption({
        schema: PageSchema,
        key: 'isHome',
        label: 'Set as Home Page',
        subLabel: page?.isHome ? 'Currently the home page' : 'Set this page as the home page',
        description: page?.isHome ? 'To change, go to another page and set it as home' : 'Setting a page as home will replace the current home page',
        input: 'InputToggle',
        props: {
          onlyOn: page?.isHome,
          textOn: 'Set as Home Page',
        },
      }),
    )
  }
  else {
    if (pageTemplates?.length) {
      const list = pageTemplates.map(p => ({ value: p.pageTemplateId, label: p.title, description: p.description }))
      basicOptions.push(
        createOption({
          schema: PageSchema,
          key: 'pageTemplateId',
          label: 'Create from Template',
          input: 'InputSelect',
          list,
          placeholder: 'Default',
        }),
      )
    }
  }

  return {
    basic: createOption({
      schema: PageSchema,
      key: 'group.pageSetup',
      label: 'Page Settings',
      input: 'group',
      icon: { class: 'i-tabler-file-plus' },
      options: basicOptions,
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
          label: 'SEO Title',
          input: 'InputTextarea',
          placeholder: 'Enter Title',
          props: { rows: 3 },
        }),
        createOption({
          schema: PageSchema,
          testId: 'page-seo-description',
          key: 'userConfig.standard.description',
          label: 'SEO Description',
          input: 'InputTextarea',
          placeholder: 'Enter Description',
          props: { rows: 3 },
        }),
      ],
    }),

  }
}
