<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { Site } from '@fiction/site'
import RevisionHistory from '@fiction/admin/el/RevisionHistory.vue'

const { site } = defineProps<{
  site: Site
  tool: EditorTool
}>()

async function handleRestore(revisionId: string) {
  const r = await site.fictionSites.requests.ManageSite.projectRequest({
    _action: 'restoreFromRevision',
    where: { siteId: site.siteId },
    revisionId,
    caller: 'revisionRestorer',
  })
  site.editorActivateTool({ toolId: '' })

  return r
}
</script>

<template>
  <RevisionHistory
    :item-id="site.siteId"
    item-type="post"
    :on-restore="handleRestore"
  />
</template>
