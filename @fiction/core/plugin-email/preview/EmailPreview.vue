<script lang="ts" setup>
import type { EmailSendConfig } from '../index.js'
import { vue } from '../../utils/libraries.js'
import { toMarkdown } from '../../utils/markdown.js'
import FictionFooterImg from '../img/fiction-email-footer.png'
import FictionIconImg from '../img/fiction-icon.png'
import { sampleHtml } from './content.js'

const email = vue.ref('')

vue.onMounted(async () => {
  const confirmEmail: EmailSendConfig = {
    subject: 'Confirm your email address',
    title: 'Welcome to Fiction',
    subTitle: 'Please confirm your email address',
    // bodyMarkdown: 'Please confirm your email address by clicking the button below.',
    bodyMarkdown: await toMarkdown(sampleHtml),
    buttons: [
      {
        theme: 'primary',
        label: `Confirm email address &#x2192;`,
        href: '#',
      },
      {
        theme: 'default',
        label: `test`,
        href: '#',
      },
      {
        theme: 'naked',
        label: `Test`,
        href: '#',
      },
    ],
    superTitle: {
      icon: { url: FictionIconImg },
      text: 'Fiction',
      href: 'https://www.fiction.com',
    },
    mediaFooter: { url: FictionFooterImg },
    poweredByFiction: true,
  }
  const EmailStandard = vue.defineAsyncComponent(() => import('@fiction/core/plugin-email/templates/EmailV2.vue'))
  const { render } = await import('@vue-email/render')
  email.value = await render(EmailStandard, confirmEmail)
})
</script>

<template>
  <iframe class="h-[100dvh] w-[100dvw]" :srcdoc="email" />
</template>
