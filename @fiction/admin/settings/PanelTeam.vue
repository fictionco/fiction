<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import ElTeamList from './ElTeamList.vue'
import SettingsPanel from './SettingsPanel.vue'

defineOptions({ name: 'PanelTeam' })

const { card, isParent } = defineProps<{ card: Card, isParent?: boolean }>()

const action = vue.computed(() => {
  return isParent ? { buttons: [{ label: 'Team Settings', href: card.link('/settings/team'), icon: 'i-tabler-arrow-left' }] } : {}
})
</script>

<template>
  <SettingsPanel title="Team" :action>
    <div :class="isParent ? 'px-6 py-12' : 'p-4 md:p-6 xl:p-12'">
      <ElTeamList :card :ui-size="isParent ? 'xs' : 'md'" />
    </div>
  </SettingsPanel>
</template>
