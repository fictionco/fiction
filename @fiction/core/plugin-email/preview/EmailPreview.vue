<script lang="ts" setup>
import type { TransactionalEmailConfig } from '../index.js'
import { vue } from '../../utils/libraries.js'
import { toMarkdown } from '../../utils/markdown.js'
import FictionFooterImg from '../img/fiction-email-footer.png'
import FictionIconImg from '../img/fiction-icon.png'
import { sampleHtml } from './content.js'

const email = vue.ref('')

vue.onMounted(async () => {
  // subject: { type: String, default: undefined },
  // heading: { type: String, default: undefined },
  // subHeading: { type: String, default: undefined },
  // markdown: { type: String, default: undefined },
  // preview: { type: String, default: undefined },
  // actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
  // unsubscribeLink: { type: String, default: undefined },
  // mediaSuper: { type: Object as vue.PropType<MediaItem>, default: undefined },
  // mediaFooter: { type: Object as vue.PropType<MediaItem>, default: undefined },

  const confirmEmail: TransactionalEmailConfig = {
    subject: 'Confirm your email address',
    heading: 'Welcome to Fiction',
    subHeading: 'Please confirm your email address',
    // bodyMarkdown: 'Please confirm your email address by clicking the button below.',
    bodyMarkdown: toMarkdown(sampleHtml),
    actions: [
      {
        theme: 'primary',
        name: `Confirm email address &#x2192;`,
        href: '#',
      },
      {
        theme: 'default',
        name: `test`,
        href: '#',
      },
      {
        theme: 'naked',
        name: `Test`,
        href: '#',
      },
    ],
    mediaSuper: {
      media: { url: FictionIconImg },
      name: 'Fiction',
      href: 'https://www.fiction.com',
    },
    mediaFooter: {
      media: { url: FictionFooterImg },
      name: 'Personal Marketing with Fiction',
      href: 'https://www.fiction.com',
    },
  }
  const EmailStandard = vue.defineAsyncComponent(() => import('@fiction/core/plugin-email/templates/EmailStandard.vue'))
  const { render } = await import('@vue-email/render')
  email.value = await render(EmailStandard, confirmEmail)
})
</script>

<template>
  <iframe class="h-[100dvh] w-[100dvw]" :srcdoc="email" />
</template>
