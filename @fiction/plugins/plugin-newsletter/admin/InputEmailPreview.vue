<script lang="ts" setup>
import type { TransactionalEmailConfig } from '@fiction/core/plugin-email/index.js'
import type { Card } from '@fiction/site'

import type { FictionNewsletter } from '../index.js'
import type { EmailCampaignConfig } from '../schema.js'
import { isDarkOrLightMode, useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import { getEmailForCampaign } from '../utils.js'

const { modelValue } = defineProps<{ modelValue?: EmailCampaignConfig, card: Card }>()

const _emit = defineEmits<{
  (event: 'update:modelValue', payload: EmailCampaignConfig): void
}>()

const { fictionNewsletter, fictionUser } = useService<{ fictionNewsletter: FictionNewsletter }>()

const emailHtml = vue.ref('')
const emailConfig = vue.ref<TransactionalEmailConfig>()
const loading = vue.ref(true)
const iframeHeight = vue.ref('800px')

const previewMode = vue.ref<'dark' | 'light' | ''>(isDarkOrLightMode())

async function setEmail(campaignConfig?: EmailCampaignConfig) {
  loading.value = true

  const org = fictionUser.activeOrganization.value

  if (!campaignConfig || !org) {
    console.error('No campaign or org')
    emailHtml.value = ''
    return
  }

  const conf = await getEmailForCampaign({ campaignConfig, fictionNewsletter, org, withDefaults: true, previewMode: previewMode.value })

  emailConfig.value = conf

  // Add script to email HTML for height calculation
  if (conf.bodyHtml) {
    const script = `
      <script>
        function updateHeight() {
          const height = document.body.scrollHeight;
          window.parent.postMessage({ type: 'resize', height: height }, '*');
        }

        function handleLinks() {
          document.body.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
              e.preventDefault();
              window.parent.postMessage({ type: 'link', href: e.target.href }, '*');
            }
          });
        }

        window.addEventListener('load', function() {
          updateHeight();
          handleLinks();
        });
        window.addEventListener('resize', updateHeight);
      </` + `script>`
    emailConfig.value.bodyHtml = conf.bodyHtml.replace('</body>', `${script}</body>`)
  }

  loading.value = false
}

vue.onMounted(async () => {
  await fictionUser.userInitialized()

  vue.watch([() => modelValue, () => previewMode.value], () => setEmail(modelValue), { immediate: true })

  // Listen for messages from the iframe
  // Listen for messages from the iframe
  window.addEventListener('message', (event) => {
    if (event.data.type === 'resize') {
      iframeHeight.value = `${event.data.height}px`
    }
    else if (event.data.type === 'link') {
      if (event.data.href && event.data.href.startsWith('http')) {
        // Open link in a new tab/window
        window.open(event.data.href, '_blank')
      }
    }
  })
})
</script>

<template>
  <div class="py-6 space-y-6">
    <div v-if="loading" class="p-12 flex justify-center min-h-[300px]">
      <ElSpinner class="size-8" />
    </div>
    <template v-else-if="emailConfig">
      <div>
        <ElInput v-model="previewMode" label="Color Scheme" input="InputSelect" :list="['dark', 'light', { name: 'User Default', value: '' }]" />
      </div>
      <div class="border-b border-theme-200 dark:border-theme-700/70 mb-8 pb-8">
        <div class=" mb-6">
          <div class="text-xl font-medium x-font-title">
            {{ emailConfig.subject }}
          </div>
          <div class="text-sm text-theme-500 dark:text-theme-400">
            {{ emailConfig.preview }}
          </div>
        </div>
        <div class="flex gap-4">
          <div><ElAvatar class="size-12 rounded-full" :url="emailConfig.avatarUrl" /></div>
          <div>
            <div class="font-medium">
              {{ emailConfig.fromName }}
            </div>
            <div class="text-sm text-theme-500 dark:text-theme-400">
              {{ emailConfig.fromEmail }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="!emailConfig?.bodyHtml" class="text-center text-theme-500/50 ">
        No HTML content was generated
      </div>
      <iframe
        v-else
        id="email-preview-frame"
        :style="{ height: iframeHeight }"
        class="w-full"
        :srcdoc="emailConfig?.bodyHtml"
        frameborder="0"
        scrolling="no"
      />
    </template>
  </div>
</template>
