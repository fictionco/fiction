<script lang="ts" setup>
import type { SuperTitle } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { InputOption } from '@fiction/ui'
import type { Post } from '../post'
import { toLabel } from '@fiction/core'
import XSuperTitle from '@fiction/ui/common/XSuperTitle.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

const { title, subTitle, superTitle, card, post, value, options = [] } = defineProps<{
  title?: string
  subTitle?: string
  superTitle?: SuperTitle
  options?: InputOption[]
  card: Card
  value: string
  post: Post
}>()
</script>

<template>
  <ElForm
    id="validForm"
    class="relative z-10 mx-auto w-full p-4 md:p-10 max-w-screen-md"
    :data-test-id="`${value}-panel`"
  >
    <div class="relative z-10 mb-4 flex gap-4 md:text-center md:justify-center">
      <div class="space-y-5">
        <XSuperTitle
          v-if="superTitle"
          class="md:justify-center"
          size="sm"
          :super-title="superTitle"
        />
        <div class="space-y-2">
          <h1 class="x-font-title text-xl font-bold antialiased">
            {{ title }}
          </h1>
          <div class="text-theme-500 dark:text-theme-400 text-lg antialiased">
            {{ subTitle }}
          </div>
        </div>
      </div>
    </div>
    <div class="relative z-10">
      <div v-if="post.status.value !== 'draft'" class="bg-primary-100 dark:bg-primary-900/30 py-4 px-4 md:px-8 rounded-lg mb-6 text-sm space-y-1">
        <div class="font-semibold space-x-2">
          <span class="text-primary-700 dark:text-primary-100">Post Status:</span>
          <span class="">{{ toLabel(post.status.value) }}</span>
        </div>
        <div class="text-primary-500 dark:text-primary-400 text-[.9em]">
          <span v-if="post.status.value === 'scheduled'">
            Email settings are unavailable. Unschedule the post to edit email details.
          </span>
          <span v-else>
            Email settings are unavailable for non-draft posts. Web version changes saved.
          </span>
        </div>
      </div>
      <FormEngine
        :model-value="post.toConfig()"
        :state-key="`optionWrap-${value}`"
        input-wrap-class="max-w-lg w-full"
        ui-size="lg"
        :depth="1"
        :input-props="{ post, card }"
        :options
        :card
        :disable-group-hide="true"
        @update:model-value="post.update($event, { caller: 'optionWrap' })"
      />
      <slot name="footer" />
    </div>
  </ElForm>
</template>
