<script lang="ts" setup>
import type { EndpointResponse, FictionRevision } from '@fiction/core'
import { dayjs, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import ElModalConfirm from '@fiction/ui/modal/ElModalConfirm.vue'

const { itemId, onRestore } = defineProps<{
  itemId: string
  itemType: 'post' | 'site'
  onRestore: (revisionId: string) => Promise<EndpointResponse>
}>()

const { fictionRevision, fictionEnv } = useService<{ fictionRevision: FictionRevision }>()

const isLoading = vue.ref(true)
const isSending = vue.ref('')
const revisions = vue.ref<any[]>([])
const showConfirm = vue.ref(false)
const selectedRevision = vue.ref<any>(null)

async function loadRevisions() {
  isLoading.value = true
  try {
    const result = await fictionRevision.requests.ManageRevision.projectRequest({
      _action: 'list',
      where: { itemId },
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
  if (!selectedRevision.value?.revisionId) {
    fictionEnv.events.emit('notify', { type: 'error', message: 'Missing revisionId' })
    return
  }

  try {
    isSending.value = selectedRevision.value.revisionId
    const r = await onRestore(selectedRevision.value.revisionId)
    showConfirm.value = false

    if (r?.status === 'success') {
      loadRevisions()
      fictionEnv.events.emit('notify', {
        type: 'success',
        message: `Restored to revision`,
      })
    }
  }
  catch {
    fictionEnv.events.emit('notify', { type: 'error', message: 'There was an error restoring' })
  }
  finally {
    isSending.value = ''
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
        Refresh Checkpoints
      </XButton>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <ElSpinner class="w-6 text-theme-400 dark:text-theme-600" />
    </div>

    <div v-else-if="revisions.length" class="space-y-3">
      <div
        v-for="rev in revisions"
        :key="rev.revisionId"
        class="flex gap-2 justify-between items-center py-3 border-t border-theme-200 dark:border-theme-700"
      >
        <div>
          <div class="font-medium text-sm">
            {{ rev.title || 'Untitled' }}
          </div>
          <div class="text-xs text-theme-500">
            {{ dayjs(rev.createdAt).format('MMM D, YYYY h:mm A') }}
          </div>
          <div v-if="rev.description" class="text-xs text-theme-400 dark:text-theme-600 mt-1">
            Description: {{ rev.description }}
          </div>
        </div>
        <div class="shrink-0 ">
          <XButton
            size="xs"
            theme="orange"
            design="outline"
            icon="i-tabler-restore"
            :loading="isSending === rev.revisionId"
            @click="(selectedRevision = rev, showConfirm = true)"
          >
            Restore
          </XButton>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-theme-500 text-sm">
      No revisions found
    </div>

    <ElModalConfirm
      v-model:vis="showConfirm"
      :title="`Restore ${itemType === 'post' ? 'Post' : 'Site'} Revision`"
      :sub="`This will restore your ${itemType} to the selected revision. Are you sure?`"
      confirm-text="Yes, Restore"
      cancel-text="Cancel"
      @confirmed="restore()"
    />
  </div>
</template>
