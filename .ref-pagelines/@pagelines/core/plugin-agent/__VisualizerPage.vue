<script lang="ts" setup>
import type { FactorMedia, FactorRouter } from '@factor/api'
import { useService, vue } from '@factor/api'
import { FrameUtility } from '@factor/ui/elBrowserFrameUtil'
import type { PostMessageAgent } from './obj'
import { ChatAgent } from './obj'
import AgentEntry from './AgentEntry.vue'
import type { PageLinesAgent } from '.'

const { factorRouter, pageLinesAgent } = useService<{
  factorMedia: FactorMedia
  factorRouter: FactorRouter
  pageLinesAgent: PageLinesAgent
}>()

const loading = vue.ref(true)
const agent = vue.shallowRef<ChatAgent>()

vue.onMounted(async () => {
  const agentId = factorRouter.params.value.agentId as string | undefined
  if (agentId) {
    const r = await pageLinesAgent.findOne({ agentId })

    if (r)
      agent.value = r
  }

  loading.value = false

  const util = new FrameUtility<PostMessageAgent>({
    relation: 'child',
    onMessage: (e) => {
      if (e.messageType === 'setAgent')
        agent.value = new ChatAgent({ pageLinesAgent, ...e.data })
    },
  })
})
</script>

<template>
  <AgentEntry :agent="agent" :loading="loading" />
</template>
