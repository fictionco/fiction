<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import type { FictionPosts } from '..'
import type { Post } from '../post'
import RevisionHistory from '@fiction/admin/el/RevisionHistory.vue'
import { useService } from '@fiction/core'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  post: { type: Object as vue.PropType<Post>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
})

const { fictionPosts } = useService<{ fictionPosts: FictionPosts }>()

async function handleRestore(revisionId: string) {
  return await fictionPosts.requests.ManagePost.projectRequest({
    _action: 'restoreFromRevision',
    where: { postId: props.post.postId },
    revisionId,
  }, { caller: 'postRevisionRestore' })
}
</script>

<template>
  <RevisionHistory
    :item-id="post.postId"
    item-type="post"
    :on-restore="handleRestore"
  />
</template>
