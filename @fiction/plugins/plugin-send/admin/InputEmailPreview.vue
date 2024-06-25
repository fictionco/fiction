<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import { useRender } from 'vue-email'
import { toMarkdown } from '@fiction/core/utils/markdown.js'
import EmailStandard from '@fiction/core/plugin-email/templates/EmailStandard.vue'
import type { TransactionalEmailConfig } from '@fiction/core/plugin-email/index.js'
import FictionFooterImg from '@fiction/core/plugin-email/img/fiction-email-footer.png'
import FictionIconImg from '@fiction/core/plugin-email/img/fiction-icon.png'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
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

const emailConfig = vue.computed<TransactionalEmailConfig>(() => {
  const email = props.modelValue || {}
  const org = service.fictionUser.activeOrganization.value

  const confirmEmail: TransactionalEmailConfig = {
    subject: email.subject,
    heading: email.post?.title || 'No Title',
    subHeading: email.post?.subTitle || 'No Subtitle',
    bodyMarkdown: toMarkdown(email.post?.content || 'No content'),
    actions: email.userConfig?.actions || [],
    mediaSuper: {
      media: { url: org?.avatar?.url },
      name: org?.orgName,
      href: org?.url,
    },
    mediaFooter: {
      media: { url: FictionFooterImg },
      name: 'Powered by Fiction',
      href: 'https://www.fiction.com',
    },
    legal: {
      name: org?.orgName,
      href: org?.url,
      desc: org?.address || '',
    },
    unsubscribeUrl: '#',
    darkMode: true,
  }

  return confirmEmail
})

async function setEmail(email?: EmailSendConfig) {
  if (!email) {
    emailHtml.value = ''
    return
  }

  const r = await useRender(EmailStandard, {
    props: emailConfig.value,
  })
  emailHtml.value = r.html
}

const org = vue.computed(() => service.fictionUser.activeOrganization.value)

vue.onMounted(async () => {
  await setEmail(props.modelValue)

  vue.watch(() => props.modelValue, v => setEmail(v))
})
</script>

<template>
  <div class="py-6  ">
    <div class="border-b border-theme-200 dark:border-theme-700/70 mb-8 pb-8">
      <div class=" mb-6">
        <div class="text-3xl font-medium">
          {{ emailConfig.subject }}
        </div>
        <div class="text-sm text-theme-500 dark:text-theme-400">
          {{ emailConfig.subject }}
        </div>
      </div>
      <div class="flex gap-4">
        <div><ElAvatar class="size-12 rounded-full" :url="org?.avatar?.url" /></div>
        <div>
          <div class="font-medium">
            {{ org?.orgName || "No Publication Name" }}
          </div>
          <div class="text-sm text-theme-500 dark:text-theme-400">
            {{ org?.orgEmail }}
          </div>
        </div>
      </div>
    </div>
    <iframe class="h-[800px] w-full" :srcdoc="emailHtml" />
  </div>
</template>
