<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import SettingsTool from '@fiction/admin/settings/SettingsTool.vue'
import type { FictionSend } from '../index.js'
import { loadEmail } from '../utils.js'
import { getTools } from './tools.js'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})
const { fictionSend } = useService<{ fictionSend: FictionSend }>()

const loading = vue.ref(true)

vue.onMounted(() => loadEmail({ fictionSend }))

const tools = getTools({ fictionSend })
</script>

<template>
  <SettingsTool base-path="/email-manage" :tools :card :loading />
</template>
