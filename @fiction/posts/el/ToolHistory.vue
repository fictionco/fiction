<script lang="ts" setup>
import ElTool from '@fiction/admin/tools/ElTool.vue'
import ElToolBanner from '@fiction/admin/tools/ElToolBanner.vue'
import ELToolHandle from '@fiction/admin/tools/ElToolHandle.vue'
import { vue } from '@fiction/core'
import type { EditorTool, Handle } from '@fiction/admin'
import type { Post } from '../post'
import type { PostDraft } from '../schema'

const props = defineProps({
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  post: { type: Object as vue.PropType<Post>, required: true },
})

const handles = vue.computed<Handle[]>(() => {
  const history = (props.post.settings.draftHistory || []) as PostDraft[]

  if (!Array.isArray(history))
    return []

  return history?.map((item) => {
    return {
      testId: `draft-${item.draftId}`,
      handleId: item.draftId || '',
      title: item.title || 'Untitled',
      date: item.createdAt,
      icon: 'i-tabler-file',
      depth: 0,
    }
  })
})
</script>

<template>
  <ElTool :tool="tool">
    <div class="p-4">
      <ElToolBanner
        v-if="handles.length === 0"
        title="Draft History"
        sub="Drafts of the post will show here"
        :icon="tool.icon"
      />
      <template v-else>
        <ELToolHandle
          v-for="handle in handles"
          :key="handle.handleId"
          class="drag-handle"
          :handle="handle"
          :data-drag-id="handle.handleId"
        />
      </template>
    </div>
  </ElTool>
</template>
