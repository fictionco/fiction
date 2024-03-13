<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import ElInput from '@fiction/ui/ElInput.vue'
import ElButton from '@fiction/ui/ElButton.vue'

import type { Card } from '../../../card'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionUser } = useService()

const sending = vue.ref<string | boolean>(false)
const sent = vue.ref(false)
const org = vue.computed(() => fictionUser.activeOrganization.value)
/**
 * Delete organization after confirmation
 */
async function maybeDeleteOrganization(): Promise<void> {
  const orgId = org.value?.orgId
  if (!orgId)
    return
  const confirmed = confirm(
    'Are you sure? Deleting this organization will delete its assets and data permanently.',
  )

  if (confirmed) {
    sending.value = 'delete'
    await fictionUser.requests.ManageOrganization.request({
      _action: 'delete',
      orgId,
    })

    await props.card.goto('/org')
    sent.value = true
    sending.value = false
  }
}
</script>

<template>
  <ElInput
    :label="`Permanently Delete Organization (You are an ${fictionUser.activeRelation.value?.memberAccess})`"
    sub-label="Permanently delete this organization and its data."
  >
    <div class="my-2 rounded-md">
      <ElButton
        :loading="sending === 'delete'"
        btn="danger"
        size="sm"
        @click="maybeDeleteOrganization()"
      >
        Permanently Delete Organization: "{{ org?.orgName }}"
      </ElButton>
    </div>
  </ElInput>
</template>
