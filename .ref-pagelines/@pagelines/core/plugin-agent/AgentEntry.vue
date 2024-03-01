<script lang="ts" setup>
import type { FactorRouter } from '@factor/api'
import { log, useService, vue } from '@factor/api'
import { FrameUtility } from '@factor/ui/elBrowserFrameUtil'
import ElLoading from '@factor/ui/ElLoading.vue'
import type { PostMessageAgent } from './obj'
import { ChatAgent } from './obj'
import type { PageLinesAgent } from '.'

const { factorRouter, pageLinesAgent } = useService<{
  factorRouter: FactorRouter
  pageLinesAgent: PageLinesAgent
}>()

const loading = vue.ref(true)
const agent = vue.shallowRef<ChatAgent>()

const el = vue.computed(() => {
  return agent.value?.el.value
})

async function setAgent() {
  loading.value = true
  const agentId = factorRouter.params.value.agentId as string | undefined
  log.info('AgentEntry', `loading agentId: ${agentId}`)

  if (agentId) {
    const r = await pageLinesAgent.findOne({ agentId })

    if (r)
      agent.value = r
  }
  else {
    const data = factorRouter.current.value
    log.error('AgentEntry', `No agentId provided`, { data })
  }
  loading.value = false
}

vue.onMounted(async () => {
  await setAgent()

  const util = new FrameUtility<PostMessageAgent>({
    relation: 'child',
    onMessage: (msg, { frameUtility }) => {
      if (msg.messageType === 'setAgent') {
        const existingMessages = agent.value?.messages.value || []
        agent.value = new ChatAgent({
          pageLinesAgent,
          ...msg.data,
          messages: existingMessages,
        })
        agent.value.frameUtility = frameUtility
      }
    },
  })

  util.init()

  if (agent.value)
    agent.value.frameUtility = util
})
</script>

<template>
  <div class="pagelines-agent h-[100vh] w-[100vw]">
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-10"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-10"
      mode="out-in"
    >
      <div
        v-if="loading"
        class="loading-veil text-theme-500 fixed inset-0 z-50 flex h-full w-full items-center justify-center"
      >
        <ElLoading key="loading" />
      </div>

      <div
        v-else
        key="another"
        class="relative z-20 h-full w-full"
      >
        <component
          :is="el.component"
          v-if="el && agent"
          v-bind="el.props"
          :agent="agent"
          :loading="loading"
        />
      </div>
    </transition>
  </div>
</template>
