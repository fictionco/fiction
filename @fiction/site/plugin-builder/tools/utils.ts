import type { Site } from '@fiction/site'
import { createOption } from '@fiction/ui'

import { t } from '../../tables'
import InputSpecialSlugs from './InputSpecialSlugs.vue'

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
