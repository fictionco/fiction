<script lang="ts" setup>
import type { FictionEmail } from '../index'
import type { EmailSendConfig } from '../util'
import { useService } from '../../inject'
import { shortId, vue } from '../../utils'
import { sampleHtml } from '../preview/content'

const { fictionEmail } = useService<{ fictionEmail: FictionEmail }>()

const compiledHtml = vue.ref<string>('')
const isLoading = vue.ref(true)

vue.onMounted(async () => {
  try {
    const superImage = await fictionEmail.emailImages().icon

    const emailConfig: EmailSendConfig = {
      to: 'arpowers@gmail.com',
      senderName: 'Fiction.com',
      senderEmail: 'admin@fiction.com',
      subject: `Test Space (test email 👀)`,
      title: 'Testing Email Layout',
      subTitle: 'Testing the Fiction email layout',
      content: sampleHtml,
      buttons: [
        {
          theme: 'primary',
          label: `Confirm email address &#x2192;`,
          href: '#',
        },
      ],
      superTitle: {
        icon: { url: superImage.url },
        text: 'Fiction',
        href: 'https://www.fiction.com',
      },
      footerLinks: [
        { label: 'View Website', href: 'https://www.fiction.com' },
      ],
      theme: 'rose',
      companyName: 'Fiction Company, Inc.',
      streetAddress: '1234 Fiction St, Fiction City, FI 12345',
      poweredByFiction: true,
      unsubscribeUrl: 'https://www.fiction.com/unsubscribe',
      env: 'test',
      postId: shortId(),
      caller: 'testEmailLayout',
      toUserId: 'fake-id',
      fromOrgId: 'system',
      readOnSiteUrl: 'https://www.fiction.com/read-email',
    }

    compiledHtml.value = await fictionEmail.compileTemplateToHtml({ emailConfig })
  }
  finally {
    isLoading.value = false
  }
})

function openInNewTab() {
  const blob = new Blob([compiledHtml.value], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}
</script>

<template>
  <div class="h-full flex flex-col bg-theme-0">
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <h2 class="text-lg font-medium text-gray-900">
        Email Preview
      </h2>
      <button
        v-if="!isLoading"
        type="button"
        class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        @click="openInNewTab"
      >
        Open in New Tab
      </button>
    </div>

    <div class="flex-1 bg-gray-50">
      <div v-if="isLoading" class="flex items-center justify-center h-full">
        <div class="text-gray-500">
          Compiling email...
        </div>
      </div>

      <iframe
        v-else
        :srcdoc="compiledHtml"
        class="w-full border-0 h-[100vh]"
        sandbox="allow-same-origin"
        title="Email Preview"
      />
    </div>
  </div>
</template>
