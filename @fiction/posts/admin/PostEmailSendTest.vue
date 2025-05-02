<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionPosts } from '../index.js'
import type { Post } from '../post.js'

import { useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import { InputOption } from '@fiction/ui/index.js'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'

const { post, card } = defineProps<{
  post?: Post | undefined
  card: Card
}>()

const service = useService<{ fictionPosts: FictionPosts }>()

const options = vue.computed<InputOption[]>(() => {
  return [
    new InputOption({
      key: 'emailTestSend',
      label: 'Send Test Email',
      input: 'group',
      options: [
        new InputOption({
          key: 'emailConfig.testEmails',
          label: 'Test Emails',
          input: 'InputText',
          placeholder: 'e1@test.com, e2@test.com',
          description: 'Enter emails to send the test to... (comma separated)',
          isRequired: true,
        }),
      ],
    }),

  ]
})

const loading = vue.ref('')
async function sendTest() {
  const pst = post
  const testEmails = pst?.testEmails.value || []

  if (testEmails?.length && pst?.postId) {
    loading.value = 'testEmail'

    await service.fictionPosts.requests.ManagePost.projectRequest({
      _action: 'emailSendTest',
      testEmails,
      where: { postId: pst.postId },
    })
  }

  loading.value = ''
}

const testEmails = vue.computed({
  get: () => post?.settings.testEmails || [],
  set: (v) => {
    post?.update({ emailConfig: { ...post.emailConfig.value, testEmails: v } }, { caller: 'ToolEmailPreview' })
  },
})
</script>

<template>
  <ElForm v-if="post" class="space-y-6 w-full p-4 md:p-12" @submit="sendTest()">
    <ElInput
      v-model="testEmails"
      label="Send Test Emails"
      sub-label="Enter emails to send the test to..."
      ui-size="xl"
      input="InputEmailMulti"
      placeholder="your@email.com"
      required
    />
    <div class="flex justify-end">
      <XButton
        type="submit"
        theme="primary"
        format="block"
        size="xl"
        rounding="md"
        :loading="!!loading"
        icon-after="i-tabler-send-2"
      >
        Send Test Email
      </XButton>
    </div>
  </ElForm>
</template>
