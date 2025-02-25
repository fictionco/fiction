<script lang="ts" setup>
import type { EmailSendConfig } from '@fiction/core/plugin-email/index.js'
import type { Card } from '@fiction/site'

import type { FictionPosts, Post } from '../../index'
import type { TablePostConfig } from '../../schema.js'
import { isDarkOrLightMode, useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import { getEmailForPost } from '../../utils/email'

const { post } = defineProps<{ post?: Post, card: Card }>()

const { fictionPosts, fictionUser } = useService<{ fictionPosts: FictionPosts }>()

const emailHtml = vue.ref('')
const emailConfig = vue.ref<EmailSendConfig>()
const loading = vue.ref(true)
const iframeHeight = vue.ref('800px')

const previewMode = vue.ref<'dark' | 'light' | ''>(isDarkOrLightMode())

async function setEmail(postConfig?: TablePostConfig) {
  loading.value = true

  const org = fictionUser.activeOrganization.value

  if (!postConfig || !org) {
    console.error('No campaign or org')
    emailHtml.value = ''
    return
  }

  const conf = await getEmailForPost({ postConfig, fictionPosts, org, withDefaults: true, previewMode: previewMode.value })

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
  await fictionUser.userInitialized({ caller: 'email-preview' })

  vue.watch(
    [() => post?.config.value, () => previewMode.value],
    () => setEmail(post?.config.value),
    { immediate: true },
  )

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
        <ElInput
          v-model="previewMode"
          label="Color Scheme"
          sub-label="Preview the email in dark or light mode"
          input="InputSelect"
          :list="['dark', 'light', { name: 'User Default', value: '' }]"
        />
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
          <div v-if="emailConfig.avatar?.url">
            <ElAvatar class="size-12 rounded-full" :url="emailConfig.avatar?.url" />
          </div>
          <div>
            <div class="font-medium">
              {{ emailConfig.senderName }}
            </div>
            <div class="text-sm text-theme-500 dark:text-theme-400">
              {{ emailConfig.senderEmail }}
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
