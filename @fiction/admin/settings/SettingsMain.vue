<script setup lang="ts">
import type { Card } from '@fiction/site/card'
import type { vue } from '@fiction/core'
import SettingsTool from './SettingsTool.vue'
import { tools } from '.'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})
</script>

<template>
  <SettingsTool base-path="/settings" :tools :card />
</template>
