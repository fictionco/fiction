<script lang="ts" setup>
import type { vue } from '@fiction/core'
import ProseEditor from '@fiction/plugin-editor/ProseEditor.vue'
import XTextBase from '@fiction/ui/XTextBase.vue'
import ElImage from '@fiction/ui/ElImage.vue'
import type { Post } from '../post'

defineProps({
  post: { type: Object as vue.PropType<Post>, default: undefined },
})
</script>

<template>
  <div v-if="post">
    <div class="py-12 prose dark:prose-invert prose-sm lg:prose-lg mx-auto focus:outline-none antialiased ">
      <div class="flex gap-4 justify-between">
        <div class=" flex-grow">
          <XTextBase
            :model-value="post.title.value"
            tag="h1"
            class="text-balance"
            :is-editable="true"
            placeholder="Enter Title"
            @update:model-value="post?.update({ title: $event as string })"
          />
          <XTextBase
            :model-value="post.subTitle.value"
            tag="h3"
            class="dark:text-theme-300"
            :is-editable="true"
            placeholder="Enter Subtitle / Excerpt"
            @update:model-value="post?.update({ subTitle: $event as string })"
          />
        </div>
        <div>
          <ElImage class="size-32 border border-theme-600 rounded-md bg-theme-800" />
        </div>
      </div>
      <div class="border-b border-theme-700 my-12" />
      <ProseEditor
        :model-value="post.content.value"
        @update:model-value="post?.update({ content: $event as string })"
      />
    </div>
  </div>
</template>
