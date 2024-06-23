<script lang="ts" setup>
import type { User } from '@fiction/core'
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import { useRender } from 'vue-email'
import { toMarkdown } from '@fiction/core/utils/markdown.js'
import EmailStandard from '@fiction/core/plugin-email/templates/EmailStandard.vue'
import type { TransactionalEmailConfig } from '@fiction/core/plugin-email/index.js'
import { sampleHtml } from '@fiction/core/plugin-email/preview/content.js'
import FictionFooterImg from '@fiction/core/plugin-email/img/fiction-email-footer.png'
import FictionIconImg from '@fiction/core/plugin-email/img/fiction-icon.png'

const props = defineProps({
  modelValue: { type: Array as vue.PropType<User[]>, default: () => [] },
  card: { type: Object as vue.PropType<Card>, required: true },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: User[]): void
}>()

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
        btn: 'primary',
        name: `Confirm email address &#x2192;`,
        href: '#',
      },
      {
        btn: 'default',
        name: `test`,
        href: '#',
      },
      {
        btn: 'naked',
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

  const r = await useRender(EmailStandard, {
    props: confirmEmail,
  })
  email.value = r.html
})
</script>

<template>
  <iframe class="h-[800px] w-full" :srcdoc="email" />
</template>
