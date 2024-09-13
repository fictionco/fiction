<script setup lang="ts">
import type { Card } from '@fiction/site/card'
import { useService, type vue } from '@fiction/core'
import { getTools } from '.'
import SettingsTool from './SettingsTool.vue'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService()
</script>

<template>
  <SettingsTool :class="card.classes.value.contentWidth" base-path="/settings" :tools="getTools({ service })" :card title="Settings" />
</template>
