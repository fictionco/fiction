<script lang="ts" setup>
import type { Card } from '@fiction/site'
import ElTeamList from './ElTeamList.vue'
import SettingsPanel from './SettingsPanel.vue'

defineOptions({ name: 'PanelTeam' })

const { card } = defineProps<{ card: Card }>()
</script>

<template>
  <SettingsPanel title="Manage Team">
    <div class="p-6 xl:p-12">
      <ElTeamList :card />
    </div>
  </SettingsPanel>
</template>
