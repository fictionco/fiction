<script lang="ts" setup>
import type { vue } from '@factor/api'
import { renderMarkdown } from '@factor/api'
import ElSpinner from '@factor/ui/ElSpinner.vue'
import type { Message } from '../../obj'

defineProps({
  message: {
    type: Object as vue.PropType<Message>,
    required: true,
  },
})
</script>

<template>
  <div
    class="clear-both"
    :class="message.isOwn.value ? 'float-right ml-12' : 'float-left mr-12'"
  >
    <div
      class="mb-3 overflow-auto rounded-lg px-3 py-2 md:px-4 md:py-3"
      :class="
        message.isOwn.value
          ? 'bg-action-main text-action-contrast'
          : 'text-action-alt-contrast bg-action-alt'
      "
    >
      <div class="flex space-x-3">
        <div class="flex-1 gap-4">
          <div class="prose text-left text-sm md:text-base">
            <div v-if="message.loading.value" class="mx-6 opacity-70">
              <ElSpinner class="h-4 w-4" />
            </div>
            <div
              v-else
              class="bubble"
              v-html="renderMarkdown(message.content.value)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.bubble {
  a {
    font-weight: 600;
    text-decoration: underline;
  }
}
</style>
