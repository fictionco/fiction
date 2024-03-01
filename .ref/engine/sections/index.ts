import { vue } from '@factor/api'

export const config = [
  {
    key: 'ElBigHero',
    el: vue.defineAsyncComponent(() => import('./ElBigHero.vue')),
  },
  {
    key: 'ElStory',
    el: vue.defineAsyncComponent(() => import('./ElStory.vue')),
  },
  {
    key: 'ctaEmail',
    el: vue.defineAsyncComponent(() => import('./ElCtaEmail.vue')),
  },
  {
    key: 'simpleFooter',
    el: vue.defineAsyncComponent(() => import('./SimpleFooter.vue')),
  },
  {
    key: 'simpleHeader',
    el: vue.defineAsyncComponent(() => import('./SimpleHeader.vue')),
  },
  {
    key: 'magFrontPage',
    el: vue.defineAsyncComponent(() => import('./ElMagFrontPage.vue')),
    opts: vue.computed(() => {
      return [
        { label: 'Primary Title', input: 'InputText', placeholder: 'My Magazine', key: 'titlePrimary' },
        { label: 'Secondary Title', input: 'InputText', placeholder: 'Project Name', key: 'titleSecondary' },
      ]
    }),
  },
  {
    key: 'magPost',
    el: vue.defineAsyncComponent(() => import('./ElMagPost.vue')),
    opts: vue.computed(() => {
      return []
    }),
  },
] as const
