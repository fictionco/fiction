<script lang="ts" setup>
import { useService, vue } from '@factor/api'
import AgentEntry from '@pagelines/core/plugin-agent/AgentEntry.vue'
import type { PageLinesAgentLoader } from '@pagelines/core/plugin-agent/loader'

const { pageLinesAgentLoader } = useService<{
  pageLinesAgentLoader: PageLinesAgentLoader
}>()

const agentState = vue.computed(() => {
  return pageLinesAgentLoader.agentState.value
})
</script>

<template>
  <div class="h-[100vh] w-[100vw]">
    <AgentEntry :agent="agentState.data" />
  </div>
</template>

<style lang="less"></style>
