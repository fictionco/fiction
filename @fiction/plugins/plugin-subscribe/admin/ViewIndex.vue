<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import ElSubscriberList from './ElSubscriberList.vue'

type UserConfig = {
  isNavItem: boolean
}
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const _x = 1
</script>

<template>
  <SettingsPanel title="All Subscribers">
    <div class="mx-auto max-w-3xl p-4 md:p-16">
      <ElSubscriberList :card />
    </div>
  </SettingsPanel>
</template>
