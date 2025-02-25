<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { Card } from '@fiction/site'
import type { FictionPosts } from '../../index.js'
import type { Post } from '../../post.js'
import type { TablePostConfig } from '../../schema.js'

import ElTool from '@fiction/admin/tools/ElTool.vue'
import { useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import { InputOption } from '@fiction/ui/index.js'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

const { tool, post, card } = defineProps<{
  tool: EditorTool
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
          key: 'userConfig.testEmails',
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

function updatePost(config: Partial<TablePostConfig>) {
  post?.update(config, { caller: 'ToolEmailPreview' })
}

const loading = vue.ref('')
async function sendTest() {
  const pst = post
  const testEmails = pst?.userConfig.value.testEmails

  if (testEmails && pst.postId) {
    loading.value = 'testEmail'

    await service.fictionPosts.requests.ManagePost.projectRequest({
      _action: 'emailSendTest',
      testEmails,
      where: { postId: pst.postId },
    })
  }

  loading.value = ''
}
</script>

<template>
  <ElTool :tool>
    <ElForm v-if="post" @submit="sendTest()">
      <FormEngine
        state-key="emailPreview"
        :model-value="post?.toConfig()"
        :options
        :input-props="{ post, card }"
        @update:model-value="updatePost($event as Partial<TablePostConfig>)"
      />
      <div class="px-4 flex justify-end">
        <XButton
          type="submit"
          theme="primary"
          :loading="!!loading"
        >
          Send Test Email
        </XButton>
      </div>
    </ElForm>
  </ElTool>
</template>
