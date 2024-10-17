<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { useService, vue } from '@fiction/core'
import ElTeamList from './ElTeamList.vue'
import SettingsPanel from './SettingsPanel.vue'

defineOptions({ name: 'PanelTeam' })

const { card } = defineProps<{ card: Card }>()

const service = useService()

const org = vue.computed(() => service.fictionUser.activeOrganization.value)

const header = vue.computed(() => {
  return {
    title: 'Team Members',
    subTitle: `Members of "${org.value?.orgName}"`,
    media: {
      class: 'i-tabler-users',
    },
  }
})
</script>

<template>
  <SettingsPanel title="Manage Team" :header>
    <div class="mx-auto max-w-3xl p-4 md:p-16">
      <ElTeamList :card />
    </div>
  </SettingsPanel>
</template>
