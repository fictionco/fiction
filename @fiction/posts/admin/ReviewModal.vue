<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { TablePostConfig } from '..'
import type { Post } from '../post.js'
import type { EditorLocation, ModalLocation } from './EditorWrap.vue'
import { dayjs, vue, waitFor } from '@fiction/core'
import { createOption } from '@fiction/ui'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import ElModalConfirm from '@fiction/ui/modal/ElModalConfirm.vue'
import SuccessModal from '@fiction/ui/modal/SuccessModal.vue'
import { TablePostSchema as schema } from '../schema.js'

import InputPostReview from './InputPostReview.vue'

import PostPreview from './PostPreview.vue'

const { post, card, modal } = defineProps<{
  post?: Post
  card: Card
  modal: ModalLocation
}>()

const emit = defineEmits<{
  (event: 'update:location', payload: EditorLocation): void
  (event: 'update:modal', payload: ModalLocation): void
  (event: 'update:post', payload: TablePostConfig): void
}>()
const sending = vue.ref<string | undefined>()

const publishSuccess = vue.computed(() => {
  return post?.publishMode.value === 'schedule'
    ? {
        title: 'Post Scheduled Successfully!',
        content: 'Your post has been scheduled for publication.',
        submitText: post?.publishAt.value
          ? `Publish on ${dayjs(post.publishAt.value).format('MMM D, YYYY [at] h:mm A')}`
          : 'Select Date',
      }
    : {
        title: 'Post Published Successfully!',
        content: 'Your post has been published.',
        submitText: 'Publish Now',
      }
})

async function saveAndSchedule() {
  sending.value = 'schedule'

  try {
    const p = post
    const publishMode = p?.publishMode.value
    const publishAt = publishMode === 'schedule' ? p?.publishAt.value : dayjs().toISOString()
    p?.update({
      status: publishMode === 'now' ? 'published' : 'scheduled',
      emailStatus: 'scheduled',
      publishAt,
    }, { caller: 'saveAndSchedule' })
    await p?.save({ caller: 'saveAndSchedule' })

    await waitFor(100)

    emit('update:modal', 'success')
    emit('update:location', 'overview')
  }
  catch (e) {
    console.error(e)
  }
  finally {
    sending.value = undefined
  }
}

const reviewOptions = vue.computed(() => {
  return [
    createOption({
      key: 'publish',
      input: 'group',
      label: 'Review & Publish',
      icon: { class: 'i-tabler-calendar' },
      options: [

        createOption({
          schema,
          key: 'publishMode',
          input: 'InputRadioButton',
          props: {
            uiSize: 'lg',
            list: [
              { label: 'Publish Now', value: 'now', icon: { class: 'i-tabler-clock' } },
              { label: 'Schedule for Later', value: 'schedule', icon: { class: 'i-tabler-calendar' } },
            ],
          },
        }),
        createOption({
          schema,
          key: 'publishAt',
          input: 'InputDate',
          isVisible: () => post?.publishMode.value === 'schedule',
          props: {
            dateMode: 'future',
            includeTime: true,
          },
        }),
        createOption({
          key: 'review',
          input: InputPostReview,
        }),
      ],
    }),
  ]
})
</script>

<template>
  <ElModal :vis="modal === 'review'" modal-class="max-w-screen-sm " @update:vis="emit('update:modal', '')">
    <ElForm v-if="post" data-test-id="publish-panel" class="p-4 space-y-6 relative" @submit="saveAndSchedule()">
      <div class="">
        <FormEngine
          :model-value="post.toConfig()"
          state-key="revision"
          :options="reviewOptions"
          :input-props="{ post, card }"
          :classes="{ tabWrap: 'py-4' }"
          @update:model-value="post?.update($event as TablePostConfig, { caller: 'reviewModal' })"
        />
      </div>
      <div class="flex justify-between gap-6">
        <XButton
          size="md"
          theme="default"
          type="submit"
          icon="i-tabler-arrow-back"
          @click.prevent="emit('update:modal', ''); emit('update:location', 'compose')"
        >
          Back to Editor
        </XButton>
        <XButton
          size="md"
          data-test-id="schedule-publish-button"
          theme="primary"
          icon="i-tabler-calendar-bolt"
          type="submit"
          :loading="sending === 'schedule'"
          :disabled="!post.publishMode.value || (post.publishMode.value === 'schedule' && !post.publishAt.value)"
        >
          {{ publishSuccess.submitText }}
        </XButton>
      </div>
    </ElForm>
  </ElModal>

  <!-- Success Confirmation Modal -->
  <SuccessModal
    :vis="modal === 'success'"
    :title="publishSuccess.title"
    :content="publishSuccess.content"
    :action="{ buttons: [{ label: 'Close', theme: 'primary' as const, onClick: () => emit('update:modal', '') }] }"
    @update:vis="emit('update:modal', '')"
  />

  <ElModal
    :vis="modal === 'preview'"
    modal-class="w-full x-font-body h-[calc(100dvh-3rem)] overflow-scroll no-scrollbar"
    transition-mode="slideUp"
    :has-close="true"
    @update:vis="emit('update:modal', '')"
  >
    <PostPreview class="p-12" :post :card />
  </ElModal>

  <ElModalConfirm
    :vis="modal === 'unschedule'"
    title="Unschedule Post?"
    sub="This will revert post to draft status. You'll need to republish."
    @update:vis="emit('update:modal', '')"
    @confirmed="emit('update:post', { status: 'draft', emailStatus: 'draft' }); emit('update:modal', ''); emit('update:location', 'compose')"
  />
</template>
