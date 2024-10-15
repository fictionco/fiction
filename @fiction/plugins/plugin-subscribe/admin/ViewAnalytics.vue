<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import WidgetArea from '@fiction/admin/dashboard/WidgetArea.vue'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'

type UserConfig = {
  isNavItem: boolean
}
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const _x = 1
</script>

<template>
  <SettingsPanel title="Subscriber Analytics">
    <div class="mx-auto max-w-3xl p-4 md:p-16">
      <WidgetArea location="subscriberIndex" :card />
    </div>
  </SettingsPanel>
</template>
