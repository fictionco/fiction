<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { Site } from '@fiction/platform'
import RevisionHistory from '@fiction/admin/el/RevisionHistory.vue'

const { site } = defineProps<{
  site: Site
  tool: EditorTool
}>()

async function handleRestore(revisionId: string) {
  return await site.fictionSites.requests.ManageSite.projectRequest({
    _action: 'restoreFromRevision',
    where: { siteId: site.siteId },
    revisionId,
    caller: 'revisionRestorer',
  })
}
</script>

<template>
  <RevisionHistory
    :item-id="site.siteId"
    item-type="post"
    :on-restore="handleRestore"
  />
</template>
