<script lang="ts" setup>
import type { vue } from '@fiction/core'
import ProseEditor from '@fiction/plugin-editor/ProseEditor.vue'
import XText from '@fiction/ui/common/XText.vue'
import ElImage from '@fiction/ui/media/ElImage.vue'
import type { Card } from '@fiction/site'
import type { Post } from '../post'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  post: { type: Object as vue.PropType<Post>, default: undefined },
})
</script>

<template>
  <div v-if="post">
    <div class="py-12 prose dark:prose-invert prose-sm md:prose-lg lg:prose-xl mx-auto focus:outline-none antialiased ">
      <div class="flex gap-6 justify-between">
        <div class=" flex-grow">
          <XText
            :model-value="post.title.value"
            tag="h1"
            class="text-balance"
            :is-editable="true"
            placeholder="Enter Title"
            @update:model-value="post?.update({ title: $event as string })"
          />
          <XText
            :model-value="post.subTitle.value"
            tag="h3"
            class="dark:text-theme-300"
            :is-editable="true"
            placeholder="Enter Subtitle / Excerpt"
            @update:model-value="post?.update({ subTitle: $event as string })"
          />
        </div>
        <div class="not-prose">
          <ElImage :media="post.image.value" class="size-32 border border-theme-200 dark:border-theme-600 rounded-md bg-theme-50 dark:bg-theme-800 overflow-hidden" />
        </div>
      </div>
      <div class="border-b border-theme-200 dark:border-theme-700 my-12" />
      <ProseEditor
        :model-value="post.content.value"
        class="font-serif"
        @update:model-value="post?.update({ content: $event as string })"
      />
    </div>
  </div>
</template>
