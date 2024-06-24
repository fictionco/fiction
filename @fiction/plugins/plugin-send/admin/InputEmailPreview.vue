<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import { useRender } from 'vue-email'
import { toMarkdown } from '@fiction/core/utils/markdown.js'
import EmailStandard from '@fiction/core/plugin-email/templates/EmailStandard.vue'
import type { TransactionalEmailConfig } from '@fiction/core/plugin-email/index.js'
import FictionFooterImg from '@fiction/core/plugin-email/img/fiction-email-footer.png'
import FictionIconImg from '@fiction/core/plugin-email/img/fiction-icon.png'
import type { EmailSendConfig } from '../schema.js'

const props = defineProps({
  modelValue: { type: Object as vue.PropType<EmailSendConfig>, default: undefined },
  card: { type: Object as vue.PropType<Card>, required: true },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: EmailSendConfig): void
}>()

const service = useService()

const emailHtml = vue.ref('')

async function setEmail(email?: EmailSendConfig) {
  if (!email) {
    emailHtml.value = ''
    return
  }

  const user = service.fictionUser.activeUser.value
  const org = service.fictionUser.activeOrganization.value

  const confirmEmail: TransactionalEmailConfig = {
    subject: email.subject,
    heading: email.post?.title || 'No Title',
    subHeading: email.post?.subTitle || 'No Subtitle',
    bodyMarkdown: toMarkdown(email.post?.content || 'No content'),
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
      media: { url: org?.avatar?.url || FictionIconImg },
      name: org?.orgName,
      href: 'https://www.fiction.com',
    },
    mediaFooter: {
      media: { url: FictionFooterImg },
      name: 'Powered by Fiction',
      href: 'https://www.fiction.com',
    },
    unsubscribeUrl: '#',
    darkMode: true,
  }

  const r = await useRender(EmailStandard, {
    props: confirmEmail,
  })
  emailHtml.value = r.html
}

vue.onMounted(async () => {
  await setEmail(props.modelValue)

  vue.watch(() => props.modelValue, v => setEmail(v))
})
</script>

<template>
  <iframe class="h-[800px] w-full" :srcdoc="emailHtml" />
</template>
