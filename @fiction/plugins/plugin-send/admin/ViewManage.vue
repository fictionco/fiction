<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import SettingsTool from '@fiction/admin/settings/SettingsTool.vue'
import type { FictionSend } from '../index.js'
import { getTools } from './tools.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})
const { fictionSend } = useService<{ fictionSend: FictionSend }>()

const loading = vue.ref(true)

const { tools, val } = getTools({ fictionSend, card: props.card })
</script>

<template>
  <SettingsTool base-path="/email-manage" :tools :card :loading :title="val?.title" />
</template>
