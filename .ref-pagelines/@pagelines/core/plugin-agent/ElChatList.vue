<script lang="ts" setup>
import type {
  ActionItem,
  FactorRouter,
  IndexMeta,
} from '@factor/api'
import {
  formatNumber,
  useService,
  vue,
} from '@factor/api'
import ElIndexGrid from '@factor/ui/ElIndexGrid.vue'
import type { ChatAgent } from './obj'
import type { PageLinesAgent } from '.'

defineEmits<{
  (event: 'itemClick', payload: ChatAgent): void
}>()

const { pageLinesAgent, factorRouter } = useService<{
  pageLinesAgent: PageLinesAgent
  factorRouter: FactorRouter
}>()

const agents = vue.shallowRef<ChatAgent[]>([])
const indexMeta = vue.ref<IndexMeta>()
const loading = vue.ref(true)
const editActions = ['delete']

const actions: ActionItem[] = [
  {
    name: `Start`,
    href: factorRouter.link('orgHome', {}, { create: 1 }).value,
    btn: 'primary',
  },
]

async function loadAgents() {
  loading.value = true
  const r = await pageLinesAgent.requestIndex()
  agents.value = r.items || []
  indexMeta.value = r.indexMeta
  loading.value = false
}

vue.onMounted(async () => {
  await loadAgents()
})

const formattedData = vue.computed(() => {
  if (!agents.value)
    return []

  const rows = agents.value.map((agent) => {
    return {
      name: agent.agentName.value,
      value: agent.agentId.value,
      desc: agent.description.value,
      tag: 'Chat Agent',
      icon: 'i-heroicons-chat-bubble-oval-left-ellipsis',
      links: [
        { name: 'Characters', desc: formatNumber(agent.totalCharacters.value) },
      ],
    }
  }) as ActionItem[]

  return rows
})

async function handleRowClick(agentId: string | number) {
  const link = factorRouter.link('chat', {
    agentId,
    topicId: '',
  }).value

  await factorRouter.push({ path: link })
}

async function handleBulkEdit(params: {
  _action: string
  selectedIds: string[]
}) {
  const _action = params._action as 'delete'

  loading.value = true

  if (_action === 'delete') {
    const confirmed = confirm('Are you sure you want to delete this?')
    if (!confirmed)
      return
  }

  await pageLinesAgent.bulkEdit({
    _action,
    selectedIds: params.selectedIds,
  })

  await loadAgents()

  loading.value = false
}
</script>

<template>
  <ElIndexGrid
    :loading="loading"
    :list="formattedData"
    :index-meta="indexMeta"
    :edit-actions="editActions"
    :empty="{
      title: 'Create Your First AI Agent',
      description: `Create your first AI agent with your own custom data and personality.`,
    }"
    :actions="actions"
    :on-item-click="handleRowClick"
    @bulk-edit="handleBulkEdit($event)"
  />
</template>
