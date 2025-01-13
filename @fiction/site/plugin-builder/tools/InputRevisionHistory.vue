<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { FictionRevision, Site } from '@fiction/platform'
import { dayjs, useService, vue } from '@fiction/core'
import { updateSite } from '@fiction/site/utils/site'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElModalConfirm from '@fiction/ui/ElModalConfirm.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'

const { site } = defineProps<{
  site: Site
  tool: EditorTool
}>()

const { fictionRevision, fictionEnv } = useService<{ fictionRevision: FictionRevision }>()

const isLoading = vue.ref(true)
const revisions = vue.ref<any[]>([])
const showConfirm = vue.ref(false)
const selectedRevision = vue.ref<any>(null)

async function loadRevisions() {
  isLoading.value = true
  try {
    const result = await fictionRevision.requests.ManageRevision.projectRequest({
      _action: 'list',
      where: { itemId: site.siteId },
      limit: 20,
      caller: 'revisionHistory',
    })

    if (result?.status === 'success') {
      revisions.value = result.data || []
    }
  }
  finally {
    isLoading.value = false
  }
}

async function restore() {
  if (!selectedRevision.value.revisionId) {
    fictionEnv.events.emit('notify', { type: 'error', message: 'Missing revisionId' })
    return
  }

  const response = await site.fictionSites.requests.ManageSite.projectRequest({
    _action: 'restoreFromRevision',
    where: { siteId: site.siteId },
    revisionId: selectedRevision.value.revisionId,
    caller: 'revisionRestorer',
  })

  if (response?.status === 'success' && response.data) {
    await updateSite({ site, newConfig: response.data, caller: 'restoreToRevision' })

    showConfirm.value = false
    fictionEnv.events.emit('notify', { type: 'success', message: 'Site restored to revision' })
  }
  else {
    fictionEnv.events.emit('notify', { type: 'error', message: 'There was an error' })
  }
}

vue.onMounted(loadRevisions)
</script>

<template>
  <div>
    <div class="mb-4 flex justify-between">
      <h3 class="text-base font-medium">
        Revisions
      </h3>
      <XButton
        size="sm"
        :loading="isLoading"
        icon="i-tabler-refresh"
        @click.stop="loadRevisions()"
      >
        Refresh
      </XButton>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <ElSpinner class="w-6 text-theme-400 dark:text-theme-600" />
    </div>

    <div v-else-if="revisions.length" class="space-y-3">
      <div
        v-for="rev in revisions"
        :key="rev.revisionId"
        class="flex justify-between items-center py-3 border-t border-theme-200 dark:border-theme-700"
      >
        <div>
          <div class="font-medium text-sm">
            {{ rev.title || 'Untitled' }}
          </div>
          <div class="text-xs text-theme-500">
            {{ dayjs(rev.createdAt).format('MMM D, YYYY h:mm A') }}
          </div>
        </div>
        <XButton
          size="xs"
          theme="orange"
          design="outline"
          icon="i-tabler-restore"
          @click="(selectedRevision = rev, showConfirm = true)"
        >
          Restore
        </XButton>
      </div>
    </div>

    <div v-else class="text-center py-8 text-theme-500 text-sm">
      No revisions found
    </div>

    <ElModalConfirm
      v-model:vis="showConfirm"
      title="Confirm Restore Revision"
      sub="This will restore your site to the selected revision. Are you sure?"
      confirm-text="Yes, Update Address"
      cancel-text="Not Yet"
      @confirmed="restore()"
    />
  </div>
</template>
