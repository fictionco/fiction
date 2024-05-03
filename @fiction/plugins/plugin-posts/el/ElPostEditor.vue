<script lang="ts" setup>
import type { vue } from '@fiction/core'
import ProseEditor from '@fiction/plugin-editor/ProseEditor.vue'
import type { Post } from '../post'

defineProps({
  post: { type: Object as vue.PropType<Post>, required: true },
})
</script>

<template>
  <div><ProseEditor v-model="post.content" /></div>
</template>
