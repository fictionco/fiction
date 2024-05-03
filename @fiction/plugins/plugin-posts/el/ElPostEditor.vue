<script lang="ts" setup>
import type { vue } from '@fiction/core'
import ProseEditor from '@fiction/plugin-editor/ProseEditor.vue'
import XTextBase from '@fiction/ui/XTextBase.vue'
import type { Post } from '../post'

defineProps({
  post: { type: Object as vue.PropType<Post>, default: undefined },
})
</script>

<template>
  <div v-if="post">
    <div class="py-12 prose dark:prose-invert prose-sm lg:prose-lg mx-auto focus:outline-none antialiased ">
      <XTextBase v-model:model-value="post.title.value" tag="h1" class="" :is-editable="true" placeholder="Enter Title" />
      <XTextBase v-model="post.title.value" tag="h3" class="dark:text-theme-300" :is-editable="true" placeholder="Enter Subtitle / Excerpt" />
      <div class="border-b border-theme-700 my-12" />
      <ProseEditor v-model="post.content.value" />
    </div>
  </div>
</template>
