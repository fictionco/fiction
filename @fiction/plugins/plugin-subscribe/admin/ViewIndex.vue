<script lang="ts" setup>
import type { Card } from '@fiction/site'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { vue } from '@fiction/core'
import ElSubscriberList from './ElSubscriberList.vue'

const { isParent, card } = defineProps<{
  card: Card
  isParent?: boolean
}>()

const action = vue.computed(() => {
  return isParent ? { buttons: [{ label: 'Back', href: card.link('/audience'), icon: 'i-tabler-arrow-left' }] } : {}
})
</script>

<template>
  <SettingsPanel title="All Connections" :action>
    <div :class="isParent ? 'px-6 py-12' : 'p-6 xl:p-12'">
      <ElSubscriberList :card :ui-size="isParent ? 'xs' : 'md'" />
    </div>
  </SettingsPanel>
</template>
