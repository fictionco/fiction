<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { Card } from '@fiction/site'
import type { Post } from '../../post.js'

import ElTool from '@fiction/admin/tools/ElTool.vue'

import PostEmailSendTest from '../PostEmailSendTest.vue'

const { tool, post, card } = defineProps<{
  tool: EditorTool
  post?: Post | undefined
  card: Card
}>()
</script>

<template>
  <ElTool :tool>
    <PostEmailSendTest :post :card />
  </ElTool>
</template>
